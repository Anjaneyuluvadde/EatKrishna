import { motion } from 'framer-motion'
import customBanner from '../assets/images/custom_laddu_banner.png'

export default function CustomizeLadduSection({ onOpen }) {
  return (
    <section style={{ padding: '0 clamp(16px, 4vw, 20px) 0', background: '#FFF5E1' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            position: 'relative',
            background: `url(${customBanner})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
            borderRadius: 24,
            overflow: 'hidden',
            minHeight: '340px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
          }}
        >
          {/* Dark Overlay for readability */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.55))',
            zIndex: 1
          }} />

          <div style={{ position: 'relative', zIndex: 2, padding: 'clamp(40px, 8vw, 60px)' }}>
            <motion.h2
              animate={{
                color: ['#8B6800', '#C8960C', '#F0D060', '#C8960C', '#8B6800']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                fontFamily: '"Playfair Display",serif',
                fontSize: 'clamp(32px, 6vw, 56px)',
                fontWeight: 900,
                marginBottom: 16,
                lineHeight: 1.1,
                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}
            >
              Customize Your Laddu
            </motion.h2>
            <p style={{
              fontFamily: 'Poppins,sans-serif',
              fontSize: 'clamp(14px, 2vw, 16px)',
              color: 'rgba(255,245,225,0.9)',
              maxWidth: 550,
              margin: '0 auto 28px',
              lineHeight: 1.6
            }}>
              Create your perfect laddu by choosing your favorite ingredients, variety type, and size. Handcrafted just for you with love and tradition.
            </p>
            <button onClick={onOpen} className="btn-primary" style={{ padding: '14px 45px', fontSize: 15, fontWeight: 600 }}>
              Start Customizing →
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
