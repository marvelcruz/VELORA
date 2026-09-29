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

const STORY_MARKS = [
  {
    year: '1956',
    kicker: 'First stitch',
    body: 'A custom suit tailor begins the craft that becomes the Rivaado bloodline.',
  },
  {
    year: '1964',
    kicker: 'The house forms',
    body: 'Sunshine Tailors gives the family craft a name, a workshop and a reputation for fit.',
  },
  {
    year: '1978',
    kicker: 'The craft is passed down',
    body: 'A new generation trains by hand, learning discipline before design.',
  },
  {
    year: '2012',
    kicker: 'Rivaado identity',
    body: 'Heritage tailoring becomes a sharper modern luxury language.',
  },
  {
    year: '2022',
    kicker: 'Calgary bespoke',
    body: 'Rivaado Bespoke Wear arrives in Calgary for men, women and ceremonial dressing.',
  },
] as const

const ATELIER_STEPS = [
  ['01', 'Measure', 'Posture, shoulder line, proportion and presence are studied first.'],
  ['02', 'Cut', 'Fabric is selected and shaped for the body, not the mannequin.'],
  ['03', 'Shape', 'Structure, drape and balance are refined through fitting.'],
  ['04', 'Finish', 'The final details turn cloth into confidence.'],
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
    <main className="w-full overflow-x-hidden bg-black text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <header className="fixed inset-x-0 top-0 z-50 px-4 py-4 sm:px-8 sm:py-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full border border-white/15 bg-black/35 px-4 py-3 shadow-2xl shadow-black/20 backdrop-blur-md sm:px-6">
          <a href="#home" className="text-xs font-semibold uppercase tracking-[0.25em] text-white no-underline sm:text-sm">
            RIVAADO
          </a>

          <nav className="hidden items-center gap-6 lg:gap-8 sm:flex" aria-label="Primary navigation">
            {NAV_ITEMS.map((item) => (
              <a key={item.href} href={item.href} className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80 no-underline transition hover:text-white">
                {item.label}
              </a>
            ))}
          </nav>

          <a href="mailto:Info@rivaado.com?subject=Rivaado%20fitting%20request" className="hidden rounded-full border border-white/55 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white no-underline transition hover:bg-white hover:text-black sm:inline-flex">
            Book fitting
          </a>
        </div>

        <nav className="mx-auto mt-3 flex max-w-7xl gap-2 overflow-x-auto pb-1 sm:hidden" aria-label="Mobile navigation">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} className="shrink-0 rounded-full border border-white/15 bg-black/35 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/85 no-underline backdrop-blur-md">
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
        <div id="home" className="absolute inset-x-0 bottom-0 z-20 px-5 pb-8 sm:px-9 sm:pb-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-white/75">Bespoke tailoring house</p>
          <h1 className="max-w-5xl uppercase leading-[0.82] tracking-[-0.06em] text-white" style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(4rem, 14vw, 13rem)' }}>
            Rivaado
          </h1>
          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-xl text-sm leading-6 text-white/78 sm:text-base sm:leading-7">
              A cinematic bespoke experience for men and women — refined suits, couture silhouettes, ceremonial tailoring and made-to-measure detail.
            </p>
            <a href="#about" className="inline-flex w-fit items-center gap-2 rounded-full border border-white/60 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white no-underline transition hover:bg-white hover:text-black">
              Enter the house
              <ArrowDown size={16} strokeWidth={2.25} />
            </a>
          </div>
        </div>
      </section>

      <section id="about" className="relative overflow-hidden bg-[#050403] px-5 py-24 sm:px-8 sm:py-32">
        <div className="pointer-events-none absolute left-1/2 top-8 -translate-x-1/2 select-none text-[24vw] font-black uppercase leading-none tracking-[-0.08em] text-white/[0.025]">
          House
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_16%,rgba(202,161,73,0.2),transparent_34%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.08),transparent_26%)]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-7 shadow-2xl shadow-black/40 backdrop-blur sm:p-10 lg:p-12">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.32em] text-[#caa149]">About Rivaado</p>
              <h2 className="text-5xl uppercase leading-[0.88] tracking-[-0.05em] text-white sm:text-7xl lg:text-8xl" style={{ fontFamily: "'Anton', sans-serif" }}>
                Not a store. A house of presence.
              </h2>
              <p className="mt-8 max-w-xl text-base leading-8 text-white/70 sm:text-lg">
                Rivaado is where tailoring heritage becomes modern identity. The story starts with hands, cloth and measurement — then becomes confidence, ceremony and personal power.
              </p>
              <div className="mt-10 grid grid-cols-2 gap-3">
                <div className="rounded-3xl border border-[#caa149]/30 bg-[#caa149]/10 p-5">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#d8ba70]">Origin</p>
                  <p className="mt-3 text-4xl font-black tracking-[-0.04em] text-white">1956</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-black/35 p-5">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">Now</p>
                  <p className="mt-3 text-3xl font-black tracking-[-0.04em] text-white">Calgary</p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-[#caa149]/25 bg-[#100c08] p-6 sm:p-8 lg:p-10">
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(90deg, rgba(202,161,73,0.18) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '56px 56px' }} />
              <div className="relative flex h-full min-h-[520px] flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <p className="max-w-sm text-sm uppercase leading-6 tracking-[0.22em] text-white/55">A visual story of cloth, discipline, family craft and modern luxury.</p>
                  <span className="rounded-full border border-[#caa149]/40 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#d8ba70]">Legacy file</span>
                </div>

                <div className="my-10 grid gap-4 sm:grid-cols-5">
                  {STORY_MARKS.map((mark, index) => (
                    <article key={mark.year} className={`group rounded-[1.5rem] border border-white/10 bg-black/45 p-4 transition duration-300 hover:-translate-y-2 hover:border-[#caa149]/50 hover:bg-[#caa149]/10 ${index % 2 ? 'sm:translate-y-10' : ''}`}>
                      <p className="text-3xl font-black tracking-[-0.06em] text-[#caa149] sm:text-4xl">{mark.year}</p>
                      <h3 className="mt-8 text-sm font-bold uppercase tracking-[0.18em] text-white">{mark.kicker}</h3>
                      <p className="mt-4 text-xs leading-6 text-white/55">{mark.body}</p>
                    </article>
                  ))}
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
                  <p className="text-sm leading-7 text-white/65">
                    The result is not just clothing. It is a controlled silhouette, a refined entrance and a garment that carries memory without looking old.
                  </p>
                  <a href="#contact" className="mt-5 inline-flex rounded-full bg-[#caa149] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-black no-underline sm:mt-0">
                    Begin fitting
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {ATELIER_STEPS.map(([number, title, body]) => (
              <article key={title} className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:border-[#caa149]/45 hover:bg-white/[0.06]">
                <p className="text-sm font-black text-[#caa149]">{number}</p>
                <h3 className="mt-14 text-2xl font-black uppercase tracking-[-0.04em] text-white">{title}</h3>
                <p className="mt-4 text-sm leading-6 text-white/55">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="collection" className="relative w-full overflow-hidden" style={{ backgroundColor: active.bg, transition: `background-color 650ms ${easing}` }}>
        <div className="relative w-full overflow-hidden" style={{ height: '100vh' }}>
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 50, opacity: 0.4, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E\")", backgroundSize: '200px 200px', backgroundRepeat: 'repeat' }} />

          <div className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none" style={{ zIndex: 2, top: '18%', fontFamily: "'Anton', sans-serif", fontSize: 'clamp(90px, 28vw, 380px)', fontWeight: 900, color: 'white', opacity: 1, lineHeight: 1, textTransform: 'uppercase', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
            RIVAADO
          </div>

          <div className="absolute top-24 left-4 text-xs font-semibold uppercase text-white sm:left-8" style={{ zIndex: 60, opacity: 0.9, letterSpacing: '0.18em' }}>
            RIVAADO LOOKS
          </div>

          <div className="absolute inset-0" style={{ zIndex: 3 }}>
            {LOOKS.map((item, index) => {
              const role = roleFor(index)
              return (
                <div key={item.src} style={getRoleStyle(role)}>
                  <img src={item.src} alt={item.name} draggable={false} style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom center' }} />
                </div>
              )
            })}
          </div>

          <div className="absolute bottom-6 left-4 sm:bottom-20 sm:left-24" style={{ zIndex: 60, maxWidth: 320 }}>
            <p className="mb-2 text-base font-bold uppercase text-white sm:mb-3 sm:text-[22px]" style={{ opacity: 0.95, letterSpacing: '0.02em' }}>{active.name}</p>
            <p className="hidden text-xs text-white sm:mb-5 sm:block sm:text-sm" style={{ opacity: 0.85, lineHeight: 1.6 }}>{active.description}</p>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => navigate('prev')} aria-label="Previous garment" className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-transparent text-white hover:scale-[1.08] hover:bg-white/10 sm:h-16 sm:w-16" style={{ transition: 'transform 150ms, background-color 150ms' }}>
                <ArrowLeft size={26} strokeWidth={2.25} />
              </button>
              <button type="button" onClick={() => navigate('next')} aria-label="Next garment" className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-transparent text-white hover:scale-[1.08] hover:bg-white/10 sm:h-16 sm:w-16" style={{ transition: 'transform 150ms, background-color 150ms' }}>
                <ArrowRight size={26} strokeWidth={2.25} />
              </button>
            </div>
          </div>

          <div className="absolute bottom-6 right-4 sm:bottom-20 sm:right-10" style={{ zIndex: 60 }}>
            <a href="mailto:Info@rivaado.com?subject=Rivaado%20fitting%20request" className="flex items-center gap-2 text-white no-underline uppercase hover:opacity-100" style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(20px, 4vw, 56px)', fontWeight: 400, opacity: 0.95, letterSpacing: '-0.02em', lineHeight: 1, transition: 'opacity 200ms' }}>
              BOOK FITTING
              <ArrowRight className="h-5 w-5 sm:h-8 sm:w-8" strokeWidth={2.25} />
            </a>
          </div>
        </div>
      </section>

      <section className="bg-[#050403] px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          {CATEGORY_SECTIONS.map((section) => (
            <article id={section.id} key={section.id} className="min-h-[360px] rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,rgba(202,161,73,0.18),rgba(255,255,255,0.035)_40%,rgba(0,0,0,0.5))] p-7 shadow-2xl shadow-black/30 sm:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#caa149]">{section.eyebrow}</p>
              <h2 className="mt-24 text-4xl uppercase leading-none tracking-[-0.05em] text-white sm:text-6xl" style={{ fontFamily: "'Anton', sans-serif" }}>{section.title}</h2>
              <p className="mt-6 max-w-md text-sm leading-7 text-white/65">{section.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="bg-black px-5 py-20 text-center sm:px-8 sm:py-28">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#caa149]">By appointment</p>
        <h2 className="mx-auto mt-5 max-w-4xl text-5xl uppercase leading-[0.9] tracking-[-0.05em] text-white sm:text-7xl" style={{ fontFamily: "'Anton', sans-serif" }}>
          Begin your bespoke journey.
        </h2>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="mailto:Info@rivaado.com?subject=Rivaado%20fitting%20request" className="rounded-full bg-white px-7 py-4 text-xs font-bold uppercase tracking-[0.18em] text-black no-underline transition hover:bg-[#caa149]">Book consultation</a>
          <a href="tel:+18258837766" className="rounded-full border border-white/20 px-7 py-4 text-xs font-bold uppercase tracking-[0.18em] text-white no-underline transition hover:border-[#caa149] hover:text-[#caa149]">+1 825-883-7766</a>
        </div>
      </section>
    </main>
  )
}
