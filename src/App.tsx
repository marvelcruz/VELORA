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

const SHOWCASES = [
  {
    id: 'men',
    active: 'Men',
    bg: '#d8c9a5',
    soft: '#ece2c8',
    text: '#13110d',
    muted: '#4e4738',
    image: suitAvatar,
    accentThumb: tuxedoAvatar,
    headline: 'Wear confidence.\nDefine your style.',
    copy: 'Bespoke suits, dinner jackets, overcoats and ceremonial tailoring shaped for posture, proportion and presence.',
    price: '#10,000',
    oldPrice: '#15,000',
    cta: 'Get the look',
    caption: 'Cut sharper.\nMove better.',
  },
  {
    id: 'women',
    active: 'Women',
    bg: '#b8004d',
    soft: '#e0146d',
    text: '#ffffff',
    muted: '#ffe1ed',
    image: coutureAvatar,
    accentThumb: coatAvatar,
    headline: 'Power in color.\nTailored for her.',
    copy: 'Structured suits, skirt looks, dresses, coats and couture silhouettes with rich color and made-to-measure detail.',
    price: '#12,000',
    oldPrice: '#18,000',
    cta: 'Style the look',
    caption: 'Stand bold.\nFit precise.',
  },
  {
    id: 'accessories',
    active: 'Accessories',
    bg: '#3b3a36',
    soft: '#67635a',
    text: '#ffffff',
    muted: '#ddd6c7',
    image: coatAvatar,
    accentThumb: tuxedoAvatar,
    headline: 'Finish the look.\nControl the detail.',
    copy: 'Ties, lapel accents, pocket squares, shoes, belts and finishing pieces selected to complete the Rivaado silhouette.',
    price: '#4,000',
    oldPrice: '#7,500',
    cta: 'Choose details',
    caption: 'Dress complete.\nPresence finished.',
  },
] as const

const ABOUT_TIMELINE = [
  ['1956', 'First stitch', 'Mr. Sita Ram Chauhan began working as a custom suit tailor.'],
  ['1964', 'The house forms', 'Sunshine Tailors became known for disciplined custom tailoring.'],
  ['1978', 'Craft passed down', 'Mr. Anil Kumar began training under Mr. Sita Ram.'],
  ['1984', 'Second store', 'The tailoring house expanded and launched a second store.'],
  ['2012', 'Rivaado identity', 'Manuj Chauhan established Rivaado as a sharper luxury expression.'],
  ['2016', 'B2B growth', 'Rivaado expanded across India as a leading B2B tailoring brand.'],
  ['2022', 'Calgary bespoke', 'Rivaado Bespoke Wear launched in Calgary for men and women.'],
] as const

type Direction = 'next' | 'prev'
type Role = 'center' | 'left' | 'right' | 'back'

const easing = 'cubic-bezier(0.4,0,0.2,1)'

function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 py-4 sm:px-8 sm:py-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full border border-white/15 bg-black/40 px-4 py-3 shadow-2xl shadow-black/20 backdrop-blur-md sm:px-6">
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
          <a key={item.href} href={item.href} className="shrink-0 rounded-full border border-white/15 bg-black/40 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/85 no-underline backdrop-blur-md">
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  )
}

function ProductShowcase({ category }: { category: (typeof SHOWCASES)[number] }) {
  const darkText = category.text !== '#ffffff'
  const navs = ['Home', 'Men', 'Women', 'Accessories', 'About Us']

  return (
    <section id={category.id} className="relative min-h-[100svh] overflow-hidden px-4 py-8 sm:px-8 sm:py-12" style={{ background: `radial-gradient(circle at 50% 10%, ${category.soft} 0%, ${category.bg} 38%, ${category.bg} 100%)`, color: category.text }}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_52%,rgba(255,255,255,0.28),transparent_20%),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(180deg,rgba(0,0,0,0.08)_1px,transparent_1px)] bg-[length:auto,80px_80px,80px_80px] opacity-40" />
      <div className="relative mx-auto flex min-h-[calc(100svh-4rem)] max-w-7xl items-center justify-center pt-24">
        <div className="relative w-full overflow-hidden rounded-[2rem] border shadow-2xl" style={{ borderColor: darkText ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.18)', boxShadow: '0 30px 80px rgba(0,0,0,.28)' }}>
          <div className="relative min-h-[680px] overflow-hidden px-5 py-5 sm:px-8 sm:py-6 lg:min-h-[760px]">
            <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 py-5 text-[10px] font-semibold uppercase tracking-[0.16em] sm:px-8">
              <span>RIVAADO</span>
              <div className="hidden gap-6 md:flex">
                {navs.map((nav) => (
                  <span key={nav} className={`rounded-full px-3 py-1 ${nav === category.active ? darkText ? 'bg-black text-white' : 'bg-white text-black' : ''}`}>
                    {nav}
                  </span>
                ))}
              </div>
              <div className="flex gap-3 text-lg leading-none">
                <span>♡</span>
                <span>⌕</span>
                <span>◌</span>
              </div>
            </div>

            <div className="absolute left-6 top-[23%] z-20 max-w-[270px] sm:left-10 lg:left-14">
              <h3 className="whitespace-pre-line text-[2.05rem] leading-[1.05] tracking-[-0.05em] sm:text-[2.7rem]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                {category.headline}
              </h3>
              <p className="mt-5 text-xs leading-5 opacity-80 sm:text-sm" style={{ color: category.muted }}>
                {category.copy}
              </p>
              <a href="mailto:Info@rivaado.com?subject=Rivaado%20fitting%20request" className="mt-7 inline-flex rounded-full px-5 py-3 text-[11px] font-bold uppercase tracking-[0.14em] no-underline" style={{ background: darkText ? '#050505' : '#ffffff', color: darkText ? '#ffffff' : '#050505' }}>
                {category.cta} →
              </a>
            </div>

            <div className="absolute right-6 top-[24%] z-20 text-right sm:right-10 lg:right-14">
              <p className="text-sm font-black tracking-tight sm:text-lg">{category.price}</p>
              <p className="text-xs font-bold line-through opacity-70 sm:text-sm">{category.oldPrice}</p>
              <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] opacity-75">Choose your size</p>
              <div className="mt-4 flex justify-end gap-2">
                {['XS', 'S', 'M', 'XL'].map((size, index) => (
                  <span key={size} className="flex h-8 w-8 items-center justify-center rounded-full text-[9px] font-black" style={{ background: index === 0 ? '#ffffff' : '#050505', color: index === 0 ? '#050505' : '#ffffff' }}>
                    {size}
                  </span>
                ))}
              </div>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-[11%] top-[12%] z-10 flex items-center justify-center">
              <div className="absolute bottom-[19%] h-8 w-48 rounded-full blur-xl" style={{ background: darkText ? 'rgba(0,0,0,.28)' : 'rgba(0,0,0,.4)' }} />
              <img src={category.image} alt={`${category.active} Rivaado showcase`} className="max-h-[68vh] w-auto object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.35)] transition duration-700 hover:scale-[1.03]" />
            </div>

            <button type="button" aria-label="Previous look" className="absolute left-[29%] top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-xl shadow-lg" style={{ background: darkText ? 'rgba(0,0,0,.18)' : 'rgba(255,255,255,.18)', color: category.text }}>
              ‹
            </button>
            <button type="button" aria-label="Next look" className="absolute right-[29%] top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-xl shadow-lg" style={{ background: darkText ? 'rgba(0,0,0,.18)' : 'rgba(255,255,255,.18)', color: category.text }}>
              ›
            </button>

            <div className="absolute bottom-7 left-6 z-20 flex items-center gap-3 sm:left-10 lg:left-14">
              {['◎', '×', '○', '□', '◌'].map((icon) => (
                <span key={icon} className="text-sm opacity-80">{icon}</span>
              ))}
            </div>
            <p className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 whitespace-pre-line text-center text-lg leading-[1.1]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
              {category.caption}
            </p>
            <div className="absolute bottom-6 right-6 z-20 flex items-end gap-4 sm:right-10 lg:right-14">
              <div className="h-24 w-20 overflow-hidden rounded-2xl border border-white/25 bg-black/10 p-2 backdrop-blur-sm">
                <img src={category.accentThumb} alt="alternate garment" className="h-full w-full object-contain" />
              </div>
              <div className="hidden text-right text-[10px] font-semibold uppercase tracking-[0.2em] opacity-70 sm:block">
                Collection<br />preview
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden bg-black px-5 py-24 sm:px-8 sm:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(202,161,73,0.14),transparent_35%)]" />
      <div className="relative mx-auto max-w-7xl">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.34em] text-[#caa149]">About Rivaado</p>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <h2 className="text-5xl leading-[0.9] tracking-[-0.06em] text-white sm:text-7xl" style={{ fontFamily: "'Anton', sans-serif" }}>
              A tailoring legacy of presence.
            </h2>
            <p className="mt-7 max-w-xl text-base leading-8 text-white/62">
              Rivaado carries a family tailoring story forward through modern bespoke wear for men and women. It starts with cloth and measurement, then becomes silhouette, confidence and identity.
            </p>
          </div>
          <div className="relative grid gap-5 sm:grid-cols-2">
            {ABOUT_TIMELINE.map(([year, title, body]) => (
              <div key={year} className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20">
                <p className="text-4xl font-black text-[#caa149]">{year}</p>
                <h3 className="mt-4 text-sm font-black uppercase tracking-[0.22em] text-white">{title}</h3>
                <p className="mt-4 text-sm leading-6 text-white/55">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

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

  const roles = useMemo(() => ({ center: activeIndex, left: (activeIndex + 3) % 4, right: (activeIndex + 1) % 4, back: (activeIndex + 2) % 4 }), [activeIndex])

  const navigate = (direction: Direction) => {
    if (isAnimating) return
    setIsAnimating(true)
    setActiveIndex((prev) => (direction === 'next' ? (prev + 1) % 4 : (prev + 3) % 4))
    window.setTimeout(() => setIsAnimating(false), 650)
  }

  const roleFor = (index: number): Role => {
    if (index === roles.center) return 'center'
    if (index === roles.left) return 'left'
    if (index === roles.right) return 'right'
    return 'back'
  }

  const getRoleStyle = (role: Role): CSSProperties => {
    const transition = [`transform 650ms ${easing}`, `filter 650ms ${easing}`, `opacity 650ms ${easing}`, `left 650ms ${easing}`, `height 650ms ${easing}`, `bottom 650ms ${easing}`].join(', ')
    const base: CSSProperties = { position: 'absolute', aspectRatio: '0.6 / 1', transition, willChange: 'transform, filter, opacity' }
    if (role === 'center') return { ...base, transform: `translateX(-50%) scale(${isMobile ? 1.08 : 1.02})`, filter: 'blur(0px)', opacity: 1, zIndex: 20, left: '50%', height: isMobile ? '68%' : '80%', bottom: isMobile ? '10%' : '3%' }
    if (role === 'left') return { ...base, transform: 'translateX(-50%) scale(1)', filter: 'blur(2px)', opacity: 0.85, zIndex: 10, left: isMobile ? '20%' : '30%', height: isMobile ? '16%' : '28%', bottom: isMobile ? '32%' : '12%' }
    if (role === 'right') return { ...base, transform: 'translateX(-50%) scale(1)', filter: 'blur(2px)', opacity: 0.85, zIndex: 10, left: isMobile ? '80%' : '70%', height: isMobile ? '16%' : '28%', bottom: isMobile ? '32%' : '12%' }
    return { ...base, transform: 'translateX(-50%) scale(1)', filter: 'blur(4px)', opacity: 1, zIndex: 5, left: '50%', height: isMobile ? '13%' : '22%', bottom: isMobile ? '32%' : '12%' }
  }

  const active = LOOKS[activeIndex]
  const heroVideoSrc = isMobile ? '/video/rivaado-hero-mobile.mp4' : '/video/rivaado-hero-desktop.mp4'
  const heroPosterSrc = isMobile ? '/video/rivaado-hero-poster-mobile.jpg' : '/video/rivaado-hero-poster.jpg'

  return (
    <main className="w-full overflow-x-hidden bg-black text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Header />

      <section id="home" className="relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-black">
        <video key={heroVideoSrc} className="absolute inset-0 h-full w-full object-cover" src={heroVideoSrc} autoPlay muted loop playsInline preload="auto" poster={heroPosterSrc} aria-label="Rivaado bespoke tailoring campaign film" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.1)_40%,rgba(0,0,0,0.82)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 z-20 px-5 pb-8 sm:px-9 sm:pb-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-white/75">Bespoke tailoring house</p>
          <h1 className="max-w-5xl uppercase leading-[0.82] tracking-[-0.06em] text-white" style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(4rem, 14vw, 13rem)' }}>Rivaado</h1>
          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-xl text-sm leading-6 text-white/78 sm:text-base sm:leading-7">A cinematic bespoke experience for men and women — refined suits, couture silhouettes, ceremonial tailoring and made-to-measure detail.</p>
            <a href="#men" className="inline-flex w-fit items-center gap-2 rounded-full border border-white/60 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white no-underline transition hover:bg-white hover:text-black">Shop the feel <ArrowDown size={16} strokeWidth={2.25} /></a>
          </div>
        </div>
      </section>

      {SHOWCASES.map((category) => <ProductShowcase key={category.id} category={category} />)}

      <AboutSection />

      <section id="collection" className="relative w-full overflow-hidden" style={{ backgroundColor: active.bg, transition: `background-color 650ms ${easing}` }}>
        <div className="relative w-full overflow-hidden" style={{ height: '100vh' }}>
          <div className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none" style={{ zIndex: 2, top: '18%', fontFamily: "'Anton', sans-serif", fontSize: 'clamp(90px, 28vw, 380px)', fontWeight: 900, color: 'white', opacity: 1, lineHeight: 1, textTransform: 'uppercase', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>RIVAADO</div>
          <div className="absolute top-24 left-4 sm:left-8 text-xs font-semibold uppercase text-white" style={{ zIndex: 60, opacity: 0.9, letterSpacing: '0.18em' }}>RIVAADO LOOKS</div>
          <div className="absolute inset-0" style={{ zIndex: 3 }}>
            {LOOKS.map((item, index) => <div key={item.src} style={getRoleStyle(roleFor(index))}><img src={item.src} alt={item.name} draggable={false} style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom center' }} /></div>)}
          </div>
          <div className="absolute bottom-6 left-4 sm:bottom-20 sm:left-24" style={{ zIndex: 60, maxWidth: 320 }}>
            <p className="mb-2 sm:mb-3 text-base sm:text-[22px] font-bold uppercase text-white" style={{ opacity: 0.95, letterSpacing: '0.02em' }}>{active.name}</p>
            <p className="hidden sm:block text-xs sm:text-sm text-white mb-4 sm:mb-5" style={{ opacity: 0.85, lineHeight: 1.6 }}>{active.description}</p>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => navigate('prev')} aria-label="Previous garment" className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white bg-transparent text-white flex items-center justify-center hover:scale-[1.08] hover:bg-white/10" style={{ transition: 'transform 150ms, background-color 150ms' }}><ArrowLeft size={26} strokeWidth={2.25} /></button>
              <button type="button" onClick={() => navigate('next')} aria-label="Next garment" className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white bg-transparent text-white flex items-center justify-center hover:scale-[1.08] hover:bg-white/10" style={{ transition: 'transform 150ms, background-color 150ms' }}><ArrowRight size={26} strokeWidth={2.25} /></button>
            </div>
          </div>
          <div className="absolute bottom-6 right-4 sm:bottom-20 sm:right-10" style={{ zIndex: 60 }}>
            <a href="mailto:Info@rivaado.com?subject=Rivaado%20fitting%20request" className="flex items-center gap-2 text-white no-underline uppercase hover:opacity-100" style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(20px, 4vw, 56px)', fontWeight: 400, opacity: 0.95, letterSpacing: '-0.02em', lineHeight: 1, transition: 'opacity 200ms' }}>BOOK FITTING <ArrowRight className="w-5 h-5 sm:w-8 sm:h-8" strokeWidth={2.25} /></a>
          </div>
        </div>
      </section>

      <footer id="contact" className="bg-black px-5 py-20 text-center sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#caa149]">Begin your fitting</p>
        <h2 className="mx-auto mt-5 max-w-4xl text-5xl uppercase leading-[0.9] tracking-[-0.05em] text-white sm:text-7xl" style={{ fontFamily: "'Anton', sans-serif" }}>Rivaado Bespoke Wear</h2>
        <p className="mt-6 text-white/60">Info@rivaado.com · +1 825-883-7766</p>
      </footer>
    </main>
  )
}
