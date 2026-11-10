import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function Particle({ style }) {
  return <div className="particle" style={style} />
}

export default function SplashScreen({ onDone }) {
  // Generate particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    width: Math.random() * 8 + 3,
    left: Math.random() * 100,
    duration: Math.random() * 6 + 4,
    delay: Math.random() * 4,
  }))

  useEffect(() => {
    const t = setTimeout(onDone, 3000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <AnimatePresence>
      <motion.div
        key="splash"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'radial-gradient(ellipse at 60% 40%, #A01010 0%, #6B0000 40%, #3A0000 70%, #1A0000 100%)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Floating particles */}
        {particles.map(p => (
          <Particle key={p.id} style={{
            width: p.width, height: p.width,
            left: `${p.left}%`, bottom: '-20px',
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }} />
        ))}

        {/* Radial glow behind text */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          style={{
            position: 'absolute',
            width: 500, height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(212,175,55,0.25) 0%, transparent 70%)',
          }}
        />

        {/* Top ornament */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ marginBottom: 16 }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            color: 'rgba(212,175,55,0.7)', fontSize: 13,
            letterSpacing: '0.3em', textTransform: 'uppercase',
            fontFamily: 'Poppins, sans-serif', fontWeight: 400,
          }}>
            <div style={{ width: 40, height: 1, background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.7))' }} />
            ✦ Premium Indian Delicacies ✦
            <div style={{ width: 40, height: 1, background: 'linear-gradient(to left, transparent, rgba(212,175,55,0.7))' }} />
          </div>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 900,
            fontSize: 'clamp(52px, 12vw, 100px)',
            letterSpacing: '0.06em',
            background: 'linear-gradient(90deg, #8B6800 0%, #C8960C 30%, #F0D060 50%, #C8960C 70%, #8B6800 100%)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'shimmer 2.5s linear infinite',
            position: 'relative', zIndex: 1,
            textAlign: 'center',
            lineHeight: 1.1,
          }}
        >
          Kbite
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: 22,
            fontWeight: 300,
            color: 'rgba(255,245,225,0.9)',
            letterSpacing: '0.08em',
            marginTop: 12,
          }}
        >
          Taste the Blessings
        </motion.p>

        {/* Gold divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          style={{
            marginTop: 24,
            width: 120, height: 2,
            background: 'linear-gradient(to right, transparent, #C8960C, transparent)',
          }}
        />

        {/* Loading dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          style={{ display: 'flex', gap: 8, marginTop: 32 }}
        >
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              style={{ width: 7, height: 7, borderRadius: '50%', background: '#C8960C' }}
              animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.8, delay: i * 0.2, repeat: Infinity }}
            />
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
