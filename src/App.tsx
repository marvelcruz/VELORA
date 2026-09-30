import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowLeft, ArrowRight, ChevronDown, Facebook, Globe2, Instagram, Menu, MessageCircle, ShoppingBag, UserRound, X } from 'lucide-react'
import Admin from './Admin'
import { fromProductRow, itemsFor, sectionSizes, seedCatalog, subsectionConfig, type CatalogItem, type ProductKind, type ProductRow, type SectionKey } from './catalog'
import { supabase } from './supabase'

const drawerPrimary: { label: string; key: Exclude<SectionKey, 'admin'>; external?: boolean }[] = [
  { label: 'Highlights', key: 'home' },
  { label: 'Clothing', key: 'men' },
  { label: 'Occasion', key: 'men' },
  { label: 'Footwear', key: 'accessories' },
  { label: 'Custom', key: 'men' },
  { label: 'Accessories', key: 'accessories' },
  { label: 'Women', key: 'women', external: true },
  { label: 'About', key: 'about' },
]

const drawerSecondary: { label: string; key: Exclude<SectionKey, 'admin'>; accent?: boolean }[] = [
  { label: 'Digital body profile', key: 'contact', accent: true },
  { label: 'Order samples', key: 'contact' },
  { label: 'Blog', key: 'about' },
  { label: 'Giftcard', key: 'contact' },
  { label: 'Corporate Solutions', key: 'contact' },
  { label: 'Contact us', key: 'contact' },
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
  const [menuOpen, setMenuOpen] = useState(false)
  const [drawerActive, setDrawerActive] = useState('Highlights')
  const dark = mode === 'dark'

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  const navigateFromMenu = (key: Exclude<SectionKey, 'admin'>) => {
    setMenuOpen(false)
    onNavigate(key)
  }

  return (
    <>
      <header className="pointer-events-none absolute inset-x-0 top-0 z-50">
        <div className="hidden h-10 items-center justify-center bg-[#171719] text-[11px] font-medium tracking-[0.04em] text-white/78 md:flex">
          Custom-tailored clothing
        </div>

        <div className={`pointer-events-auto relative flex h-[78px] items-center justify-between px-4 sm:px-6 md:h-[64px] md:px-5 ${dark ? 'text-[#202624]' : 'text-white'}`}>
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="flex h-11 w-11 items-center justify-start md:w-10"
            >
              <Menu size={26} strokeWidth={1.45} />
            </button>

            <nav className="hidden items-center gap-7 md:flex" aria-label="Desktop shortcuts">
              <button type="button" onClick={() => onNavigate('home')} className="text-[14px] font-medium tracking-[-0.02em]">Highlights</button>
              <button type="button" onClick={() => onNavigate('men')} className="text-[14px] font-medium tracking-[-0.02em]">Custom clothing</button>
              <button type="button" onClick={() => onNavigate('accessories')} className="text-[14px] font-medium tracking-[-0.02em]">Custom Footwear</button>
              <button type="button" onClick={() => onNavigate('women')} className="text-[14px] font-medium tracking-[-0.02em]">Women ↗</button>
            </nav>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="absolute left-1/2 -translate-x-1/2 text-[25px] font-semibold tracking-[-0.055em] md:text-[25px]"
          >
            Rivaado
          </button>

          <div className="flex items-center gap-4 md:gap-3.5">
            <button type="button" onClick={() => onNavigate('contact')} aria-label="Messages" className="hidden h-10 w-9 items-center justify-center md:flex">
              <MessageCircle size={22} strokeWidth={1.35} />
            </button>
            <button type="button" className="hidden items-center gap-1.5 text-[13px] font-medium md:flex" aria-label="Region">
              <Globe2 size={21} strokeWidth={1.35} />
              <span>Global</span>
            </button>
            <button type="button" onClick={() => onNavigate('contact')} className="hidden items-center gap-1.5 text-[13px] font-medium md:flex">
              <UserRound size={21} strokeWidth={1.35} />
              <span>login</span>
            </button>
            <button type="button" onClick={() => onNavigate('contact')} aria-label="Bag" className="flex h-11 w-9 items-center justify-center">
              <ShoppingBag size={24} strokeWidth={1.4} />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu overlay"
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-[70] hidden bg-black/46 md:block"
          />

          <aside className="fixed inset-y-0 left-0 z-[90] hidden w-[700px] bg-white text-[#202624] shadow-[16px_0_40px_rgba(0,0,0,.08)] md:flex">
            <div className="flex w-[350px] shrink-0 flex-col border-r border-black/8 bg-white">
              <div className="flex h-[96px] items-center px-9">
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="flex h-10 w-10 items-center justify-start"
                >
                  <X size={28} strokeWidth={1.3} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-10 pb-7">
                <nav aria-label="Main menu" className="space-y-[26px]">
                  {drawerPrimary.map((item) => (
                    <button
                      type="button"
                      key={item.label}
                      onMouseEnter={() => item.label !== 'Women' && setDrawerActive(item.label)}
                      onFocus={() => item.label !== 'Women' && setDrawerActive(item.label)}
                      onClick={() => item.label === 'Women' ? navigateFromMenu('women') : setDrawerActive(item.label)}
                      className={`block text-left text-[21px] font-normal leading-none tracking-[-0.025em] transition-colors hover:text-[#202624] ${
                        drawerActive === item.label
                          ? 'font-medium text-[#202624]'
                          : 'text-[#9b9f9d]'
                      }`}
                    >
                      {item.label}{item.external ? <span className="ml-1 align-top text-[13px]">↗</span> : null}
                    </button>
                  ))}
                </nav>

                <nav aria-label="Secondary menu" className="mt-[52px] space-y-[20px]">
                  {drawerSecondary.map((item) => (
                    <button
                      type="button"
                      key={item.label}
                      onClick={() => navigateFromMenu(item.key)}
                      className={`block text-left text-[14px] leading-none tracking-[-0.015em] ${item.accent ? 'font-semibold text-[#bd7a24]' : 'font-normal text-[#9b9f9d]'}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>

                <div className="mt-9 flex items-center gap-[17px] text-[#202624]">
                  <Instagram size={18} strokeWidth={1.8} />
                  <Facebook size={18} strokeWidth={1.8} />
                  <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-current text-[10px] font-semibold">X</span>
                  <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-current text-[9px] font-semibold">P</span>
                  <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-current text-[9px] font-semibold">♪</span>
                </div>
              </div>
            </div>

            <DesktopDrawerPanel active={drawerActive} onNavigate={navigateFromMenu} />
          </aside>

          <aside className="fixed inset-0 z-[100] flex flex-col bg-white text-[#202624] md:hidden">
            <div className="relative flex h-[78px] shrink-0 items-center justify-between px-6">
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="flex h-12 w-12 items-center justify-start"
              >
                <X size={30} strokeWidth={1.2} />
              </button>

              <button
                type="button"
                onClick={() => navigateFromMenu('home')}
                className="absolute left-1/2 -translate-x-1/2 text-[24px] font-semibold tracking-[-0.055em]"
              >
                Rivaado
              </button>

              <button type="button" onClick={() => navigateFromMenu('contact')} aria-label="Bag" className="flex h-12 w-12 items-center justify-end">
                <ShoppingBag size={27} strokeWidth={1.35} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-[105px] pt-[68px]">
              <nav aria-label="Main menu" className="space-y-[38px]">
                {drawerPrimary.map((item) => (
                  <button
                    type="button"
                    key={item.label}
                    onClick={() => navigateFromMenu(item.key)}
                    className="block text-left text-[30px] font-normal leading-[1.02] tracking-[-0.045em]"
                  >
                    {item.label}{item.external ? <span className="ml-1.5 align-top text-[16px]">↗</span> : null}
                  </button>
                ))}
              </nav>

              <nav aria-label="Secondary menu" className="mt-[92px] space-y-[24px]">
                {drawerSecondary.map((item) => (
                  <button
                    type="button"
                    key={item.label}
                    onClick={() => navigateFromMenu(item.key)}
                    className={`block text-left text-[20px] leading-[1.08] tracking-[-0.03em] ${item.accent ? 'font-semibold text-[#202124]' : 'font-normal'}`}
                  >
                    {item.accent ? (
                      <>
                        <span className="font-semibold">Digital body </span>
                        <span className="font-semibold text-[#9a927f]">profile</span>
                      </>
                    ) : item.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="absolute inset-x-0 bottom-0 flex h-[72px] items-center justify-between rounded-t-[26px] bg-[#f5f3ee] px-6 text-[19px] tracking-[-0.03em] shadow-[0_-8px_30px_rgba(0,0,0,.03)]">
              <button type="button" onClick={() => navigateFromMenu('contact')} className="font-normal">
                Access your account
              </button>
              <button type="button" className="flex items-center gap-2 font-normal">
                English <ChevronDown size={16} strokeWidth={1.5} />
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  )
}

function DesktopDrawerPanel({ active, onNavigate }: { active: string; onNavigate: (section: Exclude<SectionKey, 'admin'>) => void }) {
  const simplePanels: Record<string, { title: string; items: { label: string; accent?: boolean; badge?: string }[] }> = {
    Clothing: {
      title: 'Shop by product',
      items: [
        { label: 'Travel line', badge: 'new' },
        { label: 'Suits' },
        { label: 'Shirts', accent: true },
        { label: 'Polo Shirts' },
        { label: 'Blazers' },
        { label: 'Pants' },
        { label: 'Jeans' },
        { label: 'Chinos' },
        { label: 'Tuxedo' },
        { label: 'Outerwear' },
        { label: 'Waistcoats' },
      ],
    },
    Occasion: {
      title: 'Shop by occasion',
      items: [
        { label: 'Travel line', badge: 'new' },
        { label: 'Wedding' },
        { label: 'Business' },
        { label: 'Party' },
        { label: 'Casual' },
        { label: 'Vintage' },
      ],
    },
    Custom: {
      title: 'Custom clothing',
      items: [
        { label: 'Custom Suits' },
        { label: 'Custom Dress Shirts' },
        { label: 'Custom Blazers' },
        { label: 'Custom Dress Pants' },
        { label: 'Custom Jeans' },
        { label: 'Custom Chinos' },
        { label: 'Custom Tuxedos' },
        { label: 'Custom Coats' },
        { label: 'Custom Vests' },
        { label: 'Custom Polo Shirts' },
        { label: 'Custom Dress Shoes' },
        { label: 'Custom Sneakers' },
      ],
    },
    Accessories: {
      title: 'Shop accessories',
      items: [
        { label: 'Ties' },
        { label: 'Cufflinks' },
        { label: 'Belts' },
        { label: 'Bow–Ties' },
        { label: 'Scarfs' },
        { label: 'Socks' },
        { label: 'All accessories' },
      ],
    },
    Footwear: {
      title: 'Shop shoes',
      items: [
        { label: 'Shoes' },
        { label: 'Dress boot' },
        { label: 'Sneakers' },
        { label: 'Loafers' },
        { label: 'Specials' },
      ],
    },
    About: {
      title: 'About',
      items: [
        { label: 'Our mission' },
        { label: 'Our values' },
        { label: 'How it works' },
        { label: 'Our Partners Network' },
        { label: 'FAQ' },
      ],
    },
  }

  if (active === 'Highlights') {
    const looks = [
      { label: 'Made to Keep', image: '/looks/look-06-navy-open-suit.webp', badge: 'new' },
      { label: 'Travel line', image: '/looks/look-04-blue-shirt-scarf.webp' },
      { label: 'Outfit Ideas', image: '/looks/look-05-plaid-blazer.webp', accent: true },
      { label: 'Wedding Collection 2026', image: '/looks/look-02-textured-tuxedo.webp' },
      { label: 'Pitti Uomo', image: '/looks/look-08-leather-sleeve-coat.webp' },
    ]

    return (
      <div className="flex w-[350px] shrink-0 flex-col bg-[#f7f5ef]">
        <div className="px-6 pb-3 pt-[118px]">
          <h2 className="text-[21px] font-medium tracking-[-0.03em]">Shop by Looks</h2>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pb-8 [scrollbar-color:#c9c6bd_transparent] [scrollbar-width:thin]">
          {looks.map((look) => (
            <button type="button" key={look.label} onClick={() => onNavigate('men')} className="mb-8 block w-full text-left">
              <div className="aspect-[1.85] w-full overflow-hidden bg-[#ebe8df]">
                <img src={look.image} alt="" className="h-full w-full object-cover object-top" />
              </div>
              <div className={`mt-2 flex items-center gap-2 text-[16px] tracking-[-0.025em] ${look.accent ? 'text-[#c49a42]' : 'text-[#202624]'}`}>
                <span>{look.label}</span>
                {look.badge ? <span className="rounded-full bg-[#c65b43] px-2 py-[2px] text-[9px] font-semibold text-white">{look.badge}</span> : null}
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  const panel = simplePanels[active] || simplePanels.Clothing

  return (
    <div className="flex w-[350px] shrink-0 flex-col bg-[#f7f5ef] px-6 pb-8 pt-[118px]">
      <h2 className="text-[21px] font-medium tracking-[-0.03em]">{panel.title}</h2>
      <div className="mt-7 space-y-[20px]">
        {panel.items.map((item) => (
          <button
            type="button"
            key={item.label}
            onClick={() => onNavigate(active === 'About' ? 'about' : active === 'Accessories' || active === 'Footwear' ? 'accessories' : 'men')}
            className={`flex items-center gap-2 text-left text-[16px] leading-none tracking-[-0.02em] ${item.accent ? 'text-[#c49a42]' : 'text-[#202624]'}`}
          >
            <span>{item.label}</span>
            {item.badge ? <span className="rounded-full bg-[#c65b43] px-2 py-[2px] text-[9px] font-semibold text-white">{item.badge}</span> : null}
          </button>
        ))}
      </div>

      {active === 'Occasion' ? (
        <button type="button" onClick={() => onNavigate('men')} className="mt-auto pt-10 text-left">
          <div className="aspect-[1.9] w-full overflow-hidden bg-[#ebe8df]">
            <img src="/looks/look-02-textured-tuxedo.webp" alt="" className="h-full w-full object-cover object-top" />
          </div>
          <div className="mt-2 text-[16px] tracking-[-0.025em] text-[#202624]">Wedding Collection 2026</div>
        </button>
      ) : null}
    </div>
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
      <HomeReferenceSections onNavigate={onNavigate} />
    </div>
  )
}

function HomeReferenceSections({ onNavigate }: { onNavigate: (section: SectionKey) => void }) {
  const outfitIdeas = [
    '/looks/look-02-textured-tuxedo.webp',
    '/looks/look-08-leather-sleeve-coat.webp',
    '/looks/look-06-navy-open-suit.webp',
    '/looks/look-03-pastel-pink-suit.webp',
    '/looks/look-05-plaid-blazer.webp',
    '/looks/look-07-teal-shirt-vest.webp',
  ]

  const reviews = [
    {
      title: 'Thanks again for helping me!!',
      body: 'I wanted to take a quick moment and say again thanks to RIVAADO for the excellent work. The fit, finish and attention to detail were exactly what I hoped for.',
      name: 'Larrren Unruh – United States',
    },
    {
      title: 'Fantastic job',
      body: 'Just received my package — the items were perfect. Fantastic job. Loving my purchases and thank you for all your help.',
      name: 'David B – United States',
    },
    {
      title: 'Awesome job, RIVAADO!',
      body: 'The fit is exceptional, the garments are comfortable, and the whole process feels considered from order to arrival. I will definitely be coming back.',
      name: 'Matthew T. – United States',
    },
  ]

  return (
    <>
      <section className="bg-[#202625] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-14 lg:py-24">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-[clamp(2.7rem,4vw,4.2rem)] font-normal tracking-[-0.055em]">Outfit Ideas</h2>
              <p className="mt-5 max-w-[470px] text-sm leading-5 text-white/78 sm:text-[15px]">
                Get inspired by our community. Real customers like you styling great outfits based on RIVAADO garments.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('men')}
              className="w-fit rounded-full bg-white px-7 py-3 text-sm font-medium text-[#202625]"
            >
              Check them all
            </button>
          </div>

          <div className="category-rail mt-7 flex gap-5 overflow-x-auto pb-2">
            {outfitIdeas.map((image, index) => (
              <button
                type="button"
                key={image}
                onClick={() => onNavigate(index === 3 ? 'women' : 'men')}
                className="w-[72vw] max-w-[285px] shrink-0 overflow-hidden bg-white/5 sm:w-[31vw] lg:w-[19vw]"
              >
                <img src={image} alt={`RIVAADO outfit idea ${index + 1}`} className="aspect-[0.78] h-auto w-full object-cover object-top" loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid min-h-[760px] bg-white text-[#202124] lg:grid-cols-2">
        <div className="min-h-[520px] overflow-hidden lg:min-h-[760px]">
          <img
            src="/looks/look-09-blue-scarf-shirt.webp"
            alt="Material and craftsmanship placeholder"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex items-center justify-center px-7 py-16 text-center sm:px-12 lg:px-20">
          <div className="max-w-[520px]">
            <h2 className="text-[clamp(2.7rem,4vw,4.3rem)] font-normal leading-[1.05] tracking-[-0.055em]">
              Our planet<br />appreciates it
            </h2>
            <p className="mx-auto mt-6 max-w-[510px] text-[15px] leading-7 text-black/74 sm:text-base">
              Feel great about your clothes and your environmental impact. Thoughtful pieces are designed to be worn, cared for and kept.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('about')}
              className="mt-7 rounded-full border border-black/45 px-7 py-3 text-sm font-medium"
            >
              Learn how it's made
            </button>
          </div>
        </div>
      </section>

      <section className="grid min-h-[760px] bg-white text-[#202124] lg:grid-cols-2">
        <div className="order-2 flex items-center justify-center px-7 py-16 text-center sm:px-12 lg:order-1 lg:px-20">
          <div className="max-w-[520px]">
            <h2 className="text-[clamp(2.7rem,4vw,4.2rem)] font-normal tracking-[-0.055em]">Looks that last</h2>
            <p className="mx-auto mt-5 max-w-[510px] text-[15px] leading-7 text-black/74 sm:text-base">
              We know you pay attention to detail, and so do we. From durable fabrics to a quality-controlled tailoring process, every piece is made to stand up to repeat wear.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="mt-7 rounded-full border border-black/45 px-7 py-3 text-sm font-medium"
            >
              Order samples
            </button>
          </div>
        </div>
        <div className="order-1 min-h-[520px] overflow-hidden lg:order-2 lg:min-h-[760px]">
          <img
            src="/looks/look-05-plaid-blazer.webp"
            alt="Tailoring measurement placeholder"
            className="h-full w-full object-cover object-top"
            loading="lazy"
          />
        </div>
      </section>

      <section className="relative min-h-[820px] overflow-hidden bg-[#b65a42] text-white sm:min-h-[900px] lg:min-h-[780px]">
        <img src="/looks/look-10-gold-couture.webp" alt="" className="absolute left-[15%] top-0 hidden h-[220px] w-[380px] object-cover sm:block" />
        <img src="/looks/look-08-leather-sleeve-coat.webp" alt="" className="absolute right-0 top-0 h-[260px] w-[200px] object-cover sm:w-[250px]" />
        <img src="/looks/look-03-pastel-pink-suit.webp" alt="" className="absolute left-0 bottom-0 h-[310px] w-[190px] object-cover object-top sm:w-[220px]" />
        <img src="/looks/look-01-leopard-shirt.webp" alt="" className="absolute bottom-[130px] left-[25%] hidden h-[300px] w-[210px] object-cover object-top md:block" />
        <img src="/looks/look-06-navy-open-suit.webp" alt="" className="absolute left-[39%] top-[255px] hidden h-[300px] w-[190px] object-cover object-top lg:block" />
        <img src="/looks/look-07-teal-shirt-vest.webp" alt="" className="absolute bottom-0 right-0 h-[220px] w-[310px] object-cover object-top sm:h-[230px] sm:w-[360px]" />

        <div className="relative z-10 mx-auto flex min-h-[820px] max-w-[1500px] items-center justify-center px-6 py-20 sm:min-h-[900px] lg:min-h-[780px] lg:justify-end lg:px-20">
          <div className="max-w-[520px] bg-[#b65a42]/88 p-5 backdrop-blur-[1px] sm:p-8 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
            <h2 className="text-[clamp(3rem,4.3vw,5rem)] font-normal leading-[1.04] tracking-[-0.055em]">
              Perfect fit<br />garments, to your<br />specifications
            </h2>
            <p className="mt-7 max-w-[470px] text-base leading-7 text-white/94">
              From fabrics and buttons to pocket styles and lining colors, personalize your handcrafted look. Take control and feel confident with our fit promise.
            </p>
            <button type="button" onClick={() => onNavigate('men')} className="mt-7 text-base font-medium underline underline-offset-4">
              Learn more
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 text-[#202124] sm:px-8 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <h2 className="text-[25px] font-medium tracking-[-0.035em]">Reviewed by you</h2>
            <div className="flex items-center gap-3 text-sm">
              <span className="font-semibold">Great</span>
              <span className="tracking-[0.08em] text-[#48b82c]">★★★★★</span>
              <span className="underline underline-offset-2">23,360 reviews on</span>
              <span className="font-semibold text-[#00a36c]">★ Trustpilot</span>
            </div>
          </div>

          <div className="mt-12 grid gap-12 lg:grid-cols-3 lg:gap-20">
            {reviews.map((review) => (
              <article key={review.title}>
                <div className="text-[25px] tracking-[0.12em] text-[#f3b000]">★★★★★</div>
                <h3 className="mt-6 text-base font-medium">{review.title}</h3>
                <p className="mt-5 max-w-[430px] text-sm leading-7 text-black/62">{review.body}</p>
                <p className="mt-5 text-sm font-medium">{review.name}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <button type="button" className="rounded-full bg-[#202625] px-8 py-3 text-sm font-medium text-white">
              See them all
            </button>
          </div>
        </div>
      </section>

      <FabricSampleSections onNavigate={onNavigate} />
      <FabricPackShowcase onNavigate={onNavigate} />
      <SiteFooter />
    </>
  )
}

function FabricSampleSections({ onNavigate }: { onNavigate: (section: SectionKey) => void }) {
  const catalogs = [
    { title: 'Distinctive & Trendy', subtitle: 'Dress Shirts', image: '/looks/look-01-leopard-shirt.webp' },
    { title: 'Essentials & Top Sales', subtitle: 'Suits, Jackets & Trousers', image: '/looks/look-06-navy-open-suit.webp' },
    { title: 'Rustic & Winter Styles', subtitle: 'Suits, Jackets & Trousers', image: '/looks/look-08-leather-sleeve-coat.webp' },
    { title: 'Spring summer specials', subtitle: 'Suits, Jackets & Trousers', image: '/looks/look-03-pastel-pink-suit.webp' },
    { title: 'Party & Celebration', subtitle: 'Suits, Jackets & Trousers', image: '/looks/look-02-textured-tuxedo.webp' },
    { title: 'Essentials & Top Sales', subtitle: 'Dress Shirts', image: '/looks/look-04-blue-shirt-scarf.webp' },
    { title: 'Lightweight Layers', subtitle: 'Trench & Field Jacket', image: '/looks/look-07-teal-shirt-vest.webp' },
  ]

  const faqs = [
    'I can’t find the fabric I want in the catalogs',
    'How long it takes for samples to arrive?',
    'Why samples are not free?',
    'Can I order all catalogs at once?',
  ]

  return (
    <>
      <section className="relative isolate min-h-[420px] overflow-hidden bg-[#142338] text-white sm:min-h-[460px]">
        <img
          src="/looks/look-05-plaid-blazer.webp"
          alt="Fabric sample catalogues placeholder"
          className="absolute inset-0 -z-20 h-full w-full scale-[1.35] object-cover object-center blur-[1px]"
          loading="lazy"
        />
        <div className="absolute inset-0 -z-10 bg-[#0d1420]/58" />
        <div className="mx-auto flex min-h-[420px] max-w-[1500px] flex-col items-center justify-center px-6 py-20 text-center sm:min-h-[460px]">
          <h2 className="text-[clamp(2.8rem,4.3vw,4.8rem)] font-normal tracking-[-0.055em]">
            Fabric sample catalogues
          </h2>
          <p className="mt-8 max-w-[420px] text-lg leading-7 text-white/90 sm:text-[21px]">
            Fabric selection available in catalogs, ready to order online.
          </p>
        </div>
      </section>

      <section id="fabric-catalog-list" className="bg-white px-5 py-16 text-[#202124] sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[960px]">
          <p className="max-w-[760px] text-[15px] leading-6 text-black/78 sm:text-base">
            Request your fabric samples. Choose the catalogs that best fit your needs and we will send them to your home for you to choose from.
          </p>
          <p className="mt-7 text-[15px] leading-6 text-black/78 sm:text-base">
            Click on each of them to find out which tissues are contained in them
          </p>

          <div className="mt-14 grid gap-x-9 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {catalogs.map((catalog) => (
              <button
                type="button"
                key={catalog.title + catalog.subtitle}
                onClick={() => document.getElementById('fabric-catalog-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="text-center"
              >
                <div className="aspect-[0.82] overflow-hidden bg-[#d9b071]">
                  <img
                    src={catalog.image}
                    alt=""
                    className="h-full w-full object-cover object-top mix-blend-multiply sepia"
                    loading="lazy"
                  />
                </div>
                <h3 className="mt-3 text-[16px] font-medium tracking-[-0.025em]">{catalog.title}</h3>
                <p className="mt-1 text-[13px] text-black/65">{catalog.subtitle}</p>
                <p className="mt-1 text-[13px] font-medium">16 Samples – $5</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f3f1ec] px-5 py-16 text-[#202124] sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto grid max-w-[1500px] gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
          <div>
            <h2 className="text-[clamp(2.2rem,3vw,3.2rem)] font-normal tracking-[-0.045em]">
              About our samples catalogs
            </h2>
            <p className="mt-7 max-w-[660px] text-[15px] leading-6 text-black/76 sm:text-base">
              Recently we changed the way we offer fabric samples to our customers. We took this decision in order to offer a better service, more reliable. Now we ship our catalogs from different parts of the world so they can reach you faster.
            </p>
            <p className="mt-7 max-w-[660px] text-[15px] leading-6 text-black/76 sm:text-base">
              We will update our catalogs every quarter so you can have our best new arrivals
            </p>
          </div>

          <div className="border-t border-black/10">
            {faqs.map((faq) => (
              <details key={faq} className="group border-b border-black/10">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[15px] font-semibold">
                  <span>{faq}</span>
                  <span className="text-2xl font-light transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="pb-6 pr-10 text-sm leading-6 text-black/62">
                  Placeholder answer for RIVAADO. We can replace this with the final ordering, shipping and fabric-sample details.
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function FabricPackShowcase({ onNavigate }: { onNavigate: (section: SectionKey) => void }) {
  const [activeFabric, setActiveFabric] = useState(0)
  const [modal, setModal] = useState<null | 'weave' | 'feature'>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const fabrics = [
    { name: 'Yari', kind: 'Oxford', bg: 'linear-gradient(135deg,#171d35,#2a3154)' },
    { name: 'Miles', kind: 'Knitted', bg: 'radial-gradient(circle at 25% 25%,#fff 0 2px,transparent 2.5px),radial-gradient(circle at 75% 75%,#fff 0 2px,transparent 2.5px),#28345f', size: '18px 18px' },
    { name: 'Rees', kind: 'Brushed', bg: 'repeating-linear-gradient(135deg,#8fa2b7 0 3px,#607286 3px 6px)' },
    { name: 'Ruiz', kind: 'Brushed', bg: 'linear-gradient(135deg,#6e7454,#8a8e68)' },
    { name: 'Haris', kind: 'Poplin', bg: 'linear-gradient(135deg,#29241f,#423a35)' },
    { name: 'Coari', kind: 'Poplin', bg: 'linear-gradient(135deg,#4e2234,#6e3148)' },
    { name: 'Brandy', kind: 'Pinpoint', bg: 'linear-gradient(135deg,#8b1f35,#b42d46)' },
    { name: 'Declan', kind: 'Poplin', bg: 'linear-gradient(135deg,#41558f,#6e84c9)' },
    { name: 'Stonearby', kind: 'Double stripe', bg: 'repeating-linear-gradient(90deg,#7b8ce4 0 18px,#f7f7fb 18px 21px,#7b8ce4 21px 34px,#fff 34px 37px)' },
    { name: 'Mueller', kind: 'Knitted', bg: 'repeating-linear-gradient(135deg,#d6d6d6 0 2px,#bdbdbd 2px 4px)' },
    { name: 'Cupstock', kind: 'Oxford', bg: 'linear-gradient(135deg,#e7a8c7,#f0c7d9)' },
    { name: 'Bertram', kind: 'Cotton', bg: 'linear-gradient(135deg,#eee6d8,#f7f1e9)' },
    { name: 'Whirlwind', kind: 'Linen Blends', bg: 'repeating-linear-gradient(90deg,#e8e1d6 0 15px,#c8bdae 15px 22px,#f5f0e8 22px 32px)' },
    { name: 'Arlice', kind: 'Floral', bg: 'radial-gradient(circle at 30% 30%,#6f816c 0 2px,transparent 3px),radial-gradient(circle at 70% 60%,#9ba795 0 2px,transparent 3px),#f2f5ef' },
    { name: 'East Finchley', kind: 'Peach skin', bg: 'linear-gradient(135deg,#dce8f2,#f4f9fc)' },
    { name: 'Helton', kind: 'Linen–cotton', bg: 'repeating-linear-gradient(0deg,#f7f7f3 0 2px,#e5e5de 2px 4px)' },
  ]

  const active = fabrics[activeFabric]

  return (
    <>
      <section id="fabric-pack-detail" className="bg-[#d9b278] text-[#202124]">
        <div className="mx-auto grid min-h-[470px] max-w-[1500px] items-center gap-8 px-6 py-14 lg:grid-cols-[1fr_.85fr] lg:px-14">
          <div className="text-center lg:text-left lg:pl-28">
            <h2 className="text-[clamp(3rem,5vw,5rem)] font-normal tracking-[-0.055em]">Distinctive & Trendy</h2>
            <p className="mt-5 text-[clamp(1.4rem,2vw,2rem)]">Dress Shirts</p>
          </div>
          <div className="relative hidden h-full min-h-[360px] overflow-hidden lg:block">
            <img
              src="/looks/look-04-blue-shirt-scarf.webp"
              alt="Distinctive and Trendy catalogue placeholder"
              className="absolute inset-0 h-full w-full object-cover object-top mix-blend-multiply sepia"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-14 text-[#202124] sm:px-8 lg:px-10 lg:py-16">
        <div className="mx-auto grid max-w-[1500px] gap-10 lg:grid-cols-[1.4fr_.6fr] lg:items-start">
          <div>
            <p className="max-w-[850px] text-[15px] leading-6 text-black/78 sm:text-base">
              A fresh take on smart casual shirting, this pack showcases unique weaves, relaxed textures, and bold shades. From breathable linens and flannels to easy-iron knits and colorful oxfords, each fabric offers a distinctive look with a modern twist—perfect for standing out at the office or off-duty events.
            </p>
            <p className="mt-7 text-[15px] text-black/72 sm:text-base">Click on each fabric to know more</p>
          </div>

          <div className="text-center lg:text-right">
            <p className="text-[15px]">Catalog price inc. shipping <span className="font-semibold">$5</span></p>
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="mt-5 rounded-full bg-[#ff7200] px-12 py-3 text-base font-medium text-white"
            >
              Order this catalog
            </button>
            <button
              type="button"
              onClick={() => document.getElementById('fabric-pack-detail')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="mt-5 block w-full text-sm underline underline-offset-3 lg:text-right"
            >
              &lt; Go back
            </button>
          </div>
        </div>
      </section>

      <section className="bg-[#f6f6f4] text-[#202124]">
        <div className="grid lg:grid-cols-[385px_1fr]">
          <div className="border-r border-black/6 bg-[#f7f7f6] px-5 py-6 lg:px-6">
            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
              {fabrics.map((fabric, index) => (
                <button
                  type="button"
                  key={fabric.name}
                  onClick={() => setActiveFabric(index)}
                  className="text-left"
                >
                  <div className={`aspect-[1.35] w-full rounded-md border-2 p-[2px] ${index === activeFabric ? 'border-black/35' : 'border-transparent'}`}>
                    <div
                      className="h-full w-full rounded-[4px]"
                      style={{ background: fabric.bg, backgroundSize: 'size' in fabric ? fabric.size : undefined }}
                    />
                  </div>
                  <div className="mt-2 text-[16px] font-medium leading-none">{fabric.name}</div>
                  <div className="mt-1 text-xs text-black/55">{fabric.kind}</div>
                </button>
              ))}
            </div>
          </div>

          <div
            className="relative min-h-[820px] overflow-hidden px-6 py-10 sm:min-h-[900px] lg:min-h-[1120px] lg:px-14 lg:py-14"
            style={{
              background: active.bg,
              backgroundSize: 'size' in active ? active.size : 'auto',
            }}
          >
            <div className="absolute inset-0 bg-black/18" />
            <div className="relative flex min-h-[760px] items-end justify-center sm:min-h-[840px] lg:min-h-[1040px]">
              <div className={`w-full max-w-[1040px] bg-white px-8 shadow-[0_2px_14px_rgba(0,0,0,.08)] transition-all duration-300 sm:px-10 ${detailsOpen ? 'py-9' : 'py-8'}`}>
                <div className="flex items-start justify-between gap-8">
                  <h3 className="text-[28px] font-semibold tracking-[-0.03em]">{active.name}.</h3>
                  <button
                    type="button"
                    onClick={() => setDetailsOpen((current) => !current)}
                    className="text-center text-xs text-black/45"
                  >
                    <span className="mx-auto flex h-6 w-6 items-center justify-center rounded-full border border-black/35 text-sm">i</span>
                    <span className="mt-1 block">{detailsOpen ? <>Hide<br />Details</> : <>More<br />info</>}</span>
                  </button>
                </div>

                <div className="mt-8 flex flex-wrap gap-x-14 gap-y-7">
                  <button type="button" onClick={() => setModal('weave')} className="text-center">
                    <div className="text-2xl">▦</div>
                    <div className="mt-1 text-sm">{active.kind}</div>
                  </button>
                  <button type="button" className="text-center">
                    <div className="text-2xl">◉</div>
                    <div className="mt-1 text-sm">Cotton</div>
                  </button>
                  <button type="button" className="text-center">
                    <div className="text-2xl">❄</div>
                    <div className="mt-1 text-sm">Winter</div>
                  </button>
                  <button type="button" onClick={() => setModal('feature')} className="text-center">
                    <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-black text-[9px] font-bold text-white">OEKO<br />TEX</div>
                    <div className="mt-1 text-sm">Oeko Tex</div>
                  </button>
                </div>

                {detailsOpen ? (
                  <div className="mt-9 grid gap-x-10 gap-y-3 border-t border-black/5 pt-6 text-[14px] leading-5 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-3">
                      <p><span className="font-semibold">Tone:</span> Navy Blue</p>
                      <p><span className="font-semibold">Pattern:</span> Solid</p>
                      <button type="button" onClick={() => setModal('weave')} className="text-left">
                        <span className="font-semibold">Weave:</span> {active.kind} <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-black/60 text-[10px] text-white">i</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      <p><span className="font-semibold">Category:</span> Essential <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-black/60 text-[10px] text-white">i</span></p>
                      <p><span className="font-semibold">Seasonality:</span> Winter</p>
                      <p><span className="font-semibold">Suggested occasion:</span> Smart casual, Casual</p>
                    </div>

                    <div className="space-y-3">
                      <button type="button" onClick={() => setModal('feature')} className="block text-left">
                        <span className="font-semibold">Features:</span> Oeko Tex <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-black/60 text-[10px] text-white">i</span>
                      </button>
                      <p><span className="font-semibold">Weight:</span> 5.43 oz/yd²</p>
                      <p><span className="font-semibold">Composition:</span> Cotton (100% Cotton)</p>
                    </div>

                    <div className="space-y-3">
                      <p><span className="font-semibold">Opacity:</span> Very Opaque</p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      {modal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/65 px-5">
          <div className="relative w-full max-w-[720px] rounded-[14px] bg-white px-7 py-8 text-[#202124] shadow-2xl sm:px-10 sm:py-10">
            <button
              type="button"
              onClick={() => setModal(null)}
              aria-label="Close information"
              className="absolute right-6 top-5 text-4xl font-light text-black/55"
            >
              ×
            </button>

            {modal === 'weave' ? (
              <>
                <h3 className="text-[28px] font-medium tracking-[-0.03em]">Weave</h3>
                <h4 className="mt-7 text-[24px] font-semibold">{active.kind}</h4>
                <p className="mt-4 max-w-[620px] text-sm leading-6 text-black/72 sm:text-[15px]">
                  {active.kind} is a woven dress-shirt fabric with a visible texture and a comfortable hand. This placeholder description mirrors the information panel shown in your reference and can be replaced later with the exact RIVAADO fabric specification.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-[28px] font-medium tracking-[-0.03em]">Features</h3>
                <h4 className="mt-7 text-[24px] font-semibold">Oeko Tex</h4>
                <p className="mt-4 max-w-[620px] text-sm leading-6 text-black/72 sm:text-[15px]">
                  Independent certification placeholder indicating that textile components and production processes meet defined health and environmental requirements.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

function SiteFooter() {
  return (
    <footer className="bg-white text-[#202124]">
      <div className="px-5 py-14 sm:px-8 lg:px-10 lg:py-16">
        <div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[1.75fr_.62fr_.62fr_.62fr_.62fr]">
          <div className="max-w-[430px]">
            <h3 className="text-sm font-semibold">Subscribe To Our Newsletter To Get Updates</h3>
            <div className="mt-7 flex border-b border-black/55 pb-3">
              <input aria-label="Email Address" placeholder="Email Address" className="w-full bg-transparent text-lg outline-none placeholder:text-black/50" />
              <button type="button" aria-label="Subscribe" className="text-xl">→</button>
            </div>
          </div>

          <FooterColumn title="Men's Store" items={['Custom Suits','Custom Dress Shirts','Custom Blazers','Custom Pants','Overcoats','Other products']} />
          <FooterColumn title="Women" items={["Women's Suits","Women's Dress Shirt","Women's Blazers","Women's Dress Pants","Women's Wool Coats",'Other products']} />
          <FooterColumn title="Company" items={['About us','How it works','Perfect Fit Guarantee','RIVAADO Blog']} />
          <FooterColumn title="Support" items={['Contact us','Order fabric samples','Track order','FAQs']} />
        </div>

        <div className="mx-auto mt-14 grid max-w-[1500px] gap-10 lg:grid-cols-[1.75fr_1fr_1fr]">
          <div className="hidden lg:block" />

          <div>
            <h3 className="text-sm font-semibold">Payment Methods</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {['VISA','MC','Pay','AMEX','Klarna.'].map((method) => (
                <span key={method} className="flex h-10 min-w-[58px] items-center justify-center border border-black/10 bg-white px-2 text-xs font-bold shadow-sm">
                  {method}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Shipping Partners</h3>
            <div className="mt-4 flex gap-3">
              <span className="flex h-10 min-w-[72px] items-center justify-center bg-[#f4c400] px-3 text-xs font-black italic">DHL</span>
              <span className="flex h-10 min-w-[72px] items-center justify-center bg-[#4d2584] px-3 text-xs font-black text-white">FedEx</span>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 grid max-w-[1500px] gap-8 lg:grid-cols-[1.75fr_2fr]">
          <div className="flex items-end">
            <div className="flex items-center gap-[18px] text-[#202624]">
              <Instagram size={19} strokeWidth={1.8} />
              <Facebook size={19} strokeWidth={1.8} />
              <span className="flex h-[19px] w-[19px] items-center justify-center rounded-full border border-current text-[10px] font-semibold">X</span>
              <span className="flex h-[19px] w-[19px] items-center justify-center rounded-full border border-current text-[9px] font-semibold">P</span>
              <span className="flex h-[19px] w-[19px] items-center justify-center rounded-full border border-current text-[9px] font-semibold">♪</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Other Highlights</h3>
            <div className="mt-4 flex h-[150px] w-[90px] flex-col items-center justify-center border border-[#7c5d96] bg-[#eee9f3] text-center text-[9px] font-semibold text-[#54346d]">
              <div className="text-[11px]">DIGITAL</div>
              <div>COMMERCE</div>
              <div>AWARD</div>
              <div className="mt-2 text-[13px]">Winner</div>
              <div>2026</div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-black/6 bg-[#f3f1ec] px-5 py-4 text-xs text-black/58 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span>Copyright 2026 RIVAADO</span>
          <span>Terms and Conditions | Privacy Policy</span>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="mt-5 space-y-3 text-sm text-black/60">
        {items.map((item) => (
          <button type="button" key={item} className="block text-left hover:text-black">{item}</button>
        ))}
      </div>
    </div>
  )
}

function TailoringTechSection({ onExplore }: { onExplore: () => void }) {
  return (
    <section className="bg-[#f5f3ee] px-5 py-20 text-[#1f2826] sm:px-10 sm:py-24 lg:px-20 lg:py-28">
      <div className="mx-auto grid max-w-[1440px] items-center gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
        <div className="max-w-xl">
          <h2 className="text-[clamp(3rem,4.65vw,5rem)] font-normal leading-[1.02] tracking-[-0.05em]">
            High-tech tailoring for every body
          </h2>
          <p className="mt-8 max-w-[31rem] text-[15px] leading-7 text-[#1f2826]/78 sm:text-base sm:leading-8">
            When your clothes are made with care, you can feel it. Before our tailors cut your piece, RIVAADO brings your measurements, cloth and finishing details together so the fit is considered from the very first step.
          </p>
          <button
            type="button"
            onClick={onExplore}
            className="mt-8 rounded-full border border-[#1f2826]/55 px-7 py-3 text-sm font-medium transition hover:bg-[#1f2826] hover:text-white"
          >
            Know more
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

const demoSuitImages = [
  '/looks/look-06-navy-open-suit.webp',
  '/looks/look-05-plaid-blazer.webp',
  '/looks/look-03-pastel-pink-suit.webp',
  '/looks/look-02-textured-tuxedo.webp',
  '/looks/look-08-leather-sleeve-coat.webp',
  '/looks/look-07-teal-shirt-vest.webp',
  '/looks/look-01-leopard-shirt.webp',
  '/looks/look-04-blue-shirt-scarf.webp',
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
    if (true || !isVisible || !pageVisible || prefersReducedMotion) return

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
  const previewImage = demoSuitImages[config.fabric % demoSuitImages.length]
  const panelIndex = panel === 'fabric' ? 0 : panel === 'style' ? 1 : 2

  const openPanel = (next: ConfiguratorPanelKey) => {
    setPanel(next)
    panelScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div ref={rootRef} className="relative mx-auto w-full max-w-[920px]">
      <div className="relative aspect-[1.62] min-h-[390px] overflow-hidden rounded-[1.35rem] border-[6px] border-[#28302e] bg-white shadow-[0_28px_70px_rgba(26,35,32,0.14)] sm:min-h-[500px]">
        <div className="absolute inset-x-0 top-0 z-20 flex h-12 items-center justify-center border-b border-black/8 bg-white">
          <div className="flex items-center gap-7 text-[9px] font-bold uppercase tracking-[0.18em] text-black/35 sm:gap-10 sm:text-[10px]">
            {([
              ['fabric', 'Fabric'],
              ['style', 'Style'],
              ['finish', 'Accents'],
            ] as const).map(([key, label], index) => (
              <button key={key} type="button" onClick={() => openPanel(key)} className={`relative pb-1 ${index === panelIndex ? 'text-black' : 'hover:text-black/70'}`}>
                {label}
                <span className={`absolute inset-x-0 -bottom-1 mx-auto h-[2px] origin-left bg-[#a85b44] transition-transform duration-300 ${index === panelIndex ? 'scale-x-100' : 'scale-x-0'}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="absolute inset-0 pt-12">
          <div className="grid h-full grid-cols-[0.88fr_1.12fr] sm:grid-cols-[0.88fr_1.2fr_0.52fr]">
            <div className="relative overflow-hidden border-r border-black/8 bg-[#fafafa]">
              <ConfiguratorPanel
                refEl={panelScrollRef}
                panel={panel}
                config={config}
                applyConfig={applyConfig}
              />
            </div>

            <div className="relative flex items-center justify-center bg-white">
              <img
                src={previewImage}
                alt="RIVAADO bespoke tailoring preview"
                className="h-[92%] w-[90%] object-contain object-center transition-all duration-700"
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
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black sm:text-sm">CUSTOM SUIT</div>
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
          className="hidden config-cursor absolute z-40 h-5 w-5 transition-[left,top] duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
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
