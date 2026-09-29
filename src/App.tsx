import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import suitAvatar from '../assets/rivaado-avatar-suit.webp'
import tuxedoAvatar from '../assets/rivaado-avatar-tuxedo.webp'
import coatAvatar from '../assets/rivaado-avatar-coat.webp'
import coutureAvatar from '../assets/rivaado-avatar-couture.webp'

type SectionKey = 'home' | 'about' | 'men' | 'women' | 'accessories' | 'contact'

type ShowcaseLook = {
  name: string
  line: string
  visual: string
  bg: string
  accent: string
  price: string
  swatches: string[]
  detail: string
  tag: string
  sizes: string[]
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

const SHOWCASE: Record<'men' | 'women' | 'accessories', ShowcaseLook> = {
  men: {
    name: 'Men Bespoke',
    line: 'Dress Better. Feel Boss.',
    visual: suitAvatar,
    bg: '#c81652',
    accent: '#2a0613',
    price: 'FROM $1,250',
    swatches: ['#111111', '#7b1f2d', '#f1e6c8', '#4a4238'],
    detail: 'Three-piece suits, tuxedos and overcoats cut around posture, proportion and presence.',
    tag: 'Men / Tailoring',
    sizes: ['36', '38', '40', '42'],
  },
  women: {
    name: 'Women Bespoke',
    line: 'Power In Every Cut.',
    visual: coutureAvatar,
    bg: '#f2ead4',
    accent: '#7e1536',
    price: 'FROM $980',
    swatches: ['#0b4a3f', '#112f6f', '#8c132d', '#f6efe1'],
    detail: 'Power suits, skirt suits, coats and couture silhouettes with rich color and strong shape.',
    tag: 'Women / Couture',
    sizes: ['XS', 'S', 'M', 'L'],
  },
  accessories: {
    name: 'Accessories',
    line: 'Finish The Presence.',
    visual: tuxedoAvatar,
    bg: '#34312d',
    accent: '#caa149',
    price: 'FROM $120',
    swatches: ['#caa149', '#ffffff', '#161616', '#772432'],
    detail: 'Ties, pocket squares, cuffs, lapel details and styling pieces that complete the look.',
    tag: 'Accessories / Finish',
    sizes: ['Tie', 'Cuff', 'Lapel', 'Set'],
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
    ;[suitAvatar, tuxedoAvatar, coatAvatar, coutureAvatar].forEach((src) => {
      const image = new Image()
      image.src = src
    })
  }, [])

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 700)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const go = (key: SectionKey) => setActiveSection(key)

  return (
    <main className="relative h-[100svh] w-full overflow-hidden bg-black text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Header activeSection={activeSection} onNavigate={go} />

      <div className="absolute inset-0">
        <Screen active={activeSection === 'home'}>
          <HomeScreen isMobile={isMobile} onExplore={() => go('men')} />
        </Screen>

        <Screen active={activeSection === 'about'}>
          <AboutScreen />
        </Screen>

        <Screen active={activeSection === 'men'}>
          <ProductShowcase look={SHOWCASE.men} onPrev={() => go('about')} onNext={() => go('women')} />
        </Screen>

        <Screen active={activeSection === 'women'}>
          <ProductShowcase look={SHOWCASE.women} onPrev={() => go('men')} onNext={() => go('accessories')} />
        </Screen>

        <Screen active={activeSection === 'accessories'}>
          <ProductShowcase look={SHOWCASE.accessories} onPrev={() => go('women')} onNext={() => go('contact')} />
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
  onNavigate,
}: {
  activeSection: SectionKey
  onNavigate: (section: SectionKey) => void
}) {
  return (
    <header className="absolute inset-x-0 top-0 z-50 px-4 py-4 sm:px-8 sm:py-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full border border-black/10 bg-white/12 px-4 py-3 shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-6">
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

function Screen({
  active,
  children,
}: {
  active: boolean
  children: React.ReactNode
}) {
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
    <div className="relative flex h-full w-full items-center overflow-hidden bg-[#070604] px-5 pt-24 sm:px-10 sm:pt-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(202,161,73,0.18),transparent_32%),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[length:auto,80px_80px,80px_80px]" />
      <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="mb-4 text-xs font-black uppercase tracking-[0.34em] text-[#caa149]">About Rivaado</p>
          <h2
            className="max-w-3xl text-5xl leading-[0.9] tracking-[-0.04em] text-white sm:text-7xl"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Seventy years of cloth, cut and quiet confidence.
          </h2>
          <p className="mt-7 max-w-xl text-sm leading-7 text-white/62 sm:text-base">
            Rivaado is built from family craft, precise measurement and modern luxury. The garment is the product, but presence is the outcome.
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
  look,
  onPrev,
  onNext,
}: {
  look: ShowcaseLook
  onPrev: () => void
  onNext: () => void
}) {
  const sectionStyle: CSSProperties = {
    background: `radial-gradient(circle at 55% 40%, rgba(255,255,255,0.2), transparent 28%), ${look.bg}`,
    color: look.bg === '#f2ead4' ? '#111' : '#fff',
  }
  const isLight = look.bg === '#f2ead4'

  return (
    <div className="relative h-full w-full overflow-hidden px-5 pt-28 sm:px-10" style={sectionStyle}>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[length:72px_72px]" />
      <div className="absolute left-1/2 top-1/2 h-[72vmin] w-[72vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/12 blur-3xl" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col">
        <div className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.18em] sm:gap-6">
          {['New', 'Bespoke', 'Collection', 'Atelier', 'About us'].map((tab, index) => (
            <span
              key={tab}
              className={`rounded-full px-3 py-1 ${
                index === 1
                  ? isLight
                    ? 'bg-black text-white'
                    : 'bg-white text-black'
                  : isLight
                    ? 'text-black/55'
                    : 'text-white/65'
              }`}
            >
              {tab}
            </span>
          ))}
        </div>

        <div className="grid flex-1 items-center gap-6 lg:grid-cols-[0.85fr_1.25fr_0.7fr]">
          <div className="relative z-20">
            <p className={`mb-4 text-xs font-black uppercase tracking-[0.28em] ${isLight ? 'text-black/45' : 'text-white/65'}`}>
              {look.tag}
            </p>
            <h2
              className="max-w-md text-4xl leading-[0.95] tracking-[-0.04em] sm:text-5xl"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Wear Confidence Define Your Style.
            </h2>
            <p className={`mt-5 max-w-md text-sm leading-7 ${isLight ? 'text-black/62' : 'text-white/70'}`}>
              {look.detail}
            </p>
            <button
              type="button"
              className={`mt-7 rounded-full px-5 py-3 text-xs font-black uppercase tracking-[0.18em] ${
                isLight ? 'bg-black text-white' : 'bg-white text-black'
              }`}
            >
              Book fitting
            </button>

            <div className="mt-9 flex items-center gap-3">
              {look.swatches.map((swatch) => (
                <span
                  key={swatch}
                  className="h-4 w-4 rounded-full border border-white/45 shadow-lg"
                  style={{ backgroundColor: swatch }}
                />
              ))}
            </div>
          </div>

          <div className="relative flex h-[50vh] min-h-[340px] items-center justify-center lg:h-[68vh]">
            <button
              type="button"
              onClick={onPrev}
              className={`absolute left-0 top-1/2 z-30 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full ${
                isLight ? 'bg-black/10 text-black' : 'bg-white/15 text-white'
              }`}
              aria-label="Previous section"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="absolute bottom-[11%] h-12 w-[46%] rounded-full bg-black/28 blur-2xl" />
            <img
              src={look.visual}
              alt={look.name}
              className="relative z-20 h-full max-h-[680px] w-auto object-contain drop-shadow-[0_50px_45px_rgba(0,0,0,0.34)]"
              draggable={false}
            />

            <button
              type="button"
              onClick={onNext}
              className={`absolute right-0 top-1/2 z-30 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full ${
                isLight ? 'bg-black/10 text-black' : 'bg-white/15 text-white'
              }`}
              aria-label="Next section"
            >
              <ArrowRight size={18} />
            </button>

            <div className="absolute bottom-5 left-1/2 z-30 -translate-x-1/2 text-center">
              <p className={`text-xs ${isLight ? 'text-black/45' : 'text-white/55'}`}>{look.name}</p>
              <p className="text-sm font-black">{look.line}</p>
            </div>
          </div>

          <div className="relative z-20 flex flex-col items-start gap-7 lg:items-end">
            <div className="text-left lg:text-right">
              <p className={`text-xs font-black uppercase tracking-[0.28em] ${isLight ? 'text-black/45' : 'text-white/55'}`}>
                Starting at
              </p>
              <p className="mt-2 text-2xl font-black">{look.price}</p>
            </div>

            <div className="flex gap-2">
              {look.sizes.map((size) => (
                <span
                  key={size}
                  className={`grid h-11 min-w-11 place-items-center rounded-full px-3 text-[10px] font-black uppercase ${
                    isLight ? 'bg-black text-white' : 'bg-white text-black'
                  }`}
                >
                  {size}
                </span>
              ))}
            </div>

            <div className={`mt-auto hidden rounded-3xl border p-3 lg:block ${isLight ? 'border-black/10 bg-black/5' : 'border-white/12 bg-white/8'}`}>
              <img src={look.visual} alt="" className="h-24 w-20 object-contain" draggable={false} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ContactScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="relative flex h-full w-full items-center overflow-hidden bg-[#080604] px-5 pt-28 sm:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(202,161,73,0.22),transparent_32%)]" />
      <div className="relative mx-auto max-w-5xl">
        <p className="mb-4 text-xs font-black uppercase tracking-[0.34em] text-[#caa149]">Private appointment</p>
        <h2
          className="max-w-4xl text-5xl leading-[0.9] tracking-[-0.04em] text-white sm:text-8xl"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Begin your bespoke fitting.
        </h2>
        <p className="mt-7 max-w-2xl text-base leading-8 text-white/62">
          Calgary · Bespoke tailoring for men and women · By appointment.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <a
            href="mailto:Info@rivaado.com?subject=Rivaado%20fitting%20request"
            className="rounded-full bg-[#caa149] px-7 py-4 text-center text-xs font-black uppercase tracking-[0.2em] text-black no-underline"
          >
            Book fitting
          </a>
          <button
            type="button"
            onClick={onBack}
            className="rounded-full border border-white/20 px-7 py-4 text-xs font-black uppercase tracking-[0.2em] text-white"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  )
}
