import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const IMAGES = [
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png',
    bg: '#F4845F',
    panel: '#F79B7F',
  },
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png',
    bg: '#6BBF7A',
    panel: '#85CC92',
  },
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png',
    bg: '#E882B4',
    panel: '#ED9DC4',
  },
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png',
    bg: '#6EB5FF',
    panel: '#8DC4FF',
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
    IMAGES.forEach(({ src }) => {
      const image = new Image()
      image.src = src
    })
  }, [])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const roles = useMemo(() => {
    return {
      center: activeIndex,
      left: (activeIndex + 3) % 4,
      right: (activeIndex + 1) % 4,
      back: (activeIndex + 2) % 4,
    }
  }, [activeIndex])

  const navigate = (direction: Direction) => {
    if (isAnimating) return

    setIsAnimating(true)
    setActiveIndex((prev) =>
      direction === 'next' ? (prev + 1) % 4 : (prev + 3) % 4,
    )

    window.setTimeout(() => {
      setIsAnimating(false)
    }, 650)
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
        transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`,
        filter: 'blur(0px)',
        opacity: 1,
        zIndex: 20,
        left: '50%',
        height: isMobile ? '60%' : '92%',
        bottom: isMobile ? '22%' : 0,
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

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: IMAGES[activeIndex].bg,
        transition: `background-color 650ms ${easing}`,
        fontFamily: "'Inter', sans-serif",
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
          3D SHAPE
        </div>

        <div
          className="absolute top-6 left-4 sm:left-8 text-xs font-semibold uppercase text-white"
          style={{
            zIndex: 60,
            opacity: 0.9,
            letterSpacing: '0.18em',
          }}
        >
          TOONHUB
        </div>

        <div className="absolute inset-0" style={{ zIndex: 3 }}>
          {IMAGES.map((item, index) => {
            const role = roleFor(index)

            return (
              <div key={item.src} style={getRoleStyle(role)}>
                <img
                  src={item.src}
                  alt={`TOONHUB figurine ${index + 1}`}
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
          style={{
            zIndex: 60,
            maxWidth: 320,
          }}
        >
          <p
            className="mb-2 sm:mb-3 text-base sm:text-[22px] font-bold uppercase text-white"
            style={{
              opacity: 0.95,
              letterSpacing: '0.02em',
            }}
          >
            TOONHUB FIGURINES
          </p>

          <p
            className="hidden sm:block text-xs sm:text-sm text-white mb-4 sm:mb-5"
            style={{
              opacity: 0.85,
              lineHeight: 1.6,
            }}
          >
            The artwork is stunning, shipped fully prepared. The finish is a
            vision, the 3D craft is flawless. Many thanks! Wishing you the win.
            Order now.
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('prev')}
              aria-label="Previous figurine"
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white bg-transparent text-white flex items-center justify-center hover:scale-[1.08] hover:bg-white/10"
              style={{
                transition: 'transform 150ms, background-color 150ms',
              }}
            >
              <ArrowLeft size={26} strokeWidth={2.25} />
            </button>

            <button
              type="button"
              onClick={() => navigate('next')}
              aria-label="Next figurine"
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white bg-transparent text-white flex items-center justify-center hover:scale-[1.08] hover:bg-white/10"
              style={{
                transition: 'transform 150ms, background-color 150ms',
              }}
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
            href="#"
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
            DISCOVER IT
            <ArrowRight
              className="w-5 h-5 sm:w-8 sm:h-8"
              strokeWidth={2.25}
            />
          </a>
        </div>
      </div>
    </div>
  )
}
