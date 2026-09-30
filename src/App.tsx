import { useEffect, useRef, useState } from 'react'
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


const homeCategories: { label: string; image: string; target: ProductKind }[] = [
  { label: 'Custom Suits', image: '/looks/look-03-pastel-pink-suit.webp', target: 'men' },
  { label: 'Custom Shirts', image: '/looks/look-01-leopard-shirt.webp', target: 'men' },
  { label: 'Wool Coats', image: '/looks/look-08-leather-sleeve-coat.webp', target: 'men' },
  { label: 'Blazers', image: '/looks/look-05-plaid-blazer.webp', target: 'men' },
  { label: 'Tuxedos', image: '/looks/look-02-textured-tuxedo.webp', target: 'men' },
  { label: 'Ceremonial', image: '/looks/look-10-gold-couture.webp', target: 'women' },
  { label: 'Vests', image: '/looks/look-07-teal-shirt-vest.webp', target: 'men' },
  { label: 'Evening Shirts', image: '/looks/look-04-blue-shirt-scarf.webp', target: 'men' },
  { label: 'Formal Looks', image: '/looks/look-06-navy-open-suit.webp', target: 'men' },
  { label: 'Accessories', image: '/looks/look-09-blue-scarf-shirt.webp', target: 'accessories' },
]

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
        <Screen active={activeSection === 'home'}><HomeScreen isMobile={isMobile} onExplore={() => go('men')} onNavigate={go} /></Screen>
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

function HomeScreen({ isMobile, onExplore, onNavigate }: { isMobile: boolean; onExplore: () => void; onNavigate: (section: SectionKey) => void }) {
  const src = isMobile ? heroVideo.mobile : heroVideo.desktop
  const poster = isMobile ? heroVideo.mobilePoster : heroVideo.poster
  const categoryRail = useRef<HTMLDivElement>(null)

  const moveCategories = (direction: -1 | 1) => {
    const rail = categoryRail.current
    if (!rail) return
    const card = rail.querySelector<HTMLElement>('[data-category-card]')
    const step = (card?.offsetWidth || rail.clientWidth * 0.72) + 16
    rail.scrollBy({ left: step * direction, behavior: 'smooth' })
  }

  return (
    <div className="h-full w-full overflow-y-auto bg-white text-black">
      <section className="relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-black text-white">
        <video
          key={src}
          className="absolute inset-0 h-full w-full object-cover"
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.34),rgba(0,0,0,0.02)_42%,rgba(0,0,0,0.64))]" />

        <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-8 sm:px-10 sm:pb-11 lg:px-14 lg:pb-12">
          <div className="max-w-4xl">
            <h1 className="hero-copy-title text-[clamp(2.9rem,7vw,6.8rem)] font-normal leading-[0.94] tracking-[-0.045em] text-white">
              Dress the real you
            </h1>
            <p className="hero-copy-subtitle mt-4 max-w-3xl text-sm font-medium leading-6 text-white/92 sm:text-lg sm:leading-7 lg:text-xl">
              Clothes made to fit you, not the other way around
            </p>
          </div>

          <button
            type="button"
            onClick={onExplore}
            className="hero-copy-cta mt-7 inline-flex w-fit items-center gap-2 rounded-full border border-white/60 bg-black/10 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white backdrop-blur-sm transition hover:bg-white hover:text-black"
          >
            Explore showcase <ArrowRight size={16} strokeWidth={2.25} />
          </button>
        </div>
      </section>

      <section className="relative bg-white px-0 py-14 text-black sm:py-16 lg:py-20">
        <div className="px-5 sm:px-10 lg:px-10">
          <h2 className="text-[clamp(2rem,3vw,3.4rem)] font-normal tracking-[-0.04em] text-black">
            Bespoke from head to toe
          </h2>
        </div>

        <div className="relative mt-8 sm:mt-9">
          <button
            type="button"
            onClick={() => moveCategories(-1)}
            aria-label="Previous categories"
            className="absolute left-3 top-[45%] z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-black/22 text-white backdrop-blur-sm transition hover:bg-black/36 sm:left-5"
          >
            <ArrowLeft size={30} strokeWidth={1.8} />
          </button>

          <div
            ref={categoryRail}
            className="category-rail flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-3 sm:gap-4 sm:px-10"
          >
            {homeCategories.map((item) => (
              <button
                key={item.label}
                type="button"
                data-category-card
                onClick={() => onNavigate(item.target)}
                className="group w-[78vw] max-w-[360px] shrink-0 snap-start text-left sm:w-[36vw] sm:max-w-[380px] lg:w-[23.5vw] lg:max-w-[410px]"
              >
                <div className="aspect-[0.78] w-full overflow-hidden bg-[#ececec]">
                  <img
                    src={item.image}
                    alt={item.label}
                    className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>
                <div className="pt-3 text-[1rem] font-medium tracking-[-0.02em] text-black sm:text-[1.08rem]">
                  {item.label}
                </div>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => moveCategories(1)}
            aria-label="Next categories"
            className="absolute right-3 top-[45%] z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-black/22 text-white backdrop-blur-sm transition hover:bg-black/36 sm:right-5"
          >
            <ArrowRight size={30} strokeWidth={1.8} />
          </button>
        </div>
      </section>

      <TailoringTechSection onExplore={() => onNavigate('men')} />
    </div>
  )
}

function TailoringTechSection({ onExplore }: { onExplore: () => void }) {
  return (
    <section className="bg-[#f2efe8] px-5 py-16 text-[#1f2826] sm:px-10 sm:py-20 lg:px-16 lg:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
        <div className="max-w-xl">
          <h2 className="text-[clamp(3rem,5.3vw,6rem)] font-normal leading-[0.98] tracking-[-0.055em]">
            Bespoke, down to the last detail.
          </h2>
          <p className="mt-8 max-w-lg text-base leading-8 text-[#1f2826]/78 sm:text-lg">
            Choose the cloth, shape the silhouette and finish every detail before our tailors bring the garment to life. The screen below builds a RIVAADO look automatically, just like a live fitting configurator.
          </p>
          <button
            type="button"
            onClick={onExplore}
            className="mt-8 rounded-full border border-[#1f2826]/40 px-6 py-3 text-sm font-semibold transition hover:bg-[#1f2826] hover:text-white"
          >
            Explore tailoring
          </button>
        </div>

        <ConfiguratorDemo />
      </div>
    </section>
  )
}

const demoFabrics = [
  { name: 'Charcoal Herringbone', color: '#57514c', accent: '#716963', texture: 'linear-gradient(135deg,#57514c 0 46%,#6d6660 46% 52%,#57514c 52%)' },
  { name: 'Midnight Navy', color: '#1c2c43', accent: '#354960', texture: 'linear-gradient(90deg,#1c2c43,#2b3f58 48%,#1c2c43)' },
  { name: 'Warm Taupe', color: '#877263', accent: '#a18d7f', texture: 'linear-gradient(135deg,#877263,#a18d7f)' },
  { name: 'Deep Forest', color: '#24392f', accent: '#3a5446', texture: 'linear-gradient(135deg,#24392f,#3a5446)' },
  { name: 'Burgundy', color: '#6e2735', accent: '#8e4350', texture: 'linear-gradient(135deg,#6e2735,#8e4350)' },
  { name: 'Stone Grey', color: '#8a8c8b', accent: '#a4a6a5', texture: 'linear-gradient(135deg,#8a8c8b,#a4a6a5)' },
  { name: 'Black Barathea', color: '#151515', accent: '#303030', texture: 'linear-gradient(135deg,#151515,#303030)' },
  { name: 'Royal Blue', color: '#244e87', accent: '#416da8', texture: 'linear-gradient(135deg,#244e87,#416da8)' },
]

type ConfiguratorPanelKey = 'fabric' | 'style' | 'finish'
type DemoConfiguration = {
  fabric: number
  lapel: 'Notch' | 'Peak' | 'Shawl'
  pocket: 'Flap' | 'Jetted' | 'Patch'
  breasting: 'Single' | 'Double'
  lining: string
  monogram: string
  buttonFinish: 'Horn' | 'Dark' | 'Gold'
  trouser: 'Plain' | 'Cuffed' | 'Pleated'
}

const initialDemoConfiguration: DemoConfiguration = {
  fabric: 0,
  lapel: 'Notch',
  pocket: 'Flap',
  breasting: 'Single',
  lining: '#d7c2a4',
  monogram: 'RV',
  buttonFinish: 'Horn',
  trouser: 'Plain',
}

const configuratorTimeline: {
  panel: ConfiguratorPanelKey
  patch?: Partial<DemoConfiguration>
  cursor: [number, number]
  scrollTop: number
  hold: number
}[] = [
  { panel: 'fabric', patch: { fabric: 0 }, cursor: [15, 31], scrollTop: 0, hold: 1050 },
  { panel: 'fabric', patch: { fabric: 1 }, cursor: [27, 39], scrollTop: 0, hold: 1250 },
  { panel: 'fabric', patch: { fabric: 3 }, cursor: [17, 56], scrollTop: 68, hold: 1250 },
  { panel: 'fabric', patch: { fabric: 4 }, cursor: [29, 66], scrollTop: 120, hold: 1200 },
  { panel: 'style', patch: { lapel: 'Peak' }, cursor: [16, 34], scrollTop: 0, hold: 1300 },
  { panel: 'style', patch: { breasting: 'Double' }, cursor: [28, 47], scrollTop: 62, hold: 1250 },
  { panel: 'style', patch: { pocket: 'Jetted' }, cursor: [17, 62], scrollTop: 122, hold: 1250 },
  { panel: 'style', patch: { trouser: 'Cuffed' }, cursor: [28, 73], scrollTop: 188, hold: 1350 },
  { panel: 'finish', patch: { lining: '#a12c40' }, cursor: [17, 33], scrollTop: 0, hold: 1150 },
  { panel: 'finish', patch: { monogram: 'RA' }, cursor: [28, 49], scrollTop: 62, hold: 1250 },
  { panel: 'finish', patch: { buttonFinish: 'Gold' }, cursor: [17, 66], scrollTop: 132, hold: 1250 },
  { panel: 'finish', patch: { lining: '#b18f53', monogram: 'RV' }, cursor: [27, 73], scrollTop: 184, hold: 1650 },
]

function ConfiguratorDemo() {
  const rootRef = useRef<HTMLDivElement>(null)
  const panelScrollRef = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(0)
  const [panel, setPanel] = useState<ConfiguratorPanelKey>('fabric')
  const [config, setConfig] = useState<DemoConfiguration>(initialDemoConfiguration)
  const [isVisible, setIsVisible] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)

  const applyConfig = (patch: Partial<DemoConfiguration>) => {
    setConfig((current) => ({ ...current, ...patch }))
  }

  useEffect(() => {
    const node = rootRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting && entry.intersectionRatio >= 0.35),
      { threshold: [0, 0.35, 0.7] },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onVisibility = () => setPageVisible(document.visibilityState === 'visible')
    onVisibility()
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!isVisible || !pageVisible || prefersReducedMotion) return

    const active = configuratorTimeline[step]
    setPanel(active.panel)
    if (active.patch) applyConfig(active.patch)

    window.requestAnimationFrame(() => {
      panelScrollRef.current?.scrollTo({ top: active.scrollTop, behavior: 'smooth' })
    })

    const timer = window.setTimeout(() => {
      setStep((current) => (current + 1) % configuratorTimeline.length)
    }, active.hold)

    return () => window.clearTimeout(timer)
  }, [step, isVisible, pageVisible])

  const activeStep = configuratorTimeline[step]
  const fabric = demoFabrics[config.fabric]
  const panelIndex = panel === 'fabric' ? 0 : panel === 'style' ? 1 : 2

  const openPanel = (next: ConfiguratorPanelKey) => {
    setPanel(next)
    panelScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div ref={rootRef} className="relative mx-auto w-full max-w-[800px]">
      <div className="relative aspect-[1.38] min-h-[420px] overflow-hidden rounded-[2rem] border-[7px] border-[#222b29] bg-white shadow-[0_32px_80px_rgba(26,35,32,0.18)] sm:min-h-[520px]">
        <div className="absolute inset-x-0 top-0 z-20 flex h-12 items-center justify-center border-b border-black/8 bg-white">
          <div className="flex items-center gap-7 text-[9px] font-bold uppercase tracking-[0.18em] text-black/35 sm:gap-10 sm:text-[10px]">
            {([
              ['fabric', 'Fabric'],
              ['style', 'Style'],
              ['finish', 'Finish'],
            ] as const).map(([key, label], index) => (
              <button key={key} type="button" onClick={() => openPanel(key)} className={`relative pb-1 ${index === panelIndex ? 'text-black' : 'hover:text-black/70'}`}>
                {label}
                <span className={`absolute inset-x-0 -bottom-1 mx-auto h-[2px] origin-left bg-[#a85b44] transition-transform duration-300 ${index === panelIndex ? 'scale-x-100' : 'scale-x-0'}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="absolute inset-0 pt-12">
          <div className="grid h-full grid-cols-[0.9fr_1.1fr] sm:grid-cols-[0.82fr_1.18fr_0.58fr]">
            <div className="relative overflow-hidden border-r border-black/8 bg-[#fafafa]">
              <ConfiguratorPanel
                refEl={panelScrollRef}
                panel={panel}
                config={config}
                applyConfig={applyConfig}
              />
            </div>

            <div className="relative flex items-center justify-center bg-white">
              <SuitPreview
                color={fabric.color}
                accent={fabric.accent}
                lapel={config.lapel}
                pocket={config.pocket}
                lining={config.lining}
                breasting={config.breasting}
                buttonFinish={config.buttonFinish}
                trouser={config.trouser}
              />
              <div className="absolute bottom-4 flex gap-2">
                {demoFabrics.slice(0, 5).map((item, index) => (
                  <button
                    type="button"
                    key={item.name}
                    aria-label={item.name}
                    onClick={() => applyConfig({ fabric: index })}
                    className={`h-2 w-2 rounded-full transition ${index === config.fabric ? 'scale-125 bg-black' : 'bg-black/18'}`}
                  />
                ))}
              </div>
            </div>

            <div className="hidden flex-col items-center justify-center border-l border-black/8 px-3 text-center sm:flex">
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black sm:text-sm">Custom Suit</div>
              <div className="mt-1 text-[10px] text-black/38 sm:text-xs">Made to measure</div>
              <div className="mt-5 text-[10px] font-semibold text-black/45">Fabric</div>
              <div className="mt-1 text-[10px] font-semibold leading-tight text-black/78 sm:text-xs">{fabric.name}</div>
              <div className="mt-5 text-[10px] font-semibold text-black/45">Lapel</div>
              <div className="mt-1 text-[10px] font-semibold text-black/78 sm:text-xs">{config.lapel}</div>
              <div className="mt-5 text-[10px] font-semibold text-black/45">Construction</div>
              <div className="mt-1 text-[10px] font-semibold text-black/78 sm:text-xs">{config.breasting}</div>
              <button type="button" className="mt-7 w-full bg-[#a85b44] px-3 py-2 text-[9px] font-bold uppercase tracking-[0.14em] text-white">
                Continue
              </button>
            </div>
          </div>
        </div>

        <div
          className="config-cursor absolute z-40 h-5 w-5 transition-[left,top] duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
          style={{ left: `${activeStep.cursor[0]}%`, top: `${activeStep.cursor[1]}%` }}
        >
          <svg viewBox="0 0 24 24" className="h-full w-full drop-shadow-md">
            <path d="M4 3l13 9-6 1 3 6-2.5 1.2-3-6L4 18V3z" fill="#111" stroke="white" strokeWidth="1.4" />
          </svg>
        </div>
      </div>
    </div>
  )
}

function ConfiguratorPanel({
  refEl,
  panel,
  config,
  applyConfig,
}: {
  refEl: React.RefObject<HTMLDivElement>
  panel: ConfiguratorPanelKey
  config: DemoConfiguration
  applyConfig: (patch: Partial<DemoConfiguration>) => void
}) {
  return (
    <div className="relative h-full">
      <div className="absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-[#fafafa] via-[#fafafa] to-transparent px-4 pb-5 pt-4 sm:px-5">
        <div className="text-[9px] font-black uppercase tracking-[0.17em] text-black/42 sm:text-[10px]">
          {panel === 'fabric' ? 'Select fabric' : panel === 'style' ? 'Choose construction' : 'Finishing details'}
        </div>
      </div>

      <div ref={refEl} className="config-panel-scroll h-full overflow-y-auto px-4 pb-16 pt-14 sm:px-5">
        <div className="transition-opacity duration-250">
          {panel === 'fabric' && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {demoFabrics.map((item, index) => (
                <button
                  type="button"
                  key={item.name}
                  onClick={() => applyConfig({ fabric: index })}
                  className={`rounded-md border p-1.5 text-left transition duration-300 ${index === config.fabric ? 'border-[#a85b44] shadow-[0_0_0_2px_rgba(168,91,68,.12)]' : 'border-black/8 hover:border-black/25'}`}
                >
                  <div className="aspect-square rounded-sm" style={{ background: item.texture }} />
                  <div className="mt-1 truncate text-[7px] font-semibold text-black/58 sm:text-[8px]">{item.name}</div>
                </button>
              ))}
            </div>
          )}

          {panel === 'style' && (
            <div className="space-y-6 pb-8">
              <OptionRow title="Lapel" options={['Notch','Peak','Shawl']} active={config.lapel} onSelect={(value) => applyConfig({ lapel: value as DemoConfiguration['lapel'] })} />
              <OptionRow title="Construction" options={['Single','Double']} active={config.breasting} onSelect={(value) => applyConfig({ breasting: value as DemoConfiguration['breasting'] })} />
              <OptionRow title="Pocket style" options={['Flap','Jetted','Patch']} active={config.pocket} onSelect={(value) => applyConfig({ pocket: value as DemoConfiguration['pocket'] })} />
              <OptionRow title="Trouser finish" options={['Plain','Cuffed','Pleated']} active={config.trouser} onSelect={(value) => applyConfig({ trouser: value as DemoConfiguration['trouser'] })} />
            </div>
          )}

          {panel === 'finish' && (
            <div className="space-y-6 pb-8">
              <div>
                <div className="text-[8px] font-bold uppercase tracking-[0.12em] text-black/40">Lining</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {['#d7c2a4','#a12c40','#b18f53','#1f3550','#24392f'].map((color) => (
                    <button
                      type="button"
                      aria-label={`Lining ${color}`}
                      key={color}
                      onClick={() => applyConfig({ lining: color })}
                      className={`h-7 w-7 rounded-sm border-2 transition ${color === config.lining ? 'scale-110 border-black' : 'border-white shadow-sm'}`}
                      style={{ background: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[8px] font-bold uppercase tracking-[0.12em] text-black/40">Monogram</div>
                <div className="mt-2 flex items-center gap-2">
                  {['RV','RA','MC'].map((value) => (
                    <button
                      type="button"
                      key={value}
                      onClick={() => applyConfig({ monogram: value })}
                      className={`rounded-md border px-3 py-2 text-xs font-semibold tracking-[0.18em] ${value === config.monogram ? 'border-[#a85b44] bg-[#f5ece8]' : 'border-black/10 bg-white'}`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              <OptionRow title="Button finish" options={['Horn','Dark','Gold']} active={config.buttonFinish} onSelect={(value) => applyConfig({ buttonFinish: value as DemoConfiguration['buttonFinish'] })} />
              <OptionRow title="Pocket square" options={['None','White','Pattern']} active="White" />
            </div>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#fafafa] to-transparent" />
      <div className="absolute bottom-3 left-4 text-[8px] font-semibold text-black/32 sm:left-5">
        Live RIVAADO configuration
      </div>
    </div>
  )
}

function OptionRow({
  title,
  options,
  active,
  onSelect,
}: {
  title: string
  options: readonly string[]
  active: string
  onSelect?: (value: string) => void
}) {
  return (
    <div>
      <div className="text-[8px] font-bold uppercase tracking-[0.12em] text-black/40">{title}</div>
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        {options.map((option) => (
          <button
            type="button"
            key={option}
            onClick={() => onSelect?.(option)}
            className={`rounded-md border px-1 py-2 text-center text-[7px] font-semibold transition sm:text-[8px] ${option === active ? 'border-[#a85b44] bg-[#f5ece8] text-[#8d4634]' : 'border-black/8 bg-white text-black/48 hover:border-black/20'}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

function SuitPreview({
  color,
  accent,
  lapel,
  pocket,
  lining,
  breasting,
  buttonFinish,
  trouser,
}: {
  color: string
  accent: string
  lapel: DemoConfiguration['lapel']
  pocket: DemoConfiguration['pocket']
  lining: string
  breasting: DemoConfiguration['breasting']
  buttonFinish: DemoConfiguration['buttonFinish']
  trouser: DemoConfiguration['trouser']
}) {
  const buttonColor = buttonFinish === 'Gold' ? '#b18f53' : buttonFinish === 'Dark' ? '#111' : '#55483c'
  const lapelPath =
    lapel === 'Peak'
      ? 'M151 35l29 57-42 58 10-62-23-35z M209 35l-29 57 42 58-10-62 23-35z'
      : lapel === 'Shawl'
        ? 'M151 35c5 45 11 78 29 109 18-31 24-64 29-109l25 21c-10 66-25 104-54 132-29-28-44-66-54-132z'
        : 'M151 35l29 57-31 45-7-49-17-35z M209 35l-29 57 31 45 7-49 17-35z'

  return (
    <svg viewBox="0 0 360 470" className="h-[78%] w-[84%] drop-shadow-[0_18px_18px_rgba(0,0,0,.12)]" aria-label="Custom RIVAADO suit preview">
      <defs>
        <linearGradient id="suitFabric" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent} />
          <stop offset="48%" stopColor={color} />
          <stop offset="100%" stopColor={accent} />
        </linearGradient>
      </defs>

      <path d="M113 52L151 34h58l38 18 54 45-27 91-34-24v236H120V164l-34 24-27-91z" fill="url(#suitFabric)" />
      <path d="M151 35l29 57 29-57 25 21-54 111-54-111z" fill={lining} opacity=".92" />
      <path d={lapelPath} fill={accent} opacity=".96" />

      <line x1="180" y1="94" x2="180" y2="398" stroke="rgba(255,255,255,.24)" strokeWidth="2" />

      {breasting === 'Double' ? (
        <>
          <circle cx="165" cy="184" r="5" fill={buttonColor} />
          <circle cx="195" cy="184" r="5" fill={buttonColor} />
          <circle cx="165" cy="226" r="5" fill={buttonColor} />
          <circle cx="195" cy="226" r="5" fill={buttonColor} />
        </>
      ) : (
        <>
          <circle cx="180" cy="188" r="5" fill={buttonColor} />
          <circle cx="180" cy="232" r="5" fill={buttonColor} />
        </>
      )}

      {pocket === 'Patch' ? (
        <>
          <rect x="130" y="247" width="38" height="40" rx="4" fill="none" stroke="rgba(255,255,255,.32)" strokeWidth="3" />
          <rect x="192" y="247" width="38" height="40" rx="4" fill="none" stroke="rgba(255,255,255,.32)" strokeWidth="3" />
        </>
      ) : pocket === 'Jetted' ? (
        <>
          <line x1="129" y1="266" x2="164" y2="266" stroke="rgba(255,255,255,.42)" strokeWidth="3" />
          <line x1="196" y1="266" x2="231" y2="266" stroke="rgba(255,255,255,.42)" strokeWidth="3" />
        </>
      ) : (
        <>
          <line x1="129" y1="263" x2="163" y2="271" stroke="rgba(255,255,255,.32)" strokeWidth="4" />
          <line x1="197" y1="271" x2="231" y2="263" stroke="rgba(255,255,255,.32)" strokeWidth="4" />
        </>
      )}

      <path d="M120 400h120l-7 18h-106z" fill={accent} opacity=".65" />
      <path d={trouser === 'Pleated' ? 'M145 400l-4 60h-38v-12l24-30h18zM215 400l4 60h38v-12l-24-30h-18z' : 'M145 400v60h-40v-12l22-30h18zM215 400v60h40v-12l-22-30h-18z'} fill={color} />
      {trouser === 'Cuffed' && (
        <>
          <rect x="105" y="449" width="40" height="9" fill={accent} />
          <rect x="215" y="449" width="40" height="9" fill={accent} />
        </>
      )}
    </svg>
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
