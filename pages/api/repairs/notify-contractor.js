export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { job, contractor } = req.body
  if (!contractor.email) return res.status(200).json({ ok: true })

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'repairs@lettly.co',
        to: contractor.email,
        subject: 'New repair job assigned: ' + job.reference,
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:20px">
            <div style="background:#e07b7b;padding:20px;border-radius:12px 12px 0 0">
              <div style="font-size:20px;font-weight:800;color:#fff">New repair job assigned</div>
            </div>
            <div style="background:#fff;border:1px solid #ede5e5;border-top:none;padding:24px;border-radius:0 0 12px 12px">
              <p>Hi ${contractor.name},</p>
              <p>A new repair job has been assigned to you.</p>
              <table style="width:100%;border-collapse:collapse;margin:16px 0">
                ${[
                  ['Reference', job.reference],
                  ['Property', job.property_address],
                  ['Issue', job.category + ': ' + job.subcategory],
                  ['Tenant', job.tenant_name],
                  ['Tenant phone', job.tenant_phone || 'Not provided'],
                  ['Access', job.access_instructions || 'Not provided'],
                  ['Preferred time', job.preferred_time || 'No preference'],
                  ['Priority', job.is_emergency ? 'EMERGENCY - respond within 4 hours' : 'Normal'],
                ].map(([k, v]) => `<tr><td style="padding:8px;font-weight:600;color:#6b5f5f;border-bottom:1px solid #f0e8e8;font-size:13px">${k}</td><td style="padding:8px;border-bottom:1px solid #f0e8e8;font-size:13px">${v}</td></tr>`).join('')}
              </table>
              <p><strong>Description:</strong></p>
              <p style="background:#fdf9f9;padding:14px;border-radius:8px;font-size:13px;line-height:1.6">${job.description}</p>
              ${job.is_emergency ? '<p style="color:#c0392b;font-weight:700;font-size:14px">This is an emergency. Please respond within 4 hours.</p>' : ''}
              <p style="color:#9a8080;font-size:13px;margin-top:20px">Please contact the tenant directly to arrange access. Reply to this email if you have any questions.</p>
            </div>
          </div>
        `
      })
    })
    return res.status(200).json({ ok: true })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
