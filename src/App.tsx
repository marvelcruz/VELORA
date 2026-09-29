import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react'
import suitAvatar from '../assets/rivaado-avatar-suit.webp'
import tuxedoAvatar from '../assets/rivaado-avatar-tuxedo.webp'
import coatAvatar from '../assets/rivaado-avatar-coat.webp'
import coutureAvatar from '../assets/rivaado-avatar-couture.webp'

const LOOKS = [
  {
    src: suitAvatar,
    bg: '#7F96A8',
    name: 'FORMAL SUIT',
    description:
      'A made-to-measure suit shaped around your posture, proportions and occasion. Clean lines, premium cloth and a precise bespoke finish.',
  },
  {
    src: tuxedoAvatar,
    bg: '#30343A',
    name: 'CLASSIC TUXEDO',
    description:
      'Black-tie tailoring with satin detailing, formal proportions and a refined evening silhouette built to fit you.',
  },
  {
    src: coatAvatar,
    bg: '#B8946F',
    name: 'LONG COAT',
    description:
      'A tailored outer layer with structure, warmth and an elegant line designed to sit cleanly over suiting.',
  },
  {
    src: coutureAvatar,
    bg: '#C8A56B',
    name: 'ASIAN COUTURE',
    description:
      'Ceremonial bespoke wear with rich detailing, formal structure and a heritage-led finish for special occasions.',
  },
] as const

const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Men', href: '#men' },
  { label: 'Women', href: '#women' },
  { label: 'Accessories', href: '#accessories' },
  { label: 'Contact', href: '#contact' },
] as const

const STORY_MARKERS = [
  {
    year: '1956',
    title: 'First stitch',
    body: 'Custom suit tailoring begins the family craft.',
  },
  {
    year: '1964',
    title: 'The house forms',
    body: 'Sunshine Tailors builds its reputation on fit and trust.',
  },
  {
    year: '2012',
    title: 'Rivaado identity',
    body: 'A sharper modern luxury language takes shape.',
  },
  {
    year: '2022',
    title: 'Calgary bespoke',
    body: 'Rivaado Bespoke Wear arrives for men and women.',
  },
] as const

const ATELIER_NOTES = [
  ['Measure', 'Fit begins with posture, shoulder line and proportion.'],
  ['Select', 'Cloth, lining, buttons and finishing details are chosen with intention.'],
  ['Cut', 'Each garment is shaped to create structure without stiffness.'],
  ['Finish', 'Final adjustments bring comfort, presence and personal identity.'],
] as const

const CATEGORY_SECTIONS = [
  {
    id: 'men',
    eyebrow: 'Men',
    title: "Men's bespoke tailoring",
    body:
      'Three-piece suits, tuxedos, overcoats and ceremonial tailoring cut around posture, proportion and presence.',
  },
  {
    id: 'women',
    eyebrow: 'Women',
    title: "Women's bespoke tailoring",
    body:
      'Power suits, skirt suits, dresses, coats and couture pieces with strong structure, rich color and refined detail.',
  },
  {
    id: 'accessories',
    eyebrow: 'Accessories',
    title: 'Finishing details',
    body:
      'Ties, pocket squares, lapel details, belts, bags, cuffs and styling pieces that complete the Rivaado look.',
  },
] as const

type Direction = 'next' | 'prev'
type Role = 'center' | 'left' | 'right' | 'back'

const easing = 'cubic-bezier(0.4,0,0.2,1)'
const gold = '#caa149'

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640)

  useEffect(() => {
    LOOKS.forEach(({ src }) => {
      const image = new Image()
      image.src = src
    })
  }, [])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const roles = useMemo(
    () => ({
      center: activeIndex,
      left: (activeIndex + 3) % 4,
      right: (activeIndex + 1) % 4,
      back: (activeIndex + 2) % 4,
    }),
    [activeIndex],
  )

  const navigate = (direction: Direction) => {
    if (isAnimating) return

    setIsAnimating(true)
    setActiveIndex((prev) =>
      direction === 'next' ? (prev + 1) % 4 : (prev + 3) % 4,
    )

    window.setTimeout(() => setIsAnimating(false), 650)
  }

  const roleFor = (index: number): Role => {
    if (index === roles.center) return 'center'
    if (index === roles.left) return 'left'
    if (index === roles.right) return 'right'
    return 'back'
  }

  const getRoleStyle = (role: Role): CSSProperties => {
    const transition = [
      `transform 650ms ${easing}`,
      `filter 650ms ${easing}`,
      `opacity 650ms ${easing}`,
      `left 650ms ${easing}`,
      `height 650ms ${easing}`,
      `bottom 650ms ${easing}`,
    ].join(', ')

    const base: CSSProperties = {
      position: 'absolute',
      aspectRatio: '0.6 / 1',
      transition,
      willChange: 'transform, filter, opacity',
    }

    if (role === 'center') {
      return {
        ...base,
        transform: `translateX(-50%) scale(${isMobile ? 1.08 : 1.02})`,
        filter: 'blur(0px)',
        opacity: 1,
        zIndex: 20,
        left: '50%',
        height: isMobile ? '68%' : '80%',
        bottom: isMobile ? '10%' : '3%',
      }
    }

    if (role === 'left') {
      return {
        ...base,
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(2px)',
        opacity: 0.85,
        zIndex: 10,
        left: isMobile ? '20%' : '30%',
        height: isMobile ? '16%' : '28%',
        bottom: isMobile ? '32%' : '12%',
      }
    }

    if (role === 'right') {
      return {
        ...base,
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(2px)',
        opacity: 0.85,
        zIndex: 10,
        left: isMobile ? '80%' : '70%',
        height: isMobile ? '16%' : '28%',
        bottom: isMobile ? '32%' : '12%',
      }
    }

    return {
      ...base,
      transform: 'translateX(-50%) scale(1)',
      filter: 'blur(4px)',
      opacity: 1,
      zIndex: 5,
      left: '50%',
      height: isMobile ? '13%' : '22%',
      bottom: isMobile ? '32%' : '12%',
    }
  }

  const active = LOOKS[activeIndex]
  const heroVideoSrc = isMobile
    ? '/video/rivaado-hero-mobile.mp4'
    : '/video/rivaado-hero-desktop.mp4'
  const heroPosterSrc = isMobile
    ? '/video/rivaado-hero-poster-mobile.jpg'
    : '/video/rivaado-hero-poster.jpg'

  return (
    <main
      className="w-full overflow-x-hidden bg-black text-white"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <header className="fixed inset-x-0 top-0 z-50 px-4 py-4 sm:px-8 sm:py-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full border border-white/15 bg-black/35 px-4 py-3 shadow-2xl shadow-black/20 backdrop-blur-md sm:px-6">
          <a
            href="#home"
            className="text-xs font-semibold uppercase tracking-[0.25em] text-white no-underline sm:text-sm"
          >
            RIVAADO
          </a>

          <nav className="hidden items-center gap-6 lg:gap-8 sm:flex" aria-label="Primary navigation">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80 no-underline transition hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a
            href="mailto:Info@rivaado.com?subject=Rivaado%20fitting%20request"
            className="hidden rounded-full border border-white/55 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white no-underline transition hover:bg-white hover:text-black sm:inline-flex"
          >
            Book fitting
          </a>
        </div>

        <nav className="mx-auto mt-3 flex max-w-7xl gap-2 overflow-x-auto pb-1 sm:hidden" aria-label="Mobile navigation">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full border border-white/15 bg-black/35 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/85 no-underline backdrop-blur-md"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <section className="relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-black">
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

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.1)_40%,rgba(0,0,0,0.82)_100%)]" />

        <div
          id="home"
          className="absolute inset-x-0 bottom-0 z-20 px-5 pb-8 sm:px-9 sm:pb-12"
        >
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
              couture silhouettes, ceremonial tailoring and made-to-measure
              detail.
            </p>
            <a
              href="#about"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/60 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white no-underline transition hover:bg-white hover:text-black"
            >
              Our story
              <ArrowDown size={16} strokeWidth={2.25} />
            </a>
          </div>
        </div>
      </section>

      <section id="about" className="relative overflow-hidden bg-[#070604] px-5 py-24 sm:px-8 sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(202,161,73,0.14),transparent_30%),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[length:auto,80px_80px,80px_80px]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-4 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.34em] text-[#caa149]">
                About Rivaado
              </p>
              <h2
                className="max-w-3xl text-4xl leading-[0.95] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                Seventy years of cloth, cut and quiet confidence.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-white/60 sm:text-base">
              Rivaado is not built around noise. It is built around measurement,
              proportion and the kind of presence that does not need to announce
              itself.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
            <div className="group relative min-h-[520px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/40">
              <picture>
                <source media="(max-width: 640px)" srcSet="/video/rivaado-hero-poster-mobile.jpg" />
                <img
                  src="/video/rivaado-hero-poster.jpg"
                  alt="Rivaado bespoke tailoring editorial"
                  className="h-full min-h-[520px] w-full object-cover opacity-85 transition duration-700 group-hover:scale-[1.03]"
                />
              </picture>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.78))]" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-white/12 bg-black/45 backdrop-blur-md">
                  <div className="border-r border-white/10 p-4">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-white/45">Origin</p>
                    <p className="mt-2 text-2xl font-black text-white">1956</p>
                  </div>
                  <div className="border-r border-white/10 p-4">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-white/45">House</p>
                    <p className="mt-2 text-2xl font-black text-white">Rivaado</p>
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-white/45">Now</p>
                    <p className="mt-2 text-2xl font-black text-white">Calgary</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-[2rem] border border-white/10 bg-[#0d0b08]/90 p-6 sm:p-9 lg:p-11">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/45">
                  The story
                </p>
                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  {STORY_MARKERS.map((item) => (
                    <article key={item.year} className="border-t border-white/12 pt-5">
                      <p className="text-3xl font-black tracking-[-0.04em] text-[#caa149]">
                        {item.year}
                      </p>
                      <h3 className="mt-4 text-sm font-bold uppercase tracking-[0.22em] text-white">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-white/55">{item.body}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="mt-10 rounded-3xl border border-[#caa149]/25 bg-[#caa149]/10 p-6">
                <p className="text-lg leading-8 text-white/78 sm:text-xl">
                  The goal is not just a garment. It is the moment the shoulder,
                  waist, cloth and detail finally feel like they belong to one
                  person.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ATELIER_NOTES.map(([title, body], index) => (
              <article
                key={title}
                className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 transition hover:-translate-y-1 hover:border-[#caa149]/45 hover:bg-white/[0.055]"
              >
                <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#caa149]">
                  0{index + 1}
                </p>
                <h3 className="mt-8 text-2xl font-black uppercase tracking-[-0.03em] text-white">
                  {title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/55">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="collection"
        className="relative w-full overflow-hidden"
        style={{
          backgroundColor: active.bg,
          transition: `background-color 650ms ${easing}`,
        }}
      >
        <div className="relative w-full overflow-hidden" style={{ height: '100vh' }}>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              zIndex: 50,
              opacity: 0.4,
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E\")",
              backgroundSize: '200px 200px',
              backgroundRepeat: 'repeat',
            }}
          />

          <div
            className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none"
            style={{
              zIndex: 2,
              top: '18%',
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(90px, 28vw, 380px)',
              fontWeight: 900,
              color: 'white',
              opacity: 1,
              lineHeight: 1,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
            }}
          >
            RIVAADO
          </div>

          <div
            className="absolute top-24 left-4 sm:left-8 text-xs font-semibold uppercase text-white"
            style={{
              zIndex: 60,
              opacity: 0.9,
              letterSpacing: '0.18em',
            }}
          >
            RIVAADO LOOKS
          </div>

          <div className="absolute inset-0" style={{ zIndex: 3 }}>
            {LOOKS.map((item, index) => {
              const role = roleFor(index)
              return (
                <div key={item.src} style={getRoleStyle(role)}>
                  <img
                    src={item.src}
                    alt={item.name}
                    draggable={false}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      objectPosition: 'bottom center',
                    }}
                  />
                </div>
              )
            })}
          </div>

          <div
            className="absolute bottom-6 left-4 sm:bottom-20 sm:left-24"
            style={{ zIndex: 60, maxWidth: 320 }}
          >
            <p
              className="mb-2 sm:mb-3 text-base sm:text-[22px] font-bold uppercase text-white"
              style={{ opacity: 0.95, letterSpacing: '0.02em' }}
            >
              {active.name}
            </p>

            <p
              className="hidden sm:block text-xs sm:text-sm text-white mb-4 sm:mb-5"
              style={{ opacity: 0.85, lineHeight: 1.6 }}
            >
              {active.description}
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('prev')}
                aria-label="Previous garment"
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white bg-transparent text-white flex items-center justify-center hover:scale-[1.08] hover:bg-white/10"
                style={{ transition: 'transform 150ms, background-color 150ms' }}
              >
                <ArrowLeft size={26} strokeWidth={2.25} />
              </button>

              <button
                type="button"
                onClick={() => navigate('next')}
                aria-label="Next garment"
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white bg-transparent text-white flex items-center justify-center hover:scale-[1.08] hover:bg-white/10"
                style={{ transition: 'transform 150ms, background-color 150ms' }}
              >
                <ArrowRight size={26} strokeWidth={2.25} />
              </button>
            </div>
          </div>

          <div
            className="absolute bottom-6 right-4 sm:bottom-20 sm:right-10"
            style={{ zIndex: 60 }}
          >
            <a
              href="mailto:Info@rivaado.com?subject=Rivaado%20fitting%20request"
              className="flex items-center gap-2 text-white no-underline uppercase hover:opacity-100"
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: 'clamp(20px, 4vw, 56px)',
                fontWeight: 400,
                opacity: 0.95,
                letterSpacing: '-0.02em',
                lineHeight: 1,
                transition: 'opacity 200ms',
              }}
            >
              BOOK FITTING
              <ArrowRight
                className="w-5 h-5 sm:w-8 sm:h-8"
                strokeWidth={2.25}
              />
            </a>
          </div>
        </div>
      </section>

      <section className="bg-[#050505] px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {CATEGORY_SECTIONS.map((item) => (
            <article
              key={item.id}
              id={item.id}
              className="group min-h-[360px] rounded-[2rem] border border-white/10 bg-white/[0.035] p-7 transition hover:-translate-y-1 hover:border-[#caa149]/45 sm:p-9"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#caa149]">
                {item.eyebrow}
              </p>
              <h2
                className="mt-16 text-4xl uppercase leading-[0.95] tracking-[-0.04em] text-white sm:text-5xl"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                {item.title}
              </h2>
              <p className="mt-6 max-w-sm text-sm leading-7 text-white/58">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="bg-black px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-[#caa149]/25 bg-[#caa149]/10 p-8 sm:p-12 lg:p-16">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#caa149]">
            Calgary by appointment
          </p>
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <h2
              className="max-w-3xl text-5xl uppercase leading-[0.9] tracking-[-0.05em] text-white sm:text-7xl"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              Begin your bespoke journey.
            </h2>
            <a
              href="mailto:Info@rivaado.com?subject=Rivaado%20fitting%20request"
              className="inline-flex w-fit items-center gap-3 rounded-full bg-[#caa149] px-6 py-4 text-xs font-black uppercase tracking-[0.2em] text-black no-underline transition hover:bg-white"
            >
              Book fitting
              <ArrowRight size={18} strokeWidth={2.5} />
            </a>
          </div>
          <div className="mt-8 flex flex-col gap-3 text-sm text-white/60 sm:flex-row sm:gap-8">
            <span>Info@rivaado.com</span>
            <span>+1 825-883-7766</span>
            <span>751 3 St SW C-212, Calgary</span>
          </div>
        </div>
      </section>
    </main>
  )
}
