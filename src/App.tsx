import { useEffect, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

type SectionKey = 'home' | 'about' | 'men' | 'women' | 'accessories' | 'contact'
type ProductKind = 'men' | 'women' | 'accessories'

type ProductOption = {
  name: string
  label: string
  caption: string
  priceTop: string
  priceBottom: string
  background: string
  garment: string
  shadow: string
  accent: string
  text: 'light' | 'dark'
}

type ProductShowcaseData = {
  key: ProductKind
  eyebrow: string
  title: string
  description: string
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
    description: 'Three-piece suits, tuxedos and overcoats made around posture, proportion and presence.',
    sizes: ['36', '38', '40', '42'],
    options: [
      {
        name: 'Midnight Tuxedo',
        label: 'Peak Lapel',
        caption: 'Dress Better.\nFeel Boss.',
        priceTop: 'FROM $1,250',
        priceBottom: 'FROM $1,650',
        background: '#d70055',
        garment: '#101010',
        shadow: '#060606',
        accent: '#d5ac50',
        text: 'light',
      },
      {
        name: 'Ivory Dinner Jacket',
        label: 'Evening White',
        caption: 'Clean Lines.\nSharp Presence.',
        priceTop: 'FROM $1,450',
        priceBottom: 'FROM $1,850',
        background: '#d70055',
        garment: '#f2eee2',
        shadow: '#c9bfae',
        accent: '#d5ac50',
        text: 'light',
      },
      {
        name: 'Burgundy Three Piece',
        label: 'Modern Suit',
        caption: 'Cut Strong.\nMove Easy.',
        priceTop: 'FROM $1,350',
        priceBottom: 'FROM $1,750',
        background: '#d70055',
        garment: '#6f1028',
        shadow: '#3a0815',
        accent: '#d5ac50',
        text: 'light',
      },
      {
        name: 'Charcoal Overcoat',
        label: 'Layered Fit',
        caption: 'Quiet Power.\nTailored Warmth.',
        priceTop: 'FROM $1,600',
        priceBottom: 'FROM $2,200',
        background: '#d70055',
        garment: '#3d3834',
        shadow: '#161412',
        accent: '#d5ac50',
        text: 'light',
      },
    ],
  },
  women: {
    key: 'women',
    eyebrow: 'Women / Couture',
    title: 'Wear Confidence Define Your Style.',
    description: 'Power suits, skirt suits, dresses and tailored separates shaped with color, line and elegance.',
    sizes: ['XS', 'S', 'M', 'L'],
    options: [
      {
        name: 'Ivory Skirt Suit',
        label: 'Tailored Skirt',
        caption: 'Elegant Shape.\nSharp Finish.',
        priceTop: 'FROM $980',
        priceBottom: 'FROM $1,400',
        background: '#ebe7dc',
        garment: '#f5f2e8',
        shadow: '#b9b2a4',
        accent: '#c8a15b',
        text: 'dark',
      },
      {
        name: 'Emerald Pantsuit',
        label: 'Power Tailoring',
        caption: 'Color Forward.\nBuilt Strong.',
        priceTop: 'FROM $1,100',
        priceBottom: 'FROM $1,550',
        background: '#ebe7dc',
        garment: '#0b4a3f',
        shadow: '#052a24',
        accent: '#c8a15b',
        text: 'dark',
      },
      {
        name: 'Burgundy Long Suit',
        label: 'Statement Line',
        caption: 'Rich Color.\nFull Presence.',
        priceTop: 'FROM $1,180',
        priceBottom: 'FROM $1,700',
        background: '#ebe7dc',
        garment: '#8c132d',
        shadow: '#4b0718',
        accent: '#c8a15b',
        text: 'dark',
      },
      {
        name: 'Cobalt Evening Suit',
        label: 'Blue Edition',
        caption: 'Cool Tone.\nBold Cut.',
        priceTop: 'FROM $1,200',
        priceBottom: 'FROM $1,750',
        background: '#ebe7dc',
        garment: '#112f6f',
        shadow: '#071740',
        accent: '#c8a15b',
        text: 'dark',
      },
    ],
  },
  accessories: {
    key: 'accessories',
    eyebrow: 'Accessories / Finish',
    title: 'Wear Confidence Define Your Style.',
    description: 'Ties, cuffs, lapel details, pocket squares and finishing pieces that complete the look.',
    sizes: ['Tie', 'Cuff', 'Lapel', 'Set'],
    options: [
      {
        name: 'Silk Tie Set',
        label: 'Tie',
        caption: 'Finish Clean.\nStand Out.',
        priceTop: 'FROM $120',
        priceBottom: 'FROM $300',
        background: '#4f4039',
        garment: '#5a4840',
        shadow: '#2a211d',
        accent: '#d5ac50',
        text: 'light',
      },
      {
        name: 'Gold Cuff Detail',
        label: 'Cuff',
        caption: 'Small Detail.\nBig Finish.',
        priceTop: 'FROM $160',
        priceBottom: 'FROM $420',
        background: '#4f4039',
        garment: '#caa149',
        shadow: '#5f4617',
        accent: '#f1d17c',
        text: 'light',
      },
      {
        name: 'Lapel Flower',
        label: 'Lapel',
        caption: 'Quiet Accent.\nLuxury Touch.',
        priceTop: 'FROM $95',
        priceBottom: 'FROM $240',
        background: '#4f4039',
        garment: '#d70055',
        shadow: '#650026',
        accent: '#d5ac50',
        text: 'light',
      },
      {
        name: 'Pocket Square Set',
        label: 'Set',
        caption: 'Layered Finish.\nComplete Look.',
        priceTop: 'FROM $180',
        priceBottom: 'FROM $500',
        background: '#4f4039',
        garment: '#f5f2e8',
        shadow: '#a79d90',
        accent: '#d5ac50',
        text: 'light',
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

  const headerMode = activeSection === 'women' || activeSection === 'about' ? 'dark' : 'light'

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

function Header({
  activeSection,
  mode,
  onNavigate,
}: {
  activeSection: SectionKey
  mode: 'light' | 'dark'
  onNavigate: (section: SectionKey) => void
}) {
  const dark = mode === 'dark'

  return (
    <header className="absolute inset-x-0 top-0 z-50 px-4 py-4 sm:px-8 sm:py-6">
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full border px-4 py-3 shadow-2xl backdrop-blur-xl sm:px-6 ${
          dark ? 'border-black/10 bg-white/55 shadow-black/10' : 'border-white/30 bg-black/10 shadow-black/20'
        }`}
      >
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className={`text-xs font-black uppercase tracking-[0.28em] sm:text-sm ${dark ? 'text-black' : 'text-white'}`}
        >
          RIVAADO
        </button>

        <nav className="hidden items-center gap-6 sm:flex lg:gap-8" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => onNavigate(item.key)}
              className={`text-[11px] font-black uppercase tracking-[0.2em] transition ${
                activeSection === item.key
                  ? dark
                    ? 'text-black'
                    : 'text-white'
                  : dark
                    ? 'text-black/48 hover:text-black'
                    : 'text-white/62 hover:text-white'
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
            dark
              ? 'border-black/40 text-black hover:bg-black hover:text-white'
              : 'border-white/58 text-white hover:bg-white hover:text-black'
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
    <section
      className={`absolute inset-0 transition duration-500 ${active ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
      aria-hidden={!active}
    >
      {children}
    </section>
  )
}

function HomeScreen({ isMobile, onExplore }: { isMobile: boolean; onExplore: () => void }) {
  const src = isMobile ? HERO_VIDEO.mobile : HERO_VIDEO.desktop
  const poster = isMobile ? HERO_VIDEO.mobilePoster : HERO_VIDEO.poster

  return (
    <div className="relative h-full w-full overflow-hidden bg-black text-white">
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
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.46)_0%,rgba(0,0,0,0.08)_42%,rgba(0,0,0,0.86)_100%)]" />
      <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-8 sm:px-10 sm:pb-12">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.32em] text-white/70">Bespoke tailoring house</p>
        <h1
          className="max-w-5xl uppercase leading-[0.82] tracking-[-0.06em] text-white"
          style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(4.5rem, 14vw, 13rem)' }}
        >
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
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.055)_1px,transparent_1px),linear-gradient(180deg,rgba(0,0,0,0.045)_1px,transparent_1px)] bg-[length:72px_72px]" />
      <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="mb-4 text-xs font-black uppercase tracking-[0.34em] text-black/48">About Rivaado</p>
          <h2
            className="max-w-3xl text-5xl leading-[0.9] tracking-[-0.04em] text-black sm:text-7xl"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Seventy years of cloth, cut and quiet confidence.
          </h2>
          <p className="mt-7 max-w-xl text-sm font-semibold leading-7 text-black/58 sm:text-base">
            Rivaado is built from family craft, precise measurement and modern luxury. The garment is the product, but presence is the outcome.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-5 lg:h-[560px] lg:items-end">
          {ABOUT_MARKERS.map(([year, body], index) => (
            <div
              key={year}
              className="rounded-[2rem] border border-black/12 bg-white/45 p-5 shadow-2xl shadow-black/10 backdrop-blur"
              style={{ minHeight: `${260 + (index % 3) * 46}px` }}
            >
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
    background: `radial-gradient(circle at 52% 43%, rgba(255,255,255,0.24), transparent 28%), ${option.background}`,
    color: darkText ? '#101010' : '#ffffff',
  }

  const previousOption = () => {
    setOptionIndex((current) => (current + data.options.length - 1) % data.options.length)
  }

  const nextOption = () => {
    setOptionIndex((current) => (current + 1) % data.options.length)
  }

  return (
    <div className="relative h-full w-full overflow-hidden px-5 pt-28 sm:px-10" style={sectionStyle}>
      <div
        className={`absolute inset-0 bg-[linear-gradient(90deg,currentColor_1px,transparent_1px),linear-gradient(180deg,currentColor_1px,transparent_1px)] bg-[length:72px_72px] ${
          darkText ? 'text-black/[0.07]' : 'text-white/[0.11]'
        }`}
      />
      <div className="absolute left-1/2 top-1/2 h-[72vmin] w-[72vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10 mx-auto grid h-full max-w-7xl items-center gap-6 lg:grid-cols-[0.86fr_1.25fr_0.72fr]">
        <div className="relative z-20 pt-12 sm:pt-0">
          <p className={`mb-4 text-xs font-black uppercase tracking-[0.28em] ${darkText ? 'text-black/48' : 'text-white/68'}`}>
            {data.eyebrow}
          </p>
          <h2
            className="max-w-md text-4xl leading-[0.95] tracking-[-0.04em] sm:text-5xl"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            {data.title}
          </h2>
          <p className={`mt-6 max-w-md text-sm font-semibold leading-7 sm:text-base ${darkText ? 'text-black/58' : 'text-white/72'}`}>
            {data.description}
          </p>

          <button
            type="button"
            className={`mt-8 rounded-full px-7 py-4 text-xs font-black uppercase tracking-[0.18em] ${
              darkText ? 'bg-black text-white' : 'bg-white text-black'
            }`}
          >
            Book fitting
          </button>

          <div className="mt-8 flex items-center gap-3" aria-label={`${data.key} options`}>
            {data.options.map((item, index) => (
              <button
                key={item.name}
                type="button"
                onClick={() => setOptionIndex(index)}
                aria-label={item.name}
                className={`h-5 w-5 rounded-full border shadow ${optionIndex === index ? 'scale-110 border-white ring-2 ring-white/70' : 'border-white/60'}`}
                style={{ backgroundColor: item.garment }}
              />
            ))}
          </div>

          <div className={`mt-20 hidden items-center gap-5 text-xs sm:flex ${darkText ? 'text-black/45' : 'text-white/55'}`}>
            <span>◎</span>
            <span>×</span>
            <span>□</span>
            <span>◐</span>
            <span>↗</span>
          </div>
        </div>

        <div className="relative flex min-h-[50vh] items-center justify-center lg:min-h-[680px]">
          <button
            type="button"
            onClick={previousOption}
            aria-label={`Previous ${data.key} option`}
            className={`absolute left-0 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full transition hover:scale-105 ${
              darkText ? 'bg-black/12 text-black' : 'bg-white/18 text-white'
            }`}
          >
            <ArrowLeft size={22} strokeWidth={2.4} />
          </button>

          <ProductIllustration option={option} kind={data.key} />

          <button
            type="button"
            onClick={nextOption}
            aria-label={`Next ${data.key} option`}
            className={`absolute right-0 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full transition hover:scale-105 ${
              darkText ? 'bg-black/12 text-black' : 'bg-white/18 text-white'
            }`}
          >
            <ArrowRight size={22} strokeWidth={2.4} />
          </button>
        </div>

        <div className="relative z-20 hidden lg:block">
          <p className={`mb-3 text-xs font-black uppercase tracking-[0.24em] ${darkText ? 'text-black/50' : 'text-white/65'}`}>
            Starting at
          </p>
          <p className="text-3xl font-black uppercase leading-tight">{option.priceTop}</p>
          <p className="text-sm font-black uppercase opacity-80">{option.priceBottom}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            {data.sizes.map((size) => (
              <span
                key={size}
                className={`flex h-16 min-w-16 items-center justify-center rounded-full px-4 text-xs font-black uppercase ${
                  darkText ? 'bg-black text-white' : 'bg-white text-black'
                }`}
              >
                {size}
              </span>
            ))}
          </div>

          <div className={`mt-10 flex h-32 w-32 items-center justify-center rounded-[2rem] border ${darkText ? 'border-black/25' : 'border-white/35'}`}>
            <MiniProduct option={option} kind={data.key} />
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductIllustration({ option, kind }: { option: ProductOption; kind: ProductKind }) {
  const isAccessory = kind === 'accessories'
  const isWomen = kind === 'women'

  return (
    <div className="relative flex h-[56vh] min-h-[430px] w-full items-center justify-center lg:h-[72vh]">
      <svg className="h-full max-h-[680px] w-full max-w-[520px] drop-shadow-2xl" viewBox="0 0 520 700" role="img" aria-label={option.name}>
        <defs>
          <linearGradient id={`cloth-${kind}-${option.label.replace(/\s+/g, '-')}`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={option.garment} />
            <stop offset="58%" stopColor={option.garment} />
            <stop offset="100%" stopColor={option.shadow} />
          </linearGradient>
          <filter id={`soft-shadow-${kind}`} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="32" stdDeviation="26" floodColor="#000000" floodOpacity="0.22" />
          </filter>
        </defs>

        <path d="M260 72 C260 38 298 42 298 22" fill="none" stroke={option.accent} strokeWidth="14" strokeLinecap="round" />
        <path d="M162 118 Q260 62 358 118" fill="none" stroke={option.accent} strokeWidth="17" strokeLinecap="round" />
        <ellipse cx="260" cy="626" rx="136" ry="22" fill="#000" opacity="0.18" />

        {isAccessory ? (
          <g filter={`url(#soft-shadow-${kind})`}>
            <path d="M222 126 L298 126 L316 238 L284 604 Q280 632 260 652 Q240 632 236 604 L204 238 Z" fill={`url(#cloth-${kind}-${option.label.replace(/\s+/g, '-')})`} />
            <path d="M228 126 L260 176 L292 126" fill="#111" opacity="0.22" />
            <path d="M260 176 L260 616" stroke="rgba(255,255,255,0.45)" strokeWidth="5" />
          </g>
        ) : (
          <g filter={`url(#soft-shadow-${kind})`}>
            <path
              d={
                isWomen
                  ? 'M151 134 L232 106 L260 142 L288 106 L369 134 L418 248 L364 286 L346 594 Q343 630 312 650 L208 650 Q177 630 174 594 L156 286 L102 248 Z'
                  : 'M151 134 L232 106 L260 142 L288 106 L369 134 L425 256 L363 296 L357 596 Q356 630 324 650 L196 650 Q164 630 163 596 L157 296 L95 256 Z'
              }
              fill={`url(#cloth-${kind}-${option.label.replace(/\s+/g, '-')})`}
            />
            <path d="M232 106 L260 142 L288 106 L300 194 L260 230 L220 194 Z" fill={isWomen ? '#ffffff' : '#111111'} opacity="0.76" />
            <path d="M226 122 L260 154 L294 122" fill="none" stroke={isWomen ? '#d2c7b8' : '#5a5a5a'} strokeWidth="8" strokeLinecap="round" />
            <path d="M260 146 L260 612" fill="none" stroke={isWomen ? '#d8d0c4' : '#707070'} strokeWidth="5" opacity="0.72" />
            {[230, 290, 352].map((cy) => (
              <circle key={cy} cx="260" cy={cy} r="8" fill={isWomen ? '#d8d0c4' : '#8c8c8c'} />
            ))}
            <path d="M172 318 Q260 354 348 318" fill="none" stroke={isWomen ? '#d8d0c4' : '#656565'} strokeWidth="6" opacity="0.42" />
            <path d="M174 440 Q260 480 346 440" fill="none" stroke={isWomen ? '#d8d0c4' : '#656565'} strokeWidth="6" opacity="0.34" />
          </g>
        )}
      </svg>

      <div className={`absolute bottom-[8%] text-center text-sm font-black leading-tight ${option.text === 'dark' ? 'text-black/58' : 'text-white/68'}`}>
        {option.caption.split('\n').map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>
    </div>
  )
}

function MiniProduct({ option, kind }: { option: ProductOption; kind: ProductKind }) {
  return (
    <svg viewBox="0 0 120 160" className="h-24 w-24" aria-hidden="true">
      <path d="M60 19 C60 7 76 8 76 2" fill="none" stroke={option.accent} strokeWidth="4" strokeLinecap="round" />
      {kind === 'accessories' ? (
        <path d="M46 30 L74 30 L80 68 L66 146 L60 154 L54 146 L40 68 Z" fill={option.garment} />
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(215,0,85,0.25),transparent_35%),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:auto,72px_72px,72px_72px]" />
      <div className="relative mx-auto max-w-6xl">
        <p className="mb-4 text-xs font-black uppercase tracking-[0.34em] text-white/50">Book fitting</p>
        <h2
          className="max-w-4xl text-5xl leading-[0.9] tracking-[-0.04em] text-white sm:text-8xl"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Begin your bespoke fitting.
        </h2>
        <p className="mt-7 max-w-xl text-base font-semibold leading-8 text-white/62">
          Men, women and accessories by appointment. Calgary bespoke tailoring, ceremonial pieces and finishing details.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a className="rounded-full bg-white px-7 py-4 text-xs font-black uppercase tracking-[0.18em] text-black no-underline" href="mailto:Info@rivaado.com">
            Info@rivaado.com
          </a>
          <a className="rounded-full border border-white/35 px-7 py-4 text-xs font-black uppercase tracking-[0.18em] text-white no-underline" href="tel:+18258837766">
            +1 825-883-7766
          </a>
          <button type="button" onClick={onBack} className="rounded-full border border-white/35 px-7 py-4 text-xs font-black uppercase tracking-[0.18em] text-white">
            Back
          </button>
        </div>
      </div>
    </div>
  )
}
