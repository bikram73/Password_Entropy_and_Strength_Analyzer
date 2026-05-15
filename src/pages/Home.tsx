import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { PasswordInput } from '../components/PasswordInput'
import { StrengthMeter } from '../components/StrengthMeter'
import { EntropyCard } from '../components/EntropyCard'
import { CrackTimeCard } from '../components/CrackTimeCard'
import { SuggestionsPanel } from '../components/SuggestionsPanel'
import { EntropyGraph } from '../components/EntropyGraph'
import { PasswordInsightCharts } from '../components/PasswordInsightCharts'
import { analyzePassword } from '../utils/passwordAnalyzer'

const heroMessages = [
  'Check how secure your password really is in seconds, with live entropy scoring and crack-time estimates.',
  'See exactly how uppercase letters, numbers, symbols, and length change your password strength in real time.',
  'Spot weak patterns early, improve your password instantly, and aim for Good Level protection.',
  'Built for the fast, clear security feedback with animated visuals, smart suggestions, and cyber-style depth.',
]

const createBinaryChars = (count: number) =>
  Array.from({ length: count }, () => ({
    left: `${Math.random() * 100}%`,
    animationDuration: `${6 + Math.random() * 7}s`,
    animationDelay: `${Math.random() * 5}s`,
    value: Math.random() > 0.5 ? '1' : '0',
  }))

const createFloatingParticles = (count: number) =>
  Array.from({ length: count }, () => ({
    top: `${Math.random() * 95}%`,
    left: `${Math.random() * 95}%`,
  }))

const binaryChars = createBinaryChars(52)
const floatingParticles = createFloatingParticles(20)

export const Home = () => {
  const [password, setPassword] = useState('')
  const [heroMessageIndex, setHeroMessageIndex] = useState(0)
  const [heroText, setHeroText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)

  const analysis = useMemo(() => analyzePassword(password), [password])

  useEffect(() => {
    const currentMessage = heroMessages[heroMessageIndex]
    const typingSpeed = isDeleting ? 28 : 40
    const pauseDelay = 1400

    if (!isDeleting && heroText === currentMessage) {
      const pauseTimer = window.setTimeout(() => setIsDeleting(true), pauseDelay)
      return () => window.clearTimeout(pauseTimer)
    }

    if (isDeleting && heroText === '') {
      const restartTimer = window.setTimeout(() => {
        setIsDeleting(false)
        setHeroMessageIndex((current) => (current + 1) % heroMessages.length)
      }, 0)

      return () => window.clearTimeout(restartTimer)
    }

    const timer = window.setTimeout(() => {
      if (isDeleting) {
        setHeroText(currentMessage.slice(0, Math.max(0, heroText.length - 1)))
      } else {
        setHeroText(currentMessage.slice(0, heroText.length + 1))
      }
    }, typingSpeed)

    return () => window.clearTimeout(timer)
  }, [heroMessageIndex, heroText, isDeleting])

  useEffect(() => {
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 16, textShadow: '0 0 0px rgba(0,245,255,0)' },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          textShadow: '0 0 22px rgba(0,245,255,0.45)',
        },
      )
    }

    const particles = particlesRef.current?.querySelectorAll('.bg-particle')
    let tween: gsap.core.Tween | null = null

    if (particles?.length) {
      tween = gsap.to(particles, {
        y: 'random(-40, 40)',
        x: 'random(-30, 30)',
        scale: 'random(0.8, 1.25)',
        duration: 'random(4, 9)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.08,
      })
    }

    return () => {
      tween?.kill()
    }
  }, [])

  return (
    <main className="relative min-h-screen overflow-hidden bg-cyber-gradient px-3 pb-10 pt-6 text-white sm:px-5 sm:pt-8 md:px-8 lg:px-10 xl:px-14">
      <div className="bg-grid" aria-hidden="true" />

      <div className="binary-rain" aria-hidden="true">
        {binaryChars.map((character, index) => (
          <span
            key={`binary-${index}`}
            className="binary-char"
            style={{
              left: character.left,
              animationDuration: character.animationDuration,
              animationDelay: character.animationDelay,
            }}
          >
            {character.value}
          </span>
        ))}
      </div>

      <div ref={particlesRef} className="pointer-events-none absolute inset-0" aria-hidden="true">
        {floatingParticles.map((particle, index) => (
          <span
            key={`particle-${index}`}
            className="bg-particle"
            style={{
              top: particle.top,
              left: particle.left,
              animationDelay: `${index * 120}ms`,
            }}
          />
        ))}
      </div>

      <div className="mx-auto w-full max-w-[1600px]">
        <header className="relative mb-7 max-w-4xl md:mb-10">
          <motion.p
            className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            SecurePass AI • Entropy Dashboard
          </motion.p>
          <h1
            ref={titleRef}
            className="font-heading text-[clamp(2rem,5vw,4.25rem)] leading-[1.05] text-white"
          >
            Password Entropy and Strength Analyzer
          </h1>
          <motion.p
            key={heroMessageIndex}
            className="hero-typing mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base md:max-w-3xl md:text-lg"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <span>{heroText}</span>
            <span className="typing-caret" aria-hidden="true">
              |
            </span>
          </motion.p>
        </header>

        <section className="grid gap-4 sm:gap-5">
          <PasswordInput value={password} onChange={setPassword} />
          <StrengthMeter score={analysis.score} tier={analysis.tier} />

          <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
            <EntropyCard
              entropy={analysis.entropy}
              poolSize={analysis.poolSize}
              length={analysis.length}
              score={analysis.score}
            />
            <CrackTimeCard crackTime={analysis.crackTime} />
          </div>

          <SuggestionsPanel analysis={analysis} />
          <EntropyGraph value={password} />
          <PasswordInsightCharts analysis={analysis} />
        </section>
      </div>
    </main>
  )
}
