import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import suitAvatar from '../assets/rivaado-avatar-suit.webp'
import tuxedoAvatar from '../assets/rivaado-avatar-tuxedo.webp'
import coatAvatar from '../assets/rivaado-avatar-coat.webp'
import coutureAvatar from '../assets/rivaado-avatar-couture.webp'

type Page = 'home' | 'about' | 'men' | 'women' | 'accessories' | 'contact'
type ShowcasePage = 'men' | 'women' | 'accessories'

const NAV_ITEMS: { label: string; page: Page }[] = [
  { label: 'Home', page: 'home' },
  { label: 'About', page: 'about' },
  { label: 'Men', page: 'men' },
  { label: 'Women', page: 'women' },
  { label: 'Accessories', page: 'accessories' },
  { label: 'Contact', page: 'contact' },
]

const SHOWCASES: Record<
  ShowcasePage,
  {
    nav: string
    eyebrow: string
    title: string
    description: string
    bg: string
    accent: string
    src: string
    product: string
    detail: string
    sizes: string[]
    small: string
  }
> = {
  men: {
    nav: 'Men',
    eyebrow: 'Tailored for him',
    title: 'Menswear',
    description:
      'Three-piece suits, tuxedos, overcoats and ceremonial tailoring built around posture, confidence and presence.',
    bg: '#d5a953',
    accent: '#3d2a13',
    src: suitAvatar,
    product: 'Formal Suit',
    detail: 'Bespoke / Made to measure',
    sizes: ['36', '38', '40', '42'],
    small: 'Charcoal wool · full canvas feel',
  },
  women: {
    nav: 'Women',
    eyebrow: 'Tailored for her',
    title: 'Womenswear',
    description:
      'Power suits, skirt suits, dresses, coats and couture silhouettes with strong structure and refined detail.',
    bg: '#b44d63',
    accent: '#2d0f18',
    src: coutureAvatar,
    product: 'Couture Suiting',
    detail: 'Structured / Elegant / Personal',
    sizes: ['XS', 'S', 'M', 'L'],
    small: 'Burgundy, cream, emerald and midnight tones',
  },
  accessories: {
    nav: 'Accessories',
    eyebrow: 'Finishing details',
    title: 'Accessories',
    description:
      'Ties, pocket squares, lapel details, cuffs, belts, bags and styling pieces that complete the Rivaado look.',
    bg: '#c59c6b',
    accent: '#2f2014',
    src: coatAvatar,
    product: 'Final Details',
    detail: 'Selected to complete the silhouette',
    sizes: ['Tie', 'Cuff', 'Belt', 'Bag'],
    small: 'Texture, metal, leather and silk accents',
  },
}

const showcaseOrder: ShowcasePage[] = ['men', 'women', 'accessories']

const STORY = [
  ['1956', 'Mr. Sita Ram Chauhan began working as a custom suit tailor.'],
  ['1964', 'Sunshine Tailors was established and became known for fit.'],
  ['1978', 'The next generation began training in the craft.'],
  ['2012', 'Rivaado became a sharper modern tailoring identity.'],
  ['2022', 'Rivaado Bespoke Wear arrived in Calgary.'],
] as const

function nextShowcase(current: ShowcasePage, direction: 'prev' | 'next'): ShowcasePage {
  const index = showcaseOrder.indexOf(current)
  if (direction === 'next') return showcaseOrder[(index + 1) % showcaseOrder.length]
  return showcaseOrder[(index + showcaseOrder.length - 1) % showcaseOrder.length]
}

export default function App() {
  const [activePage, setActivePage] = useState<Page>('home')
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === 'undefined' ? false : window.innerWidth < 640,
  )

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    ;[suitAvatar, tuxedoAvatar, coatAvatar, coutureAvatar].forEach((src) => {
      const image = new Image()
      image.src = src
    })
  }, [])

  const heroVideoSrc = isMobile
    ? '/video/rivaado-hero-mobile.mp4'
    : '/video/rivaado-hero-desktop.mp4'
  const heroPosterSrc = isMobile
    ? '/video/rivaado-hero-poster-mobile.jpg'
    : '/video/rivaado-hero-poster.jpg'

  const showPage = (page: Page) => {
    setActivePage(page)
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${page}`)
    }
  }

  const currentShowcase: ShowcasePage =
    activePage === 'women' || activePage === 'accessories' ? activePage : 'men'

  const headerStyle: CSSProperties = useMemo(
    () => ({
      background:
        'linear-gradient(135deg, rgba(8, 7, 5, 0.78), rgba(8, 7, 5, 0.42))',
      boxShadow: '0 18px 60px rgba(0,0,0,0.35)',
    }),
    [],
  )

  return (
    <main
      className="relative h-[100svh] w-full overflow-hidden bg-black text-white"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <header className="fixed inset-x-0 top-0 z-50 px-4 py-4 sm:px-8 sm:py-6">
        <div
          className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full border border-white/15 px-4 py-3 backdrop-blur-xl sm:px-6"
          style={headerStyle}
        >
          <button
            type="button"
            onClick={() => showPage('home')}
            className="text-xs font-semibold uppercase tracking-[0.28em] text-white sm:text-sm"
          >
            RIVAADO
          </button>

          <nav className="hidden items-center gap-6 lg:gap-8 sm:flex" aria-label="Primary navigation">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.page}
                type="button"
                onClick={() => showPage(item.page)}
                className={`text-[11px] font-semibold uppercase tracking-[0.2em] transition ${
                  activePage === item.page ? 'text-white' : 'text-white/62 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => showPage('contact')}
            className="hidden rounded-full border border-white/55 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-black sm:inline-flex"
          >
            Book fitting
          </button>
        </div>

        <nav className="mx-auto mt-3 flex max-w-7xl gap-2 overflow-x-auto pb-1 sm:hidden" aria-label="Mobile navigation">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.page}
              type="button"
              onClick={() => showPage(item.page)}
              className={`shrink-0 rounded-full border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] backdrop-blur-md ${
                activePage === item.page
                  ? 'border-white bg-white text-black'
                  : 'border-white/15 bg-black/35 text-white/85'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      {activePage === 'home' && (
        <HomeSection videoSrc={heroVideoSrc} posterSrc={heroPosterSrc} onExplore={() => showPage('men')} />
      )}

      {activePage === 'about' && <AboutSection />}

      {(activePage === 'men' || activePage === 'women' || activePage === 'accessories') && (
        <ShowcaseSection
          page={currentShowcase}
          onSelect={(page) => showPage(page)}
          onMove={(direction) => showPage(nextShowcase(currentShowcase, direction))}
        />
      )}

      {activePage === 'contact' && <ContactSection />}
    </main>
  )
}

function HomeSection({
  videoSrc,
  posterSrc,
  onExplore,
}: {
  videoSrc: string
  posterSrc: string
  onExplore: () => void
}) {
  return (
    <section className="relative h-full w-full overflow-hidden bg-black">
      <video
        key={videoSrc}
        className="absolute inset-0 h-full w-full object-cover"
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={posterSrc}
        aria-label="Rivaado bespoke tailoring campaign film"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.52)_0%,rgba(0,0,0,0.05)_42%,rgba(0,0,0,0.86)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 z-20 px-5 pb-8 sm:px-9 sm:pb-12">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-white/75">
          Bespoke tailoring house
        </p>
        <h1
          className="max-w-5xl uppercase leading-[0.82] tracking-[-0.06em] text-white"
          style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(4rem, 14vw, 13rem)' }}
        >
          Rivaado
        </h1>
        <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-xl text-sm leading-6 text-white/78 sm:text-base sm:leading-7">
            A cinematic bespoke experience for men and women — refined suits,
            couture silhouettes, ceremonial tailoring and made-to-measure detail.
          </p>
          <button
            type="button"
            onClick={onExplore}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/60 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-black"
          >
            Explore collection
            <ArrowRight size={16} strokeWidth={2.25} />
          </button>
        </div>
      </div>
    </section>
  )
}

function ShowcaseSection({
  page,
  onSelect,
  onMove,
}: {
  page: ShowcasePage
  onSelect: (page: ShowcasePage) => void
  onMove: (direction: 'prev' | 'next') => void
}) {
  const item = SHOWCASES[page]

  return (
    <section
      className="relative h-full w-full overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: item.bg }}
    >
      <div className="absolute inset-0 opacity-[0.22] mix-blend-multiply">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.72),transparent_35%),linear-gradient(90deg,rgba(0,0,0,0.14)_1px,transparent_1px),linear-gradient(180deg,rgba(0,0,0,0.12)_1px,transparent_1px)] bg-[length:auto,72px_72px,72px_72px]" />
      </div>

      <div className="absolute inset-x-0 top-[6.5rem] z-20 flex justify-center px-5 sm:top-[7.5rem]">
        <div className="flex rounded-full border border-black/12 bg-white/24 p-1 shadow-2xl shadow-black/10 backdrop-blur-xl">
          {showcaseOrder.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(key)}
              className={`rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] transition sm:px-6 sm:text-xs ${
                page === key ? 'bg-black text-white' : 'text-black/70 hover:bg-white/40'
              }`}
            >
              {SHOWCASES[key].nav}
            </button>
          ))}
        </div>
      </div>

      <div className="absolute left-5 top-[23%] z-20 max-w-[19rem] sm:left-12 lg:left-20 lg:max-w-[24rem]">
        <p className="mb-4 text-[11px] font-black uppercase tracking-[0.34em] text-black/55">
          {item.eyebrow}
        </p>
        <h2
          className="uppercase leading-[0.82] tracking-[-0.07em] text-black"
          style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(4rem, 10vw, 10rem)' }}
        >
          {item.title}
        </h2>
        <p className="mt-5 max-w-sm text-sm font-medium leading-7 text-black/64 sm:text-base">
          {item.description}
        </p>
        <button className="mt-7 rounded-full bg-black px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-white shadow-2xl shadow-black/25 transition hover:scale-105">
          Book look
        </button>
      </div>

      <div className="absolute inset-0 z-10 flex items-end justify-center pb-[7vh] sm:pb-[5vh]">
        <div className="absolute bottom-[9vh] h-12 w-[20rem] rounded-full bg-black/28 blur-2xl sm:w-[34rem]" />
        <img
          src={item.src}
          alt={item.product}
          draggable={false}
          className="relative z-10 max-h-[64vh] max-w-[74vw] object-contain drop-shadow-[0_42px_42px_rgba(0,0,0,0.42)] transition duration-700 sm:max-h-[72vh] lg:max-h-[78vh]"
        />
      </div>

      <div className="absolute right-5 top-[26%] z-20 hidden w-[16rem] text-black lg:block">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/45">Rivaado Select</p>
        <h3 className="mt-3 text-4xl font-black uppercase leading-none tracking-[-0.04em]">
          {item.product}
        </h3>
        <p className="mt-3 text-sm font-semibold leading-6 text-black/58">{item.detail}</p>

        <div className="mt-8">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.24em] text-black/48">
            Options
          </p>
          <div className="grid grid-cols-2 gap-3">
            {item.sizes.map((size) => (
              <button
                key={size}
                className="aspect-square rounded-full border border-black/20 bg-white/22 text-xs font-black uppercase tracking-[0.08em] text-black backdrop-blur transition hover:bg-black hover:text-white"
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-30 hidden -translate-x-1/2 items-center gap-4 rounded-[2rem] border border-black/10 bg-white/25 p-3 pr-7 text-black shadow-2xl shadow-black/15 backdrop-blur-xl sm:flex">
        <div className="flex h-20 w-20 items-end justify-center overflow-hidden rounded-2xl bg-black/10">
          <img src={item.src} alt="" className="h-full object-contain" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-black/45">Current look</p>
          <p className="mt-1 text-sm font-black uppercase tracking-[0.12em] text-black">{item.small}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onMove('prev')}
        className="absolute left-4 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-black/20 bg-white/22 text-black backdrop-blur transition hover:bg-black hover:text-white sm:left-8 sm:h-16 sm:w-16"
        aria-label="Previous category"
      >
        <ArrowLeft size={26} />
      </button>
      <button
        type="button"
        onClick={() => onMove('next')}
        className="absolute right-4 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-black/20 bg-white/22 text-black backdrop-blur transition hover:bg-black hover:text-white sm:right-8 sm:h-16 sm:w-16"
        aria-label="Next category"
      >
        <ArrowRight size={26} />
      </button>
    </section>
  )
}

function AboutSection() {
  return (
    <section className="relative h-full w-full overflow-hidden bg-[#060504] px-5 pt-32 sm:px-10 sm:pt-36">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(202,161,73,0.16),transparent_32%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.07),transparent_28%)]" />
      <div className="relative mx-auto grid h-[calc(100svh-9rem)] max-w-7xl gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
        <div>
          <p className="mb-5 text-xs font-black uppercase tracking-[0.34em] text-[#caa149]">About Rivaado</p>
          <h2
            className="max-w-2xl leading-[0.92] tracking-[-0.05em] text-white"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 'clamp(3rem, 7vw, 7rem)' }}
          >
            A tailoring legacy shaped across generations.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-8 text-white/66">
            From custom suit tailoring to a modern Calgary bespoke house,
            Rivaado carries a family craft into a sharper world of men’s and
            women’s tailoring.
          </p>
        </div>

        <div className="relative hidden h-[70vh] min-h-[500px] lg:block">
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-[#caa149] via-[#f1d18a] to-[#caa149]" />
          {STORY.map(([year, body], index) => (
            <div
              key={year}
              className={`absolute flex w-[46%] items-center gap-5 ${index % 2 === 0 ? 'left-0 text-right' : 'right-0'}`}
              style={{ top: `${8 + index * 20}%` }}
            >
              {index % 2 === 0 && <p className="flex-1 text-sm leading-6 text-white/72">{body}</p>}
              <div className="h-4 w-4 rounded-full border-2 border-[#caa149] bg-[#060504] shadow-[0_0_24px_rgba(202,161,73,0.5)]" />
              {index % 2 !== 0 && <p className="flex-1 text-sm leading-6 text-white/72">{body}</p>}
              <span className="absolute -top-7 text-3xl font-black text-[#caa149]" style={index % 2 === 0 ? { right: 0 } : { left: 0 }}>
                {year}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ContactSection() {
  return (
    <section className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#070503] px-5 text-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(202,161,73,0.18),transparent_35%)]" />
      <div className="relative max-w-4xl">
        <p className="mb-5 text-xs font-black uppercase tracking-[0.34em] text-[#caa149]">Private appointment</p>
        <h2
          className="uppercase leading-[0.86] tracking-[-0.06em] text-white"
          style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(4rem, 12vw, 11rem)' }}
        >
          Begin fitting
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-white/65">
          Book a Rivaado consultation for bespoke menswear, womenswear,
          ceremonial looks and finishing accessories.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="mailto:Info@rivaado.com?subject=Rivaado%20fitting%20request"
            className="rounded-full bg-[#caa149] px-7 py-4 text-xs font-black uppercase tracking-[0.2em] text-black no-underline"
          >
            Info@rivaado.com
          </a>
          <a
            href="tel:+18258837766"
            className="rounded-full border border-white/20 px-7 py-4 text-xs font-black uppercase tracking-[0.2em] text-white no-underline"
          >
            +1 825-883-7766
          </a>
        </div>
      </div>
    </section>
  )
}
