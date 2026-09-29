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
    panel: '#93A8B8',
    name: 'FORMAL SUIT',
    description:
      'A made-to-measure suit shaped around your posture, proportions and occasion. Clean lines, premium cloth and a precise bespoke finish.',
  },
  {
    src: tuxedoAvatar,
    bg: '#30343A',
    panel: '#4A4F56',
    name: 'CLASSIC TUXEDO',
    description:
      'Black-tie tailoring with satin detailing, formal proportions and a refined evening silhouette built to fit you.',
  },
  {
    src: coatAvatar,
    bg: '#B8946F',
    panel: '#C7A886',
    name: 'LONG COAT',
    description:
      'A tailored outer layer with structure, warmth and an elegant line designed to sit cleanly over suiting.',
  },
  {
    src: coutureAvatar,
    bg: '#C8A56B',
    panel: '#D5B983',
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

const ABOUT_MILESTONES = [
  {
    year: '1956',
    title: 'The first stitch',
    body: 'Mr. Sita Ram Chauhan began working as a custom suit tailor, setting the foundation for a family-led tailoring legacy.',
  },
  {
    year: '1964',
    title: 'Sunshine Tailors begins',
    body: 'The craft evolved into Sunshine Tailors, a tailoring house built on fit, discipline and word-of-mouth trust.',
  },
  {
    year: '1978',
    title: 'The next generation trains',
    body: 'Mr. Anil Kumar began training under Mr. Sita Ram, carrying the precision of bespoke tailoring forward.',
  },
  {
    year: '2012',
    title: 'Rivaado is established',
    body: 'Manuj Chauhan created Rivaado as a modern expression of the family craft, joining heritage with a sharper luxury identity.',
  },
  {
    year: '2022',
    title: 'Calgary bespoke house',
    body: 'Rivaado Bespoke Wear launched in Calgary, bringing made-to-measure elegance to men and women by appointment.',
  },
] as const

const VALUES = [
  {
    title: 'Heritage',
    body: 'A family story shaped by generations of tailoring knowledge and disciplined craftsmanship.',
  },
  {
    title: 'Precision',
    body: 'Every garment is built around posture, proportion, fabric, occasion and personal presence.',
  },
  {
    title: 'Elegance',
    body: 'Modern silhouettes, timeless details and a luxury finish for men and women.',
  },
  {
    title: 'Identity',
    body: 'Bespoke wear made to feel personal, confident and unmistakably yours.',
  },
] as const

const PROCESS_STEPS = [
  'Consultation',
  'Fabric selection',
  'Precision tailoring',
  'Final fitting',
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

      <section id="about" className="relative overflow-hidden bg-[#050403] px-5 py-24 sm:px-8 sm:py-32">
        <div className="pointer-events-none absolute left-1/2 top-8 -translate-x-1/2 select-none text-[22vw] font-black uppercase leading-none tracking-[-0.08em] text-white/[0.025]">
          Legacy
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(202,161,73,0.18),transparent_35%),radial-gradient(circle_at_80%_60%,rgba(255,255,255,0.08),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-7 shadow-2xl shadow-black/30 backdrop-blur sm:p-10 lg:p-12">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.32em] text-[#caa149]">
                About Rivaado
              </p>
              <h2
                className="max-w-4xl text-5xl uppercase leading-[0.9] tracking-[-0.05em] text-white sm:text-7xl lg:text-8xl"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                A legacy tailored through generations.
              </h2>
              <p className="mt-8 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
                Rivaado is built on the patience of old-world tailoring and the
                presence of modern luxury. The work begins with measurement, but
                the real purpose is confidence — a garment that feels personal,
                powerful and unmistakably made for you.
              </p>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
                From family craftsmanship to a Calgary bespoke house, the story
                continues through precision suits, ceremonial pieces, couture
                silhouettes and styling details for both men and women.
              </p>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {[
                  ['70+', 'years of craft'],
                  ['Men + Women', 'bespoke focus'],
                  ['Calgary', 'by appointment'],
                ].map(([number, label]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-black/35 p-5">
                    <p className="text-2xl font-semibold text-white">{number}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-white/45">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[520px] overflow-hidden rounded-[2rem] border border-[#caa149]/35 bg-[#0f0c08] p-8 shadow-2xl shadow-black/40">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(202,161,73,0.25),transparent_40%),radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.16),transparent_18%)]" />
              <div className="absolute -right-16 top-8 h-72 w-72 rounded-full border border-[#caa149]/30" />
              <div className="absolute -bottom-20 -left-16 h-72 w-72 rounded-full border border-white/10" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/55">
                  <span>Atelier Notes</span>
                  <span style={{ color: gold }}>01</span>
                </div>
                <div className="space-y-7">
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-[#caa149]/70 to-transparent" />
                  <p className="text-3xl leading-tight text-white sm:text-4xl">
                    “We do not simply make garments. We shape presence, memory
                    and personal legacy through bespoke craftsmanship.”
                  </p>
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-[#caa149]/70 to-transparent" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#caa149]">
                    Rivaado Bespoke Wear
                  </p>
                  <p className="mt-2 text-sm text-white/55">
                    Consultation · Fabric · Construction · Final Fit
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20">
            <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#caa149]">
                  Timeline
                </p>
                <h3
                  className="mt-3 text-4xl uppercase leading-none tracking-[-0.04em] text-white sm:text-6xl"
                  style={{ fontFamily: "'Anton', sans-serif" }}
                >
                  The story line
                </h3>
              </div>
              <p className="max-w-md text-sm leading-7 text-white/55">
                A cleaner, more cinematic version of the old About page timeline —
                built like an editorial heritage section instead of a template.
              </p>
            </div>

            <div className="relative">
              <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-[#caa149] via-[#caa149]/60 to-transparent md:left-1/2" />
              <div className="space-y-8">
                {ABOUT_MILESTONES.map((item, index) => (
                  <div
                    key={item.year}
                    className={`relative grid gap-5 md:grid-cols-2 ${
                      index % 2 === 0 ? '' : 'md:[&>*:first-child]:col-start-2'
                    }`}
                  >
                    <div className="ml-11 rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-6 transition hover:border-[#caa149]/60 hover:bg-white/[0.06] md:ml-0">
                      <div className="mb-4 flex items-center gap-4">
                        <span className="rounded-full border border-[#caa149]/55 px-4 py-2 text-sm font-bold text-[#caa149]">
                          {item.year}
                        </span>
                        <span className="h-px flex-1 bg-white/10" />
                      </div>
                      <h4 className="text-2xl font-semibold text-white">{item.title}</h4>
                      <p className="mt-3 text-sm leading-7 text-white/58">{item.body}</p>
                    </div>
                    <div className="absolute left-4 top-8 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-[#caa149] bg-black md:left-1/2" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-20 grid gap-4 md:grid-cols-4">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="group rounded-[1.5rem] border border-white/10 bg-black/35 p-6 transition hover:-translate-y-1 hover:border-[#caa149]/60 hover:bg-[#caa149]/10"
              >
                <p className="mb-8 text-xs font-semibold uppercase tracking-[0.28em] text-[#caa149]">
                  {value.title}
                </p>
                <p className="text-sm leading-7 text-white/60 group-hover:text-white/78">
                  {value.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-20 rounded-[2rem] border border-white/10 bg-white/[0.035] p-7 sm:p-10">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#caa149]">
                  The bespoke process
                </p>
                <h3
                  className="mt-4 text-4xl uppercase leading-none tracking-[-0.04em] text-white sm:text-6xl"
                  style={{ fontFamily: "'Anton', sans-serif" }}
                >
                  From first consult to final fit.
                </h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-4">
                {PROCESS_STEPS.map((step, index) => (
                  <div key={step} className="rounded-2xl border border-white/10 bg-black/40 p-5">
                    <p className="text-xs font-semibold text-[#caa149]">0{index + 1}</p>
                    <p className="mt-8 text-sm font-semibold uppercase tracking-[0.16em] text-white">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
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

      <section className="bg-[#050403] px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
          {CATEGORY_SECTIONS.map((section) => (
            <article
              id={section.id}
              key={section.id}
              className="scroll-mt-32 rounded-[2rem] border border-white/10 bg-white/[0.035] p-7 transition hover:-translate-y-1 hover:border-[#caa149]/55 hover:bg-white/[0.055] sm:p-9"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#caa149]">
                {section.eyebrow}
              </p>
              <h3
                className="mt-6 text-4xl uppercase leading-none tracking-[-0.04em] text-white"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                {section.title}
              </h3>
              <p className="mt-6 text-sm leading-7 text-white/58">{section.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="bg-black px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl rounded-[2.2rem] border border-[#caa149]/40 bg-[linear-gradient(135deg,rgba(202,161,73,0.18),rgba(255,255,255,0.035))] p-8 sm:p-12 lg:p-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#caa149]">
                Begin your bespoke journey
              </p>
              <h2
                className="mt-5 max-w-4xl text-5xl uppercase leading-[0.9] tracking-[-0.05em] text-white sm:text-7xl"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                Tailoring made around you.
              </h2>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
                Book a consultation for men’s tailoring, women’s tailoring,
                accessories, ceremonial wear or a complete Rivaado look.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <a
                href="mailto:Info@rivaado.com?subject=Rivaado%20fitting%20request"
                className="inline-flex justify-center rounded-full bg-white px-7 py-4 text-xs font-bold uppercase tracking-[0.18em] text-black no-underline transition hover:bg-[#caa149]"
              >
                Book consultation
              </a>
              <a
                href="tel:+18258837766"
                className="inline-flex justify-center rounded-full border border-white/30 px-7 py-4 text-xs font-bold uppercase tracking-[0.18em] text-white no-underline transition hover:border-white"
              >
                +1 825-883-7766
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
