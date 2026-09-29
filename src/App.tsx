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

const TIMELINE = [
  {
    year: '1956',
    title: 'First stitch',
    body: 'Mr. Sita Ram Chauhan started working as a custom suit tailor.',
  },
  {
    year: '1964',
    title: 'Sunshine Tailors',
    body: 'He established Sunshine Tailors, later becoming one of the most renowned names in Delhi tailoring.',
  },
  {
    year: '1978',
    title: 'Training begins',
    body: 'His son, Mr. Anil Kumar, started training under Mr. Sita Ram.',
  },
  {
    year: '1984',
    title: 'Second store',
    body: 'Sunshine Tailors expanded and launched the second store.',
  },
  {
    year: '2012',
    title: 'Rivaado starts',
    body: 'Rivaado was established by Manuj Chauhan, the third generation of the family.',
  },
  {
    year: '2016',
    title: 'Pan-India expansion',
    body: 'Rivaado expanded pan-India and became one of the leading B2B brands.',
  },
  {
    year: '2022',
    title: 'Calgary bespoke',
    body: 'Manuj set up Rivaado Bespoke Wear in Calgary.',
  },
] as const

const ATELIER_NOTES = [
  ['Measure', 'Posture, shoulder line and proportions are read before cloth is cut.'],
  ['Select', 'Fabric, lining, buttons and finishings are chosen with intention.'],
  ['Shape', 'The garment is built for structure, comfort and presence.'],
  ['Finish', 'Final adjustments bring the piece into the client’s life.'],
] as const

const CATEGORY_SECTIONS = [
  {
    id: 'men',
    eyebrow: 'Men',
    title: "Men's bespoke tailoring",
    pull: 'Commanding structure. Quiet confidence.',
    body:
      'Three-piece suits, tuxedos, overcoats and ceremonial tailoring cut around posture, proportion and presence.',
    image: suitAvatar,
    details: ['Three-piece suits', 'Tuxedos', 'Overcoats', 'Ceremonial wear'],
  },
  {
    id: 'women',
    eyebrow: 'Women',
    title: "Women's bespoke tailoring",
    pull: 'Sharp silhouettes. Rich colour. Personal power.',
    body:
      'Power suits, skirt suits, dresses, coats and couture pieces with strong structure, rich color and refined detail.',
    image: coutureAvatar,
    details: ['Power suits', 'Skirt suits', 'Couture pieces', 'Tailored coats'],
  },
  {
    id: 'accessories',
    eyebrow: 'Accessories',
    title: 'Finishing details',
    pull: 'The final detail is never small.',
    body:
      'Ties, pocket squares, lapel details, belts, bags, cuffs and styling pieces that complete the Rivaado look.',
    image: tuxedoAvatar,
    details: ['Ties', 'Pocket squares', 'Lapel details', 'Cuffs and styling'],
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
              Rivaado is built around measurement, proportion and the kind of
              presence that does not need to announce itself.
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/40">
              <picture>
                <source media="(max-width: 640px)" srcSet="/video/rivaado-hero-poster-mobile.jpg" />
                <img
                  src="/video/rivaado-hero-poster.jpg"
                  alt="Rivaado bespoke tailoring editorial"
                  className="h-[520px] w-full object-cover opacity-85"
                />
              </picture>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.8))]" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#caa149]">
                  Legacy house
                </p>
                <p className="mt-4 max-w-md text-2xl leading-tight text-white sm:text-3xl">
                  From family tailoring to a Calgary bespoke house for men and women.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-4 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-[#caa149]/70 to-transparent sm:block" />
              <div className="space-y-4 sm:pl-12">
                {TIMELINE.map((item, index) => (
                  <article
                    key={item.year}
                    className="group relative rounded-2xl border border-white/10 bg-[#11100d]/85 p-5 shadow-xl shadow-black/25 transition hover:border-[#caa149]/55 hover:bg-[#17140f] sm:p-6"
                  >
                    <div className="absolute -left-[2.9rem] top-7 hidden h-4 w-4 rounded-full border-2 border-[#caa149] bg-[#070604] sm:block" />
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-4xl font-black leading-none text-[#caa149] sm:text-5xl">
                          {item.year}
                        </p>
                        <h3 className="mt-3 text-sm font-black uppercase tracking-[0.24em] text-white">
                          {item.title}
                        </h3>
                      </div>
                      <span className="hidden text-xs text-white/25 sm:block">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <p className="mt-4 max-w-xl text-sm leading-7 text-white/62">
                      {item.body}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ATELIER_NOTES.map(([title, body]) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-black/30 p-6 transition hover:border-[#caa149]/60 hover:bg-[#100d08]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#caa149]">
                  {title}
                </p>
                <p className="mt-4 text-sm leading-7 text-white/62">{body}</p>
              </div>
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

      <section className="bg-[#050403] px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.34em] text-[#caa149]">
              Collections
            </p>
            <h2
              className="text-4xl leading-[0.95] tracking-[-0.04em] text-white sm:text-6xl"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              The same heritage, shaped for every wardrobe.
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {CATEGORY_SECTIONS.map((section, index) => (
              <article
                id={section.id}
                key={section.id}
                className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0e0c09] p-6 shadow-2xl shadow-black/25 transition hover:-translate-y-1 hover:border-[#caa149]/65 sm:p-7"
              >
                <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#caa149]/10 blur-3xl transition group-hover:bg-[#caa149]/20" />
                <div className="mb-8 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#caa149]">
                    {section.eyebrow}
                  </p>
                  <span className="text-xs text-white/25">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="relative mb-8 h-72 overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/35">
                  <img
                    src={section.image}
                    alt={section.title}
                    className="absolute bottom-0 left-1/2 h-[95%] -translate-x-1/2 object-contain transition duration-700 group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.65))]" />
                  <p
                    className="absolute bottom-4 left-4 right-4 text-4xl uppercase leading-none tracking-[-0.04em] text-white/10"
                    style={{ fontFamily: "'Anton', sans-serif" }}
                  >
                    {section.eyebrow}
                  </p>
                </div>

                <h3
                  className="text-3xl uppercase leading-none tracking-[-0.03em] text-white sm:text-4xl"
                  style={{ fontFamily: "'Anton', sans-serif" }}
                >
                  {section.title}
                </h3>
                <p className="mt-4 text-lg leading-7 text-white/82">
                  {section.pull}
                </p>
                <p className="mt-4 text-sm leading-7 text-white/55">
                  {section.body}
                </p>

                <div className="mt-7 grid grid-cols-2 gap-2">
                  {section.details.map((detail) => (
                    <span
                      key={detail}
                      className="rounded-full border border-white/10 bg-black/25 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/60"
                    >
                      {detail}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="bg-black px-5 py-20 text-center sm:px-8 sm:py-28">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.34em] text-[#caa149]">
          Private fitting
        </p>
        <h2
          className="mx-auto max-w-4xl text-5xl uppercase leading-[0.9] tracking-[-0.05em] text-white sm:text-7xl"
          style={{ fontFamily: "'Anton', sans-serif" }}
        >
          Begin your bespoke journey
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/60 sm:text-base">
          Book a consultation for men’s tailoring, women’s bespoke wear,
          ceremonial dressing or accessories.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="mailto:Info@rivaado.com?subject=Rivaado%20fitting%20request"
            className="rounded-full bg-[#caa149] px-7 py-4 text-xs font-black uppercase tracking-[0.2em] text-black no-underline transition hover:bg-white"
          >
            Book consultation
          </a>
          <a
            href="tel:+18258837766"
            className="rounded-full border border-white/20 px-7 py-4 text-xs font-black uppercase tracking-[0.2em] text-white no-underline transition hover:border-white hover:bg-white hover:text-black"
          >
            +1 825-883-7766
          </a>
        </div>
      </section>
    </main>
  )
}
