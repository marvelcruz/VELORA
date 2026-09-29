import { useEffect, useMemo, useState } from 'react'\nimport type { ReactNode } from 'react'
import { upload } from '@vercel/blob/client'
import { ArrowLeft, ImagePlus, Pencil, RefreshCw, Trash2, UploadCloud } from 'lucide-react'
import { seedCatalog, subsectionConfig, type CatalogItem, type ProductKind, type TextMode } from './catalog'

type CatalogResponse = {
  items: CatalogItem[]
  storage: 'blob' | 'seed'
  backendReady: boolean
  adminReady: boolean
}

const blankItem = (): CatalogItem => ({
  id: '',
  section: 'men',
  subsection: 'suits',
  name: '',
  label: '',
  caption: '',
  description: '',
  priceTop: 'FROM $1,250',
  priceBottom: 'BESPOKE',
  background: '#111827',
  glow: 'rgba(255,255,255,0.18)',
  text: 'light',
  imageUrl: '',
  published: true,
  sortOrder: 100,
})

function safeFileName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '')
}

export default function Admin({ onExit }: { onExit: () => void }) {
  const [password, setPassword] = useState('')
  const [items, setItems] = useState<CatalogItem[]>(seedCatalog)
  const [form, setForm] = useState<CatalogItem>(blankItem)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [backendReady, setBackendReady] = useState(false)
  const [adminReady, setAdminReady] = useState(false)
  const [storage, setStorage] = useState<'blob' | 'seed'>('seed')

  const load = async () => {
    setMessage('')
    try {
      const response = await fetch('/api/catalog', { cache: 'no-store' })
      if (!response.ok) throw new Error('Catalog API is not available yet')
      const data = (await response.json()) as CatalogResponse
      setItems(data.items)
      setBackendReady(data.backendReady)
      setAdminReady(data.adminReady)
      setStorage(data.storage)
    } catch (error) {
      setItems(seedCatalog)
      setMessage((error as Error).message)
    }
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    if (!file) {
      setPreview(form.imageUrl)
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file, form.imageUrl])

  const subsections = subsectionConfig[form.section]
  const filtered = useMemo(
    () => [...items].sort((a,b) => a.section.localeCompare(b.section) || a.subsection.localeCompare(b.subsection) || a.sortOrder - b.sortOrder),
    [items],
  )

  const updateSection = (section: ProductKind) => {
    setForm((current) => ({ ...current, section, subsection: subsectionConfig[section][0].id }))
  }

  const edit = (item: CatalogItem) => {
    setForm({ ...item })
    setFile(null)
    setPreview(item.imageUrl)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const reset = () => {
    setForm(blankItem())
    setFile(null)
    setPreview('')
    setMessage('')
  }

  const save = async () => {
    if (!password) return setMessage('Enter the RIVAADO admin password first.')
    if (!form.name.trim() || !form.label.trim()) return setMessage('Name and display label are required.')
    if (!form.imageUrl && !file) return setMessage('Choose an image for this look.')

    setSaving(true)
    setMessage('')
    try {
      let imageUrl = form.imageUrl
      if (file) {
        const pathname = `rivaado/${form.section}/${form.subsection}/${Date.now()}-${safeFileName(file.name || 'look.webp')}`
        const blob = await upload(pathname, file, {
          access: 'public',
          handleUploadUrl: '/api/upload',
          clientPayload: JSON.stringify({ password }),
          multipart: file.size > 4_000_000,
        })
        imageUrl = blob.url
      }

      const response = await fetch('/api/catalog-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          action: 'upsert',
          item: { ...form, imageUrl },
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Could not save this look.')

      setItems(data.items)
      setStorage('blob')
      setBackendReady(true)
      setMessage('Published. The website catalog has been updated.')
      reset()
      await load()
    } catch (error) {
      setMessage((error as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const remove = async (item: CatalogItem) => {
    if (!password) return setMessage('Enter the RIVAADO admin password first.')
    if (!window.confirm(`Remove "${item.name}" from the catalog?`)) return
    setSaving(true)
    try {
      const response = await fetch('/api/catalog-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, action: 'delete', id: item.id }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Could not remove this look.')
      setItems(data.items)
      setMessage('Look removed.')
    } catch (error) {
      setMessage((error as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="h-full overflow-y-auto bg-[#0c0d10] text-white">
      <div className="mx-auto max-w-7xl px-5 pb-20 pt-7 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <button onClick={onExit} className="mb-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-white/55 hover:text-white"><ArrowLeft size={16}/> Back to website</button>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#d3aa52]">Rivaado Backend</p>
            <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] sm:text-6xl">Media & Catalog</h1>
          </div>
          <button onClick={load} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-xs font-black uppercase tracking-[0.16em]"><RefreshCw size={15}/> Refresh</button>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <StatusCard label="Image storage" value={backendReady ? 'Vercel Blob connected' : 'Needs Blob connection'} good={backendReady}/>
          <StatusCard label="Admin security" value={adminReady ? 'Password configured' : 'Needs admin password'} good={adminReady}/>
          <StatusCard label="Catalog source" value={storage === 'blob' ? 'Live backend catalog' : 'Built-in starter catalog'} good={storage === 'blob'}/>
        </div>

        {(!backendReady || !adminReady) && (
          <div className="mt-5 rounded-3xl border border-[#d3aa52]/35 bg-[#d3aa52]/10 p-5 text-sm leading-6 text-white/75">
            The admin interface is installed. To enable uploads, connect a Vercel Blob store to this Vercel project and add the environment variable <b>RIVAADO_ADMIN_PASSWORD</b>. Until then the public site safely uses the starter catalog.
          </div>
        )}

        <div className="mt-8 grid gap-7 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 sm:p-7">
            <div className="flex items-center gap-3"><ImagePlus className="text-[#d3aa52]"/><h2 className="text-xl font-black">{form.id ? 'Edit look' : 'Add new look'}</h2></div>

            <label className="mt-6 block text-xs font-black uppercase tracking-[0.16em] text-white/50">Admin password</label>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Private admin password" className="mt-2 w-full rounded-2xl border border-white/12 bg-black/35 px-4 py-3 outline-none focus:border-[#d3aa52]"/>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Section">
                <select value={form.section} onChange={(e)=>updateSection(e.target.value as ProductKind)} className="admin-input">
                  <option value="men">Men</option><option value="women">Women</option><option value="accessories">Accessories</option>
                </select>
              </Field>
              <Field label="Subsection">
                <select value={form.subsection} onChange={(e)=>setForm({...form,subsection:e.target.value})} className="admin-input">
                  {subsections.map((s)=><option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Product image">
              <label className="mt-2 flex min-h-32 cursor-pointer items-center justify-center overflow-hidden rounded-3xl border border-dashed border-white/20 bg-black/25">
                {preview ? <img src={preview} alt="" className="h-56 w-full object-cover object-top"/> : <div className="text-center text-white/45"><UploadCloud className="mx-auto mb-2"/><span className="text-xs font-bold">Choose JPEG, PNG, WebP or AVIF</span></div>}
                <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(e)=>setFile(e.target.files?.[0] || null)} className="hidden"/>
              </label>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Internal name"><input className="admin-input" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} placeholder="Pastel Pink Suit"/></Field>
              <Field label="Display title"><input className="admin-input" value={form.label} onChange={(e)=>setForm({...form,label:e.target.value})} placeholder="Pastel Suit"/></Field>
            </div>
            <Field label="Description"><textarea className="admin-input min-h-24" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} placeholder="Short product description"/></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Price"><input className="admin-input" value={form.priceTop} onChange={(e)=>setForm({...form,priceTop:e.target.value})}/></Field>
              <Field label="Price label"><input className="admin-input" value={form.priceBottom} onChange={(e)=>setForm({...form,priceBottom:e.target.value})}/></Field>
              <Field label="Background"><input type="color" className="mt-2 h-12 w-full rounded-xl border border-white/15 bg-transparent" value={form.background} onChange={(e)=>setForm({...form,background:e.target.value})}/></Field>
              <Field label="Text color">
                <select className="admin-input" value={form.text} onChange={(e)=>setForm({...form,text:e.target.value as TextMode})}><option value="light">Light</option><option value="dark">Dark</option></select>
              </Field>
              <Field label="Sort order"><input type="number" className="admin-input" value={form.sortOrder} onChange={(e)=>setForm({...form,sortOrder:Number(e.target.value)})}/></Field>
              <Field label="Published">
                <select className="admin-input" value={form.published ? 'yes':'no'} onChange={(e)=>setForm({...form,published:e.target.value==='yes'})}><option value="yes">Yes</option><option value="no">Draft</option></select>
              </Field>
            </div>

            {message && <div className="mt-5 rounded-2xl bg-white/8 p-4 text-sm text-white/75">{message}</div>}
            <div className="mt-6 flex gap-3">
              <button disabled={saving} onClick={save} className="flex-1 rounded-full bg-[#d3aa52] px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-black disabled:opacity-50">{saving ? 'Saving…' : form.id ? 'Update look' : 'Upload & publish'}</button>
              {form.id && <button onClick={reset} className="rounded-full border border-white/20 px-6 py-4 text-xs font-black uppercase tracking-[0.16em]">Cancel</button>}
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-end justify-between"><div><p className="text-xs font-black uppercase tracking-[0.22em] text-white/45">Current catalog</p><h2 className="mt-1 text-3xl font-black">{items.length} looks</h2></div></div>
            <div className="grid gap-4 sm:grid-cols-2">
              {filtered.map((item)=>(
                <article key={item.id} className="overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/[0.04]">
                  <div className="aspect-[4/3] bg-black/30"><img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover object-top"/></div>
                  <div className="p-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.15em] text-[#d3aa52]">{item.section} / {item.subsection}</div>
                    <div className="mt-2 text-lg font-black">{item.name}</div>
                    <div className="mt-1 text-xs text-white/45">{item.published ? 'Published' : 'Draft'} · order {item.sortOrder}</div>
                    <div className="mt-4 flex gap-2">
                      <button onClick={()=>edit(item)} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[10px] font-black uppercase tracking-[0.12em]"><Pencil size={13}/> Edit</button>
                      <button disabled={saving} onClick={()=>remove(item)} className="inline-flex items-center gap-2 rounded-full border border-red-400/20 px-4 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-red-300"><Trash2 size={13}/> Remove</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="mt-4 block"><span className="text-[10px] font-black uppercase tracking-[0.16em] text-white/45">{label}</span><div className="mt-2">{children}</div></label>
}

function StatusCard({ label, value, good }: { label: string; value: string; good: boolean }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><div className="text-[10px] font-black uppercase tracking-[0.16em] text-white/40">{label}</div><div className={`mt-2 text-sm font-black ${good ? 'text-emerald-300':'text-amber-300'}`}>{value}</div></div>
}
