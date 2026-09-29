import { useEffect, useMemo, useState } from 'react'
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

type Direction = 'next' | 'prev'
type Role = 'center' | 'left' | 'right' | 'back'

const easing = 'cubic-bezier(0.4,0,0.2,1)'

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

  const getRoleStyle = (role: Role): React.CSSProperties => {
    const transition = [
      `transform 650ms ${easing}`,
      `filter 650ms ${easing}`,
      `opacity 650ms ${easing}`,
      `left 650ms ${easing}`,
      `height 650ms ${easing}`,
      `bottom 650ms ${easing}`,
    ].join(', ')

    const base: React.CSSProperties = {
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
        <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-5 sm:px-9 sm:py-7">
          <a
            href="#home"
            className="text-xs font-semibold uppercase tracking-[0.25em] text-white no-underline"
          >
            RIVAADO
          </a>
          <a
            href="mailto:Info@rivaado.com?subject=Rivaado%20fitting%20request"
            className="rounded-full border border-white/55 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white no-underline backdrop-blur-sm transition hover:bg-white hover:text-black sm:text-xs"
          >
            Book fitting
          </a>
        </div>

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
              href="#collection"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/60 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white no-underline transition hover:bg-white hover:text-black"
            >
              Explore looks
              <ArrowDown size={16} strokeWidth={2.25} />
            </a>
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
            className="absolute top-6 left-4 sm:left-8 text-xs font-semibold uppercase text-white"
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
    </main>
  )
}
