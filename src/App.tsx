import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import suitAvatar from '../assets/rivaado-avatar-suit.webp'
import tuxedoAvatar from '../assets/rivaado-avatar-tuxedo.webp'
import coatAvatar from '../assets/rivaado-avatar-coat.webp'
import coutureAvatar from '../assets/rivaado-avatar-couture.webp'

type Page = 'home' | 'about' | 'men' | 'women' | 'accessories' | 'contact'

type Showcase = {
  id: Page
  label: string
  kicker: string
  title: string
  description: string
  price: string
  accent: string
  bg: string
  image: string
  pieces: string[]
  sizes: string[]
}

const NAV_ITEMS: { label: string; page: Page }[] = [
  { label: 'Home', page: 'home' },
  { label: 'About', page: 'about' },
  { label: 'Men', page: 'men' },
  { label: 'Women', page: 'women' },
  { label: 'Accessories', page: 'accessories' },
  { label: 'Contact', page: 'contact' },
]

const SHOWCASES: Showcase[] = [
  {
    id: 'men',
    label: 'Men',
    kicker: 'Bespoke menswear',
    title: 'Three-piece presence',
    description:
      'Structured tailoring for suits, tuxedos, coats and ceremonial dressing — cut around posture, proportion and occasion.',
    price: 'From consultation',
    accent: '#caa149',
    bg: '#15100a',
    image: suitAvatar,
    pieces: ['Suiting', 'Tuxedo', 'Overcoat'],
    sizes: ['38', '40', '42', '44'],
  },
  {
    id: 'women',
    label: 'Women',
    kicker: 'Bespoke womenswear',
    title: 'Power cut in color',
    description:
      'Tailored suits, skirt suits, dresses and couture silhouettes built with strong structure, rich color and refined detail.',
    price: 'Made to measure',
    accent: '#8d1f35',
    bg: '#17070b',
    image: coutureAvatar,
    pieces: ['Power suit', 'Skirt suit', 'Couture'],
    sizes: ['XS', 'S', 'M', 'L'],
  },
  {
    id: 'accessories',
    label: 'Accessories',
    kicker: 'Finishing details',
    title: 'The final signature',
    description:
      'Ties, lapel details, pockets, belts, cuffs and styling pieces that complete the Rivaado silhouette.',
    price: 'Styled by request',
    accent: '#b8946f',
    bg: '#11100f',
    image: coatAvatar,
    pieces: ['Tie', 'Pocket square', 'Lapel'],
    sizes: ['Gold', 'Silk', 'Leather', 'Wool'],
  },
]

const MILESTONES = [
  ['1956', 'First stitch', 'Custom suit tailoring begins the family craft.'],
  ['1964', 'The house forms', 'Sunshine Tailors builds its reputation on fit and trust.'],
  ['1978', 'Craft passed down', 'A new generation trains by hand before design.'],
  ['1984', 'Expansion', 'The tailoring house grows while keeping the same discipline.'],
  ['2012', 'Rivaado identity', 'A sharper modern luxury language takes shape.'],
  ['2016', 'B2B growth', 'Rivaado expands with a stronger tailoring presence.'],
  ['2022', 'Calgary bespoke', 'Rivaado Bespoke Wear arrives for men and women.'],
]

const easing = 'cubic-bezier(0.4,0,0.2,1)'
const validPages = NAV_ITEMS.map((item) => item.page)

export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640)
  const [activeProduct, setActiveProduct] = useState(0)

  useEffect(() => {
    const hash = window.location.hash.replace('#', '') as Page
    if (validPages.includes(hash)) setPage(hash)
  }, [])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const index = SHOWCASES.findIndex((item) => item.id === page)
    if (index >= 0) setActiveProduct(index)
  }, [page])

  const heroVideoSrc = isMobile
    ? '/video/rivaado-hero-mobile.mp4'
    : '/video/rivaado-hero-desktop.mp4'
  const heroPosterSrc = isMobile
    ? '/video/rivaado-hero-poster-mobile.jpg'
    : '/video/rivaado-hero-poster.jpg'

  const activeShowcase = useMemo(() => SHOWCASES[activeProduct], [activeProduct])

  const openPage = (nextPage: Page) => {
    setPage(nextPage)
    window.history.replaceState(null, '', `#${nextPage}`)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const nextProduct = (direction: 'prev' | 'next') => {
    setActiveProduct((current) => {
      const next = direction === 'next'
        ? (current + 1) % SHOWCASES.length
        : (current + SHOWCASES.length - 1) % SHOWCASES.length
      const nextPage = SHOWCASES[next].id
      setPage(nextPage)
      window.history.replaceState(null, '', `#${nextPage}`)
      return next
    })
  }

  return (
    <main
      className="min-h-screen w-full overflow-x-hidden bg-black text-white"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <Header page={page} openPage={openPage} />

      {page === 'home' && (
        <HomePage
          heroVideoSrc={heroVideoSrc}
          heroPosterSrc={heroPosterSrc}
          openPage={openPage}
        />
      )}

      {page === 'about' && <AboutPage openPage={openPage} />}

      {(page === 'men' || page === 'women' || page === 'accessories') && (
        <ShowcasePage
          active={activeShowcase}
          activeProduct={activeProduct}
          setProduct={(index) => {
            setActiveProduct(index)
            openPage(SHOWCASES[index].id)
          }}
          nextProduct={nextProduct}
        />
      )}

      {page === 'contact' && <ContactPage openPage={openPage} />}
    </main>
  )
}

function Header({ page, openPage }: { page: Page; openPage: (page: Page) => void }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 py-4 sm:px-8 sm:py-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full border border-white/15 bg-black/45 px-4 py-3 shadow-2xl shadow-black/30 backdrop-blur-md sm:px-6">
        <button
          type="button"
          onClick={() => openPage('home')}
          className="text-xs font-semibold uppercase tracking-[0.25em] text-white sm:text-sm"
        >
          RIVAADO
        </button>

        <nav className="hidden items-center gap-6 lg:gap-8 sm:flex" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.page}
              type="button"
              onClick={() => openPage(item.page)}
              className={`text-[11px] font-semibold uppercase tracking-[0.2em] transition ${
                page === item.page ? 'text-white' : 'text-white/62 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => openPage('contact')}
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
            onClick={() => openPage(item.page)}
            className={`shrink-0 rounded-full border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] backdrop-blur-md ${
              page === item.page
                ? 'border-white/50 bg-white text-black'
                : 'border-white/15 bg-black/35 text-white/85'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  )
}

function HomePage({
  heroVideoSrc,
  heroPosterSrc,
  openPage,
}: {
  heroVideoSrc: string
  heroPosterSrc: string
  openPage: (page: Page) => void
}) {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black">
      <video
        key={heroVideoSrc}
        className="absolute inset-0 h-full w-full object-cover"
        src={heroVideoSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={heroPosterSrc}
        aria-label="Rivaado bespoke tailoring campaign film"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.06)_42%,rgba(0,0,0,0.86)_100%)]" />

      <div className="absolute inset-x-0 bottom-0 z-20 px-5 pb-8 sm:px-9 sm:pb-12">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-white/75">
          Bespoke tailoring house
        </p>
        <h1
          className="max-w-5xl uppercase leading-[0.82] tracking-[-0.06em] text-white"
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: 'clamp(4rem, 14vw, 13rem)',
          }}
        >
          Rivaado
        </h1>
        <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-xl text-sm leading-6 text-white/78 sm:text-base sm:leading-7">
            A cinematic bespoke experience for men and women — refined suits,
            couture silhouettes, ceremonial tailoring and made-to-measure detail.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => openPage('men')}
              className="rounded-full border border-white/60 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-black"
            >
              Men
            </button>
            <button
              type="button"
              onClick={() => openPage('women')}
              className="rounded-full border border-white/60 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-black"
            >
              Women
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function AboutPage({ openPage }: { openPage: (page: Page) => void }) {
  return (
    <section className="min-h-screen bg-[#070604] px-5 pb-14 pt-32 sm:px-8 sm:pb-20 sm:pt-36">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
          <div className="relative min-h-[540px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/40">
            <picture>
              <source media="(max-width: 640px)" srcSet="/video/rivaado-hero-poster-mobile.jpg" />
              <img
                src="/video/rivaado-hero-poster.jpg"
                alt="Rivaado bespoke tailoring editorial"
                className="h-full min-h-[540px] w-full object-cover opacity-80"
              />
            </picture>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.82))]" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.32em] text-[#caa149]">
                About Rivaado
              </p>
              <h2
                className="text-5xl leading-[0.9] tracking-[-0.05em] text-white sm:text-7xl"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                Seventy years of cloth, cut and quiet confidence.
              </h2>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-black/45 p-6 sm:p-8 lg:p-10">
            <p className="max-w-2xl text-lg leading-9 text-white/70">
              Rivaado is not built around noise. It is built around measurement,
              proportion and the kind of presence that does not need to announce
              itself. The story begins with custom suit tailoring and continues
              as a modern bespoke house for men and women.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {MILESTONES.map(([year, title, body]) => (
                <article
                  key={year}
                  className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 transition hover:border-[#caa149]/55 hover:bg-[#caa149]/10"
                >
                  <p className="text-3xl font-black text-[#caa149]">{year}</p>
                  <h3 className="mt-4 text-sm font-black uppercase tracking-[0.18em] text-white">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/55">{body}</p>
                </article>
              ))}
            </div>

            <button
              type="button"
              onClick={() => openPage('contact')}
              className="mt-8 rounded-full bg-[#caa149] px-6 py-4 text-xs font-black uppercase tracking-[0.2em] text-black transition hover:bg-white"
            >
              Begin fitting
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function ShowcasePage({
  active,
  activeProduct,
  setProduct,
  nextProduct,
}: {
  active: Showcase
  activeProduct: number
  setProduct: (index: number) => void
  nextProduct: (direction: 'prev' | 'next') => void
}) {
  const bgStyle: CSSProperties = {
    background:
      `radial-gradient(circle at 70% 18%, ${active.accent}33, transparent 28%), linear-gradient(135deg, ${active.bg}, #050505 68%)`,
    transition: `background 650ms ${easing}`,
  }

  return (
    <section className="relative min-h-screen overflow-hidden px-5 pb-10 pt-32 sm:px-8 sm:pt-36" style={bgStyle}>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[length:82px_82px]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-10rem)] max-w-7xl grid-cols-1 items-center gap-8 lg:grid-cols-[0.86fr_1.08fr_0.62fr]">
        <div className="z-10">
          <p className="text-xs font-black uppercase tracking-[0.34em]" style={{ color: active.accent }}>
            {active.kicker}
          </p>
          <h2
            className="mt-5 max-w-xl text-6xl uppercase leading-[0.85] tracking-[-0.06em] text-white sm:text-8xl"
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            {active.title}
          </h2>
          <p className="mt-6 max-w-md text-base leading-8 text-white/68">
            {active.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {active.pieces.map((piece) => (
              <span
                key={piece}
                className="rounded-full border border-white/16 bg-black/25 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/75 backdrop-blur"
              >
                {piece}
              </span>
            ))}
          </div>
        </div>

        <div className="relative flex min-h-[440px] items-end justify-center lg:min-h-[620px]">
          <div
            className="absolute bottom-10 h-20 w-72 rounded-full blur-2xl"
            style={{ backgroundColor: `${active.accent}40` }}
          />
          <div
            className="pointer-events-none absolute left-1/2 top-12 -translate-x-1/2 select-none text-[28vw] font-black uppercase leading-none tracking-[-0.08em] text-white/[0.035] lg:text-[13rem]"
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            {active.label}
          </div>
          <img
            src={active.image}
            alt={active.title}
            className="relative z-10 h-[430px] w-auto object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.55)] sm:h-[560px] lg:h-[690px]"
          />
        </div>

        <div className="z-10 rounded-[2rem] border border-white/12 bg-black/35 p-5 backdrop-blur-md sm:p-6">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/45">
            Rivaado selection
          </p>
          <p className="mt-4 text-2xl font-black uppercase tracking-[-0.03em] text-white">
            {active.price}
          </p>

          <div className="mt-7 grid grid-cols-2 gap-3">
            {active.sizes.map((size) => (
              <div
                key={size}
                className="flex aspect-square items-center justify-center rounded-full border text-xs font-black uppercase tracking-[0.16em]"
                style={{ borderColor: `${active.accent}80`, color: 'white' }}
              >
                {size}
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => nextProduct('prev')}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-white transition hover:bg-white hover:text-black"
              aria-label="Previous category"
            >
              <ArrowLeft size={19} />
            </button>
            <div className="flex gap-2">
              {SHOWCASES.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setProduct(index)}
                  className="h-2.5 rounded-full transition-all"
                  style={{
                    width: activeProduct === index ? 28 : 10,
                    backgroundColor: activeProduct === index ? active.accent : 'rgba(255,255,255,0.25)',
                  }}
                  aria-label={`Open ${item.label}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => nextProduct('next')}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-white transition hover:bg-white hover:text-black"
              aria-label="Next category"
            >
              <ArrowRight size={19} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function ContactPage({ openPage }: { openPage: (page: Page) => void }) {
  return (
    <section className="flex min-h-screen items-center bg-[#060504] px-5 py-32 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.34em] text-[#caa149]">
            Private appointment
          </p>
          <h2
            className="mt-5 text-6xl uppercase leading-[0.88] tracking-[-0.06em] text-white sm:text-8xl"
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            Begin your bespoke journey.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-8 text-white/62">
            Book a fitting for menswear, womenswear or styling details. Rivaado
            will guide you from consultation to final fit.
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 sm:p-8">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/45">
            Contact
          </p>
          <a
            href="mailto:Info@rivaado.com?subject=Rivaado%20fitting%20request"
            className="mt-5 block text-2xl font-black text-white no-underline sm:text-3xl"
          >
            Info@rivaado.com
          </a>
          <a
            href="tel:+18258837766"
            className="mt-4 block text-2xl font-black text-[#caa149] no-underline sm:text-3xl"
          >
            +1 825-883-7766
          </a>
          <p className="mt-6 text-sm leading-7 text-white/55">
            Calgary · Bespoke for Men & Women · By Appointment
          </p>
          <button
            type="button"
            onClick={() => openPage('home')}
            className="mt-8 rounded-full border border-white/25 px-6 py-4 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-black"
          >
            Back home
          </button>
        </div>
      </div>
    </section>
  )
}
