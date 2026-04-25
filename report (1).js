import { useState, useRef } from 'react'
import Head from 'next/head'

// Detailed line-art SVG illustrations matching FixFlo style
const ILLUSTRATIONS = {
  bathroom: `<svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <!-- Bath -->
    <path d="M10 55 Q10 45 20 45 L80 45 Q90 45 90 55 L90 75 Q90 80 85 80 L15 80 Q10 80 10 75 Z"/>
    <path d="M25 45 L25 38 Q25 32 31 32 Q37 32 37 38 L37 45"/>
    <circle cx="31" cy="32" r="3"/>
    <path d="M27 80 L27 88 M83 80 L83 88"/>
    <path d="M22 88 L32 88 M78 88 L88 88"/>
    <!-- Tap -->
    <path d="M33 45 L33 40 M33 40 L40 40 L40 38" stroke-width="2"/>
    <!-- Toilet -->
    <ellipse cx="108" cy="55" rx="10" ry="7"/>
    <path d="M98 55 Q96 68 98 72 L118 72 Q120 68 118 55"/>
    <rect x="98" y="50" width="20" height="5" rx="2"/>
    <rect x="102" y="42" width="12" height="8" rx="1"/>
    <!-- Sink -->
    <ellipse cx="108" cy="88" rx="10" ry="6"/>
    <path d="M104 82 L104 78 M112 82 L112 78"/>
    <path d="M108 78 L108 72"/>
  </svg>`,
  kitchen: `<svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <!-- Counter top -->
    <rect x="5" y="62" width="110" height="6" rx="1"/>
    <!-- Cabinets below -->
    <rect x="5" y="68" width="50" height="28" rx="1"/>
    <rect x="60" y="68" width="55" height="28" rx="1"/>
    <circle cx="30" cy="82" r="2"/><circle cx="88" cy="82" r="2"/>
    <line x1="5" y1="82" x2="55" y2="82"/><line x1="60" y1="82" x2="115" y2="82"/>
    <!-- Wall cabinets -->
    <rect x="5" y="5" width="50" height="30" rx="1"/>
    <rect x="60" y="5" width="55" height="30" rx="1"/>
    <circle cx="30" cy="20" r="2"/><circle cx="88" cy="20" r="2"/>
    <!-- Hob -->
    <rect x="30" y="50" width="60" height="12" rx="2"/>
    <circle cx="45" cy="56" r="4"/><circle cx="75" cy="56" r="4"/>
    <circle cx="60" cy="56" r="3"/>
    <!-- Sink -->
    <rect x="8" y="50" width="18" height="12" rx="1"/>
    <line x1="17" y1="46" x2="17" y2="50"/>
    <path d="M14 46 Q17 43 20 46"/>
  </svg>`,
  heating: `<svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <!-- Radiator body -->
    <rect x="15" y="35" width="90" height="50" rx="3"/>
    <!-- Sections -->
    <line x1="33" y1="35" x2="33" y2="85"/>
    <line x1="51" y1="35" x2="51" y2="85"/>
    <line x1="69" y1="35" x2="69" y2="85"/>
    <line x1="87" y1="35" x2="87" y2="85"/>
    <!-- Top and bottom rails -->
    <rect x="15" y="35" width="90" height="8" rx="2"/>
    <rect x="15" y="77" width="90" height="8" rx="2"/>
    <!-- Pipe connections -->
    <path d="M25 85 L25 92 L15 92"/>
    <path d="M95 85 L95 92 L105 92"/>
    <!-- Valve -->
    <circle cx="15" cy="92" r="4"/>
    <!-- Heat waves -->
    <path d="M40 20 Q44 15 40 10" stroke-dasharray="none"/>
    <path d="M60 20 Q64 15 60 10"/>
    <path d="M80 20 Q84 15 80 10"/>
  </svg>`,
  water: `<svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <!-- Main pipe horizontal -->
    <path d="M5 35 L85 35" stroke-width="5"/>
    <!-- Elbow joint -->
    <path d="M85 35 Q98 35 98 48" stroke-width="5"/>
    <!-- Pipe vertical down -->
    <path d="M98 48 L98 75" stroke-width="5"/>
    <!-- Crack/leak on pipe -->
    <path d="M55 32 L58 38" stroke="#555" stroke-width="1.5"/>
    <!-- Water dripping -->
    <path d="M57 40 Q54 46 57 50 Q60 46 57 40"/>
    <path d="M57 54 Q55 58 57 61 Q59 58 57 54"/>
    <!-- Puddle -->
    <ellipse cx="57" cy="82" rx="20" ry="6" opacity="0.5"/>
    <ellipse cx="57" cy="82" rx="12" ry="3.5"/>
    <!-- Valve handle -->
    <circle cx="20" cy="35" r="6"/>
    <line x1="20" y1="29" x2="20" y2="23"/>
    <line x1="14" y1="32" x2="8" y2="28"/>
  </svg>`,
  doors: `<svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <!-- Door frame -->
    <path d="M25 5 L25 95 M95 5 L95 95"/>
    <path d="M25 5 L95 5"/>
    <!-- Door -->
    <rect x="28" y="5" width="64" height="90" rx="1"/>
    <!-- Door panels -->
    <rect x="34" y="12" width="25" height="30" rx="1"/>
    <rect x="64" y="12" width="25" height="30" rx="1"/>
    <rect x="34" y="48" width="25" height="38" rx="1"/>
    <rect x="64" y="48" width="25" height="38" rx="1"/>
    <!-- Handle -->
    <circle cx="82" cy="52" r="3"/>
    <line x1="82" y1="49" x2="82" y2="44"/>
    <!-- Keyhole -->
    <circle cx="82" cy="42" r="2.5"/>
    <path d="M80.5 44.5 L83.5 44.5 L83 47 L81 47 Z"/>
    <!-- Hinges -->
    <rect x="26" y="15" width="4" height="8" rx="1"/>
    <rect x="26" y="75" width="4" height="8" rx="1"/>
  </svg>`,
  damp: `<svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <!-- Wall -->
    <rect x="10" y="10" width="100" height="80" rx="2"/>
    <!-- Damp patch / mould -->
    <path d="M20 40 Q25 30 35 35 Q40 25 50 30 Q55 20 65 28 Q70 18 80 25 Q85 30 80 40 Q85 50 75 52 Q70 60 60 55 Q55 65 45 58 Q40 65 30 58 Q20 55 20 48 Q15 44 20 40Z" opacity="0.3" fill="#555"/>
    <path d="M20 40 Q25 30 35 35 Q40 25 50 30 Q55 20 65 28 Q70 18 80 25 Q85 30 80 40 Q85 50 75 52 Q70 60 60 55 Q55 65 45 58 Q40 65 30 58 Q20 55 20 48 Q15 44 20 40Z"/>
    <!-- Mould spots -->
    <circle cx="35" cy="40" r="4" fill="#555" opacity="0.4" stroke="none"/>
    <circle cx="50" cy="33" r="3" fill="#555" opacity="0.4" stroke="none"/>
    <circle cx="65" cy="38" r="5" fill="#555" opacity="0.4" stroke="none"/>
    <circle cx="55" cy="50" r="3" fill="#555" opacity="0.3" stroke="none"/>
    <!-- Water drops -->
    <path d="M85 60 Q83 65 85 69 Q87 65 85 60"/>
    <path d="M95 55 Q93 59 95 63 Q97 59 95 55"/>
  </svg>`,
  electrical: `<svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <!-- Fuse box -->
    <rect x="25" y="15" width="70" height="70" rx="3"/>
    <rect x="30" y="20" width="60" height="10" rx="1"/>
    <text x="34" y="29" font-size="7" fill="#555" stroke="none" font-family="sans-serif">CONSUMER UNIT</text>
    <!-- Breakers -->
    <rect x="32" y="34" width="12" height="18" rx="1"/>
    <rect x="48" y="34" width="12" height="18" rx="1"/>
    <rect x="64" y="34" width="12" height="18" rx="1"/>
    <rect x="80" y="34" width="12" height="18" rx="1"/>
    <!-- Breaker switches -->
    <rect x="35" y="37" width="6" height="6" rx="0.5" fill="#555" opacity="0.3"/>
    <rect x="51" y="37" width="6" height="6" rx="0.5" fill="#555" opacity="0.3"/>
    <rect x="67" y="43" width="6" height="6" rx="0.5" fill="#555" opacity="0.3"/>
    <rect x="83" y="37" width="6" height="6" rx="0.5" fill="#555" opacity="0.3"/>
    <!-- Lightning bolt for tripped -->
    <path d="M69 35 L66 42 L69 42 L66 49" stroke-width="1.5"/>
    <!-- Cables at bottom -->
    <path d="M40 85 L40 95 M60 85 L60 95 M80 85 L80 95"/>
    <!-- Socket on wall -->
    <rect x="3" y="55" width="18" height="14" rx="2"/>
    <circle cx="8" cy="60" r="2"/><circle cx="14" cy="60" r="2"/>
    <line x1="11" y1="63" x2="11" y2="65"/>
  </svg>`,
  structural: `<svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <!-- Room walls -->
    <path d="M10 90 L10 15 L60 5 L110 15 L110 90"/>
    <path d="M10 90 L110 90"/>
    <!-- Roof ridge -->
    <path d="M60 5 L60 5"/>
    <!-- Ceiling crack -->
    <path d="M30 15 L38 22 L45 18 L55 28 L65 22" stroke-width="2"/>
    <!-- Wall crack -->
    <path d="M110 40 L105 48 L108 55 L103 65"/>
    <!-- Floor damage -->
    <path d="M30 90 L35 85 L45 88 L50 90"/>
    <!-- Window -->
    <rect x="25" y="45" width="28" height="25" rx="1"/>
    <line x1="39" y1="45" x2="39" y2="70"/>
    <line x1="25" y1="57" x2="53" y2="57"/>
    <!-- Door -->
    <rect x="75" y="58" width="22" height="32" rx="1"/>
    <circle cx="91" cy="74" r="2"/>
  </svg>`,
  pests: `<svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <!-- Mouse body -->
    <ellipse cx="65" cy="65" rx="22" ry="14"/>
    <!-- Mouse head -->
    <ellipse cx="87" cy="58" rx="12" ry="10"/>
    <!-- Ear -->
    <ellipse cx="82" cy="50" rx="5" ry="7"/>
    <ellipse cx="82" cy="50" rx="3" ry="5" fill="none"/>
    <!-- Eye -->
    <circle cx="90" cy="56" r="2" fill="#555"/>
    <!-- Nose -->
    <circle cx="97" cy="60" r="1.5" fill="#555"/>
    <!-- Whiskers -->
    <line x1="97" y1="58" x2="110" y2="54"/>
    <line x1="97" y1="60" x2="112" y2="60"/>
    <line x1="97" y1="62" x2="110" y2="66"/>
    <!-- Tail -->
    <path d="M43 65 Q25 60 20 72 Q18 82 30 85"/>
    <!-- Feet -->
    <path d="M58 78 L55 85 M65 79 L63 87 M72 78 L72 86 M79 75 L82 83"/>
    <!-- Hole in skirting board -->
    <path d="M5 90 L115 90"/>
    <path d="M8 90 Q8 80 15 80 Q22 80 22 90"/>
  </svg>`,
  garden: `<svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <!-- Ground line -->
    <path d="M5 80 L115 80"/>
    <!-- House outline -->
    <path d="M60 10 L85 30 L85 75 L35 75 L35 30 Z"/>
    <path d="M25 35 L60 10 L95 35"/>
    <!-- Window -->
    <rect x="42" y="40" width="15" height="15" rx="1"/>
    <line x1="49.5" y1="40" x2="49.5" y2="55"/>
    <line x1="42" y1="47.5" x2="57" y2="47.5"/>
    <!-- Door -->
    <rect x="62" y="55" width="12" height="20" rx="1"/>
    <circle cx="71" cy="65" r="1.5"/>
    <!-- Tree -->
    <path d="M100 80 L100 55"/>
    <circle cx="100" cy="45" r="14"/>
    <circle cx="90" cy="52" r="9" opacity="0.6"/>
    <circle cx="110" cy="50" r="10" opacity="0.6"/>
    <!-- Garden path -->
    <path d="M68 80 Q70 88 72 95"/>
    <path d="M62 80 Q60 88 58 95"/>
    <!-- Fence -->
    <line x1="5" y1="75" x2="30" y2="75"/>
    <line x1="10" y1="68" x2="10" y2="80"/>
    <line x1="16" y1="68" x2="16" y2="80"/>
    <line x1="22" y1="68" x2="22" y2="80"/>
  </svg>`,
  appliances: `<svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <!-- Washing machine -->
    <rect x="8" y="20" width="45" height="72" rx="3"/>
    <rect x="12" y="24" width="37" height="10" rx="1"/>
    <circle cx="30" cy="65" r="18"/>
    <circle cx="30" cy="65" r="13"/>
    <circle cx="30" cy="65" r="6" opacity="0.3" fill="#555"/>
    <!-- Controls -->
    <circle cx="20" cy="29" r="3"/>
    <circle cx="30" cy="29" r="3"/>
    <rect x="35" y="26" width="10" height="6" rx="1"/>
    <!-- Fridge -->
    <rect x="65" y="10" width="48" height="85" rx="3"/>
    <line x1="65" y1="58" x2="113" y2="58"/>
    <path d="M65 32 Q78 35 78 32" stroke-width="1.5"/>
    <path d="M65 70 Q78 73 78 70" stroke-width="1.5"/>
    <!-- Fridge handle -->
    <path d="M75" y1="15" x2="75" y2="55" stroke-width="1.5"/>
    <path d="M75 15 L75 25"/>
    <path d="M75 63 L75 73"/>
  </svg>`,
  lighting: `<svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <!-- Ceiling rose -->
    <circle cx="60" cy="8" r="5"/>
    <!-- Pendant cord -->
    <line x1="60" y1="13" x2="60" y2="30"/>
    <!-- Light shade -->
    <path d="M38 30 Q60 25 82 30 L72 60 Q60 65 48 60 Z"/>
    <!-- Bulb -->
    <circle cx="60" cy="55" r="8"/>
    <path d="M55 63 L56 70 L64 70 L65 63"/>
    <line x1="56" y1="70" x2="64" y2="70"/>
    <!-- Light rays -->
    <line x1="60" y1="75" x2="60" y2="83"/>
    <line x1="46" y1="71" x2="40" y2="77"/>
    <line x1="74" y1="71" x2="80" y2="77"/>
    <line x1="40" y1="58" x2="32" y2="55"/>
    <line x1="80" y1="58" x2="88" y2="55"/>
    <!-- Wall light on side -->
    <rect x="3" y="45" width="18" height="28" rx="2"/>
    <ellipse cx="12" cy="52" rx="5" ry="5"/>
    <path d="M7 60 Q12 56 17 60"/>
    <!-- Switch -->
    <rect x="95" y="55" width="18" height="12" rx="2"/>
    <rect x="100" y="57" width="8" height="8" rx="1"/>
  </svg>`,
  window: `<svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <!-- Wall section -->
    <rect x="5" y="5" width="110" height="90" rx="2" opacity="0.15" fill="#555"/>
    <rect x="5" y="5" width="110" height="90" rx="2"/>
    <!-- Window frame outer -->
    <rect x="18" y="18" width="84" height="64" rx="2"/>
    <!-- Window frame inner -->
    <rect x="22" y="22" width="76" height="56" rx="1"/>
    <!-- Vertical divider -->
    <line x1="60" y1="22" x2="60" y2="78"/>
    <!-- Horizontal divider -->
    <line x1="22" y1="50" x2="98" y2="50"/>
    <!-- Glass panes (slight fill) -->
    <rect x="23" y="23" width="36" height="26" opacity="0.08" fill="#555"/>
    <rect x="61" y="23" width="36" height="26" opacity="0.08" fill="#555"/>
    <rect x="23" y="51" width="36" height="26" opacity="0.08" fill="#555"/>
    <rect x="61" y="51" width="36" height="26" opacity="0.08" fill="#555"/>
    <!-- Handle -->
    <circle cx="56" cy="50" r="3"/>
    <line x1="56" y1="47" x2="56" y2="42"/>
    <!-- Crack on glass -->
    <path d="M30 28 L38 38 L34 44"/>
  </svg>`,
}

const CATEGORIES = [
  { id:'bathroom',   label:'Bathroom and toilet',   color:'#3b82f6', bg:'#eff6ff', subs:['Toilet not flushing','Toilet blocked','Bath leaking','Shower not working','No hot water','Tap dripping','Mould in bathroom','Other'] },
  { id:'kitchen',    label:'Kitchen',                color:'#f97316', bg:'#fff7ed', subs:['Oven not working','Hob not working','Extractor fan fault','Sink blocked','Tap leaking','Cupboard door broken','Other'] },
  { id:'heating',    label:'Heating and boiler',     color:'#ef4444', bg:'#fef2f2', subs:['No heating','Radiator not working','Boiler fault','Thermostat issue','Boiler making noise','Other'] },
  { id:'water',      label:'Water and leaks',        color:'#06b6d4', bg:'#ecfeff', subs:['Burst pipe','Leaking pipe','Damp patch','Water coming through ceiling','Low water pressure','Other'] },
  { id:'doors',      label:'Doors and locks',        color:'#8b5cf6', bg:'#f5f3ff', subs:['Door not locking','Broken lock','Door not closing','Window lock broken','Key stuck','Other'] },
  { id:'structural', label:'Floors, walls, ceilings',color:'#6b7280', bg:'#f9fafb', subs:['Ceiling crack','Wall crack','Flooring damaged','Ceiling leak','Plaster falling','Other'] },
  { id:'lighting',   label:'Lighting',               color:'#f59e0b', bg:'#fffbeb', subs:['Light not working','Flickering lights','Outside light fault','Stairwell light out','Other'] },
  { id:'window',     label:'Windows',                color:'#0ea5e9', bg:'#f0f9ff', subs:['Window not closing','Broken glass','Condensation between panes','Window lock broken','Draught','Other'] },
  { id:'garden',     label:'Exterior and garden',    color:'#22c55e', bg:'#f0fdf4', subs:['Garden maintenance','Fence damaged','Gate not working','Guttering blocked','Exterior wall damage','Other'] },
  { id:'appliances', label:'Appliances and laundry', color:'#ec4899', bg:'#fdf2f8', subs:['Washing machine fault','Fridge not working','Dishwasher fault','Tumble dryer fault','Other appliance'] },
  { id:'damp',       label:'Damp and mould',         color:'#14b8a6', bg:'#f0fdfa', subs:['Mould on walls','Black mould','Damp smell','Condensation issue','Water ingress','Other'] },
  { id:'electrical', label:'Electrical',             color:'#eab308', bg:'#fefce8', subs:['No power','Lights not working','Socket not working','Trip switch issue','Sparking socket','Other'] },
]

const EMERGENCY = ['Burst pipe','Boiler fault','No heating','Trip switch issue','Sparking socket','Water coming through ceiling']
const STEPS = ['Property','Issue','Details','Photos','Submit']
const R = '#e07b7b'
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
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ property_address:'', tenant_name:'', tenant_email:'', tenant_phone:'', category:'', subcategory:'', description:'', access_instructions:'', preferred_time:'' })
  const [photos, setPhotos] = useState([])
  const [submitted, setSubmitted] = useState(null)
  const fileRef = useRef()
  const cameraRef = useRef()

  const selectedCat = CATEGORIES.find(c => c.id === form.category)
  const isEmergency = EMERGENCY.includes(form.subcategory)
  const set = (k,v) => setForm(f=>({...f,[k]:v}))

  const filteredCats = search.trim()
    ? CATEGORIES.filter(c => c.label.toLowerCase().includes(search.toLowerCase()) || c.subs.some(s => s.toLowerCase().includes(search.toLowerCase())))
    : CATEGORIES

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
        <style>{`*{box-sizing:border-box;margin:0;padding:0}body{background:#f5f5f5} .cat-card{transition:all .15s;cursor:pointer} .cat-card:hover{border-color:#e07b7b !important;background:#fdf9f9 !important;transform:translateY(-2px);box-shadow:0 4px 16px rgba(0,0,0,0.08)}`}</style>
      </Head>
      <div style={{ minHeight:'100vh', background:'#f5f5f5', fontFamily:"'Plus Jakarta Sans', system-ui, sans-serif" }}>

        {/* Header */}
        <div style={{ background:'#fff', borderBottom:'1px solid #eee', padding:'0 24px', height:60, display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:34, height:34, background:R, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:16, color:'#fff' }}>L</div>
          <span style={{ fontWeight:700, fontSize:17, color:'#1a1414' }}>Report a repair</span>
          {isEmergency && <span style={{ marginLeft:'auto', fontSize:11, fontWeight:700, padding:'4px 12px', borderRadius:20, background:'rgba(248,113,113,0.1)', color:'#c0392b', border:'1px solid rgba(248,113,113,0.25)' }}>EMERGENCY</span>}
        </div>

        {/* Progress */}
        <div style={{ background:'#fff', borderBottom:'1px solid #eee', padding:'12px 24px' }}>
          <div style={{ display:'flex', gap:4, maxWidth:700, margin:'0 auto' }}>
            {STEPS.map((s,i) => (
              <div key={s} style={{ flex:1 }}>
                <div style={{ height:3, borderRadius:2, background: i<=step ? R : '#eee', marginBottom:5, transition:'background .2s' }}/>
                <div style={{ fontSize:11, fontWeight: i===step?700:400, color: i<=step?R:'#bbb', textAlign:'center' }}>{s}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ maxWidth:900, margin:'0 auto', padding:'24px 16px 110px' }}>

          {/* STEP 0 */}
          {step===0 && (
            <div style={{ maxWidth:560, margin:'0 auto' }}>
              <div style={{ background:'#fff', borderRadius:12, padding:'24px 28px', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
                <h2 style={{ fontSize:20, fontWeight:800, color:'#1a1414', marginBottom:4 }}>Your details</h2>
                <p style={{ fontSize:14, color:'#9a8080', marginBottom:24 }}>Tell us about yourself and the property.</p>
                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  <div><label style={lbl}>Property address *</label><input style={inp} value={form.property_address} onChange={e=>set('property_address',e.target.value)} placeholder="e.g. 11 Northfield Avenue, Hessle, HU13"/></div>
                  <div><label style={lbl}>Your full name *</label><input style={inp} value={form.tenant_name} onChange={e=>set('tenant_name',e.target.value)} placeholder="First and last name"/></div>
                  <div><label style={lbl}>Email address *</label><input type="email" style={inp} value={form.tenant_email} onChange={e=>set('tenant_email',e.target.value)} placeholder="you@example.com"/></div>
                  <div><label style={lbl}>Phone number (optional)</label><input type="tel" style={inp} value={form.tenant_phone} onChange={e=>set('tenant_phone',e.target.value)} placeholder="07700 000000"/></div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: Picture grid */}
          {step===1 && (
            <div>
              {!form.category ? (
                <div style={{ background:'#fff', borderRadius:12, padding:'24px 28px', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
                  <h2 style={{ fontSize:20, fontWeight:800, color:'#1a1414', marginBottom:4 }}>What is the problem?</h2>
                  <p style={{ fontSize:14, color:'#9a8080', marginBottom:20 }}>Please click on the relevant picture</p>
                  {/* Search */}
                  <div style={{ position:'relative', marginBottom:24 }}>
                    <svg style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', opacity:0.4 }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search your problem..." style={{ ...inp, paddingLeft:42, fontSize:15, borderRadius:8, border:'1.5px solid #ddd' }}/>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px, 1fr))', gap:10 }}>
                    {filteredCats.map(cat => (
                      <button key={cat.id} className="cat-card" onClick={()=>{set('category',cat.id);set('subcategory','');setSearch('')}}
                        style={{ padding:0, borderRadius:10, border:'1.5px solid #e8e8e8', background:'#fff', textAlign:'center', fontFamily:'inherit', display:'flex', flexDirection:'column', overflow:'hidden' }}>
                        <div style={{ padding:'20px 12px 12px', display:'flex', alignItems:'center', justifyContent:'center', height:110 }}
                          dangerouslySetInnerHTML={{ __html: `<div style="width:90px;height:80px">${ILLUSTRATIONS[cat.id]||ILLUSTRATIONS.structural}</div>` }}
                        />
                        <div style={{ padding:'8px 10px 14px', borderTop:'1px solid #f0f0f0', fontSize:12, fontWeight:700, color:'#2a2020', lineHeight:1.3 }}>{cat.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ background:'#fff', borderRadius:12, padding:'24px 28px', boxShadow:'0 1px 4px rgba(0,0,0,0.06)', maxWidth:600, margin:'0 auto' }}>
                  <button onClick={()=>{set('category','');set('subcategory','')}} style={{ display:'inline-flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:14, color:'#9a8080', marginBottom:20, padding:0 }}>
                    ← Back to categories
                  </button>
                  <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:24, padding:'14px 18px', background:'#f9f9f9', borderRadius:10, border:'1px solid #eee' }}>
                    <div style={{ width:60, height:50, flexShrink:0 }} dangerouslySetInnerHTML={{ __html: ILLUSTRATIONS[selectedCat.id]||ILLUSTRATIONS.structural }}/>
                    <div>
                      <div style={{ fontWeight:800, fontSize:16, color:'#1a1414' }}>{selectedCat.label}</div>
                      <div style={{ fontSize:13, color:'#9a8080', marginTop:2 }}>Select the specific issue</div>
                    </div>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {selectedCat.subs.map(sub => {
                      const isEmerg = EMERGENCY.includes(sub)
                      return (
                        <button key={sub} onClick={()=>set('subcategory',sub)}
                          style={{ padding:'13px 18px', borderRadius:10, border:'1.5px solid '+(form.subcategory===sub ? R : '#eee'), background: form.subcategory===sub ? RDIM : '#fff', cursor:'pointer', textAlign:'left', fontFamily:'inherit', fontWeight:600, fontSize:14, color:'#1a1414', display:'flex', alignItems:'center', justifyContent:'space-between', transition:'border .1s' }}>
                          <span>{sub}</span>
                          {isEmerg && <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20, background:'rgba(248,113,113,0.12)', color:'#c0392b', flexShrink:0, marginLeft:8 }}>Emergency</span>}
                        </button>
                      )
                    })}
                  </div>
                  {isEmergency && <div style={{ marginTop:16, padding:14, background:'rgba(248,113,113,0.07)', border:'1px solid rgba(248,113,113,0.25)', borderRadius:10, fontSize:13, color:'#c0392b', fontWeight:600, lineHeight:1.6 }}>If there is immediate risk to life or property, call 999. Otherwise we will prioritise this within 4 hours.</div>}
                </div>
              )}
            </div>
          )}

          {/* STEP 2 */}
          {step===2 && (
            <div style={{ maxWidth:560, margin:'0 auto' }}>
              <div style={{ background:'#fff', borderRadius:12, padding:'24px 28px', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
                <h2 style={{ fontSize:20, fontWeight:800, color:'#1a1414', marginBottom:4 }}>Describe the issue</h2>
                {selectedCat && (
                  <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'5px 12px 5px 8px', background:'#f5f5f5', borderRadius:20, marginBottom:20, marginTop:8 }}>
                    <div style={{ width:22, height:18, flexShrink:0 }} dangerouslySetInnerHTML={{ __html: ILLUSTRATIONS[selectedCat.id]||ILLUSTRATIONS.structural }}/>
                    <span style={{ fontSize:13, fontWeight:700, color:'#1a1414' }}>{selectedCat.label}: {form.subcategory}</span>
                  </div>
                )}
                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  <div>
                    <label style={lbl}>Description *</label>
                    <textarea value={form.description} onChange={e=>set('description',e.target.value)} placeholder="What happened, where in the property, when it started..." rows={5} style={{ ...inp, resize:'vertical', lineHeight:1.6 }}/>
                    <div style={{ fontSize:12, color: form.description.length<10 ? '#c0392b' : '#9a8080', marginTop:4 }}>{form.description.length<10 ? `${10-form.description.length} more characters needed` : `${form.description.length} characters`}</div>
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
            </div>
          )}

          {/* STEP 3 */}
          {step===3 && (
            <div style={{ maxWidth:560, margin:'0 auto' }}>
              <div style={{ background:'#fff', borderRadius:12, padding:'24px 28px', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
                <h2 style={{ fontSize:20, fontWeight:800, color:'#1a1414', marginBottom:4 }}>Add photos</h2>
                <p style={{ fontSize:14, color:'#9a8080', marginBottom:24 }}>Photos help contractors diagnose the issue. Up to 6 photos.</p>
                <input ref={fileRef} type="file" accept="image/*" multiple style={{ display:'none' }} onChange={e=>addPhotos(e.target.files)}/>
                <input ref={cameraRef} type="file" accept="image/*" capture="environment" style={{ display:'none' }} onChange={e=>addPhotos(e.target.files)}/>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20 }}>
                  <button onClick={()=>cameraRef.current.click()} style={{ padding:'22px 12px', borderRadius:12, border:'2px dashed '+RBDR, background:RDIM, cursor:'pointer', fontFamily:'inherit', fontWeight:700, fontSize:14, color:R, display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
                    <svg width="32" height="32" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="8" width="32" height="24" rx="4" fill="none"/><circle cx="18" cy="20" r="6" fill="none"/><path d="M13 8l2-4h6l2 4" strokeLinecap="round"/></svg>
                    Take photo
                  </button>
                  <button onClick={()=>fileRef.current.click()} style={{ padding:'22px 12px', borderRadius:12, border:'2px dashed #ddd', background:'#fafafa', cursor:'pointer', fontFamily:'inherit', fontWeight:700, fontSize:14, color:'#6b5f5f', display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
                    <svg width="32" height="32" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="4" y="8" width="28" height="22" rx="3" fill="none"/><path d="M12 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" strokeLinecap="round"/><path d="M18 14v8M14 18h8" strokeLinecap="round"/></svg>
                    Browse files
                  </button>
                </div>
                {photos.length > 0 ? (
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
                    {photos.map((p,i) => (
                      <div key={i} style={{ position:'relative', borderRadius:10, overflow:'hidden', aspectRatio:'1', border:'1.5px solid #eee' }}>
                        <img src={p.preview} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                        <button onClick={()=>setPhotos(ph=>ph.filter((_,idx)=>idx!==i))} style={{ position:'absolute', top:5, right:5, width:22, height:22, borderRadius:'50%', background:'rgba(0,0,0,0.6)', border:'none', color:'#fff', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign:'center', padding:'36px 20px', color:'#c0b0b0', fontSize:14, background:'#fafafa', borderRadius:12, border:'2px dashed #eee', lineHeight:1.8 }}>No photos added yet.<br/>Photos are optional but really helpful.</div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step===4 && (
            <div style={{ maxWidth:560, margin:'0 auto' }}>
              <div style={{ background:'#fff', borderRadius:12, padding:'24px 28px', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
                <h2 style={{ fontSize:20, fontWeight:800, color:'#1a1414', marginBottom:4 }}>Review and submit</h2>
                <p style={{ fontSize:14, color:'#9a8080', marginBottom:20 }}>Check your details before submitting.</p>
                {selectedCat && (
                  <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', background:'#f9f9f9', borderRadius:10, border:'1px solid #eee', marginBottom:20 }}>
                    <div style={{ width:44, height:36, flexShrink:0 }} dangerouslySetInnerHTML={{ __html: ILLUSTRATIONS[selectedCat.id]||ILLUSTRATIONS.structural }}/>
                    <div>
                      <div style={{ fontWeight:700, fontSize:15, color:'#1a1414' }}>{selectedCat.label}: {form.subcategory}</div>
                      {isEmergency && <div style={{ fontSize:12, color:'#c0392b', fontWeight:600, marginTop:2 }}>Emergency</div>}
                    </div>
                  </div>
                )}
                <div style={{ border:'1px solid #eee', borderRadius:10, overflow:'hidden', marginBottom:16 }}>
                  {[['Property',form.property_address],['Name',form.tenant_name],['Email',form.tenant_email],['Phone',form.tenant_phone||'Not provided'],['Description',form.description],['Access',form.access_instructions||'Not provided'],['Time',form.preferred_time||'No preference'],['Photos',photos.length+' photo'+(photos.length===1?'':'s')]].map(([k,v],i,arr)=>(
                    <div key={k} style={{ display:'flex', gap:12, padding:'11px 16px', borderBottom: i<arr.length-1 ? '1px solid #f5f5f5' : 'none', fontSize:14 }}>
                      <span style={{ fontWeight:600, color:'#9a8080', minWidth:90, flexShrink:0 }}>{k}</span>
                      <span style={{ color:'#1a1414', lineHeight:1.5 }}>{v}</span>
                    </div>
                  ))}
                </div>
                {isEmergency && <div style={{ padding:14, background:'rgba(248,113,113,0.07)', border:'1px solid rgba(248,113,113,0.25)', borderRadius:10, fontSize:13, color:'#c0392b', fontWeight:600 }}>Emergency flagged. We will aim to respond within 4 hours.</div>}
              </div>
            </div>
          )}
        </div>

        {/* Bottom nav */}
        <div style={{ position:'fixed', bottom:0, left:0, right:0, background:'#fff', borderTop:'1px solid #eee', padding:'12px 20px', display:'flex', gap:10, justifyContent:'center' }}>
          <div style={{ display:'flex', gap:10, width:'100%', maxWidth:560 }}>
            {step>0 && !(step===1 && form.category && !form.subcategory) && (
              <button onClick={()=>{ if(step===1&&form.category){set('category','');set('subcategory','')}else{setStep(s=>s-1)} }} style={{ padding:'12px 24px', borderRadius:100, border:'1.5px solid #ddd', background:'#fff', fontFamily:'inherit', fontWeight:600, fontSize:15, color:'#6b5f5f', cursor:'pointer' }}>Back</button>
            )}
            {!(step===1 && !form.subcategory) && (
              step < 4
                ? <button onClick={()=>setStep(s=>s+1)} disabled={!canNext()} style={{ flex:1, padding:'13px 20px', borderRadius:100, border:'none', background: canNext() ? R : '#eee', fontFamily:'inherit', fontWeight:700, fontSize:15, color: canNext() ? '#fff' : '#bbb', cursor: canNext() ? 'pointer' : 'default' }}>Continue</button>
                : <button onClick={handleSubmit} style={{ flex:1, padding:'13px 20px', borderRadius:100, border:'none', background:R, fontFamily:'inherit', fontWeight:700, fontSize:15, color:'#fff', cursor:'pointer' }}>Submit repair request</button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
