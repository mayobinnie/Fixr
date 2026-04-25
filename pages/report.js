import { useState, useRef } from 'react'
import Head from 'next/head'

const CATEGORIES = {
  'Plumbing': ['Leaking tap','Blocked drain','No hot water','Toilet not flushing','Burst pipe','Low water pressure','Other plumbing'],
  'Heating': ['No heating','Radiator not working','Boiler fault','Thermostat issue','Other heating'],
  'Electrical': ['No power','Lights not working','Socket not working','Trip switch issue','Other electrical'],
  'Doors and windows': ['Door not locking','Window not closing','Broken lock','Broken hinge','Other'],
  'Damp and mould': ['Mould on walls','Damp patch','Condensation','Leak from above','Other'],
  'Appliances': ['Oven not working','Fridge not working','Washing machine fault','Dishwasher fault','Other'],
  'Structural': ['Ceiling damage','Wall damage','Flooring issue','Roof issue','Other'],
  'Pests': ['Mice','Rats','Insects','Other'],
  'Garden and exterior': ['Garden maintenance','Fence damage','Gate fault','Guttering','Other'],
  'Other': ['General repair','Decoration','Cleaning','Other'],
}
const EMERGENCY = ['Burst pipe','No heating','No power','Boiler fault']
const STEPS = ['Property','Issue','Details','Photos','Submit']

const R = '#e07b7b'
const RL = '#eca9a9'
const RDIM = 'rgba(224,123,123,0.10)'
const RBDR = 'rgba(224,123,123,0.25)'
const inp = { width:'100%', background:'#fff', border:'1px solid #e5e0e0', borderRadius:10, padding:'11px 14px', fontSize:15, fontFamily:'inherit', outline:'none', color:'#1a1414', boxSizing:'border-box' }
const lbl = { fontSize:13, fontWeight:600, color:'#4a3f3f', marginBottom:6, display:'block' }

function generateRef() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let r = 'RPR-'
  for (let i=0;i<6;i++) r += chars[Math.floor(Math.random()*chars.length)]
  return r
}

export default function ReportPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ property_address:'', tenant_name:'', tenant_email:'', tenant_phone:'', category:'', subcategory:'', description:'', access_instructions:'', preferred_time:'' })
  const [photos, setPhotos] = useState([])
  const [submitted, setSubmitted] = useState(null)
  const fileRef = useRef()
  const cameraRef = useRef()

  const isEmergency = EMERGENCY.includes(form.subcategory)
  const subcats = CATEGORIES[form.category] || []
  const set = (k,v) => setForm(f=>({...f,[k]:v}))

  function addPhotos(files) {
    Array.from(files).slice(0,6-photos.length).forEach(file => {
      const r = new FileReader()
      r.onload = e => setPhotos(p=>[...p,{preview:e.target.result}])
      r.readAsDataURL(file)
    })
  }

  function canNext() {
    if (step===0) return form.property_address && form.tenant_name && form.tenant_email
    if (step===1) return form.category && form.subcategory
    if (step===2) return form.description.length >= 10
    return true
  }

  function handleSubmit() {
    setSubmitted({ reference: generateRef(), email: form.tenant_email, isEmergency })
  }

  if (submitted) return (
    <div style={{ minHeight:'100vh', background:'#fdf9f9', display:'flex', alignItems:'center', justifyContent:'center', padding:20, fontFamily:"'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <div style={{ maxWidth:480, width:'100%', textAlign:'center' }}>
        <div style={{ width:72, height:72, background:RDIM, border:'2px solid '+RBDR, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, margin:'0 auto 20px' }}>✓</div>
        <h1 style={{ fontWeight:800, fontSize:26, color:'#1a1414', marginBottom:8 }}>Report received</h1>
        <p style={{ fontSize:15, color:'#6b5f5f', marginBottom:24, lineHeight:1.7 }}>We have logged your repair request and will be in touch shortly.</p>
        <div style={{ background:'#fff', border:'1px solid #eedada', borderRadius:12, padding:'20px 24px', marginBottom:24 }}>
          <div style={{ fontSize:12, fontWeight:700, color:'#9a8080', textTransform:'uppercase', letterSpacing:1, marginBottom:6 }}>Your reference number</div>
          <div style={{ fontFamily:'monospace', fontSize:28, fontWeight:800, color:R, letterSpacing:3 }}>{submitted.reference}</div>
          <div style={{ fontSize:12, color:'#9a8080', marginTop:6 }}>Keep this safe. Use it to check your repair status.</div>
        </div>
        {submitted.isEmergency && <div style={{ background:'rgba(248,113,113,0.08)', border:'1px solid rgba(248,113,113,0.25)', borderRadius:10, padding:16, fontSize:14, color:'#c0392b', fontWeight:600 }}>Emergency flagged. You will be contacted within 4 hours.</div>}
      </div>
    </div>
  )

  return (
    <>
      <Head>
        <title>Report a repair</title>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet"/>
      </Head>
      <div style={{ minHeight:'100vh', background:'#fdf9f9', fontFamily:"'Plus Jakarta Sans', system-ui, sans-serif" }}>
        <div style={{ background:'#fff', borderBottom:'1px solid #f0e8e8', padding:'0 20px', height:60, display:'flex', alignItems:'center', gap:12, position:'sticky', top:0, zIndex:10 }}>
          <div style={{ width:32, height:32, background:R, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:15, color:'#fff' }}>L</div>
          <span style={{ fontWeight:700, fontSize:16, color:'#1a1414' }}>Report a repair</span>
          {isEmergency && <span style={{ marginLeft:'auto', fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20, background:'rgba(248,113,113,0.1)', color:'#c0392b' }}>EMERGENCY</span>}
        </div>

        <div style={{ background:'#fff', borderBottom:'1px solid #f0e8e8', padding:'12px 20px' }}>
          <div style={{ display:'flex', gap:4, maxWidth:540, margin:'0 auto' }}>
            {STEPS.map((s,i) => (
              <div key={s} style={{ flex:1 }}>
                <div style={{ height:3, borderRadius:2, background: i<=step ? R : '#f0e8e8', marginBottom:5 }}/>
                <div style={{ fontSize:10, fontWeight: i===step ? 700 : 400, color: i<=step ? R : '#c0b0b0', textAlign:'center' }}>{s}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ maxWidth:540, margin:'0 auto', padding:'28px 20px 100px' }}>
          {step===0 && (
            <div>
              <h2 style={{ fontSize:22, fontWeight:800, color:'#1a1414', marginBottom:6 }}>Your details</h2>
              <p style={{ fontSize:14, color:'#9a8080', marginBottom:24 }}>Tell us about yourself and the property.</p>
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <div><label style={lbl}>Property address *</label><input style={inp} value={form.property_address} onChange={e=>set('property_address',e.target.value)} placeholder="e.g. 11 Northfield Avenue, Hessle, HU13"/></div>
                <div><label style={lbl}>Your full name *</label><input style={inp} value={form.tenant_name} onChange={e=>set('tenant_name',e.target.value)} placeholder="First and last name"/></div>
                <div><label style={lbl}>Email address *</label><input type="email" style={inp} value={form.tenant_email} onChange={e=>set('tenant_email',e.target.value)} placeholder="you@example.com"/></div>
                <div><label style={lbl}>Phone number (optional)</label><input type="tel" style={inp} value={form.tenant_phone} onChange={e=>set('tenant_phone',e.target.value)} placeholder="07700 000000"/></div>
              </div>
            </div>
          )}

          {step===1 && (
            <div>
              <h2 style={{ fontSize:22, fontWeight:800, color:'#1a1414', marginBottom:6 }}>What needs fixing?</h2>
              <p style={{ fontSize:14, color:'#9a8080', marginBottom:20 }}>Select the type of repair.</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
                {Object.keys(CATEGORIES).map(cat => (
                  <button key={cat} onClick={()=>{set('category',cat);set('subcategory','')}} style={{ padding:'14px 12px', borderRadius:10, border:'1.5px solid '+(form.category===cat ? R : '#ede5e5'), background: form.category===cat ? RDIM : '#fff', cursor:'pointer', textAlign:'left', fontFamily:'inherit', fontWeight:600, fontSize:13, color: form.category===cat ? R : '#3a3333' }}>
                    {cat}
                  </button>
                ))}
              </div>
              {form.category && (
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {subcats.map(sub => (
                    <button key={sub} onClick={()=>set('subcategory',sub)} style={{ padding:'11px 14px', borderRadius:8, border:'1.5px solid '+(form.subcategory===sub ? R : '#ede5e5'), background: form.subcategory===sub ? RDIM : '#fff', cursor:'pointer', textAlign:'left', fontFamily:'inherit', fontWeight:500, fontSize:14, color:'#3a3333', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      {sub}
                      {EMERGENCY.includes(sub) && <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20, background:'rgba(248,113,113,0.1)', color:'#c0392b' }}>EMERGENCY</span>}
                    </button>
                  ))}
                </div>
              )}
              {isEmergency && <div style={{ marginTop:16, padding:14, background:'rgba(248,113,113,0.07)', border:'1px solid rgba(248,113,113,0.2)', borderRadius:10, fontSize:13, color:'#c0392b', fontWeight:600, lineHeight:1.6 }}>If there is immediate risk to life or property, call 999. Otherwise we will prioritise this and aim to respond within 4 hours.</div>}
            </div>
          )}

          {step===2 && (
            <div>
              <h2 style={{ fontSize:22, fontWeight:800, color:'#1a1414', marginBottom:6 }}>Describe the issue</h2>
              <p style={{ fontSize:14, color:'#9a8080', marginBottom:24 }}>The more detail, the faster we can help.</p>
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <div>
                  <label style={lbl}>Description *</label>
                  <textarea value={form.description} onChange={e=>set('description',e.target.value)} placeholder="What happened, where in the property, when it started..." rows={5} style={{ ...inp, resize:'vertical', lineHeight:1.6 }}/>
                  <div style={{ fontSize:12, color: form.description.length<10 ? '#c0392b' : '#9a8080', marginTop:4 }}>{form.description.length<10 ? `${10-form.description.length} more characters needed` : `${form.description.length} characters`}</div>
                </div>
                <div><label style={lbl}>Access instructions (optional)</label><input style={inp} value={form.access_instructions} onChange={e=>set('access_instructions',e.target.value)} placeholder="e.g. Key in lockbox, ring bell"/></div>
                <div>
                  <label style={lbl}>Preferred time for visit (optional)</label>
                  <select value={form.preferred_time} onChange={e=>set('preferred_time',e.target.value)} style={{ ...inp, appearance:'none' }}>
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

          {step===3 && (
            <div>
              <h2 style={{ fontSize:22, fontWeight:800, color:'#1a1414', marginBottom:6 }}>Add photos</h2>
              <p style={{ fontSize:14, color:'#9a8080', marginBottom:24 }}>Photos help contractors diagnose before they visit. Up to 6.</p>
              <input ref={fileRef} type="file" accept="image/*" multiple style={{ display:'none' }} onChange={e=>addPhotos(e.target.files)}/>
              <input ref={cameraRef} type="file" accept="image/*" capture="environment" style={{ display:'none' }} onChange={e=>addPhotos(e.target.files)}/>
              <div style={{ display:'flex', gap:10, marginBottom:20 }}>
                <button onClick={()=>cameraRef.current.click()} style={{ flex:1, padding:'14px 12px', borderRadius:10, border:'1.5px dashed '+RBDR, background:RDIM, cursor:'pointer', fontFamily:'inherit', fontWeight:700, fontSize:14, color:R }}>📷 Take photo</button>
                <button onClick={()=>fileRef.current.click()} style={{ flex:1, padding:'14px 12px', borderRadius:10, border:'1.5px dashed #ede5e5', background:'#fff', cursor:'pointer', fontFamily:'inherit', fontWeight:700, fontSize:14, color:'#6b5f5f' }}>🗂 Browse files</button>
              </div>
              {photos.length > 0 ? (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
                  {photos.map((p,i) => (
                    <div key={i} style={{ position:'relative', borderRadius:10, overflow:'hidden', aspectRatio:'1', border:'1px solid #ede5e5' }}>
                      <img src={p.preview} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                      <button onClick={()=>setPhotos(p=>p.filter((_,idx)=>idx!==i))} style={{ position:'absolute', top:4, right:4, width:22, height:22, borderRadius:'50%', background:'rgba(0,0,0,0.6)', border:'none', color:'#fff', cursor:'pointer', fontSize:14 }}>×</button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign:'center', padding:'40px 20px', color:'#c0b0b0', fontSize:14 }}>No photos added yet. Photos are optional but helpful.</div>
              )}
            </div>
          )}

          {step===4 && (
            <div>
              <h2 style={{ fontSize:22, fontWeight:800, color:'#1a1414', marginBottom:6 }}>Review and submit</h2>
              <p style={{ fontSize:14, color:'#9a8080', marginBottom:24 }}>Check your details before submitting.</p>
              {[['Property',form.property_address],['Name',form.tenant_name],['Email',form.tenant_email],['Phone',form.tenant_phone||'Not provided'],['Issue',form.category+': '+form.subcategory],['Description',form.description],['Access',form.access_instructions||'Not provided'],['Preferred time',form.preferred_time||'No preference'],['Photos',photos.length+' photo'+(photos.length===1?'':'s')]].map(([k,v])=>(
                <div key={k} style={{ display:'flex', gap:12, padding:'10px 0', borderBottom:'1px solid #f0e8e8', fontSize:14 }}>
                  <span style={{ fontWeight:600, color:'#9a8080', minWidth:110, flexShrink:0 }}>{k}</span>
                  <span style={{ color:'#1a1414' }}>{v}</span>
                </div>
              ))}
              {isEmergency && <div style={{ marginTop:16, padding:14, background:'rgba(248,113,113,0.07)', border:'1px solid rgba(248,113,113,0.2)', borderRadius:10, fontSize:13, color:'#c0392b', fontWeight:600 }}>Emergency flagged. We will aim to respond within 4 hours.</div>}
            </div>
          )}
        </div>

        <div style={{ position:'fixed', bottom:0, left:0, right:0, background:'#fff', borderTop:'1px solid #f0e8e8', padding:'12px 20px', display:'flex', gap:10 }}>
          {step>0 && <button onClick={()=>setStep(s=>s-1)} style={{ padding:'12px 20px', borderRadius:100, border:'1px solid #ede5e5', background:'#fff', fontFamily:'inherit', fontWeight:600, fontSize:15, color:'#6b5f5f', cursor:'pointer' }}>Back</button>}
          {step<4
            ? <button onClick={()=>setStep(s=>s+1)} disabled={!canNext()} style={{ flex:1, padding:'13px 20px', borderRadius:100, border:'none', background: canNext() ? R : '#f0e8e8', fontFamily:'inherit', fontWeight:700, fontSize:15, color: canNext() ? '#fff' : '#c0b0b0', cursor: canNext() ? 'pointer' : 'default' }}>Continue</button>
            : <button onClick={handleSubmit} style={{ flex:1, padding:'13px 20px', borderRadius:100, border:'none', background:R, fontFamily:'inherit', fontWeight:700, fontSize:15, color:'#fff', cursor:'pointer' }}>Submit repair request</button>
          }
        </div>
      </div>
    </>
  )
}
