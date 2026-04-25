import { useState, useRef } from 'react'
import Head from 'next/head'

const ICONS = {
  plumbing: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="20" width="8" height="22" rx="2" fill="currentColor" opacity=".2"/><rect x="8" y="20" width="4" height="22" rx="1" fill="currentColor"/><path d="M10 20V12a8 8 0 0 1 8-8h12a8 8 0 0 1 8 8v4" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none"/><rect x="34" y="14" width="8" height="18" rx="2" fill="currentColor" opacity=".2"/><rect x="36" y="14" width="4" height="18" rx="1" fill="currentColor"/><circle cx="10" cy="44" r="3" fill="currentColor"/><circle cx="38" cy="34" r="3" fill="currentColor"/></svg>`,
  heating: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 6c0 0-8 8-8 16a8 8 0 0 0 16 0C32 14 24 6 24 6z" fill="currentColor" opacity=".25"/><path d="M24 6c0 0-8 8-8 16a8 8 0 0 0 16 0C32 14 24 6 24 6z" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" fill="none"/><path d="M20 26c0 0 2-3 2-6 0 0 3 3 3 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/><path d="M12 40h24" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M8 44h32" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity=".4"/></svg>`,
  electrical: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M28 4L14 26h12l-6 18 20-24H28L34 4z" fill="currentColor" opacity=".2"/><path d="M28 4L14 26h12l-6 18 20-24H28L34 4z" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" fill="none"/></svg>`,
  doors: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="4" width="32" height="40" rx="2" fill="currentColor" opacity=".15"/><rect x="8" y="4" width="32" height="40" rx="2" stroke="currentColor" stroke-width="2.5" fill="none"/><circle cx="34" cy="24" r="2.5" fill="currentColor"/><path d="M8 4l8 8" stroke="currentColor" stroke-width="1.5" opacity=".3"/></svg>`,
  damp: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 8c0 0-14 14-14 22a14 14 0 0 0 28 0C38 22 24 8 24 8z" fill="currentColor" opacity=".2"/><path d="M24 8c0 0-14 14-14 22a14 14 0 0 0 28 0C38 22 24 8 24 8z" stroke="currentColor" stroke-width="2.5" fill="none"/><path d="M18 34a6 6 0 0 0 6 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  appliances: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="8" width="32" height="32" rx="3" fill="currentColor" opacity=".15"/><rect x="8" y="8" width="32" height="32" rx="3" stroke="currentColor" stroke-width="2.5" fill="none"/><circle cx="24" cy="24" r="8" stroke="currentColor" stroke-width="2.5" fill="none"/><circle cx="24" cy="24" r="3" fill="currentColor" opacity=".4"/><path d="M14 12h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="33" cy="12" r="1.5" fill="currentColor"/></svg>`,
  structural: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 6L4 22h6v20h28V22h6L24 6z" fill="currentColor" opacity=".2"/><path d="M24 6L4 22h6v20h28V22h6L24 6z" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" fill="none"/><rect x="18" y="30" width="12" height="12" fill="currentColor" opacity=".3"/></svg>`,
  pests: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="24" cy="26" rx="10" ry="13" fill="currentColor" opacity=".2"/><ellipse cx="24" cy="26" rx="10" ry="13" stroke="currentColor" stroke-width="2.5" fill="none"/><circle cx="24" cy="14" r="5" fill="currentColor" opacity=".3"/><circle cx="24" cy="14" r="5" stroke="currentColor" stroke-width="2.5" fill="none"/><path d="M8 20l6 4M40 20l-6 4M8 30l6-2M40 30l-6-2M14 40l4-4M34 40l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="21" cy="12" r="1.5" fill="currentColor"/><circle cx="27" cy="12" r="1.5" fill="currentColor"/></svg>`,
  garden: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 38V20M24 20c0 0-8-6-14-6 0 8 6 14 14 14M24 20c0 0 8-6 14-6 0 8-6 14-14 14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M24 28c0 0-4-8-4-14 4 0 8 6 8 14" fill="currentColor" opacity=".2"/><path d="M10 42h28" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>`,
  other: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="18" fill="currentColor" opacity=".1"/><circle cx="24" cy="24" r="18" stroke="currentColor" stroke-width="2.5" fill="none"/><path d="M20 19a4 4 0 0 1 8 0c0 4-4 4-4 8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" fill="none"/><circle cx="24" cy="34" r="2" fill="currentColor"/></svg>`,
}

const CATEGORIES = [
  { id:'plumbing',   label:'Plumbing',          color:'#3b82f6', bg:'#eff6ff', subs:['Leaking tap','Blocked drain','No hot water','Toilet not flushing','Burst pipe','Low water pressure','Other'] },
  { id:'heating',    label:'Heating',            color:'#f97316', bg:'#fff7ed', subs:['No heating','Radiator not working','Boiler fault','Thermostat issue','Other'] },
  { id:'electrical', label:'Electrical',         color:'#eab308', bg:'#fefce8', subs:['No power','Lights not working','Socket not working','Trip switch issue','Other'] },
  { id:'doors',      label:'Doors and windows',  color:'#8b5cf6', bg:'#f5f3ff', subs:['Door not locking','Window not closing','Broken lock','Broken hinge','Other'] },
  { id:'damp',       label:'Damp and mould',     color:'#06b6d4', bg:'#ecfeff', subs:['Mould on walls','Damp patch','Condensation','Leak from above','Other'] },
  { id:'appliances', label:'Appliances',         color:'#ec4899', bg:'#fdf2f8', subs:['Oven not working','Fridge not working','Washing machine fault','Dishwasher fault','Other'] },
  { id:'structural', label:'Structural',         color:'#6b7280', bg:'#f9fafb', subs:['Ceiling damage','Wall damage','Flooring issue','Roof issue','Other'] },
  { id:'pests',      label:'Pests',              color:'#84cc16', bg:'#f7fee7', subs:['Mice','Rats','Insects','Other'] },
  { id:'garden',     label:'Garden and exterior',color:'#22c55e', bg:'#f0fdf4', subs:['Garden maintenance','Fence damage','Gate fault','Guttering','Other'] },
  { id:'other',      label:'Other',              color:'#9ca3af', bg:'#f9fafb', subs:['General repair','Decoration','Cleaning','Other'] },
]

const EMERGENCY = ['Burst pipe','No heating','No power','Boiler fault']
const STEPS = ['Property','Issue','Details','Photos','Submit']
const R = '#e07b7b'
const RDIM = 'rgba(224,123,123,0.10)'
const RBDR = 'rgba(224,123,123,0.25)'
const inp = { width:'100%', background:'#fff', border:'1px solid #e5e0e0', borderRadius:10, padding:'11px 14px', fontSize:15, fontFamily:'inherit', outline:'none', color:'#1a1414', boxSizing:'border-box' }
const lbl = { fontSize:13, fontWeight:600, color:'#4a3f3f', marginBottom:6, display:'block' }

function CategoryIcon({ id, color }) {
  return (
    <span style={{ color, width:44, height:44, display:'block' }}
      dangerouslySetInnerHTML={{ __html: ICONS[id] || ICONS.other }}
    />
  )
}

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

  const selectedCat = CATEGORIES.find(c => c.id === form.category)
  const isEmergency = EMERGENCY.includes(form.subcategory)
  const set = (k,v) => setForm(f=>({...f,[k]:v}))

  function addPhotos(files) {
    Array.from(files).slice(0, 6 - photos.length).forEach(file => {
      const r = new FileReader()
      r.onload = e => setPhotos(p => [...p, { preview: e.target.result }])
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
        <div style={{ width:72, height:72, background:RDIM, border:'2px solid '+RBDR, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:36, margin:'0 auto 20px' }}>✓</div>
        <h1 style={{ fontWeight:800, fontSize:26, color:'#1a1414', marginBottom:8 }}>Report received</h1>
        <p style={{ fontSize:15, color:'#6b5f5f', marginBottom:24, lineHeight:1.7 }}>We have logged your repair and will be in touch shortly.</p>
        <div style={{ background:'#fff', border:'1px solid #eedada', borderRadius:12, padding:'20px 24px', marginBottom:24 }}>
          <div style={{ fontSize:12, fontWeight:700, color:'#9a8080', textTransform:'uppercase', letterSpacing:1, marginBottom:6 }}>Your reference number</div>
          <div style={{ fontFamily:'monospace', fontSize:28, fontWeight:800, color:R, letterSpacing:3 }}>{submitted.reference}</div>
          <div style={{ fontSize:12, color:'#9a8080', marginTop:6 }}>Keep this safe to check your repair status.</div>
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
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style>{`*{box-sizing:border-box;margin:0;padding:0}body{background:#fdf9f9}.cat-btn:hover{transform:translateY(-2px);box-shadow:0 4px 16px rgba(0,0,0,0.08)}`}</style>
      </Head>
      <div style={{ minHeight:'100vh', background:'#fdf9f9', fontFamily:"'Plus Jakarta Sans', system-ui, sans-serif" }}>

        <div style={{ background:'#fff', borderBottom:'1px solid #f0e8e8', padding:'0 20px', height:60, display:'flex', alignItems:'center', gap:12, position:'sticky', top:0, zIndex:10 }}>
          <div style={{ width:32, height:32, background:R, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:15, color:'#fff' }}>L</div>
          <span style={{ fontWeight:700, fontSize:16, color:'#1a1414' }}>Report a repair</span>
          {isEmergency && <span style={{ marginLeft:'auto', fontSize:11, fontWeight:700, padding:'3px 12px', borderRadius:20, background:'rgba(248,113,113,0.1)', color:'#c0392b', border:'1px solid rgba(248,113,113,0.2)' }}>EMERGENCY</span>}
        </div>

        <div style={{ background:'#fff', borderBottom:'1px solid #f0e8e8', padding:'12px 20px' }}>
          <div style={{ display:'flex', gap:4, maxWidth:600, margin:'0 auto' }}>
            {STEPS.map((s,i) => (
              <div key={s} style={{ flex:1 }}>
                <div style={{ height:3, borderRadius:2, background: i<=step ? R : '#f0e8e8', marginBottom:5, transition:'background .2s' }}/>
                <div style={{ fontSize:10, fontWeight: i===step?700:400, color: i<=step?R:'#c0b0b0', textAlign:'center' }}>{s}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ maxWidth:680, margin:'0 auto', padding:'28px 16px 110px' }}>

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
              {!form.category ? (
                <>
                  <h2 style={{ fontSize:22, fontWeight:800, color:'#1a1414', marginBottom:6 }}>What needs fixing?</h2>
                  <p style={{ fontSize:14, color:'#9a8080', marginBottom:24 }}>Tap the area that best describes the problem.</p>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(150px, 1fr))', gap:14 }}>
                    {CATEGORIES.map(cat => (
                      <button key={cat.id} className="cat-btn" onClick={()=>{set('category',cat.id);set('subcategory','')}}
                        style={{ padding:'22px 12px 18px', borderRadius:16, border:'2px solid #f0e8e8', background:'#fff', cursor:'pointer', textAlign:'center', fontFamily:'inherit', transition:'all .18s', display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
                        <div style={{ width:56, height:56, borderRadius:16, background:cat.bg, display:'flex', alignItems:'center', justifyContent:'center', border:'1.5px solid '+cat.color+'30' }}>
                          <CategoryIcon id={cat.id} color={cat.color}/>
                        </div>
                        <span style={{ fontSize:13, fontWeight:700, color:'#1a1414', lineHeight:1.3 }}>{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <button onClick={()=>{set('category','');set('subcategory','')}} style={{ display:'inline-flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:14, color:'#9a8080', marginBottom:20, padding:0 }}>
                    ← All categories
                  </button>
                  <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:24, padding:'14px 18px', background:selectedCat.bg, borderRadius:14, border:'1.5px solid '+selectedCat.color+'30' }}>
                    <div style={{ width:48, height:48, borderRadius:12, background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <CategoryIcon id={selectedCat.id} color={selectedCat.color}/>
                    </div>
                    <div>
                      <div style={{ fontWeight:800, fontSize:16, color:'#1a1414' }}>{selectedCat.label}</div>
                      <div style={{ fontSize:13, color:'#6b5f5f', marginTop:2 }}>Select the specific issue below</div>
                    </div>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {selectedCat.subs.map(sub => {
                      const isEmerg = EMERGENCY.includes(sub)
                      const isSelected = form.subcategory === sub
                      return (
                        <button key={sub} onClick={()=>set('subcategory',sub)}
                          style={{ padding:'14px 18px', borderRadius:12, border:'2px solid '+(isSelected ? selectedCat.color : '#f0e8e8'), background: isSelected ? selectedCat.bg : '#fff', cursor:'pointer', textAlign:'left', fontFamily:'inherit', fontWeight:600, fontSize:14, color:'#1a1414', display:'flex', alignItems:'center', justifyContent:'space-between', transition:'all .15s' }}>
                          <span>{sub}</span>
                          {isEmerg && <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20, background:'rgba(248,113,113,0.12)', color:'#c0392b', flexShrink:0, marginLeft:8 }}>Emergency</span>}
                        </button>
                      )
                    })}
                  </div>
                  {isEmergency && (
                    <div style={{ marginTop:16, padding:14, background:'rgba(248,113,113,0.07)', border:'1px solid rgba(248,113,113,0.25)', borderRadius:12, fontSize:13, color:'#c0392b', fontWeight:600, lineHeight:1.6 }}>
                      If there is immediate risk to life or property, call 999. Otherwise we will prioritise this and aim to respond within 4 hours.
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {step===2 && (
            <div>
              <h2 style={{ fontSize:22, fontWeight:800, color:'#1a1414', marginBottom:6 }}>Describe the issue</h2>
              <p style={{ fontSize:14, color:'#9a8080', marginBottom:16 }}>The more detail, the faster we can help.</p>
              {selectedCat && (
                <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 14px 6px 8px', background:selectedCat.bg, borderRadius:20, border:'1px solid '+selectedCat.color+'30', marginBottom:20 }}>
                  <div style={{ width:28, height:28, borderRadius:8, background:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <span style={{ color:selectedCat.color, width:18, height:18, display:'block' }} dangerouslySetInnerHTML={{ __html: ICONS[selectedCat.id]||ICONS.other }}/>
                  </div>
                  <span style={{ fontSize:13, fontWeight:700, color:'#1a1414' }}>{selectedCat.label}: {form.subcategory}</span>
                </div>
              )}
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <div>
                  <label style={lbl}>Description *</label>
                  <textarea value={form.description} onChange={e=>set('description',e.target.value)} placeholder="What happened, where in the property, when it started..." rows={5} style={{ ...inp, resize:'vertical', lineHeight:1.6 }}/>
                  <div style={{ fontSize:12, color: form.description.length<10 ? '#c0392b' : '#9a8080', marginTop:4 }}>
                    {form.description.length<10 ? `${10-form.description.length} more characters needed` : `${form.description.length} characters`}
                  </div>
                </div>
                <div><label style={lbl}>Access instructions (optional)</label><input style={inp} value={form.access_instructions} onChange={e=>set('access_instructions',e.target.value)} placeholder="e.g. Key in lockbox, ring bell, dog in garden"/></div>
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
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20 }}>
                <button onClick={()=>cameraRef.current.click()} style={{ padding:'24px 12px', borderRadius:16, border:'2px dashed '+RBDR, background:RDIM, cursor:'pointer', fontFamily:'inherit', fontWeight:700, fontSize:15, color:R, display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="2" y="8" width="32" height="24" rx="4" stroke="currentColor" strokeWidth="2.5" fill="none"/><circle cx="18" cy="20" r="6" stroke="currentColor" strokeWidth="2.5" fill="none"/><path d="M13 8l2-4h6l2 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  Take photo
                </button>
                <button onClick={()=>fileRef.current.click()} style={{ padding:'24px 12px', borderRadius:16, border:'2px dashed #e5e0e0', background:'#fff', cursor:'pointer', fontFamily:'inherit', fontWeight:700, fontSize:15, color:'#6b5f5f', display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="2" y="6" width="32" height="24" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none" opacity=".5"/><path d="M10 6V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2.5"/><path d="M18 12v12M12 18h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
                  Browse files
                </button>
              </div>
              {photos.length > 0 ? (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
                  {photos.map((p,i) => (
                    <div key={i} style={{ position:'relative', borderRadius:12, overflow:'hidden', aspectRatio:'1', border:'2px solid #f0e8e8' }}>
                      <img src={p.preview} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                      <button onClick={()=>setPhotos(ph=>ph.filter((_,idx)=>idx!==i))} style={{ position:'absolute', top:6, right:6, width:24, height:24, borderRadius:'50%', background:'rgba(0,0,0,0.65)', border:'none', color:'#fff', cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center', lineHeight:1 }}>×</button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign:'center', padding:'40px 20px', color:'#c0b0b0', fontSize:14, background:'#fff', borderRadius:16, border:'2px dashed #f0e8e8', lineHeight:1.8 }}>
                  No photos added yet.<br/>Photos are optional but really helpful.
                </div>
              )}
            </div>
          )}

          {step===4 && (
            <div>
              <h2 style={{ fontSize:22, fontWeight:800, color:'#1a1414', marginBottom:6 }}>Review and submit</h2>
              <p style={{ fontSize:14, color:'#9a8080', marginBottom:20 }}>Check your details before submitting.</p>
              {selectedCat && (
                <div style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 18px', background:selectedCat.bg, borderRadius:12, border:'1.5px solid '+selectedCat.color+'30', marginBottom:20 }}>
                  <div style={{ width:44, height:44, borderRadius:10, background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <CategoryIcon id={selectedCat.id} color={selectedCat.color}/>
                  </div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:15, color:'#1a1414' }}>{selectedCat.label}: {form.subcategory}</div>
                    {isEmergency && <div style={{ fontSize:12, color:'#c0392b', fontWeight:600, marginTop:2 }}>Emergency</div>}
                  </div>
                </div>
              )}
              <div style={{ background:'#fff', border:'1px solid #f0e8e8', borderRadius:12, overflow:'hidden', marginBottom:16 }}>
                {[['Property',form.property_address],['Name',form.tenant_name],['Email',form.tenant_email],['Phone',form.tenant_phone||'Not provided'],['Description',form.description],['Access',form.access_instructions||'Not provided'],['Preferred time',form.preferred_time||'No preference'],['Photos',photos.length+' photo'+(photos.length===1?'':'s')]].map(([k,v],i,arr)=>(
                  <div key={k} style={{ display:'flex', gap:12, padding:'12px 16px', borderBottom: i<arr.length-1 ? '1px solid #f0e8e8' : 'none', fontSize:14 }}>
                    <span style={{ fontWeight:600, color:'#9a8080', minWidth:100, flexShrink:0 }}>{k}</span>
                    <span style={{ color:'#1a1414', lineHeight:1.5 }}>{v}</span>
                  </div>
                ))}
              </div>
              {isEmergency && <div style={{ padding:14, background:'rgba(248,113,113,0.07)', border:'1px solid rgba(248,113,113,0.25)', borderRadius:12, fontSize:13, color:'#c0392b', fontWeight:600 }}>Emergency flagged. We will aim to respond within 4 hours.</div>}
            </div>
          )}
        </div>

        <div style={{ position:'fixed', bottom:0, left:0, right:0, background:'#fff', borderTop:'1px solid #f0e8e8', padding:'12px 16px', display:'flex', gap:10 }}>
          {step>0 && !(step===1 && form.category && !form.subcategory) && (
            <button onClick={()=>{ if(step===1&&form.category){set('category','');set('subcategory','')}else{setStep(s=>s-1)} }} style={{ padding:'12px 20px', borderRadius:100, border:'1px solid #ede5e5', background:'#fff', fontFamily:'inherit', fontWeight:600, fontSize:15, color:'#6b5f5f', cursor:'pointer' }}>Back</button>
          )}
          {!(step===1 && !form.subcategory) && (
            step < 4
              ? <button onClick={()=>setStep(s=>s+1)} disabled={!canNext()} style={{ flex:1, padding:'13px 20px', borderRadius:100, border:'none', background: canNext() ? R : '#f0e8e8', fontFamily:'inherit', fontWeight:700, fontSize:15, color: canNext() ? '#fff' : '#c0b0b0', cursor: canNext() ? 'pointer' : 'default' }}>Continue</button>
              : <button onClick={handleSubmit} style={{ flex:1, padding:'13px 20px', borderRadius:100, border:'none', background:R, fontFamily:'inherit', fontWeight:700, fontSize:15, color:'#fff', cursor:'pointer' }}>Submit repair request</button>
          )}
        </div>
      </div>
    </>
  )
}
