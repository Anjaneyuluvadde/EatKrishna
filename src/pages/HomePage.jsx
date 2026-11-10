import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Star, ShieldCheck, Truck, Leaf, Award, ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import CustomizeLaddu from '../components/CustomizeLaddu'
import { fetchProducts } from '../services/productService'
import { CATEGORY_DATA, TESTIMONIALS, HERO_SLIDES, hero1, catBesan, motichoorCard, festiveBanner, familyMoment, shopInterior } from '../utils/data'
import customBanner from '../assets/images/custom_laddu_banner.png'
import CustomizeLadduSection from '../components/CustomizeLadduSection'
import logoEk from '../assets/images/logo_ek.png'

/* ── Particles ── */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({ id: i, size: Math.random() * 7 + 3, left: Math.random() * 100, dur: Math.random() * 8 + 5, delay: Math.random() * 6 }))

/* ── Hero ── */
function Hero({ onOpen }) {
  const navigate = useNavigate()
  const [idx, setIdx] = useState(0)
  const total = HERO_SLIDES.length
  useEffect(() => { const t = setInterval(() => setIdx(i => (i + 1) % total), 5000); return () => clearInterval(t) }, [])
  const [showChoices, setShowChoices] = useState(false)

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
      const offset = 80 // Navbar height offset
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = el.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#2C1200' }}>
      {/* BG slides */}
      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }}
          style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img src={HERO_SLIDES[idx].image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center right', display: 'block' }} />
          {/* Masking Gradient */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, rgba(40, 0, 0, 0.98) 0%, rgba(60, 0, 0, 0.85) 30%, rgba(120, 5, 5, 0.4) 100%)'
          }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 0%, rgba(20, 0, 0, 0.75) 100%)' }} />
        </motion.div>
      </AnimatePresence>

      {/* Particles */}
      {PARTICLES.map(p => (
        <div key={p.id} className="particle" style={{ width: p.size, height: p.size, left: `${p.left}%`, bottom: -20, background: 'rgba(200, 150, 12, 0.45)', animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s`, zIndex: 1 }} />
      ))}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 clamp(16px, 4vw, 24px)', maxWidth: 1000, margin: '0 auto', paddingTop: 40 }}>
        <AnimatePresence mode="wait">
          {!showChoices ? (
            <motion.div key="main-hero" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }}>
              <h1 className="hero-title" style={{
                fontFamily: '"Playfair Display",serif', fontWeight: 900, fontSize: 'clamp(56px,12vw,100px)', color: '#C8960C',
                lineHeight: 1.1, letterSpacing: '-0.01em', marginBottom: 24,
                textShadow: '0 4px 15px rgba(0,0,0,0.4)'
              }}>
                Kbite
              </h1>
              <p style={{
                fontFamily: 'Poppins,sans-serif', fontSize: 'clamp(15px,2.5vw,18px)', color: 'rgba(255,245,225,0.9)',
                lineHeight: 1.6, maxWidth: 650, margin: '0 auto 48px', letterSpacing: '0.02em',
                textShadow: '0 2px 8px rgba(0,0,0,0.5)'
              }}>
                Experience the authentic flavors of India with our premium sweets, ladoos, and dry fruits
              </p>

              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <button className="btn-primary" onClick={() => setShowChoices(true)}
                  style={{ fontSize: 15, padding: '15px 48px', fontWeight: 600, boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}>
                  choose your laddu
                </button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div key="choices" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.5 }}
              style={{ position: 'relative', width: '100%', zIndex: 10 }}>
              
              {/* Overlay for clicking outside */}
              <div 
                onClick={() => setShowChoices(false)}
                style={{ position: 'fixed', inset: 0, zIndex: -1, background: 'transparent' }} 
              />

              <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: 'clamp(28px, 5vw, 42px)', color: '#C8960C', marginBottom: 50, marginTop: 40, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                How would you like to start?
              </h2>
              
              <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'nowrap', maxWidth: 1000, margin: '0 auto', padding: '0 20px' }}>
                {/* Customized Card */}
                <motion.div 
                  whileHover={{ y: -10, scale: 1.02 }}
                  onClick={(e) => { 
                    e.stopPropagation();
                    onOpen();
                    scrollToSection('custom-section'); 
                  }}
                  style={{ 
                    flex: '1 1 50%', height: 'clamp(320px, 50vh, 420px)', borderRadius: 24, cursor: 'pointer', position: 'relative', overflow: 'hidden', 
                    border: '1.5px solid rgba(200,150,12,0.35)', boxShadow: '0 25px 50px rgba(0,0,0,0.6)' 
                  }}
                >
                  <img src={customBanner} alt="Customized" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(44,18,0,0.95) 0%, rgba(44,18,0,0.4) 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', padding: '40px 24px' }}>
                    <h3 style={{ fontFamily: '"Playfair Display",serif', fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 700, color: '#C8960C', marginBottom: 10, textAlign: 'center', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Customized Laddu</h3>
                    <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 'clamp(12px, 1.8vw, 15px)', color: 'rgba(255,245,225,0.85)', textAlign: 'center', maxWidth: 300 }}>Craft your own divine recipe with bespoke ingredients</p>
                  </div>
                </motion.div>

                {/* Product Card */}
                <motion.div 
                  whileHover={{ y: -10, scale: 1.02 }}
                  onClick={(e) => { 
                    e.stopPropagation();
                    navigate('/products');
                  }}
                  style={{ 
                    flex: '1 1 50%', height: 'clamp(320px, 50vh, 420px)', borderRadius: 24, cursor: 'pointer', position: 'relative', overflow: 'hidden', 
                    border: '1.5px solid rgba(200,150,12,0.35)', boxShadow: '0 25px 50px rgba(0,0,0,0.6)' 
                  }}
                >
                  <img src={catBesan} alt="Collection" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(44,18,0,0.95) 0%, rgba(44,18,0,0.4) 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', padding: '40px 24px' }}>
                    <h3 style={{ fontFamily: '"Playfair Display",serif', fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 700, color: '#C8960C', marginBottom: 10, textAlign: 'center', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Product Laddu</h3>
                    <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 'clamp(12px, 1.8vw, 15px)', color: 'rgba(255,245,225,0.85)', textAlign: 'center', maxWidth: 300 }}>Explore our award-winning signature collection</p>
                  </div>
                </motion.div>
              </div>

              <motion.button 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                onClick={() => setShowChoices(false)}
                style={{ background: 'transparent', border: 'none', color: 'rgba(255,245,225,0.4)', marginTop: 32, cursor: 'pointer', fontFamily: 'Poppins,sans-serif', fontSize: 13, textDecoration: 'underline' }}
              >
                Go back
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          style={{ display: 'flex', gap: 40, justifyContent: 'center', marginTop: 52, paddingTop: 28, borderTop: '1px solid rgba(255,245,225,0.12)' }}>
          {[['50K+', 'Happy Customers'], ['100%', 'Pure Ingredients'], ['25+', 'Premium Products']].map(([v, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: '"Playfair Display",serif', fontWeight: 700, fontSize: 24, color: '#C8960C' }}>{v}</div>
              <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: 11, color: 'rgba(255,245,225,0.5)', marginTop: 3 }}>{l}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Slide dots */}
      <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 2 }}>
        {HERO_SLIDES.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ width: i === idx ? 24 : 8, height: 8, borderRadius: 4, background: i === idx ? '#C8960C' : 'rgba(255,245,225,0.35)', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }} />
        ))}
      </div>

      {/* Wave */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 50, background: 'linear-gradient(to bottom,transparent,#FFF5E1)', zIndex: 2 }} />
    </section>
  )
}

/* ── Section Header ── */
function SH({ label, title, gold, sub }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 40 }}>
      {label && <p className="section-label" style={{ marginBottom: 8 }}>{label}</p>}
      <h2 className="section-title" style={{ fontSize: 'clamp(26px,4.5vw,38px)', marginBottom: sub ? 10 : 0 }}>
        {title} {gold && <span className="gold">{gold}</span>}
      </h2>
      {sub && <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 14, color: '#999', maxWidth: 400, margin: '0 auto' }}>{sub}</p>}
    </motion.div>
  )
}

/* ── Featured Products ── */
function FeaturedProducts() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const data = await fetchProducts()
      // Normalize data to match ProductCard props
      const normalized = (data || []).map(p => ({
        ...p,
        name: p.title || p.name,
        image: p.image_url || p.image,
        rating: p.rating || 4.5,
        reviews: p.reviews || 0,
        category: p.category || 'sweets',
        originalPrice: p.old_price,
        discount: p.discount
      }))
      setProducts(normalized.slice(0, 8))
      setLoading(false)
    }
    load()
  }, [])

  return (
    <section id="featured-section" style={{ padding: '20px clamp(16px, 4vw, 20px) clamp(48px, 8vw, 72px)', background: '#FFF5E1' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <SH label="Curated for you" title="Featured" gold="Products" sub="Handpicked delicacies just for you" />
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ width: 32, height: 32, border: '3px solid #EAEAEA', borderTopColor: '#C8960C', borderRadius: '50%', margin: '0 auto', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : (
          <div className="responsive-grid responsive-grid-1 responsive-grid-2 responsive-grid-3 responsive-grid-4">
            {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button className="btn-outline" onClick={() => navigate('/products')}>View All Products <ArrowRight size={15} /></button>
        </div>
      </div>
    </section>
  )
}

/* ── Categories ── */
function Categories() {
  const navigate = useNavigate()
  return (
    <section style={{ padding: 'clamp(48px, 8vw, 64px) clamp(16px, 4vw, 20px)', background: '#F5E6C8' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <SH label="Collections" title="Shop by" gold="Category" sub="Discover our exquisite range" />
        <div className="responsive-grid responsive-grid-1 responsive-grid-2 responsive-grid-3">
          {Object.entries(CATEGORY_DATA).map(([id, cat], i) => (
            <motion.div key={id} initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
              whileHover={{ y: -6 }} onClick={() => navigate(`/products?category=${id}`)}
              style={{ cursor: 'pointer', borderRadius: 16, overflow: 'hidden', position: 'relative', aspectRatio: '4/3' }}>
              <img src={cat.image} alt={cat.label} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.07)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,0.68) 0%,transparent 55%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', padding: '0 0 22px' }}>
                <span style={{ fontFamily: '"Playfair Display",serif', fontSize: 22, fontWeight: 700, color: '#fff' }}>{cat.label}</span>
                <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 12, color: 'rgba(255,245,225,0.75)', marginTop: 4 }}>{cat.desc}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Festival Banner ── */
function FestivalBanner() {
  const navigate = useNavigate()
  return (
    <section style={{ padding: '0 clamp(16px, 4vw, 20px) clamp(48px, 8vw, 64px)', background: '#FFF5E1' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          style={{ borderRadius: 20, overflow: 'hidden', position: 'relative', minHeight: 240 }}>
          <img src={festiveBanner} alt="Festival"
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(44,18,0,0.8) 0%,rgba(20,10,0,0.6) 100%)' }} />
          <div style={{ position: 'relative', zIndex: 2, padding: 'clamp(32px, 8vw, 56px) clamp(24px, 6vw, 48px)', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 11, color: '#F0D060', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 10 }}>✦ Limited Edition ✦</p>
            <h2 style={{ fontFamily: '"Playfair Display",serif', fontWeight: 900, color: '#fff', fontSize: 'clamp(26px,5vw,42px)', marginBottom: 12 }}>
              Festival Special
            </h2>
            <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 14, color: 'rgba(255,245,225,0.72)', marginBottom: 26 }}>
              Exclusive handcrafted gift boxes for your loved ones
            </p>
            <button className="btn-primary" onClick={() => navigate('/products')} style={{ padding: '12px 32px', fontSize: 14 }}>
              Explore Festival Gifts
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ── Why Us ── */
function WhyUs() {
  const features = [
    { icon: Leaf, title: 'Pure & Natural', desc: 'No preservatives or artificial colours. 100% natural ingredients sourced ethically.' },
    { icon: Award, title: 'Handcrafted Daily', desc: 'Made fresh every morning by expert halwais using traditional recipes.' },
    { icon: ShieldCheck, title: 'FSSAI Certified', desc: 'All our products meet the highest food safety and quality standards.' },
    { icon: Truck, title: 'Pan-India Delivery', desc: 'Carefully packed and delivered fresh to your doorstep across India.' },
  ]
  return (
    <section style={{ padding: 'clamp(48px, 8vw, 64px) clamp(16px, 4vw, 20px)', background: '#F5E6C8' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <SH label="Our Promise" title="Why Choose" gold="Us" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 20 }}>
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="card-hover"
              style={{ background: '#fff', borderRadius: 14, padding: '28px 22px', textAlign: 'center', border: '1px solid rgba(200,150,12,0.1)' }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(200,150,12,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <f.icon size={24} color="#C8960C" />
              </div>
              <h3 style={{ fontFamily: '"Playfair Display",serif', fontSize: 17, fontWeight: 700, color: '#333', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 13, color: '#888', lineHeight: 1.65 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Testimonials ── */
function Testimonials() {
  return (
    <section style={{ padding: '64px 20px', background: '#FFF5E1' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <SH label="Customer Love" title="What Our" gold="Customers Say" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20 }}>
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="card-hover"
              style={{ background: '#fff', borderRadius: 14, padding: '22px 20px', border: '1px solid rgba(200,150,12,0.1)' }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 12 }}>
                {[...Array(t.rating)].map((_, j) => <Star key={j} size={14} fill="#C8960C" color="#C8960C" />)}
              </div>
              <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 13, color: '#666', lineHeight: 1.7, marginBottom: 16, fontStyle: 'italic' }} className="line-clamp-3">"{t.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#C8960C,#F0D060)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Playfair Display",serif', fontWeight: 700, fontSize: 14, color: '#fff' }}>
                  {t.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: 13, fontWeight: 600, color: '#333' }}>{t.name}</div>
                  <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: 11, color: '#C8960C' }}>{t.city}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Newsletter ── */
function Newsletter() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  return (
    <section style={{ padding: '64px 20px', background: '#2C1200' }}>
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
          <img src={logoEk} alt="EK Logo" style={{ height: 56, width: 'auto', objectFit: 'contain', filter: 'brightness(1.2)' }} />
          <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: 36, fontWeight: 700, color: '#FFF5E1', marginBottom: 0 }}>
            K<span style={{ color: '#C8960C' }}>bite</span>
          </h2>
        </div>
        <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 14, color: 'rgba(255,245,225,0.55)', marginBottom: 28 }}>
          Exclusive offers, festival deals and new arrivals in your inbox.
        </p>
        {done ? (
          <motion.p initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ color: '#C8960C', fontFamily: 'Poppins,sans-serif', fontSize: 16 }}>
            🙏 Thank you! Divine blessings on the way.
          </motion.p>
        ) : (
          <form onSubmit={e => { e.preventDefault(); if (email) setDone(true) }} style={{ display: 'flex', gap: 10 }}>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
              style={{ flex: 1, padding: '12px 16px', borderRadius: 9, border: '1.5px solid rgba(200,150,12,0.3)', background: 'rgba(255,245,225,0.07)', fontFamily: 'Poppins,sans-serif', fontSize: 14, color: '#FFF5E1', outline: 'none' }} />
            <button type="submit" className="btn-primary" style={{ padding: '12px 22px', whiteSpace: 'nowrap' }}>Subscribe</button>
          </form>
        )}
      </motion.div>
    </section>
  )
}

/* ── Customize Laddu Section ── */


export default function HomePage() {
  const [customizeLadduOpen, setCustomizeLadduOpen] = useState(false)

  return (
    <div>
      <Hero onOpen={() => setCustomizeLadduOpen(true)} />
      <div id="custom-section">
        <CustomizeLadduSection onOpen={() => setCustomizeLadduOpen(true)} />
      </div>
      <FeaturedProducts />
      <Categories />
      <section style={{ padding: '64px 20px', background: '#FFF5E1' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 40, alignItems: 'center' }}>
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <SH label="Our Legacy" title="Handcrafted with" gold="Devotion" sub="Since generations, we've been crafting more than just sweets; we're preserving a legacy of pure ingredients and divine taste." />
              <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 14, color: '#666', lineHeight: 1.8, marginBottom: 24 }}>
                Every laddu is shaped by hand, every ingredient is chosen with care. From the pure desi ghee to the finest saffron, our process is a labor of love and a tribute to traditional Indian craftsmanship.
              </p>
              <div style={{ display: 'flex', gap: 20 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>🍯</div>
                  <div style={{ fontSize: 12, color: '#888', fontFamily: 'Poppins,sans-serif' }}>Pure Ghee</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>🌿</div>
                  <div style={{ fontSize: 12, color: '#888', fontFamily: 'Poppins,sans-serif' }}>Organic Besan</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>✨</div>
                  <div style={{ fontSize: 12, color: '#888', fontFamily: 'Poppins,sans-serif' }}>No Preservatives</div>
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
              <img src={familyMoment} alt="Our Tradition" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </motion.div>
          </div>
        </div>
      </section>
      <FestivalBanner />
      <section style={{ padding: '64px 20px', background: '#F5E6C8' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 40, alignItems: 'center' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} style={{ position: 'relative', aspectRatio: '16/9', borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
              <img src={shopInterior} alt="Our Luxury Shop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <SH label="Visit Us" title="Experience" gold="Luxury" sub="Step into the world of Kbite, where tradition meets modern luxury. Visit our boutique outlets for a sensory journey through India's finest delicacies." />
              <button className="btn-primary" style={{ padding: '12px 32px' }}>Find a Store near you</button>
            </motion.div>
          </div>
        </div>
      </section>
      <WhyUs />
      <Testimonials />
      <Newsletter />
      <AnimatePresence>
        <CustomizeLaddu isOpen={customizeLadduOpen} onClose={() => setCustomizeLadduOpen(false)} />
      </AnimatePresence>
    </div>
  )
}
