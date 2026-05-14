import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { PasswordInput } from '../components/PasswordInput'
import { StrengthMeter } from '../components/StrengthMeter'
import { EntropyCard } from '../components/EntropyCard'
import { CrackTimeCard } from '../components/CrackTimeCard'
import { SuggestionsPanel } from '../components/SuggestionsPanel'
import { EntropyGraph } from '../components/EntropyGraph'
import { analyzePassword } from '../utils/passwordAnalyzer'

const subtitleText = 'Check how secure your password really is.'

export const Home = () => {
  const [password, setPassword] = useState('')
  const titleRef = useRef<HTMLHeadingElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)

  const analysis = useMemo(() => analyzePassword(password), [password])

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
    <main className="relative min-h-screen overflow-hidden bg-cyber-gradient px-4 pb-12 pt-8 text-white md:px-8 lg:px-12">
      <div ref={particlesRef} className="pointer-events-none absolute inset-0" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, index) => (
          <span
            key={`particle-${index}`}
            className="bg-particle"
            style={{
              top: `${Math.random() * 95}%`,
              left: `${Math.random() * 95}%`,
              animationDelay: `${index * 120}ms`,
            }}
          />
        ))}
      </div>

      <div className="mx-auto w-full max-w-7xl">
        <header className="relative mb-8 md:mb-10">
          <motion.p
            className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            SecurePass AI • Entropy Dashboard
          </motion.p>
          <h1 ref={titleRef} className="font-heading text-4xl leading-tight text-white md:text-6xl">
            Password Entropy and Strength Analyzer
          </h1>
          <p className="typewriter mt-3 max-w-2xl text-sm text-slate-300 md:text-lg">{subtitleText}</p>
        </header>

        <section className="grid gap-5">
          <PasswordInput value={password} onChange={setPassword} />
          <StrengthMeter score={analysis.score} tier={analysis.tier} />

          <div className="grid gap-5 lg:grid-cols-2">
            <EntropyCard
              entropy={analysis.entropy}
              poolSize={analysis.poolSize}
              length={analysis.length}
              score={analysis.score}
            />
            <CrackTimeCard crackTime={analysis.crackTime} />
          </div>

          <EntropyGraph value={password} />
          <SuggestionsPanel analysis={analysis} />
        </section>
      </div>
    </main>
  )
}
