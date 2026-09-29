import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Admin from './Admin'
import { fromProductRow, itemsFor, sectionSizes, seedCatalog, subsectionConfig, type CatalogItem, type ProductKind, type ProductRow, type SectionKey } from './catalog'
import { supabase } from './supabase'

const navItems: { label: string; key: Exclude<SectionKey, 'admin'> }[] = [
  { label: 'Home', key: 'home' },
  { label: 'About', key: 'about' },
  { label: 'Men', key: 'men' },
  { label: 'Women', key: 'women' },
  { label: 'Accessories', key: 'accessories' },
  { label: 'Contact', key: 'contact' },
]

const heroVideo = {
  desktop: '/video/rivaado-hero-desktop.mp4',
  mobile: '/video/rivaado-hero-mobile.mp4',
  poster: '/video/rivaado-hero-poster.jpg',
  mobilePoster: '/video/rivaado-hero-poster-mobile.jpg',
}

const aboutMarkers = [
  ['1956', 'Custom suit tailoring begins.'],
  ['1964', 'Sunshine Tailors becomes the family house of fit.'],
  ['1978', 'The next generation learns the craft by hand.'],
  ['2012', 'Rivaado becomes a sharper modern identity.'],
  ['2022', 'Rivaado Bespoke Wear arrives in Calgary.'],
] as const

const sectionOrder: SectionKey[] = ['home', 'about', 'men', 'women', 'accessories', 'contact', 'admin']

function getInitialSection(): SectionKey {
  if (typeof window === 'undefined') return 'home'
  const hash = window.location.hash.replace('#', '') as SectionKey
  return sectionOrder.includes(hash) ? hash : 'home'
}

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionKey>(getInitialSection)
  const [isMobile, setIsMobile] = useState(false)
  const [catalog, setCatalog] = useState<CatalogItem[]>(seedCatalog)

  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 700)
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  useEffect(() => {
    const onHash = () => setActiveSection(getInitialSection())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    let active = true

    const loadCatalog = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('published', true)
        .order('section')
        .order('subsection')
        .order('sort_order')

      if (!active) return
      if (error || !data?.length) {
        setCatalog(seedCatalog)
        return
      }

      setCatalog((data as ProductRow[]).map(fromProductRow))
    }

    loadCatalog()
    return () => { active = false }
  }, [])

  const go = (key: SectionKey) => {
    setActiveSection(key)
    window.history.replaceState(null, '', key === 'home' ? window.location.pathname : `#${key}`)
  }

  if (activeSection === 'admin') {
    return <main className="h-[100svh] w-full overflow-hidden"><Admin onExit={() => go('home')} /></main>
  }

  const headerMode = activeSection === 'about' ? 'dark' : 'light'

  return (
    <main className="relative h-[100svh] w-full overflow-hidden bg-black" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Header activeSection={activeSection} mode={headerMode} onNavigate={go} />
      <div className="absolute inset-0">
        <Screen active={activeSection === 'home'}><HomeScreen isMobile={isMobile} onExplore={() => go('men')} /></Screen>
        <Screen active={activeSection === 'about'}><AboutScreen /></Screen>
        <Screen active={activeSection === 'men'}><ProductShowcase section="men" catalog={catalog} /></Screen>
        <Screen active={activeSection === 'women'}><ProductShowcase section="women" catalog={catalog} /></Screen>
        <Screen active={activeSection === 'accessories'}><ProductShowcase section="accessories" catalog={catalog} /></Screen>
        <Screen active={activeSection === 'contact'}><ContactScreen onBack={() => go('accessories')} /></Screen>
      </div>
    </main>
  )
}

function Header({ activeSection, mode, onNavigate }: { activeSection: SectionKey; mode: 'light' | 'dark'; onNavigate: (section: SectionKey) => void }) {
  const dark = mode === 'dark'
  return (
    <header className="absolute inset-x-0 top-0 z-50 px-4 py-4 sm:px-8 sm:py-6">
      <div className={`mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full border px-4 py-3 shadow-2xl backdrop-blur-xl sm:px-6 ${dark ? 'border-black/10 bg-white/60 text-black' : 'border-white/30 bg-black/15 text-white'}`}>
        <button type="button" onClick={() => onNavigate('home')} className="text-xs font-black uppercase tracking-[0.28em] sm:text-sm">RIVAADO</button>
        <nav className="hidden items-center gap-6 sm:flex lg:gap-8" aria-label="Primary navigation">
          {navItems.map((item) => (
            <button key={item.key} type="button" onClick={() => onNavigate(item.key)} className={`text-[11px] font-black uppercase tracking-[0.2em] transition ${activeSection === item.key ? 'opacity-100' : 'opacity-55 hover:opacity-100'}`}>{item.label}</button>
          ))}
        </nav>
        <button type="button" onClick={() => onNavigate('contact')} className="hidden rounded-full border border-current/45 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] transition hover:bg-white hover:text-black sm:inline-flex">Book fitting</button>
      </div>
      <nav className="mx-auto mt-3 flex max-w-7xl gap-2 overflow-x-auto pb-1 sm:hidden" aria-label="Mobile navigation">
        {navItems.map((item) => (
          <button key={item.key} type="button" onClick={() => onNavigate(item.key)} className={`shrink-0 rounded-full border px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] backdrop-blur-md ${activeSection === item.key ? 'border-white bg-white text-black' : 'border-white/20 bg-black/20 text-white/80'}`}>{item.label}</button>
        ))}
      </nav>
    </header>
  )
}

function Screen({ active, children }: { active: boolean; children: ReactNode }) {
  return <section className={`absolute inset-0 transition duration-500 ${active ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`} aria-hidden={!active}>{children}</section>
}

function HomeScreen({ isMobile, onExplore }: { isMobile: boolean; onExplore: () => void }) {
  const src = isMobile ? heroVideo.mobile : heroVideo.desktop
  const poster = isMobile ? heroVideo.mobilePoster : heroVideo.poster
  return (
    <div className="relative h-full w-full overflow-hidden bg-black text-white">
      <video key={src} className="absolute inset-0 h-full w-full object-cover" src={src} poster={poster} autoPlay muted loop playsInline preload="auto" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.52),rgba(0,0,0,0.05)_44%,rgba(0,0,0,0.88))]" />
      <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-8 sm:px-10 sm:pb-12">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.32em] text-white/70">Bespoke tailoring house</p>
        <h1 className="max-w-5xl uppercase leading-[0.82] tracking-[-0.06em] text-white" style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(4.5rem, 14vw, 13rem)' }}>Rivaado</h1>
        <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-xl text-sm leading-6 text-white/75 sm:text-base sm:leading-7">A cinematic bespoke experience for men and women — tailoring, couture, accessories and made-to-measure presence.</p>
          <button type="button" onClick={onExplore} className="inline-flex w-fit items-center gap-2 rounded-full border border-white/60 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-black">Explore showcase <ArrowRight size={16} strokeWidth={2.25} /></button>
        </div>
      </div>
    </div>
  )
}

function AboutScreen() {
  return (
    <div className="relative flex h-full w-full items-center overflow-hidden bg-[#ebe7dc] px-5 pt-24 text-black sm:px-10 sm:pt-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_35%,rgba(255,255,255,0.65),transparent_34%),radial-gradient(circle_at_75%_70%,rgba(202,161,73,0.18),transparent_28%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="mb-4 text-xs font-black uppercase tracking-[0.34em] text-black/48">About Rivaado</p>
          <h2 className="max-w-3xl text-5xl leading-[0.9] tracking-[-0.04em] text-black sm:text-7xl" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Seventy years of cloth, cut and quiet confidence.</h2>
          <p className="mt-7 max-w-xl text-sm font-semibold leading-7 text-black/58 sm:text-base">Rivaado is built from family craft, precise measurement and modern luxury. The garment is the product, but presence is the outcome.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-5 lg:h-[560px] lg:items-end">
          {aboutMarkers.map(([year, body], index) => (
            <div key={year} className="rounded-[2rem] border border-black/12 bg-white/42 p-5 shadow-2xl shadow-black/10 backdrop-blur" style={{ minHeight: `${260 + (index % 3) * 46}px` }}>
              <p className="text-4xl font-black text-black">{year}</p>
              <p className="mt-5 text-xs font-bold leading-6 text-black/58 sm:text-sm">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProductShowcase({ section, catalog }: { section: ProductKind; catalog: CatalogItem[] }) {
  const [subIndex, setSubIndex] = useState(0)
  const [lookIndex, setLookIndex] = useState(0)
  const subsections = subsectionConfig[section]
  const subsection = subsections[subIndex]
  const looks = itemsFor(catalog, section, subsection.id)
  const activeLook = looks[lookIndex] || looks[0]

  useEffect(() => { setSubIndex(0); setLookIndex(0) }, [section])
  useEffect(() => { if (lookIndex >= looks.length) setLookIndex(0) }, [looks.length, lookIndex])

  const selectSubsection = (index: number) => { setSubIndex(index); setLookIndex(0) }
  const previousLook = () => looks.length && setLookIndex((current) => (current + looks.length - 1) % looks.length)
  const nextLook = () => looks.length && setLookIndex((current) => (current + 1) % looks.length)

  const fallbackBg = section === 'women' ? '#7f172b' : section === 'accessories' ? '#2b2119' : '#111827'
  const darkText = activeLook?.text === 'dark'
  const background = activeLook?.background || fallbackBg
  const glow = activeLook?.glow || 'rgba(255,255,255,0.16)'
  const eyebrow = section === 'men' ? 'Men / Bespoke' : section === 'women' ? 'Women / Bespoke' : 'Accessories / Finish'

  return (
    <div className="relative h-full w-full overflow-hidden px-5 pt-28 transition-colors duration-500 sm:px-10" style={{ background, color: darkText ? '#101010' : '#fff' }}>
      <div className="absolute inset-0 transition duration-500" style={{ background: `radial-gradient(circle at 52% 43%, ${glow}, transparent 38%), linear-gradient(180deg, rgba(255,255,255,0.06), rgba(0,0,0,0.14))` }} />
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col">
        <div className="mt-16 flex flex-wrap justify-center gap-2 sm:mt-20">
          {subsections.map((item, index) => (
            <button key={item.id} type="button" onClick={() => selectSubsection(index)} className={`rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] transition ${index === subIndex ? (darkText ? 'border-black bg-black text-white' : 'border-white bg-white text-black') : darkText ? 'border-black/20 bg-white/20 text-black/55 hover:text-black' : 'border-white/20 bg-black/10 text-white/62 hover:text-white'}`}>{item.label}</button>
          ))}
        </div>

        {!activeLook ? (
          <div className="flex flex-1 items-center justify-center text-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] opacity-50">{eyebrow} / {subsection.label}</p>
              <h2 className="mt-4 text-5xl font-black">No looks published yet.</h2>
              <p className="mt-3 opacity-60">Add images through the RIVAADO admin catalog.</p>
            </div>
          </div>
        ) : (
          <div className="grid flex-1 items-center gap-6 lg:grid-cols-[0.86fr_1.25fr_0.72fr]">
            <div className="relative z-20 pt-6 sm:pt-0">
              <p className={`mb-4 text-xs font-black uppercase tracking-[0.28em] ${darkText ? 'text-black/50' : 'text-white/70'}`}>{eyebrow} / {subsection.label}</p>
              <h2 className="max-w-md text-4xl leading-[0.95] tracking-[-0.04em] sm:text-6xl" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>{activeLook.label}</h2>
              <p className={`mt-6 max-w-md text-sm font-semibold leading-7 sm:text-base ${darkText ? 'text-black/60' : 'text-white/76'}`}>{activeLook.description}</p>
              <button type="button" className={`mt-8 rounded-full px-7 py-4 text-xs font-black uppercase tracking-[0.18em] ${darkText ? 'bg-black text-white' : 'bg-white text-black'}`}>Book fitting</button>
              <div className="mt-8 flex items-center gap-3" aria-label={`${subsection.label} looks`}>
                {looks.map((item, index) => (
                  <button key={item.id} type="button" onClick={() => setLookIndex(index)} title={item.name} className={`h-11 w-11 overflow-hidden rounded-full border-2 transition ${index === lookIndex ? (darkText ? 'scale-110 border-black' : 'scale-110 border-white') : darkText ? 'border-black/30' : 'border-white/45'}`}>
                    <img src={item.imageUrl} alt="" className="h-full w-full object-cover object-top" />
                  </button>
                ))}
              </div>
              <div className={`mt-5 text-xs font-black uppercase tracking-[0.18em] ${darkText ? 'text-black/46' : 'text-white/55'}`}>{activeLook.name}</div>
            </div>

            <div className="relative flex min-h-[48vh] items-center justify-center lg:min-h-[640px]">
              <button type="button" onClick={previousLook} aria-label={`Previous ${subsection.label} look`} className={`absolute left-0 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full transition hover:scale-105 ${darkText ? 'bg-black/12 text-black' : 'bg-white/18 text-white'}`}><ArrowLeft size={22} strokeWidth={2.4} /></button>
              <RunwayImage look={activeLook} darkText={darkText} />
              <button type="button" onClick={nextLook} aria-label={`Next ${subsection.label} look`} className={`absolute right-0 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full transition hover:scale-105 ${darkText ? 'bg-black/12 text-black' : 'bg-white/18 text-white'}`}><ArrowRight size={22} strokeWidth={2.4} /></button>
            </div>

            <div className="relative z-20 hidden lg:block">
              <p className={`mb-3 text-xs font-black uppercase tracking-[0.24em] ${darkText ? 'text-black/50' : 'text-white/68'}`}>Starting at</p>
              <p className="text-3xl font-black uppercase leading-tight">{activeLook.priceTop}</p>
              <p className="text-sm font-black uppercase opacity-80">{activeLook.priceBottom}</p>
              <div className="mt-8 flex flex-wrap gap-3">{sectionSizes[section].map((size) => <span key={size} className={`flex h-16 min-w-16 items-center justify-center rounded-full px-4 text-xs font-black uppercase ${darkText ? 'bg-black text-white' : 'bg-white text-black'}`}>{size}</span>)}</div>
              <div className={`mt-10 h-36 w-28 overflow-hidden rounded-[2rem] border ${darkText ? 'border-black/24' : 'border-white/36'}`}><img src={activeLook.imageUrl} alt="" className="h-full w-full object-cover object-top" /></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function RunwayImage({ look, darkText }: { look: CatalogItem; darkText: boolean }) {
  return (
    <div className="relative flex h-[54vh] min-h-[400px] w-full items-center justify-center lg:h-[68vh]">
      <div className={`relative h-full max-h-[660px] w-[min(78vw,420px)] overflow-hidden rounded-[2.5rem] border shadow-2xl ${darkText ? 'border-black/18 shadow-black/20' : 'border-white/20 shadow-black/40'}`}>
        <img src={look.imageUrl} alt={look.name} className="h-full w-full object-cover object-top" loading="eager" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/68 via-black/10 to-transparent p-6 text-center text-white">
          <div className="text-sm font-black leading-tight">{look.caption.split('\n').map((line) => <div key={line}>{line}</div>)}</div>
        </div>
      </div>
    </div>
  )
}

function ContactScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="relative flex h-full w-full items-center overflow-hidden bg-[#111] px-5 pt-24 text-white sm:px-10 sm:pt-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(215,0,85,0.25),transparent_35%),radial-gradient(circle_at_18%_88%,rgba(202,161,73,0.16),transparent_28%)]" />
      <div className="relative mx-auto max-w-6xl">
        <p className="mb-4 text-xs font-black uppercase tracking-[0.34em] text-white/50">Book fitting</p>
        <h2 className="max-w-4xl text-5xl leading-[0.9] tracking-[-0.04em] text-white sm:text-8xl" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Begin your bespoke fitting.</h2>
        <p className="mt-7 max-w-xl text-base font-semibold leading-8 text-white/62">Men, women and accessories by appointment. Calgary bespoke tailoring, ceremonial wear and refined finishing details.</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a href="mailto:Info@rivaado.com?subject=Rivaado%20fitting%20request" className="rounded-full bg-white px-7 py-4 text-xs font-black uppercase tracking-[0.18em] text-black no-underline">Email Rivaado</a>
          <a href="tel:+18258837766" className="rounded-full border border-white/35 px-7 py-4 text-xs font-black uppercase tracking-[0.18em] text-white no-underline">+1 825-883-7766</a>
          <button type="button" onClick={onBack} className="rounded-full border border-white/20 px-7 py-4 text-xs font-black uppercase tracking-[0.18em] text-white/70">Back</button>
        </div>
      </div>
    </div>
  )
}
