import { useEffect, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

type SectionKey = 'home' | 'about' | 'men' | 'women' | 'accessories' | 'contact'
type ProductKind = 'men' | 'women' | 'accessories'

type ProductLook = {
  key: ProductKind
  label: string
  tag: string
  headline: string
  detail: string
  price: string
  sizes: string[]
  colors: string[]
  backgrounds: string[]
  activeTab: string
  miniLabel: string
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

const PRODUCTS: Record<ProductKind, ProductLook> = {
  men: {
    key: 'men',
    label: 'Men',
    tag: 'Men / Bespoke',
    headline: 'Wear Confidence Define Your Style.',
    detail:
      'Three-piece suits, tuxedos and overcoats made around posture, proportion and presence.',
    price: 'FROM $1,250',
    sizes: ['36', '38', '40', '42'],
    colors: ['#101010', '#7b1f2d', '#efe6d2', '#4a3c32'],
    backgrounds: ['#d70755', '#8f1e2e', '#ece7dc', '#6b5a50'],
    activeTab: 'Men',
    miniLabel: 'Dress Better. Feel Boss.',
  },
  women: {
    key: 'women',
    label: 'Women',
    tag: 'Women / Couture',
    headline: 'Wear Confidence Define Your Style.',
    detail:
      'Power suits, skirt suits, coats and couture silhouettes with strong shape and rich color.',
    price: 'FROM $980',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['#0b4a3f', '#112f6f', '#8c132d', '#f6efe1'],
    backgrounds: ['#eee9d9', '#12463e', '#b51c42', '#c8b891'],
    activeTab: 'Women',
    miniLabel: 'Sharp Lines. Soft Power.',
  },
  accessories: {
    key: 'accessories',
    label: 'Accessories',
    tag: 'Accessories / Finish',
    headline: 'Wear Confidence Define Your Style.',
    detail:
      'Ties, pocket squares, cuffs, lapel details and styling pieces that complete the look.',
    price: 'FROM $120',
    sizes: ['Tie', 'Cuff', 'Lapel', 'Set'],
    colors: ['#caa149', '#111111', '#ffffff', '#772432'],
    backgrounds: ['#34312d', '#111111', '#e8e2d7', '#5b1329'],
    activeTab: 'Accessories',
    miniLabel: 'Finish The Presence.',
  },
}

const ABOUT_MARKERS = [
  ['1956', 'Custom suit tailoring begins.'],
  ['1964', 'Sunshine Tailors becomes the family house of fit.'],
  ['1978', 'The next generation learns the craft by hand.'],
  ['2012', 'Rivaado becomes a sharper modern identity.'],
  ['2022', 'Rivaado Bespoke Wear arrives in Calgary.'],
] as const

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionKey>('home')
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 700)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 700)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <main
      className="relative h-[100svh] w-full overflow-hidden bg-black text-white"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <Header activeSection={activeSection} onNavigate={setActiveSection} />

      <div className="absolute inset-0">
        <Screen active={activeSection === 'home'}>
          <HomeScreen isMobile={isMobile} onExplore={() => setActiveSection('men')} />
        </Screen>

        <Screen active={activeSection === 'about'}>
          <AboutScreen />
        </Screen>

        <Screen active={activeSection === 'men'}>
          <ProductShowcase
            product={PRODUCTS.men}
            onPrev={() => setActiveSection('about')}
            onNext={() => setActiveSection('women')}
          />
        </Screen>

        <Screen active={activeSection === 'women'}>
          <ProductShowcase
            product={PRODUCTS.women}
            onPrev={() => setActiveSection('men')}
            onNext={() => setActiveSection('accessories')}
          />
        </Screen>

        <Screen active={activeSection === 'accessories'}>
          <ProductShowcase
            product={PRODUCTS.accessories}
            onPrev={() => setActiveSection('women')}
            onNext={() => setActiveSection('contact')}
          />
        </Screen>

        <Screen active={activeSection === 'contact'}>
          <ContactScreen onBack={() => setActiveSection('accessories')} />
        </Screen>
      </div>
    </main>
  )
}

function Header({
  activeSection,
  onNavigate,
}: {
  activeSection: SectionKey
  onNavigate: (section: SectionKey) => void
}) {
  return (
    <header className="absolute inset-x-0 top-0 z-50 px-4 py-4 sm:px-8 sm:py-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full border border-white/12 bg-black/32 px-4 py-3 shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-6">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="text-xs font-black uppercase tracking-[0.28em] text-white sm:text-sm"
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
                activeSection === item.key ? 'text-white' : 'text-white/62 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => onNavigate('contact')}
          className="hidden rounded-full border border-white/50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-black sm:inline-flex"
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
                ? 'border-white bg-white text-black'
                : 'border-white/18 bg-black/35 text-white/85'
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
      className={`absolute inset-0 transition duration-500 ${
        active ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
      aria-hidden={!active}
    >
      {children}
    </section>
  )
}

function HomeScreen({
  isMobile,
  onExplore,
}: {
  isMobile: boolean
  onExplore: () => void
}) {
  const src = isMobile ? HERO_VIDEO.mobile : HERO_VIDEO.desktop
  const poster = isMobile ? HERO_VIDEO.mobilePoster : HERO_VIDEO.poster

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
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
        <p className="mb-3 text-xs font-black uppercase tracking-[0.32em] text-white/70">
          Bespoke tailoring house
        </p>
        <h1
          className="max-w-5xl uppercase leading-[0.82] tracking-[-0.06em] text-white"
          style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(4.5rem, 14vw, 13rem)' }}
        >
          Rivaado
        </h1>
        <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-xl text-sm leading-6 text-white/75 sm:text-base sm:leading-7">
            A cinematic bespoke experience for men and women — tailoring, couture, accessories and
            made-to-measure presence.
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
    <div className="relative flex h-full w-full items-center overflow-hidden bg-[#070604] px-5 pt-24 sm:px-10 sm:pt-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(202,161,73,0.18),transparent_32%),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[length:auto,80px_80px,80px_80px]" />
      <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="mb-4 text-xs font-black uppercase tracking-[0.34em] text-[#caa149]">
            About Rivaado
          </p>
          <h2
            className="max-w-3xl text-5xl leading-[0.9] tracking-[-0.04em] text-white sm:text-7xl"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Seventy years of cloth, cut and quiet confidence.
          </h2>
          <p className="mt-7 max-w-xl text-sm leading-7 text-white/62 sm:text-base">
            Rivaado is built from family craft, precise measurement and modern luxury. The garment
            is the product, but presence is the outcome.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-5 lg:h-[560px] lg:items-end">
          {ABOUT_MARKERS.map(([year, body], index) => (
            <div
              key={year}
              className="rounded-[2rem] border border-[#caa149]/25 bg-black/42 p-5 shadow-2xl shadow-black/30 backdrop-blur"
              style={{ minHeight: `${260 + (index % 3) * 46}px` }}
            >
              <p className="text-4xl font-black text-[#caa149]">{year}</p>
              <p className="mt-5 text-xs font-bold leading-6 text-white/64 sm:text-sm">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProductShowcase({
  product,
  onPrev,
  onNext,
}: {
  product: ProductLook
  onPrev: () => void
  onNext: () => void
}) {
  const [colorIndex, setColorIndex] = useState(0)
  const color = product.colors[colorIndex]
  const background = product.backgrounds[colorIndex]
  const isLight = isLightColor(background)

  const pageStyle: CSSProperties = {
    background: background,
    color: isLight ? '#141414' : '#fff',
  }

  return (
    <div className="relative h-full w-full overflow-hidden px-5 pt-28 sm:px-10" style={pageStyle}>
      <div
        className="absolute inset-0 opacity-45"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(180deg, rgba(255,255,255,0.14) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />
      <div className="absolute left-1/2 top-1/2 h-[72vmin] w-[72vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/18 blur-3xl" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col">
        <div className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.18em] sm:gap-7">
          {['Home', 'Men', 'Women', 'Accessories', 'About Us'].map((tab) => {
            const active =
              tab.toLowerCase() === product.activeTab.toLowerCase() ||
              (product.key === 'men' && tab === 'Men') ||
              (product.key === 'women' && tab === 'Women') ||
              (product.key === 'accessories' && tab === 'Accessories')

            return (
              <button
                key={tab}
                type="button"
                className={`rounded-full px-3 py-1 ${active ? activePillClass(isLight) : mutedTextClass(isLight)}`}
              >
                {tab}
              </button>
            )
          })}
        </div>

        <div className="grid flex-1 items-center gap-6 lg:grid-cols-[0.86fr_1.22fr_0.72fr]">
          <div className="relative z-20">
            <p className={`mb-4 text-xs font-black uppercase tracking-[0.28em] ${mutedTextClass(isLight)}`}>
              {product.tag}
            </p>
            <h2
              className="max-w-md text-4xl leading-[0.95] tracking-[-0.04em] sm:text-5xl"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              {product.headline}
            </h2>
            <p className={`mt-6 max-w-md text-sm font-semibold leading-7 ${bodyTextClass(isLight)}`}>
              {product.detail}
            </p>

            <button
              type="button"
              className={`mt-8 rounded-full px-7 py-4 text-xs font-black uppercase tracking-[0.16em] shadow-xl transition ${
                isLight ? 'bg-black text-white hover:bg-black/80' : 'bg-white text-black hover:bg-white/85'
              }`}
            >
              Book fitting
            </button>

            <div className="mt-8 flex items-center gap-3">
              {product.colors.map((swatch, index) => (
                <button
                  key={swatch}
                  type="button"
                  onClick={() => setColorIndex(index)}
                  className={`h-5 w-5 rounded-full border transition ${
                    colorIndex === index
                      ? isLight
                        ? 'border-black scale-110'
                        : 'border-white scale-110'
                      : isLight
                        ? 'border-black/30'
                        : 'border-white/35'
                  }`}
                  style={{ backgroundColor: swatch }}
                  aria-label={`Select ${product.label} color ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="relative flex min-h-[420px] items-center justify-center lg:min-h-[620px]">
            <button
              type="button"
              onClick={onPrev}
              className={`absolute left-0 z-30 hidden h-12 w-12 items-center justify-center rounded-full backdrop-blur sm:flex ${
                isLight ? 'bg-black/14 text-black hover:bg-black/22' : 'bg-white/20 text-white hover:bg-white/28'
              }`}
              aria-label="Previous section"
            >
              <ArrowLeft size={22} strokeWidth={2.2} />
            </button>

            <div className="relative flex h-[56vh] min-h-[360px] w-full items-center justify-center sm:h-[66vh]">
              <div
                className="absolute bottom-[8%] h-10 w-[44%] rounded-full blur-xl"
                style={{ backgroundColor: isLight ? 'rgba(0,0,0,0.22)' : 'rgba(0,0,0,0.38)' }}
              />
              <ProductIllustration kind={product.key} color={color} isLight={isLight} />
              <div className={`absolute bottom-[6%] text-center text-sm font-bold ${bodyTextClass(isLight)}`}>
                <p className="opacity-70">{product.label}</p>
                <p className="font-black">{product.miniLabel}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onNext}
              className={`absolute right-0 z-30 hidden h-12 w-12 items-center justify-center rounded-full backdrop-blur sm:flex ${
                isLight ? 'bg-black/14 text-black hover:bg-black/22' : 'bg-white/20 text-white hover:bg-white/28'
              }`}
              aria-label="Next section"
            >
              <ArrowRight size={22} strokeWidth={2.2} />
            </button>
          </div>

          <div className="relative z-20 flex flex-col items-start gap-8 lg:items-end">
            <div className="text-left lg:text-right">
              <p className={`text-xs font-black uppercase tracking-[0.24em] ${mutedTextClass(isLight)}`}>
                Starting at
              </p>
              <p className="mt-2 text-2xl font-black uppercase sm:text-3xl">{product.price}</p>
            </div>

            <div className="flex flex-wrap gap-3 lg:justify-end">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`flex h-14 min-w-14 items-center justify-center rounded-full px-4 text-xs font-black uppercase shadow-xl transition ${
                    isLight ? 'bg-black text-white hover:bg-black/80' : 'bg-white text-black hover:bg-white/85'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            <div className={`hidden rounded-[2rem] border p-4 sm:block ${isLight ? 'border-black/28' : 'border-white/40'}`}>
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[1.4rem] bg-white/12 backdrop-blur">
                <ProductIllustration kind={product.key} color={color} isLight={isLight} miniature />
              </div>
            </div>
          </div>
        </div>

        <div className={`absolute bottom-7 left-0 flex items-center gap-3 text-[11px] font-black ${mutedTextClass(isLight)}`}>
          <span>◎</span>
          <span>✕</span>
          <span>□</span>
          <span>◐</span>
          <span>↗</span>
        </div>
      </div>
    </div>
  )
}

function ProductIllustration({
  kind,
  color,
  isLight,
  miniature = false,
}: {
  kind: ProductKind
  color: string
  isLight: boolean
  miniature?: boolean
}) {
  const scale = miniature ? 'h-24 w-24' : 'h-[430px] w-[360px] sm:h-[560px] sm:w-[470px]'
  const stroke = isLight ? '#171717' : '#ffffff'

  if (kind === 'accessories') {
    return (
      <div className={`relative ${scale}`}>
        <svg viewBox="0 0 360 460" className="h-full w-full overflow-visible drop-shadow-2xl">
          <path
            d="M160 70 C190 110 198 170 180 230 C162 170 170 110 160 70Z"
            fill={color}
            stroke={stroke}
            strokeOpacity="0.25"
            strokeWidth="2"
          />
          <path d="M160 70 L205 115 L180 380 L130 335 L160 70Z" fill={color} opacity="0.95" />
          <path d="M205 115 L235 330 L180 380 L205 115Z" fill={color} opacity="0.72" />
          <rect x="34" y="170" width="112" height="112" rx="12" fill={color} opacity="0.82" />
          <path d="M34 170 L146 282 M146 170 L34 282" stroke={stroke} strokeOpacity="0.22" />
          <circle cx="276" cy="205" r="42" fill={color} opacity="0.88" />
          <circle cx="276" cy="205" r="23" fill="none" stroke={stroke} strokeOpacity="0.3" strokeWidth="10" />
          <ellipse cx="183" cy="424" rx="112" ry="18" fill="rgba(0,0,0,0.24)" />
        </svg>
      </div>
    )
  }

  const isWomen = kind === 'women'

  return (
    <div className={`relative ${scale}`}>
      <svg viewBox="0 0 420 560" className="h-full w-full overflow-visible drop-shadow-2xl">
        <path
          d="M210 33 C205 14 230 12 232 31 C234 48 211 49 211 64"
          fill="none"
          stroke={stroke}
          strokeOpacity="0.54"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path d="M136 94 C166 69 188 64 210 64 C232 64 254 69 284 94" fill="none" stroke="#c89b55" strokeWidth="10" strokeLinecap="round" />
        <path
          d={
            isWomen
              ? 'M117 112 L77 198 L104 222 L118 188 L105 455 C105 480 128 496 156 486 L210 462 L264 486 C292 496 315 480 315 455 L302 188 L336 222 L363 198 L303 112 C277 96 247 86 210 86 C173 86 143 96 117 112Z'
              : 'M110 112 L54 194 L88 222 L116 174 L98 462 C98 490 124 505 154 492 L210 470 L266 492 C296 505 322 490 322 462 L304 174 L332 222 L366 194 L310 112 C282 98 248 88 210 88 C172 88 138 98 110 112Z'
          }
          fill={color}
        />
        <path
          d={isWomen ? 'M151 126 C175 150 192 160 210 162 C228 160 245 150 269 126 L248 268 L210 462 L172 268Z' : 'M152 119 C175 145 193 158 210 160 C227 158 245 145 268 119 L250 290 L210 470 L170 290Z'}
          fill="rgba(255,255,255,0.18)"
        />
        <path d="M210 160 L210 464" stroke={stroke} strokeOpacity="0.22" strokeWidth="3" />
        <path d="M176 109 C189 131 200 146 210 160 C220 146 231 131 244 109" fill="none" stroke={stroke} strokeOpacity="0.35" strokeWidth="5" />
        <path d="M151 210 C184 222 236 222 269 210" fill="none" stroke={stroke} strokeOpacity="0.17" strokeWidth="5" />
        <path d="M157 318 C190 330 230 330 263 318" fill="none" stroke={stroke} strokeOpacity="0.14" strokeWidth="5" />
        <circle cx="210" cy="205" r="5" fill={stroke} opacity="0.42" />
        <circle cx="210" cy="242" r="5" fill={stroke} opacity="0.42" />
        <circle cx="210" cy="279" r="5" fill={stroke} opacity="0.42" />
        <ellipse cx="210" cy="522" rx="115" ry="19" fill="rgba(0,0,0,0.24)" />
      </svg>
    </div>
  )
}

function ContactScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="relative flex h-full w-full items-center overflow-hidden bg-[#090807] px-5 pt-28 sm:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(202,161,73,0.18),transparent_34%)]" />
      <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div>
          <p className="mb-4 text-xs font-black uppercase tracking-[0.34em] text-[#caa149]">Private fitting</p>
          <h2
            className="max-w-3xl text-5xl leading-[0.9] tracking-[-0.04em] text-white sm:text-7xl"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Begin your bespoke appointment.
          </h2>
          <p className="mt-7 max-w-xl text-sm leading-7 text-white/62 sm:text-base">
            Calgary · Bespoke for men and women · By appointment
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="mailto:Info@rivaado.com?subject=Rivaado%20fitting%20request"
              className="rounded-full bg-white px-7 py-4 text-xs font-black uppercase tracking-[0.16em] text-black no-underline"
            >
              Email Rivaado
            </a>
            <a
              href="tel:+18258837766"
              className="rounded-full border border-white/45 px-7 py-4 text-xs font-black uppercase tracking-[0.16em] text-white no-underline"
            >
              +1 825-883-7766
            </a>
            <button
              type="button"
              onClick={onBack}
              className="rounded-full border border-[#caa149]/50 px-7 py-4 text-xs font-black uppercase tracking-[0.16em] text-[#caa149]"
            >
              Back
            </button>
          </div>
        </div>

        <div className="rounded-[2.2rem] border border-white/10 bg-white/[0.035] p-7 backdrop-blur">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-white/40">Showroom</p>
          <p className="mt-5 text-2xl font-black leading-9 text-white">
            THE CORE, 751 3 St SW C-212, Calgary, AB T2P 4K8, Canada
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 text-sm font-bold text-white/62">
            <div className="rounded-2xl bg-black/35 p-4">Consultation</div>
            <div className="rounded-2xl bg-black/35 p-4">Fabric selection</div>
            <div className="rounded-2xl bg-black/35 p-4">Measurements</div>
            <div className="rounded-2xl bg-black/35 p-4">Final fitting</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function isLightColor(hex: string) {
  const value = hex.replace('#', '')
  const r = parseInt(value.slice(0, 2), 16)
  const g = parseInt(value.slice(2, 4), 16)
  const b = parseInt(value.slice(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 165
}

function activePillClass(isLight: boolean) {
  return isLight ? 'bg-black text-white' : 'bg-white text-black'
}

function mutedTextClass(isLight: boolean) {
  return isLight ? 'text-black/55' : 'text-white/65'
}

function bodyTextClass(isLight: boolean) {
  return isLight ? 'text-black/65' : 'text-white/70'
}
