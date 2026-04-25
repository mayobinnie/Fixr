import { useState, useEffect } from 'react'
import Head from 'next/head'
import { supabase } from '../lib/supabase'

const R = '#e07b7b'
const RL = '#eca9a9'
const RDIM = 'rgba(224,123,123,0.10)'
const RBDR = 'rgba(224,123,123,0.25)'

const STATUS = {
  new:         { label: 'New',          color: '#f87171', bg: 'rgba(248,113,113,0.10)' },
  triaged:     { label: 'Triaged',      color: '#fbbf24', bg: 'rgba(251,191,36,0.10)' },
  assigned:    { label: 'Assigned',     color: '#60a5fa', bg: 'rgba(96,165,250,0.10)' },
  in_progress: { label: 'In progress',  color: '#a78bfa', bg: 'rgba(167,139,250,0.10)' },
  completed:   { label: 'Completed',    color: '#4ade80', bg: 'rgba(74,222,128,0.10)' },
  closed:      { label: 'Closed',       color: '#9ca3af', bg: 'rgba(156,163,175,0.10)' },
}

const inp = {
  background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.12)',
  borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: 13,
  fontFamily: 'inherit', outline: 'none', width: '100%', boxSizing: 'border-box'
}

function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.new
  return <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: s.bg, color: s.color }}>{s.label}</span>
}

function PriorityDot({ priority }) {
  const c = priority === 'emergency' ? '#f87171' : priority === 'high' ? '#fbbf24' : 'rgba(255,255,255,0.3)'
  return <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, display: 'inline-block', flexShrink: 0, boxShadow: priority === 'emergency' ? '0 0 6px rgba(248,113,113,0.6)' : 'none' }}/>
}

export default function AgentDashboard() {
  const [jobs, setJobs] = useState([])
  const [contractors, setContractors] = useState([])
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [updates, setUpdates] = useState([])
  const [photos, setPhotos] = useState([])
  const [note, setNote] = useState('')
  const [savingNote, setSavingNote] = useState(false)
  const [tab, setTab] = useState('details')
  const [showContractors, setShowContractors] = useState(false)
  const [newContractor, setNewContractor] = useState({ name: '', trade: '', email: '', phone: '' })

  useEffect(() => { loadJobs(); loadContractors() }, [])
  useEffect(() => { if (selected) { loadUpdates(selected.id); loadPhotos(selected.id) } }, [selected])

  async function loadJobs() {
    setLoading(true)
    const { data } = await supabase.from('repair_jobs').select('*').order('created_at', { ascending: false })
    setJobs(data || [])
    setLoading(false)
  }

  async function loadContractors() {
    const { data } = await supabase.from('repair_contractors').select('*').eq('active', true).order('trade')
    setContractors(data || [])
  }

  async function loadUpdates(id) {
    const { data } = await supabase.from('repair_updates').select('*').eq('job_id', id).order('created_at')
    setUpdates(data || [])
  }

  async function loadPhotos(id) {
    const { data } = await supabase.from('repair_photos').select('*').eq('job_id', id).order('created_at')
    setPhotos(data || [])
  }

  async function updateStatus(id, status) {
    await supabase.from('repair_jobs').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
    await supabase.from('repair_updates').insert({ job_id: id, author: 'Agent', author_type: 'agent', message: 'Status updated to: ' + STATUS[status]?.label, status_change: status })
    setJobs(j => j.map(job => job.id === id ? { ...job, status } : job))
    if (selected?.id === id) setSelected(s => ({ ...s, status }))
    loadUpdates(id)
  }

  async function assignContractor(job, contractor) {
    await supabase.from('repair_jobs').update({
      contractor_id: contractor.id, contractor_name: contractor.name,
      contractor_email: contractor.email, contractor_phone: contractor.phone,
      status: 'assigned', contractor_assigned_at: new Date().toISOString(), updated_at: new Date().toISOString()
    }).eq('id', job.id)
    await supabase.from('repair_updates').insert({
      job_id: job.id, author: 'Agent', author_type: 'agent',
      message: 'Assigned to ' + contractor.name + ' (' + contractor.trade + ')',
      status_change: 'assigned'
    })
    // Email contractor
    if (contractor.email) {
      await fetch('/api/repairs/notify-contractor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job, contractor })
      })
    }
    loadJobs(); loadUpdates(job.id)
    setSelected(s => ({ ...s, status: 'assigned', contractor_name: contractor.name }))
  }

  async function addNote() {
    if (!note.trim() || !selected) return
    setSavingNote(true)
    await supabase.from('repair_updates').insert({ job_id: selected.id, author: 'Agent', author_type: 'agent', message: note.trim() })
    await supabase.from('repair_jobs').update({ agent_notes: note.trim(), updated_at: new Date().toISOString() }).eq('id', selected.id)
    setNote('')
    loadUpdates(selected.id)
    setSavingNote(false)
  }

  async function addContractor() {
    if (!newContractor.name || !newContractor.trade) return
    await supabase.from('repair_contractors').insert({ ...newContractor, active: true })
    setNewContractor({ name: '', trade: '', email: '', phone: '' })
    loadContractors()
  }

  const filtered = jobs.filter(j => {
    if (filter !== 'all' && j.status !== filter) return false
    if (search && !j.property_address.toLowerCase().includes(search.toLowerCase()) && !j.tenant_name.toLowerCase().includes(search.toLowerCase()) && !j.reference.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const counts = { all: jobs.length }
  Object.keys(STATUS).forEach(s => { counts[s] = jobs.filter(j => j.status === s).length })

  const sideW = 320

  return (
    <>
      <Head>
        <title>Repairs dashboard</title>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      </Head>
      <div style={{ display: 'flex', height: '100vh', background: '#0d0a0a', color: '#fff', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", overflow: 'hidden' }}>

        {/* SIDEBAR */}
        <div style={{ width: sideW, borderRight: '0.5px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          {/* Header */}
          <div style={{ padding: '16px 16px 12px', borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 30, height: 30, background: R, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: '#fff' }}>L</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>Repairs</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{jobs.length} total jobs</div>
              </div>
              <button onClick={() => setShowContractors(!showContractors)} style={{ marginLeft: 'auto', padding: '5px 10px', borderRadius: 20, border: '0.5px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>
                Contractors
              </button>
            </div>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs..." style={{ ...inp, fontSize: 13 }}/>
          </div>

          {/* Status filters */}
          <div style={{ padding: '10px 16px', borderBottom: '0.5px solid rgba(255,255,255,0.08)', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[['all','All'], ...Object.entries(STATUS).map(([k,v]) => [k, v.label])].map(([k, label]) => (
              <button key={k} onClick={() => setFilter(k)} style={{
                padding: '4px 10px', borderRadius: 20, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                fontSize: 11, fontWeight: filter === k ? 700 : 400,
                background: filter === k ? R : 'rgba(255,255,255,0.06)',
                color: filter === k ? '#fff' : 'rgba(255,255,255,0.5)'
              }}>
                {label} {counts[k] > 0 && <span style={{ opacity: 0.7 }}>({counts[k]})</span>}
              </button>
            ))}
          </div>

          {/* Job list */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading && <div style={{ padding: 20, color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Loading...</div>}
            {filtered.map(job => (
              <div key={job.id} onClick={() => { setSelected(job); setTab('details') }} style={{
                padding: '12px 16px', borderBottom: '0.5px solid rgba(255,255,255,0.05)', cursor: 'pointer',
                background: selected?.id === job.id ? 'rgba(224,123,123,0.08)' : 'transparent',
                borderLeft: selected?.id === job.id ? '2px solid ' + R : '2px solid transparent',
                transition: 'all .1s'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                  <PriorityDot priority={job.priority}/>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>{job.reference}</span>
                  <StatusBadge status={job.status}/>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 3 }}>{job.category}: {job.subcategory}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.property_address}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{job.tenant_name} · {new Date(job.created_at).toLocaleDateString('en-GB')}</div>
              </div>
            ))}
            {!loading && filtered.length === 0 && (
              <div style={{ padding: 24, color: 'rgba(255,255,255,0.3)', fontSize: 13, textAlign: 'center' }}>No jobs found</div>
            )}
          </div>
        </div>

        {/* MAIN PANEL */}
        {selected ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Job header */}
            <div style={{ padding: '16px 24px', borderBottom: '0.5px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <PriorityDot priority={selected.priority}/>
                  <span style={{ fontFamily: 'monospace', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{selected.reference}</span>
                  <StatusBadge status={selected.status}/>
                  {selected.is_emergency && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: 'rgba(248,113,113,0.15)', color: '#f87171' }}>EMERGENCY</span>}
                </div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{selected.category}: {selected.subcategory}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{selected.property_address}</div>
              </div>
              {/* Status controls */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {Object.entries(STATUS).filter(([k]) => k !== selected.status).map(([k, v]) => (
                  <button key={k} onClick={() => updateStatus(selected.id, k)} style={{ padding: '6px 14px', borderRadius: 20, border: '0.5px solid ' + v.color, background: 'transparent', color: v.color, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div style={{ padding: '0 24px', borderBottom: '0.5px solid rgba(255,255,255,0.08)', display: 'flex', gap: 0 }}>
              {[['details','Details'], ['updates','Updates (' + updates.length + ')'], ['photos','Photos (' + photos.length + ')'], ['assign','Contractor']].map(([t, l]) => (
                <button key={t} onClick={() => setTab(t)} style={{ padding: '12px 18px', border: 'none', background: 'transparent', fontFamily: 'inherit', fontSize: 13, fontWeight: tab === t ? 700 : 400, color: tab === t ? R : 'rgba(255,255,255,0.4)', borderBottom: '2px solid ' + (tab === t ? R : 'transparent'), cursor: 'pointer' }}>{l}</button>
              ))}
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>

              {/* DETAILS TAB */}
              {tab === 'details' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 800 }}>
                  {[
                    ['Tenant', selected.tenant_name],
                    ['Email', selected.tenant_email],
                    ['Phone', selected.tenant_phone || 'Not provided'],
                    ['Property', selected.property_address],
                    ['Category', selected.category + ': ' + selected.subcategory],
                    ['Priority', selected.priority],
                    ['Access', selected.access_instructions || 'Not provided'],
                    ['Preferred time', selected.preferred_time || 'No preference'],
                    ['Submitted', new Date(selected.created_at).toLocaleString('en-GB')],
                    ['Contractor', selected.contractor_name || 'Not assigned'],
                  ].map(([k, v]) => (
                    <div key={k} style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 16 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{k}</div>
                      <div style={{ fontSize: 14, color: '#fff' }}>{v}</div>
                    </div>
                  ))}
                  <div style={{ gridColumn: '1 / -1', background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Description</div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>{selected.description}</div>
                  </div>
                </div>
              )}

              {/* UPDATES TAB */}
              {tab === 'updates' && (
                <div style={{ maxWidth: 640 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                    {updates.map(u => (
                      <div key={u.id} style={{ display: 'flex', gap: 12 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, background: u.author_type === 'agent' ? RDIM : 'rgba(255,255,255,0.06)', border: '0.5px solid ' + (u.author_type === 'agent' ? RBDR : 'rgba(255,255,255,0.1)'), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: u.author_type === 'agent' ? RL : 'rgba(255,255,255,0.5)' }}>
                          {u.author_type === 'agent' ? 'AG' : u.author_type === 'contractor' ? 'CO' : 'TN'}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 3 }}>
                            <span style={{ fontSize: 13, fontWeight: 600 }}>{u.author}</span>
                            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{new Date(u.created_at).toLocaleString('en-GB')}</span>
                            {u.status_change && <StatusBadge status={u.status_change}/>}
                          </div>
                          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '10px 14px' }}>{u.message}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add an internal note..." rows={3} style={{ ...inp, resize: 'none', lineHeight: 1.5, flex: 1 }}/>
                    <button onClick={addNote} disabled={!note.trim() || savingNote} style={{ padding: '10px 20px', borderRadius: 10, background: R, border: 'none', color: '#fff', fontFamily: 'inherit', fontWeight: 700, fontSize: 13, cursor: 'pointer', opacity: !note.trim() ? 0.5 : 1, alignSelf: 'flex-end' }}>
                      Add
                    </button>
                  </div>
                </div>
              )}

              {/* PHOTOS TAB */}
              {tab === 'photos' && (
                <div>
                  {photos.length === 0 ? (
                    <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>No photos attached to this job.</div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, maxWidth: 640 }}>
                      {photos.map(p => (
                        <a key={p.id} href={p.url} target="_blank" rel="noreferrer">
                          <img src={p.url} alt="" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 10, border: '0.5px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}/>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ASSIGN CONTRACTOR TAB */}
              {tab === 'assign' && (
                <div style={{ maxWidth: 560 }}>
                  {selected.contractor_name && (
                    <div style={{ padding: 16, background: RDIM, border: '0.5px solid ' + RBDR, borderRadius: 10, marginBottom: 20 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: RL, marginBottom: 4 }}>Currently assigned</div>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>{selected.contractor_name}</div>
                      {selected.contractor_phone && <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 3 }}>{selected.contractor_phone}</div>}
                    </div>
                  )}
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1, fontSize: 11 }}>Available contractors</div>
                  {contractors.length === 0 ? (
                    <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, marginBottom: 20 }}>No contractors added yet. Add one below.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                      {contractors.map(c => (
                        <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 10 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>{c.name}</div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{c.trade}{c.phone ? ' · ' + c.phone : ''}</div>
                          </div>
                          <button onClick={() => assignContractor(selected, c)} style={{ padding: '7px 16px', borderRadius: 20, background: R, border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                            Assign
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Add contractor</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                    {[['name','Full name'],['trade','Trade (e.g. Plumber)'],['email','Email'],['phone','Phone']].map(([k,p]) => (
                      <input key={k} value={newContractor[k]} onChange={e => setNewContractor(c => ({ ...c, [k]: e.target.value }))} placeholder={p} style={inp}/>
                    ))}
                  </div>
                  <button onClick={addContractor} disabled={!newContractor.name || !newContractor.trade} style={{ padding: '10px 20px', borderRadius: 100, background: R, border: 'none', color: '#fff', fontFamily: 'inherit', fontWeight: 700, fontSize: 13, cursor: 'pointer', opacity: (!newContractor.name || !newContractor.trade) ? 0.5 : 1 }}>
                    Add contractor
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: 'rgba(255,255,255,0.3)' }}>
            <div style={{ fontSize: 40 }}>🔧</div>
            <div style={{ fontSize: 15, fontWeight: 500 }}>Select a job to view details</div>
          </div>
        )}

        {/* CONTRACTORS PANEL */}
        {showContractors && (
          <div style={{ width: 280, borderLeft: '0.5px solid rgba(255,255,255,0.08)', padding: 16, overflowY: 'auto' }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>All contractors</div>
            {contractors.map(c => (
              <div key={c.id} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, marginBottom: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{c.trade}</div>
                {c.phone && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{c.phone}</div>}
                {c.email && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{c.email}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export async function getServerSideProps() {
  return { props: {} }
}
