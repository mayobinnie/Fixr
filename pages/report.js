import { useState, useRef } from 'react'
import Head from 'next/head'
import { CATEGORIES, EMERGENCY_SUBCATEGORIES } from '../lib/categories'

const R = '#e07b7b'
const RL = '#eca9a9'
const RDIM = 'rgba(224,123,123,0.10)'
const RBDR = 'rgba(224,123,123,0.25)'

const inp = {
  width: '100%', background: '#fff', border: '1px solid #e5e0e0',
  borderRadius: 10, padding: '11px 14px', fontSize: 15,
  fontFamily: 'inherit', outline: 'none', color: '#1a1414',
  boxSizing: 'border-box', transition: 'border .15s'
}
const lbl = { fontSize: 13, fontWeight: 600, color: '#4a3f3f', marginBottom: 6, display: 'block' }

const STEPS = ['Property', 'Issue', 'Details', 'Photos', 'Submit']

export default function ReportPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    property_address: '', tenant_name: '', tenant_email: '',
    tenant_phone: '', category: '', subcategory: '', description: '',
    access_instructions: '', preferred_time: '', is_emergency: false,
  })
  const [photos, setPhotos] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(null)
  const [error, setError] = useState('')
  const fileRef = useRef()
  const cameraRef = useRef()

  const isEmergency = form.subcategory && EMERGENCY_SUBCATEGORIES.includes(form.subcategory)
  const subcats = form.category ? CATEGORIES[form.category] || [] : []

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  function addPhotos(files) {
    const arr = Array.from(files).slice(0, 6 - photos.length)
    arr.forEach(file => {
      const reader = new FileReader()
      reader.onload = e => setPhotos(p => [...p, { file, preview: e.target.result }])
      reader.readAsDataURL(file)
    })
  }

  function removePhoto(i) { setPhotos(p => p.filter((_, idx) => idx !== i)) }

  function canNext() {
    if (step === 0) return form.property_address && form.tenant_name && form.tenant_email
    if (step === 1) return form.category && form.subcategory
    if (step === 2) return form.description.length >= 10
    return true
  }

  async function handleSubmit() {
    setSubmitting(true)
    setError('')
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      photos.forEach((p, i) => fd.append('photo_' + i, p.file))

      const res = await fetch('/api/repairs/create', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setSubmitted(data)
    } catch (e) {
      setError(e.message)
    }
    setSubmitting(false)
  }

  if (submitted) return (
    <div style={{ minHeight: '100vh', background: '#fdf9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, background: RDIM, border: '2px solid ' + RBDR, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 20px' }}>✓</div>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 26, fontWeight: 800, color: '#1a1414', marginBottom: 8 }}>Report received</h1>
        <div style={{ fontSize: 15, color: '#6b5f5f', marginBottom: 24, lineHeight: 1.7 }}>
          We have logged your repair request and will be in touch shortly.
        </div>
        <div style={{ background: '#fff', border: '1px solid #eedada', borderRadius: 12, padding: '20px 24px', marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#9a8080', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Your reference number</div>
          <div style={{ fontFamily: 'monospace', fontSize: 28, fontWeight: 800, color: R, letterSpacing: 3 }}>{submitted.reference}</div>
          <div style={{ fontSize: 12, color: '#9a8080', marginTop: 6 }}>Keep this safe. You can use it to check the status of your repair.</div>
        </div>
        {submitted.is_emergency && (
          <div style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: 10, padding: 16, marginBottom: 20, fontSize: 14, color: '#c0392b', fontWeight: 600 }}>
            This has been flagged as an emergency. You will be contacted within 4 hours.
          </div>
        )}
        <div style={{ fontSize: 14, color: '#9a8080' }}>A confirmation has been sent to {submitted.tenant_email}</div>
      </div>
    </div>
  )

  return (
    <>
      <Head>
        <title>Report a repair</title>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=""/>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      </Head>
      <div style={{ minHeight: '100vh', background: '#fdf9f9', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>

        {/* Header */}
        <div style={{ background: '#fff', borderBottom: '1px solid #f0e8e8', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ width: 32, height: 32, background: R, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15, color: '#fff' }}>L</div>
          <span style={{ fontWeight: 700, fontSize: 16, color: '#1a1414' }}>Report a repair</span>
          {isEmergency && (
            <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: 'rgba(248,113,113,0.1)', color: '#c0392b', border: '1px solid rgba(248,113,113,0.2)' }}>EMERGENCY</span>
          )}
        </div>

        {/* Progress */}
        <div style={{ background: '#fff', borderBottom: '1px solid #f0e8e8', padding: '12px 20px' }}>
          <div style={{ display: 'flex', gap: 4, maxWidth: 540, margin: '0 auto' }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ flex: 1 }}>
                <div style={{ height: 3, borderRadius: 2, background: i <= step ? R : '#f0e8e8', marginBottom: 5, transition: 'background .2s' }}/>
                <div style={{ fontSize: 10, fontWeight: i === step ? 700 : 400, color: i <= step ? R : '#c0b0b0', textAlign: 'center' }}>{s}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 540, margin: '0 auto', padding: '28px 20px 100px' }}>

          {/* STEP 0: Property and tenant details */}
          {step === 0 && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1a1414', marginBottom: 6 }}>Your details</h2>
              <p style={{ fontSize: 14, color: '#9a8080', marginBottom: 24 }}>Tell us about yourself and the property that needs a repair.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={lbl}>Property address *</label>
                  <input style={inp} value={form.property_address} onChange={e => set('property_address', e.target.value)} placeholder="e.g. 11 Northfield Avenue, Hessle, HU13"/>
                </div>
                <div>
                  <label style={lbl}>Your full name *</label>
                  <input style={inp} value={form.tenant_name} onChange={e => set('tenant_name', e.target.value)} placeholder="First and last name"/>
                </div>
                <div>
                  <label style={lbl}>Email address *</label>
                  <input type="email" style={inp} value={form.tenant_email} onChange={e => set('tenant_email', e.target.value)} placeholder="you@example.com"/>
                </div>
                <div>
                  <label style={lbl}>Phone number (optional)</label>
                  <input type="tel" style={inp} value={form.tenant_phone} onChange={e => set('tenant_phone', e.target.value)} placeholder="07700 000000"/>
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: Category */}
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1a1414', marginBottom: 6 }}>What needs fixing?</h2>
              <p style={{ fontSize: 14, color: '#9a8080', marginBottom: 20 }}>Select the type of repair needed.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                {Object.keys(CATEGORIES).map(cat => (
                  <button key={cat} onClick={() => { set('category', cat); set('subcategory', '') }} style={{
                    padding: '14px 12px', borderRadius: 10, border: '1.5px solid ' + (form.category === cat ? R : '#ede5e5'),
                    background: form.category === cat ? RDIM : '#fff', cursor: 'pointer', textAlign: 'left',
                    fontFamily: 'inherit', fontWeight: 600, fontSize: 13, color: form.category === cat ? R : '#3a3333',
                    transition: 'all .15s'
                  }}>
                    {cat}
                  </button>
                ))}
              </div>
              {form.category && (
                <div>
                  <label style={lbl}>Specific issue</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {subcats.map(sub => {
                      const isEmerg = EMERGENCY_SUBCATEGORIES.includes(sub)
                      return (
                        <button key={sub} onClick={() => set('subcategory', sub)} style={{
                          padding: '11px 14px', borderRadius: 8, border: '1.5px solid ' + (form.subcategory === sub ? R : '#ede5e5'),
                          background: form.subcategory === sub ? RDIM : '#fff', cursor: 'pointer', textAlign: 'left',
                          fontFamily: 'inherit', fontWeight: 500, fontSize: 14, color: '#3a3333',
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                        }}>
                          {sub}
                          {isEmerg && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: 'rgba(248,113,113,0.1)', color: '#c0392b' }}>EMERGENCY</span>}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
              {isEmergency && (
                <div style={{ marginTop: 16, padding: 14, background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 10, fontSize: 13, color: '#c0392b', fontWeight: 600, lineHeight: 1.6 }}>
                  This has been flagged as an emergency. If there is immediate risk to life or property, call 999. Otherwise we will prioritise this report and aim to respond within 4 hours.
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Description */}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1a1414', marginBottom: 6 }}>Describe the issue</h2>
              <p style={{ fontSize: 14, color: '#9a8080', marginBottom: 24 }}>The more detail you give, the faster we can help.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={lbl}>Description *</label>
                  <textarea value={form.description} onChange={e => set('description', e.target.value)}
                    placeholder="Describe what has happened and where in the property the issue is. When did it start? Has it happened before?"
                    rows={5}
                    style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }}
                  />
                  <div style={{ fontSize: 12, color: form.description.length < 10 ? '#c0392b' : '#9a8080', marginTop: 4 }}>
                    {form.description.length < 10 ? `${10 - form.description.length} more characters needed` : `${form.description.length} characters`}
                  </div>
                </div>
                <div>
                  <label style={lbl}>Access instructions (optional)</label>
                  <input style={inp} value={form.access_instructions} onChange={e => set('access_instructions', e.target.value)}
                    placeholder="e.g. Key in lockbox, dog in garden, ring bell"/>
                </div>
                <div>
                  <label style={lbl}>Preferred time for visit (optional)</label>
                  <select value={form.preferred_time} onChange={e => set('preferred_time', e.target.value)} style={{ ...inp, appearance: 'none' }}>
                    <option value="">No preference</option>
                    <option>Morning (8am - 12pm)</option>
                    <option>Afternoon (12pm - 5pm)</option>
                    <option>Weekday only</option>
                    <option>Weekend preferred</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Photos */}
          {step === 3 && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1a1414', marginBottom: 6 }}>Add photos</h2>
              <p style={{ fontSize: 14, color: '#9a8080', marginBottom: 24 }}>Photos help contractors diagnose the issue before they visit. Up to 6 photos.</p>
              <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => addPhotos(e.target.files)}/>
              <input ref={cameraRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={e => addPhotos(e.target.files)}/>
              <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                <button onClick={() => cameraRef.current.click()} style={{ flex: 1, padding: '14px 12px', borderRadius: 10, border: '1.5px dashed ' + RBDR, background: RDIM, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: 14, color: R, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  📷 Take photo
                </button>
                <button onClick={() => fileRef.current.click()} style={{ flex: 1, padding: '14px 12px', borderRadius: 10, border: '1.5px dashed #ede5e5', background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: 14, color: '#6b5f5f', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  🗂 Browse files
                </button>
              </div>
              {photos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                  {photos.map((p, i) => (
                    <div key={i} style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', aspectRatio: '1', border: '1px solid #ede5e5' }}>
                      <img src={p.preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                      <button onClick={() => removePhoto(i)} style={{ position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                    </div>
                  ))}
                </div>
              )}
              {photos.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#c0b0b0', fontSize: 14 }}>
                  No photos added yet. Photos are optional but helpful.
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Review and submit */}
          {step === 4 && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1a1414', marginBottom: 6 }}>Review and submit</h2>
              <p style={{ fontSize: 14, color: '#9a8080', marginBottom: 24 }}>Check your details are correct before submitting.</p>
              {[
                ['Property', form.property_address],
                ['Tenant', form.tenant_name],
                ['Email', form.tenant_email],
                ['Phone', form.tenant_phone || 'Not provided'],
                ['Category', form.category + ' - ' + form.subcategory],
                ['Description', form.description],
                ['Access', form.access_instructions || 'Not provided'],
                ['Preferred time', form.preferred_time || 'No preference'],
                ['Photos', photos.length + ' photo' + (photos.length === 1 ? '' : 's') + ' added'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid #f0e8e8', fontSize: 14 }}>
                  <span style={{ fontWeight: 600, color: '#9a8080', minWidth: 110, flexShrink: 0 }}>{k}</span>
                  <span style={{ color: '#1a1414' }}>{v}</span>
                </div>
              ))}
              {isEmergency && (
                <div style={{ marginTop: 16, padding: 14, background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 10, fontSize: 13, color: '#c0392b', fontWeight: 600 }}>
                  Emergency flagged. We will aim to respond within 4 hours.
                </div>
              )}
              {error && (
                <div style={{ marginTop: 16, padding: 12, background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 8, fontSize: 13, color: '#c0392b' }}>
                  {error}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom nav */}
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #f0e8e8', padding: '12px 20px', display: 'flex', gap: 10 }}>
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} style={{ padding: '12px 20px', borderRadius: 100, border: '1px solid #ede5e5', background: '#fff', fontFamily: 'inherit', fontWeight: 600, fontSize: 15, color: '#6b5f5f', cursor: 'pointer' }}>
              Back
            </button>
          )}
          {step < 4 ? (
            <button onClick={() => setStep(s => s + 1)} disabled={!canNext()} style={{ flex: 1, padding: '13px 20px', borderRadius: 100, border: 'none', background: canNext() ? R : '#f0e8e8', fontFamily: 'inherit', fontWeight: 700, fontSize: 15, color: canNext() ? '#fff' : '#c0b0b0', cursor: canNext() ? 'pointer' : 'default', transition: 'all .15s' }}>
              Continue
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting} style={{ flex: 1, padding: '13px 20px', borderRadius: 100, border: 'none', background: R, fontFamily: 'inherit', fontWeight: 700, fontSize: 15, color: '#fff', cursor: 'pointer', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? 'Submitting...' : 'Submit repair request'}
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps() {
  return { props: {} }
}
