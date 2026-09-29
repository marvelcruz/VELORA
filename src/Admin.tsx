import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowLeft, ImagePlus, LogOut, Pencil, RefreshCw, Trash2, UploadCloud } from 'lucide-react'
import { supabase } from './supabase'
import { fromProductRow, subsectionConfig, toProductRow, type CatalogItem, type ProductKind, type ProductRow, type TextMode } from './catalog'

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
  const [items, setItems] = useState<CatalogItem[]>([])
  const [form, setForm] = useState<CatalogItem>(blankItem)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [sessionEmail, setSessionEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const loadCatalog = async () => {
    const { data, error } = await supabase.from('products').select('*').order('section').order('subsection').order('sort_order')
    if (error) return setMessage(error.message)
    setItems(((data || []) as ProductRow[]).map(fromProductRow))
  }

  const refreshAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setSessionEmail(session?.user.email || '')
    if (!session) {
      setIsAdmin(false)
      return
    }

    await supabase.rpc('claim_first_admin')
    const { data } = await supabase.from('admin_users').select('user_id').eq('user_id', session.user.id).maybeSingle()
    setIsAdmin(Boolean(data))
  }

  useEffect(() => {
    loadCatalog()
    refreshAuth()
    const { data } = supabase.auth.onAuthStateChange(() => refreshAuth())
    return () => data.subscription.unsubscribe()
  }, [])

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
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const reset = () => {
    setForm(blankItem())
    setFile(null)
    setPreview('')
  }

  const authenticate = async (mode: 'signin' | 'signup') => {
    setMessage('')

    const cleanEmail = email.trim()
    if (!cleanEmail || !password) {
      setMessage('Enter your email and password first.')
      return
    }

    if (password.length < 6) {
      setMessage('Use a password with at least 6 characters.')
      return
    }

    const result = mode === 'signin'
      ? await supabase.auth.signInWithPassword({ email: cleanEmail, password })
      : await supabase.auth.signUp({ email: cleanEmail, password })

    if (result.error) return setMessage(result.error.message)
    if (mode === 'signup' && !result.data.session) {
      setMessage('Account created. Check your email to confirm it, then sign in here.')
      return
    }
    await refreshAuth()
    setMessage('Signed in.')
  }

  const save = async () => {
    if (!isAdmin) return setMessage('Sign in with the RIVAADO admin account first.')
    if (!form.name.trim() || !form.label.trim()) return setMessage('Name and display title are required.')
    if (!form.imageUrl && !file) return setMessage('Choose an image for this look.')

    setSaving(true)
    setMessage('')
    try {
      let imageUrl = form.imageUrl

      if (file) {
        const path = `${form.section}/${form.subsection}/${Date.now()}-${safeFileName(file.name || 'look.webp')}`
        const { error: uploadError } = await supabase.storage
          .from('rivaado-products')
          .upload(path, file, { cacheControl: '3600', upsert: false })

        if (uploadError) throw uploadError
        const { data } = supabase.storage.from('rivaado-products').getPublicUrl(path)
        imageUrl = data.publicUrl
      }

      const row = toProductRow({ ...form, imageUrl })
      const result = form.id
        ? await supabase.from('products').update(row).eq('id', form.id).select().single()
        : await supabase.from('products').insert(row).select().single()

      if (result.error) throw result.error

      setMessage('Published to Supabase.')
      reset()
      await loadCatalog()
    } catch (error) {
      setMessage((error as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const remove = async (item: CatalogItem) => {
    if (!isAdmin) return setMessage('Sign in first.')
    if (!window.confirm(`Remove "${item.name}" from the catalog?`)) return

    setSaving(true)
    const { error } = await supabase.from('products').delete().eq('id', item.id)
    if (error) setMessage(error.message)
    else {
      setMessage('Look removed.')
      await loadCatalog()
    }
    setSaving(false)
  }

  return (
    <div className="h-full overflow-y-auto bg-[#0c0d10] text-white">
      <div className="mx-auto max-w-7xl px-5 pb-20 pt-7 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <button onClick={onExit} className="mb-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-white/55 hover:text-white"><ArrowLeft size={16}/> Back to website</button>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#d3aa52]">Rivaado Supabase Backend</p>
            <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] sm:text-6xl">Media & Catalog</h1>
          </div>
          <button onClick={loadCatalog} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-xs font-black uppercase tracking-[0.16em]"><RefreshCw size={15}/> Refresh</button>
        </div>

        {!sessionEmail ? (
          <div className="mt-7 max-w-xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">Admin sign in</h2>
            <p className="mt-2 text-sm text-white/55">The first account created here becomes the RIVAADO catalog administrator.</p>
            <Field label="Email"><input className="admin-input" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="admin@rivaado.com" autoComplete="email" /></Field>
            <Field label="Password"><input className="admin-input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="At least 6 characters" autoComplete="current-password" /></Field>
            <div className="mt-5 flex gap-3">
              <button onClick={()=>authenticate('signin')} className="rounded-full bg-[#d3aa52] px-6 py-3 text-xs font-black uppercase tracking-[0.15em] text-black">Sign in</button>
              <button onClick={()=>authenticate('signup')} className="rounded-full border border-white/20 px-6 py-3 text-xs font-black uppercase tracking-[0.15em]">Create admin account</button>
            </div>
            {message && <p className="mt-4 text-sm text-white/70">{message}</p>}
          </div>
        ) : (
          <>
            <div className="mt-7 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div><div className="text-[10px] font-black uppercase tracking-[0.16em] text-white/40">Signed in</div><div className="mt-1 text-sm font-black">{sessionEmail} · {isAdmin ? 'Admin access' : 'No admin access'}</div></div>
              <button onClick={()=>supabase.auth.signOut()} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-black uppercase tracking-[0.14em]"><LogOut size={14}/> Sign out</button>
            </div>

            <div className="mt-8 grid gap-7 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 sm:p-7">
                <div className="flex items-center gap-3"><ImagePlus className="text-[#d3aa52]"/><h2 className="text-xl font-black">{form.id ? 'Edit look' : 'Add new look'}</h2></div>

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
                  <Field label="Internal name"><input className="admin-input" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} /></Field>
                  <Field label="Display title"><input className="admin-input" value={form.label} onChange={(e)=>setForm({...form,label:e.target.value})} /></Field>
                </div>
                <Field label="Caption"><input className="admin-input" value={form.caption} onChange={(e)=>setForm({...form,caption:e.target.value})} /></Field>
                <Field label="Description"><textarea className="admin-input min-h-24" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} /></Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Price"><input className="admin-input" value={form.priceTop} onChange={(e)=>setForm({...form,priceTop:e.target.value})}/></Field>
                  <Field label="Price label"><input className="admin-input" value={form.priceBottom} onChange={(e)=>setForm({...form,priceBottom:e.target.value})}/></Field>
                  <Field label="Background"><input type="color" className="mt-2 h-12 w-full rounded-xl border border-white/15 bg-transparent" value={form.background} onChange={(e)=>setForm({...form,background:e.target.value})}/></Field>
                  <Field label="Text color"><select className="admin-input" value={form.text} onChange={(e)=>setForm({...form,text:e.target.value as TextMode})}><option value="light">Light</option><option value="dark">Dark</option></select></Field>
                  <Field label="Sort order"><input type="number" className="admin-input" value={form.sortOrder} onChange={(e)=>setForm({...form,sortOrder:Number(e.target.value)})}/></Field>
                  <Field label="Published"><select className="admin-input" value={form.published ? 'yes':'no'} onChange={(e)=>setForm({...form,published:e.target.value==='yes'})}><option value="yes">Yes</option><option value="no">Draft</option></select></Field>
                </div>

                {message && <div className="mt-5 rounded-2xl bg-white/8 p-4 text-sm text-white/75">{message}</div>}
                <div className="mt-6 flex gap-3">
                  <button disabled={saving || !isAdmin} onClick={save} className="flex-1 rounded-full bg-[#d3aa52] px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-black disabled:opacity-40">{saving ? 'Saving…' : form.id ? 'Update look' : 'Upload & publish'}</button>
                  {form.id && <button onClick={reset} className="rounded-full border border-white/20 px-6 py-4 text-xs font-black uppercase tracking-[0.16em]">Cancel</button>}
                </div>
              </div>

              <div>
                <div className="mb-4"><p className="text-xs font-black uppercase tracking-[0.22em] text-white/45">Current catalog</p><h2 className="mt-1 text-3xl font-black">{items.length} looks</h2></div>
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
          </>
        )}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="mt-4 block"><span className="text-[10px] font-black uppercase tracking-[0.16em] text-white/45">{label}</span><div className="mt-2">{children}</div></label>
}
