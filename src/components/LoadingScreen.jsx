import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

const hellos = [
  { text: 'Halo', lang: 'Indonesia' },
  { text: 'Hello', lang: 'English' },
  { text: 'Bonjour', lang: 'French' },
  { text: 'こんにちは', lang: 'Japanese' },
  { text: '안녕하세요', lang: 'Korean' },
  { text: 'Ciao', lang: 'Italian' },
  { text: 'Hola', lang: 'Spanish' },
  { text: 'مرحبا', lang: 'Arabic' },
]

const PANELS = 5

export default function LoadingScreen({ onComplete }) {
  const [index, setIndex]     = useState(0)
  const [leaving, setLeaving] = useState(false)
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    const total = hellos.length
    const interval = setInterval(() => {
      setIndex(prev => {
        const next = prev + 1
        setPercent(Math.round((next / total) * 100))
        if (prev === total - 1) {
          clearInterval(interval)
          setTimeout(() => {
            setLeaving(true)
            setTimeout(onComplete, 900)
          }, 350)
          return prev
        }
        return next
      })
    }, 300)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Main loading screen */}
      <AnimatePresence>
        {!leaving && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            style={{
              position: 'fixed', top: 0, left: 0,
              width: '100vw', height: '100vh',
              background: '#111', zIndex: 9999,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -80, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                style={{ textAlign: 'center' }}
              >
                <h1 style={{
                  color: '#fff',
                  fontSize: 'clamp(72px, 15vw, 160px)',
                  fontFamily: 'Josefin Sans, sans-serif',
                  fontWeight: 900,
                  letterSpacing: '-3px',
                  lineHeight: 1,
                  margin: 0,
                }}>
                  {hellos[index].text}
                </h1>
                <p style={{
                  color: '#444',
                  fontSize: '13px',
                  letterSpacing: '4px',
                  fontFamily: 'Inter, sans-serif',
                  marginTop: '12px',
                  textTransform: 'uppercase',
                }}>
                  {hellos[index].lang}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Bottom counter */}
            <div style={{
              position: 'absolute', bottom: '40px', right: '48px',
              fontFamily: 'Josefin Sans, sans-serif',
              fontSize: '13px', letterSpacing: '2px', color: '#555',
            }}>
              {String(percent).padStart(3, '0')}%
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Staggered panel wipe — slides upward on exit */}
      <AnimatePresence>
        {leaving && (
          <div
            style={{
              position: 'fixed', top: 0, left: 0,
              width: '100vw', height: '100vh',
              zIndex: 9999, display: 'flex', pointerEvents: 'none',
            }}
          >
            {[...Array(PANELS)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: '0%' }}
                animate={{ y: '-100%' }}
                transition={{
                  duration: 0.75,
                  delay: i * 0.07,
                  ease: [0.76, 0, 0.24, 1],
                }}
                style={{
                  flex: 1,
                  height: '100%',
                  background: '#111',
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
