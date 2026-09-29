import { useEffect, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

type SectionKey = 'home' | 'about' | 'men' | 'women' | 'accessories' | 'contact'
type ProductKind = 'men' | 'women' | 'accessories'
type ProductShape =
  | 'suit'
  | 'shirt'
  | 'tuxedo'
  | 'overcoat'
  | 'ceremonial'
  | 'pantsuit'
  | 'skirt-suit'
  | 'dress'
  | 'blouse'
  | 'coat'
  | 'shoe'
  | 'tie'
  | 'cuff'
  | 'belt'
  | 'square'
  | 'lapel'

type ProductOption = {
  name: string
  label: string
  caption: string
  description: string
  priceTop: string
  priceBottom: string
  background: string
  glow: string
  garment: string
  shadow: string
  accent: string
  text: 'light' | 'dark'
  shape: ProductShape
}

type ProductShowcaseData = {
  key: ProductKind
  eyebrow: string
  title: string
  sizes: string[]
  options: ProductOption[]
}

const NAV_ITEMS: { label: string; key: SectionKey }[] = [
  { label: 'Home', key: 'home' },
  { label: 'About', key: 'about' },
  { label: 'Men', key: 'men' },
  { label: 'Women', key: 'women' },
  { label: 'Accessories', key: 'accessories' },
  { label: 'Contact', key: 'contact' },
]

const HERO_VIDEO = {
  desktop: '/video/rivaado-hero-desktop.mp4',
  mobile: '/video/rivaado-hero-mobile.mp4',
  poster: '/video/rivaado-hero-poster.jpg',
  mobilePoster: '/video/rivaado-hero-poster-mobile.jpg',
}

const PRODUCTS: Record<ProductKind, ProductShowcaseData> = {
  men: {
    key: 'men',
    eyebrow: 'Men / Bespoke',
    title: 'Wear Confidence Define Your Style.',
    sizes: ['S', 'M', 'L', 'XL'],
    options: [
      {
        name: 'Bespoke Suit',
        label: 'Suit',
        caption: 'Structured Fit.\nModern Presence.',
        description: 'Two-piece and three-piece suits shaped around posture, proportion and personal style.',
        priceTop: 'FROM $1,250',
        priceBottom: 'FULL BESPOKE',
        background: '#d70055',
        glow: 'rgba(255,255,255,0.28)',
        garment: '#111111',
        shadow: '#050505',
        accent: '#d5ac50',
        text: 'light',
        shape: 'suit',
      },
      {
        name: 'Dress Shirt',
        label: 'Shirt',
        caption: 'Clean Collar.\nPrecise Lines.',
        description: 'Custom shirts with sharp collars, premium cotton, exact sleeve length and a clean body fit.',
        priceTop: 'FROM $220',
        priceBottom: 'CUSTOM FIT',
        background: '#e8e4dc',
        glow: 'rgba(255,255,255,0.62)',
        garment: '#f8f6ef',
        shadow: '#bdb4a6',
        accent: '#c79b37',
        text: 'dark',
        shape: 'shirt',
      },
      {
        name: 'Classic Tuxedo',
        label: 'Tuxedo',
        caption: 'Black Tie.\nSharp Finish.',
        description: 'Formal tuxedos with satin lapels, balanced shoulders and evening proportions.',
        priceTop: 'FROM $1,450',
        priceBottom: 'EVENING WEAR',
        background: '#101010',
        glow: 'rgba(255,255,255,0.16)',
        garment: '#060606',
        shadow: '#000000',
        accent: '#d5ac50',
        text: 'light',
        shape: 'tuxedo',
      },
      {
        name: 'Long Overcoat',
        label: 'Overcoat',
        caption: 'Quiet Power.\nTailored Warmth.',
        description: 'Long coats built to sit cleanly over tailoring with weight, warmth and structure.',
        priceTop: 'FROM $1,600',
        priceBottom: 'OUTERWEAR',
        background: '#3e3935',
        glow: 'rgba(255,255,255,0.18)',
        garment: '#2e2925',
        shadow: '#11100f',
        accent: '#d5ac50',
        text: 'light',
        shape: 'overcoat',
      },
      {
        name: 'Ceremonial Wear',
        label: 'Ceremony',
        caption: 'Heritage Cut.\nOccasion Ready.',
        description: 'Traditional and ceremonial silhouettes tailored for weddings, events and statement entrances.',
        priceTop: 'FROM $1,800',
        priceBottom: 'SPECIAL ORDER',
        background: '#9d7427',
        glow: 'rgba(255,255,255,0.2)',
        garment: '#d4a94a',
        shadow: '#6a4914',
        accent: '#fff0b6',
        text: 'dark',
        shape: 'ceremonial',
      },
    ],
  },
  women: {
    key: 'women',
    eyebrow: 'Women / Bespoke',
    title: 'Wear Confidence Define Your Style.',
    sizes: ['XS', 'S', 'M', 'L'],
    options: [
      {
        name: 'Power Pantsuit',
        label: 'Pantsuit',
        caption: 'Strong Line.\nSoft Finish.',
        description: 'Tailored pantsuits with a strong shoulder, refined waist and modern wide-leg balance.',
        priceTop: 'FROM $1,100',
        priceBottom: 'CUSTOM FIT',
        background: '#0b4a3f',
        glow: 'rgba(255,255,255,0.2)',
        garment: '#0e5b4e',
        shadow: '#052a24',
        accent: '#d5ac50',
        text: 'light',
        shape: 'pantsuit',
      },
      {
        name: 'Ivory Skirt Suit',
        label: 'Skirt Suit',
        caption: 'Elegant Shape.\nSharp Finish.',
        description: 'Skirt suits with clean tailoring, precise waist shaping and a feminine formal silhouette.',
        priceTop: 'FROM $980',
        priceBottom: 'BESPOKE SET',
        background: '#ebe7dc',
        glow: 'rgba(255,255,255,0.62)',
        garment: '#f5f2e8',
        shadow: '#b9b2a4',
        accent: '#c8a15b',
        text: 'dark',
        shape: 'skirt-suit',
      },
      {
        name: 'Evening Dress',
        label: 'Dress',
        caption: 'One Line.\nFull Presence.',
        description: 'Elegant dresses cut for ceremony, evening wear and polished social occasions.',
        priceTop: 'FROM $1,200',
        priceBottom: 'OCCASION WEAR',
        background: '#8c132d',
        glow: 'rgba(255,255,255,0.18)',
        garment: '#9e1835',
        shadow: '#4b0718',
        accent: '#d5ac50',
        text: 'light',
        shape: 'dress',
      },
      {
        name: 'Silk Blouse',
        label: 'Blouse',
        caption: 'Clean Collar.\nSoft Drape.',
        description: 'Blouses and shirts with refined collars, elegant drape and tailored proportion.',
        priceTop: 'FROM $260',
        priceBottom: 'MADE TO FIT',
        background: '#112f6f',
        glow: 'rgba(255,255,255,0.18)',
        garment: '#eef0fb',
        shadow: '#9ba3ca',
        accent: '#d5ac50',
        text: 'light',
        shape: 'blouse',
      },
      {
        name: 'Tailored Coat',
        label: 'Coat',
        caption: 'Layered Luxury.\nClean Structure.',
        description: 'Women’s coats with sculpted shoulders, shaped waistlines and clean long-line movement.',
        priceTop: 'FROM $1,450',
        priceBottom: 'OUTERWEAR',
        background: '#b57b52',
        glow: 'rgba(255,255,255,0.18)',
        garment: '#c89065',
        shadow: '#70452c',
        accent: '#ffe0a0',
        text: 'light',
        shape: 'coat',
      },
    ],
  },
  accessories: {
    key: 'accessories',
    eyebrow: 'Accessories / Finish',
    title: 'Wear Confidence Define Your Style.',
    sizes: ['One', 'Pair', 'Set', 'Custom'],
    options: [
      {
        name: 'Dress Shoes',
        label: 'Shoes',
        caption: 'Grounded Look.\nSharp Finish.',
        description: 'Polished footwear styling to complete formal, ceremonial and bespoke looks.',
        priceTop: 'FROM $280',
        priceBottom: 'PAIR',
        background: '#2c211d',
        glow: 'rgba(255,255,255,0.17)',
        garment: '#17110f',
        shadow: '#070504',
        accent: '#d5ac50',
        text: 'light',
        shape: 'shoe',
      },
      {
        name: 'Silk Tie',
        label: 'Tie',
        caption: 'Finish Clean.\nStand Out.',
        description: 'Silk ties matched to suiting, shirts and occasion styling.',
        priceTop: 'FROM $120',
        priceBottom: 'SILK',
        background: '#4f4039',
        glow: 'rgba(255,255,255,0.18)',
        garment: '#5a4840',
        shadow: '#2a211d',
        accent: '#d5ac50',
        text: 'light',
        shape: 'tie',
      },
      {
        name: 'Cufflinks',
        label: 'Cuffs',
        caption: 'Small Detail.\nBig Finish.',
        description: 'Cufflink details for formal shirts, tuxedos and ceremonial dressing.',
        priceTop: 'FROM $160',
        priceBottom: 'PAIR',
        background: '#caa149',
        glow: 'rgba(255,255,255,0.32)',
        garment: '#d5ad49',
        shadow: '#5f4617',
        accent: '#fff1b8',
        text: 'dark',
        shape: 'cuff',
      },
      {
        name: 'Leather Belt',
        label: 'Belt',
        caption: 'Clean Waist.\nFinished Fit.',
        description: 'Belts selected to finish trousers, suiting and full bespoke looks.',
        priceTop: 'FROM $180',
        priceBottom: 'LEATHER',
        background: '#11111f',
        glow: 'rgba(255,255,255,0.12)',
        garment: '#1b1715',
        shadow: '#050505',
        accent: '#d5ac50',
        text: 'light',
        shape: 'belt',
      },
      {
        name: 'Pocket Square',
        label: 'Pocket Square',
        caption: 'Layered Finish.\nComplete Look.',
        description: 'Pocket squares in refined tones for tuxedos, suits and event styling.',
        priceTop: 'FROM $95',
        priceBottom: 'SILK SET',
        background: '#e8e4dc',
        glow: 'rgba(255,255,255,0.54)',
        garment: '#f5f2e8',
        shadow: '#a79d90',
        accent: '#c79b37',
        text: 'dark',
        shape: 'square',
      },
      {
        name: 'Lapel Pin',
        label: 'Lapel Pin',
        caption: 'Quiet Accent.\nLuxury Touch.',
        description: 'Lapel pins and floral accents for formal, wedding and ceremonial looks.',
        priceTop: 'FROM $85',
        priceBottom: 'DETAIL',
        background: '#d70055',
        glow: 'rgba(255,255,255,0.25)',
        garment: '#d70055',
        shadow: '#650026',
        accent: '#d5ac50',
        text: 'light',
        shape: 'lapel',
      },
    ],
  },
}

const ABOUT_MARKERS = [
  ['1956', 'Custom suit tailoring begins.'],
  ['1964', 'Sunshine Tailors becomes the family house of fit.'],
  ['1978', 'The next generation learns the craft by hand.'],
  ['2012', 'Rivaado becomes a sharper modern identity.'],
  ['2022', 'Rivaado Bespoke Wear arrives in Calgary.'],
] as const

const sectionOrder: SectionKey[] = ['home', 'about', 'men', 'women', 'accessories', 'contact']

function getInitialSection(): SectionKey {
  if (typeof window === 'undefined') return 'home'
  const hash = window.location.hash.replace('#', '') as SectionKey
  return sectionOrder.includes(hash) ? hash : 'home'
}

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionKey>(getInitialSection)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 700)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 700)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const onHash = () => setActiveSection(getInitialSection())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const go = (key: SectionKey) => {
    setActiveSection(key)
    window.history.replaceState(null, '', key === 'home' ? window.location.pathname : `#${key}`)
  }

  const headerMode = activeSection === 'about' ? 'dark' : 'light'

  return (
    <main className="relative h-[100svh] w-full overflow-hidden bg-black" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Header activeSection={activeSection} mode={headerMode} onNavigate={go} />

      <div className="absolute inset-0">
        <Screen active={activeSection === 'home'}>
          <HomeScreen isMobile={isMobile} onExplore={() => go('men')} />
        </Screen>
        <Screen active={activeSection === 'about'}>
          <AboutScreen />
        </Screen>
        <Screen active={activeSection === 'men'}>
          <ProductShowcase data={PRODUCTS.men} />
        </Screen>
        <Screen active={activeSection === 'women'}>
          <ProductShowcase data={PRODUCTS.women} />
        </Screen>
        <Screen active={activeSection === 'accessories'}>
          <ProductShowcase data={PRODUCTS.accessories} />
        </Screen>
        <Screen active={activeSection === 'contact'}>
          <ContactScreen onBack={() => go('accessories')} />
        </Screen>
      </div>
    </main>
  )
}

function Header({ activeSection, mode, onNavigate }: { activeSection: SectionKey; mode: 'light' | 'dark'; onNavigate: (section: SectionKey) => void }) {
  const dark = mode === 'dark'

  return (
    <header className="absolute inset-x-0 top-0 z-50 px-4 py-4 sm:px-8 sm:py-6">
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full border px-4 py-3 shadow-2xl backdrop-blur-xl sm:px-6 ${
          dark ? 'border-black/10 bg-white/58 shadow-black/10' : 'border-white/30 bg-black/10 shadow-black/20'
        }`}
      >
        <button type="button" onClick={() => onNavigate('home')} className={`text-xs font-black uppercase tracking-[0.28em] sm:text-sm ${dark ? 'text-black' : 'text-white'}`}>
          RIVAADO
        </button>

        <nav className="hidden items-center gap-6 sm:flex lg:gap-8" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => onNavigate(item.key)}
              className={`text-[11px] font-black uppercase tracking-[0.2em] transition ${
                activeSection === item.key ? (dark ? 'text-black' : 'text-white') : dark ? 'text-black/50 hover:text-black' : 'text-white/68 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => onNavigate('contact')}
          className={`hidden rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.18em] transition sm:inline-flex ${
            dark ? 'border-black/40 text-black hover:bg-black hover:text-white' : 'border-white/58 text-white hover:bg-white hover:text-black'
          }`}
        >
          Book fitting
        </button>
      </div>

      <nav className="mx-auto mt-3 flex max-w-7xl gap-2 overflow-x-auto pb-1 sm:hidden" aria-label="Mobile navigation">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onNavigate(item.key)}
            className={`shrink-0 rounded-full border px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] backdrop-blur-md ${
              activeSection === item.key
                ? dark
                  ? 'border-black bg-black text-white'
                  : 'border-white bg-white text-black'
                : dark
                  ? 'border-black/15 bg-white/35 text-black/65'
                  : 'border-white/18 bg-black/20 text-white/85'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  )
}

function Screen({ active, children }: { active: boolean; children: ReactNode }) {
  return (
    <section className={`absolute inset-0 transition duration-500 ${active ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`} aria-hidden={!active}>
      {children}
    </section>
  )
}

function HomeScreen({ isMobile, onExplore }: { isMobile: boolean; onExplore: () => void }) {
  const src = isMobile ? HERO_VIDEO.mobile : HERO_VIDEO.desktop
  const poster = isMobile ? HERO_VIDEO.mobilePoster : HERO_VIDEO.poster

  return (
    <div className="relative h-full w-full overflow-hidden bg-black text-white">
      <video key={src} className="absolute inset-0 h-full w-full object-cover" src={src} poster={poster} autoPlay muted loop playsInline preload="auto" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.05),transparent_38%),linear-gradient(180deg,rgba(0,0,0,0.46)_0%,rgba(0,0,0,0.08)_42%,rgba(0,0,0,0.86)_100%)]" />
      <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-8 sm:px-10 sm:pb-12">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.32em] text-white/70">Bespoke tailoring house</p>
        <h1 className="max-w-5xl uppercase leading-[0.82] tracking-[-0.06em] text-white" style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(4.5rem, 14vw, 13rem)' }}>
          Rivaado
        </h1>
        <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-xl text-sm leading-6 text-white/75 sm:text-base sm:leading-7">
            A cinematic bespoke experience for men and women — tailoring, couture, accessories and made-to-measure presence.
          </p>
          <button
            type="button"
            onClick={onExplore}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/60 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-black"
          >
            Explore showcase
            <ArrowRight size={16} strokeWidth={2.25} />
          </button>
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
          <h2 className="max-w-3xl text-5xl leading-[0.9] tracking-[-0.04em] text-black sm:text-7xl" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            Seventy years of cloth, cut and quiet confidence.
          </h2>
          <p className="mt-7 max-w-xl text-sm font-semibold leading-7 text-black/58 sm:text-base">
            Rivaado is built from family craft, precise measurement and modern luxury. The garment is the product, but presence is the outcome.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-5 lg:h-[560px] lg:items-end">
          {ABOUT_MARKERS.map(([year, body], index) => (
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

function ProductShowcase({ data }: { data: ProductShowcaseData }) {
  const [optionIndex, setOptionIndex] = useState(0)
  const option = data.options[optionIndex]
  const darkText = option.text === 'dark'
  const sectionStyle: CSSProperties = {
    background: `${option.background}`,
    color: darkText ? '#101010' : '#ffffff',
  }

  const previousOption = () => setOptionIndex((current) => (current + data.options.length - 1) % data.options.length)
  const nextOption = () => setOptionIndex((current) => (current + 1) % data.options.length)

  return (
    <div className="relative h-full w-full overflow-hidden px-5 pt-28 transition-colors duration-500 sm:px-10" style={sectionStyle}>
      <div
        className="absolute inset-0 transition duration-500"
        style={{
          background: `radial-gradient(circle at 52% 42%, ${option.glow}, transparent 32%), radial-gradient(circle at 18% 86%, rgba(0,0,0,0.16), transparent 27%), linear-gradient(180deg, rgba(255,255,255,0.06), rgba(0,0,0,0.08))`,
        }}
      />

      <div className="relative z-10 mx-auto grid h-full max-w-7xl items-center gap-6 lg:grid-cols-[0.86fr_1.25fr_0.72fr]">
        <div className="relative z-20 pt-12 sm:pt-0">
          <p className={`mb-4 text-xs font-black uppercase tracking-[0.28em] ${darkText ? 'text-black/48' : 'text-white/70'}`}>{data.eyebrow}</p>
          <h2 className="max-w-md text-4xl leading-[0.95] tracking-[-0.04em] sm:text-5xl" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            {option.label}
          </h2>
          <p className={`mt-6 max-w-md text-sm font-semibold leading-7 sm:text-base ${darkText ? 'text-black/60' : 'text-white/76'}`}>{option.description}</p>

          <button type="button" className={`mt-8 rounded-full px-7 py-4 text-xs font-black uppercase tracking-[0.18em] ${darkText ? 'bg-black text-white' : 'bg-white text-black'}`}>
            Book fitting
          </button>

          <div className="mt-8 flex items-center gap-3" aria-label={`${data.key} options`}>
            {data.options.map((item, index) => (
              <button
                key={item.name}
                type="button"
                onClick={() => setOptionIndex(index)}
                aria-label={item.name}
                title={item.label}
                className={`h-6 w-6 rounded-full border-2 transition ${index === optionIndex ? (darkText ? 'border-black scale-110' : 'border-white scale-110') : darkText ? 'border-black/30' : 'border-white/45'}`}
                style={{ backgroundColor: item.garment }}
              />
            ))}
          </div>

          <div className={`mt-5 text-xs font-black uppercase tracking-[0.18em] ${darkText ? 'text-black/46' : 'text-white/55'}`}>{option.name}</div>
        </div>

        <div className="relative flex min-h-[50vh] items-center justify-center lg:min-h-[680px]">
          <button
            type="button"
            onClick={previousOption}
            aria-label={`Previous ${data.key} option`}
            className={`absolute left-0 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full transition hover:scale-105 ${darkText ? 'bg-black/12 text-black' : 'bg-white/18 text-white'}`}
          >
            <ArrowLeft size={22} strokeWidth={2.4} />
          </button>

          <ProductIllustration productKey={data.key} option={option} />

          <button
            type="button"
            onClick={nextOption}
            aria-label={`Next ${data.key} option`}
            className={`absolute right-0 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full transition hover:scale-105 ${darkText ? 'bg-black/12 text-black' : 'bg-white/18 text-white'}`}
          >
            <ArrowRight size={22} strokeWidth={2.4} />
          </button>
        </div>

        <div className="relative z-20 hidden lg:block">
          <p className={`mb-3 text-xs font-black uppercase tracking-[0.24em] ${darkText ? 'text-black/50' : 'text-white/68'}`}>Starting at</p>
          <p className="text-3xl font-black uppercase leading-tight">{option.priceTop}</p>
          <p className="text-sm font-black uppercase opacity-80">{option.priceBottom}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            {data.sizes.map((size) => (
              <span key={size} className={`flex h-16 min-w-16 items-center justify-center rounded-full px-4 text-xs font-black uppercase ${darkText ? 'bg-black text-white' : 'bg-white text-black'}`}>
                {size}
              </span>
            ))}
          </div>

          <div className={`mt-10 flex h-32 w-32 items-center justify-center rounded-[2rem] border ${darkText ? 'border-black/24' : 'border-white/36'}`}>
            <MiniProduct productKey={data.key} option={option} />
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductIllustration({ productKey, option }: { productKey: ProductKind; option: ProductOption }) {
  const slug = `${productKey}-${option.name.replace(/\s+/g, '-')}`
  const isAccessory = productKey === 'accessories'
  const lapel = option.text === 'dark' ? '#2d2d2d' : '#101010'
  const stroke = option.text === 'dark' ? '#6f675c' : '#787878'

  return (
    <div className="relative flex h-[56vh] min-h-[430px] w-full items-center justify-center lg:h-[72vh]">
      <svg className="h-full max-h-[680px] w-full max-w-[520px] drop-shadow-2xl" viewBox="0 0 520 700" role="img" aria-label={option.name}>
        <defs>
          <linearGradient id={`cloth-${slug}`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={option.garment} />
            <stop offset="64%" stopColor={option.garment} />
            <stop offset="100%" stopColor={option.shadow} />
          </linearGradient>
          <filter id={`shadow-${slug}`} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="30" stdDeviation="24" floodColor="#000000" floodOpacity="0.22" />
          </filter>
        </defs>

        {!isAccessory && (
          <>
            <path d="M260 72 C260 38 298 42 298 22" fill="none" stroke={option.accent} strokeWidth="14" strokeLinecap="round" />
            <path d="M162 118 Q260 62 358 118" fill="none" stroke={option.accent} strokeWidth="17" strokeLinecap="round" />
          </>
        )}
        <ellipse cx="260" cy="626" rx="136" ry="22" fill="#000" opacity="0.18" />

        <g filter={`url(#shadow-${slug})`}>
          {renderShape(option, `url(#cloth-${slug})`, lapel, stroke)}
        </g>
      </svg>

      <div className={`absolute bottom-[8%] text-center text-sm font-black leading-tight ${option.text === 'dark' ? 'text-black/62' : 'text-white/72'}`}>
        {option.caption.split('\n').map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>
    </div>
  )
}

function renderShape(option: ProductOption, fill: string, lapel: string, stroke: string) {
  switch (option.shape) {
    case 'shirt':
    case 'blouse':
      return (
        <>
          <path d="M156 136 L232 108 L260 146 L288 108 L364 136 L400 266 L348 296 L336 610 Q320 642 260 642 Q200 642 184 610 L172 296 L120 266 Z" fill={fill} />
          <path d="M232 108 L260 146 L288 108 L304 176 L260 204 L216 176 Z" fill="#ffffff" opacity="0.75" />
          <path d="M260 150 L260 610" stroke={stroke} strokeWidth="5" opacity="0.62" />
          {[246, 306, 366, 426].map((cy) => <circle key={cy} cx="260" cy={cy} r="7" fill={stroke} opacity="0.72" />)}
        </>
      )
    case 'overcoat':
    case 'coat':
      return (
        <>
          <path d="M132 128 L225 100 L260 146 L295 100 L388 128 L430 250 L374 294 L362 628 Q344 658 260 658 Q176 658 158 628 L146 294 L90 250 Z" fill={fill} />
          <path d="M228 108 L260 150 L292 108 L318 244 L260 282 L202 244 Z" fill={lapel} opacity="0.65" />
          <path d="M260 148 L260 632" stroke={stroke} strokeWidth="6" opacity="0.62" />
          <path d="M178 350 Q260 392 342 350" fill="none" stroke={stroke} strokeWidth="7" opacity="0.35" />
        </>
      )
    case 'ceremonial':
      return (
        <>
          <path d="M150 128 L230 108 L260 136 L290 108 L370 128 L392 590 Q376 650 260 650 Q144 650 128 590 Z" fill={fill} />
          <path d="M260 142 L260 612" stroke={option.accent} strokeWidth="6" opacity="0.7" />
          {[196, 248, 300, 352, 404].map((cy) => <circle key={cy} cx="260" cy={cy} r="7" fill={option.accent} opacity="0.9" />)}
          <path d="M185 188 Q260 226 335 188" stroke={option.accent} strokeWidth="6" fill="none" opacity="0.45" />
          <path d="M182 466 Q260 510 338 466" stroke={option.accent} strokeWidth="6" fill="none" opacity="0.35" />
        </>
      )
    case 'skirt-suit':
      return (
        <>
          <path d="M150 134 L230 108 L260 144 L290 108 L370 134 L410 246 L356 286 L336 404 Q310 428 260 428 Q210 428 184 404 L164 286 L110 246 Z" fill={fill} />
          <path d="M198 430 L322 430 L368 640 L152 640 Z" fill={fill} />
          <path d="M232 110 L260 148 L288 110 L302 192 L260 224 L218 192 Z" fill={lapel} opacity="0.66" />
          <path d="M260 148 L260 414" stroke={stroke} strokeWidth="5" opacity="0.64" />
        </>
      )
    case 'dress':
      return (
        <>
          <path d="M218 112 L260 146 L302 112 L340 288 L390 650 L130 650 L180 288 Z" fill={fill} />
          <path d="M218 112 L260 148 L302 112 L286 192 L260 216 L234 192 Z" fill={lapel} opacity="0.45" />
          <path d="M260 148 L260 620" stroke={stroke} strokeWidth="4" opacity="0.42" />
        </>
      )
    case 'pantsuit':
    case 'suit':
    case 'tuxedo':
      return (
        <>
          <path d="M151 134 L232 106 L260 142 L288 106 L369 134 L425 256 L363 296 L357 596 Q356 630 324 650 L196 650 Q164 630 163 596 L157 296 L95 256 Z" fill={fill} />
          <path d="M232 106 L260 142 L288 106 L300 194 L260 230 L220 194 Z" fill={lapel} opacity="0.75" />
          <path d="M226 122 L260 154 L294 122" fill="none" stroke={stroke} strokeWidth="8" strokeLinecap="round" />
          <path d="M260 146 L260 612" fill="none" stroke={stroke} strokeWidth="5" opacity="0.72" />
          {[230, 290, 352].map((cy) => <circle key={cy} cx="260" cy={cy} r="8" fill={stroke} />)}
          <path d="M172 318 Q260 354 348 318" fill="none" stroke={stroke} strokeWidth="6" opacity="0.35" />
          <path d="M174 440 Q260 480 346 440" fill="none" stroke={stroke} strokeWidth="6" opacity="0.28" />
        </>
      )
    case 'shoe':
      return (
        <>
          <path d="M128 422 C210 398 282 406 356 438 C392 454 418 486 420 524 C328 552 224 552 104 528 C102 480 104 442 128 422 Z" fill={fill} />
          <path d="M162 430 C220 396 268 378 318 386 C344 392 365 412 382 442 C300 430 228 434 146 466 Z" fill={option.shadow} opacity="0.72" />
          <path d="M154 506 C242 524 328 526 410 510" stroke={option.accent} strokeWidth="7" fill="none" opacity="0.65" />
        </>
      )
    case 'tie':
      return (
        <>
          <path d="M228 116 L292 116 L310 306 L260 606 L210 306 Z" fill={fill} />
          <path d="M226 116 L294 116 L280 170 L260 154 L240 170 Z" fill={lapel} opacity="0.64" />
          <path d="M260 156 L260 570" stroke={option.accent} strokeWidth="5" opacity="0.45" />
        </>
      )
    case 'cuff':
      return (
        <>
          <circle cx="220" cy="350" r="78" fill={fill} />
          <circle cx="306" cy="350" r="78" fill={fill} opacity="0.84" />
          <circle cx="220" cy="350" r="34" fill={option.accent} opacity="0.75" />
          <circle cx="306" cy="350" r="34" fill={option.accent} opacity="0.75" />
        </>
      )
    case 'belt':
      return (
        <>
          <path d="M96 320 H370 Q418 320 418 368 Q418 416 370 416 H96 Z" fill={fill} />
          <rect x="328" y="296" width="112" height="144" rx="28" fill="none" stroke={option.accent} strokeWidth="16" />
          <path d="M124 368 H336" stroke={option.accent} strokeWidth="7" opacity="0.45" />
        </>
      )
    case 'square':
      return (
        <>
          <path d="M156 186 L368 136 L340 562 L120 506 Z" fill={fill} />
          <path d="M156 186 L254 300 L368 136" stroke={option.accent} strokeWidth="8" fill="none" opacity="0.55" />
          <path d="M124 506 L248 368 L340 562" stroke={option.accent} strokeWidth="8" fill="none" opacity="0.45" />
        </>
      )
    case 'lapel':
      return (
        <>
          <circle cx="260" cy="330" r="92" fill={fill} />
          <circle cx="220" cy="292" r="56" fill={option.shadow} opacity="0.75" />
          <circle cx="306" cy="292" r="56" fill={option.shadow} opacity="0.75" />
          <path d="M260 414 C250 494 222 544 188 606" stroke={option.accent} strokeWidth="12" fill="none" strokeLinecap="round" />
          <path d="M260 414 C292 492 328 538 382 594" stroke={option.accent} strokeWidth="9" fill="none" strokeLinecap="round" opacity="0.7" />
        </>
      )
  }
}

function MiniProduct({ productKey, option }: { productKey: ProductKind; option: ProductOption }) {
  return (
    <svg viewBox="0 0 120 160" className="h-24 w-24" aria-hidden="true">
      {productKey !== 'accessories' && <path d="M60 19 C60 7 76 8 76 2" fill="none" stroke={option.accent} strokeWidth="4" strokeLinecap="round" />}
      {option.shape === 'shoe' ? (
        <path d="M20 98 C42 88 70 90 96 104 C108 111 113 121 112 132 C80 140 44 138 12 130 C10 116 10 104 20 98 Z" fill={option.garment} />
      ) : option.shape === 'tie' ? (
        <path d="M52 24 L68 24 L74 70 L60 146 L46 70 Z" fill={option.garment} />
      ) : option.shape === 'cuff' ? (
        <><circle cx="44" cy="82" r="24" fill={option.garment} /><circle cx="76" cy="82" r="24" fill={option.garment} opacity="0.85" /></>
      ) : option.shape === 'belt' ? (
        <path d="M12 72 H92 Q108 72 108 88 Q108 104 92 104 H12 Z" fill={option.garment} />
      ) : option.shape === 'square' ? (
        <path d="M30 34 L92 22 L84 132 L24 118 Z" fill={option.garment} />
      ) : option.shape === 'lapel' ? (
        <circle cx="60" cy="76" r="38" fill={option.garment} />
      ) : option.shape === 'dress' ? (
        <path d="M48 26 L60 40 L72 26 L86 84 L100 150 L20 150 L34 84 Z" fill={option.garment} />
      ) : (
        <path d="M28 32 L52 22 L60 34 L68 22 L92 32 L106 62 L88 73 L86 132 Q84 145 72 150 L48 150 Q36 145 34 132 L32 73 L14 62 Z" fill={option.garment} />
      )}
      <ellipse cx="60" cy="152" rx="34" ry="6" fill="#000" opacity="0.2" />
    </svg>
  )
}

function ContactScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="relative flex h-full w-full items-center overflow-hidden bg-[#111] px-5 pt-24 text-white sm:px-10 sm:pt-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(215,0,85,0.25),transparent_35%),radial-gradient(circle_at_18%_88%,rgba(202,161,73,0.16),transparent_28%)]" />
      <div className="relative mx-auto max-w-6xl">
        <p className="mb-4 text-xs font-black uppercase tracking-[0.34em] text-white/50">Book fitting</p>
        <h2 className="max-w-4xl text-5xl leading-[0.9] tracking-[-0.04em] text-white sm:text-8xl" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
          Begin your bespoke fitting.
        </h2>
        <p className="mt-7 max-w-xl text-base font-semibold leading-8 text-white/62">
          Men, women and accessories by appointment. Calgary bespoke tailoring, ceremonial wear and refined finishing details.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a href="mailto:Info@rivaado.com?subject=Rivaado%20fitting%20request" className="rounded-full bg-white px-7 py-4 text-xs font-black uppercase tracking-[0.18em] text-black no-underline">
            Email Rivaado
          </a>
          <a href="tel:+18258837766" className="rounded-full border border-white/35 px-7 py-4 text-xs font-black uppercase tracking-[0.18em] text-white no-underline">
            +1 825-883-7766
          </a>
          <button type="button" onClick={onBack} className="rounded-full border border-white/20 px-7 py-4 text-xs font-black uppercase tracking-[0.18em] text-white/70">
            Back
          </button>
        </div>
      </div>
    </div>
  )
}
