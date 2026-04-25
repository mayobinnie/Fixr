import { supabase } from '../../../lib/supabase'
import { generateReference } from '../../../lib/reference'
import { IncomingForm } from 'formidable'
import fs from 'fs'

export const config = { api: { bodyParser: false } }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const form = new IncomingForm({ maxFileSize: 10 * 1024 * 1024, multiples: true })

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err)
        else resolve({ fields, files })
      })
    })

    const get = k => Array.isArray(fields[k]) ? fields[k][0] : fields[k]

    const reference = generateReference()
    const isEmergency = EMERGENCY_SUBCATEGORIES.includes(get('subcategory'))

    // Upload photos to Supabase storage
    const photoUrls = []
    const photoFiles = Object.keys(files).filter(k => k.startsWith('photo_'))
    for (const key of photoFiles) {
      const file = Array.isArray(files[key]) ? files[key][0] : files[key]
      const buffer = fs.readFileSync(file.filepath)
      const ext = file.originalFilename?.split('.').pop() || 'jpg'
      const path = 'repairs/' + reference + '/' + key + '.' + ext
      const { data, error } = await supabase.storage.from('documents').upload(path, buffer, {
        contentType: file.mimetype || 'image/jpeg', upsert: true
      })
      if (!error) {
        const { data: pub } = supabase.storage.from('documents').getPublicUrl(path)
        photoUrls.push(pub.publicUrl)
      }
    }

    // Create the job
    const { data: job, error: jobError } = await supabase.from('repair_jobs').insert({
      reference,
      property_address: get('property_address'),
      tenant_name: get('tenant_name'),
      tenant_email: get('tenant_email'),
      tenant_phone: get('tenant_phone') || null,
      category: get('category'),
      subcategory: get('subcategory'),
      description: get('description'),
      access_instructions: get('access_instructions') || null,
      preferred_time: get('preferred_time') || null,
      is_emergency: isEmergency,
      priority: isEmergency ? 'emergency' : 'normal',
      status: 'new',
    }).select().single()

    if (jobError) throw new Error(jobError.message)

    // Save photos
    for (const url of photoUrls) {
      await supabase.from('repair_photos').insert({ job_id: job.id, url, uploaded_by: 'tenant' })
    }

    // Log initial update
    await supabase.from('repair_updates').insert({
      job_id: job.id,
      author: get('tenant_name'),
      author_type: 'tenant',
      message: 'Repair request submitted: ' + get('category') + ' - ' + get('subcategory'),
      status_change: 'new'
    })

    // Send confirmation email via Resend
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'repairs@lettly.co',
          to: get('tenant_email'),
          subject: 'Repair request received: ' + reference,
          html: `
            <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:20px">
              <div style="background:#e07b7b;padding:20px;border-radius:12px 12px 0 0;text-align:center">
                <div style="font-size:24px;font-weight:800;color:#fff">Repair request received</div>
              </div>
              <div style="background:#fff;border:1px solid #ede5e5;border-top:none;padding:24px;border-radius:0 0 12px 12px">
                <p>Hi ${get('tenant_name')},</p>
                <p>We have received your repair request. Your reference number is:</p>
                <div style="text-align:center;padding:20px;background:#fdf9f9;border-radius:8px;margin:20px 0">
                  <div style="font-size:32px;font-weight:800;color:#e07b7b;letter-spacing:4px;font-family:monospace">${reference}</div>
                </div>
                <p><strong>Issue:</strong> ${get('category')} - ${get('subcategory')}</p>
                <p><strong>Property:</strong> ${get('property_address')}</p>
                ${isEmergency ? '<p style="color:#c0392b;font-weight:700">This has been flagged as an emergency. We will aim to contact you within 4 hours.</p>' : '<p>We will be in touch to arrange access for a contractor.</p>'}
                <p style="color:#9a8080;font-size:13px">Keep your reference number safe. You may need it if you contact us about this repair.</p>
              </div>
            </div>
          `
        })
      })
    } catch (e) {
      console.log('Email error:', e.message)
    }

    return res.status(200).json({ reference, tenant_email: get('tenant_email'), is_emergency: isEmergency })

  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: e.message })
  }
}

const EMERGENCY_SUBCATEGORIES = ['Burst pipe', 'No heating', 'No power', 'Boiler fault']
