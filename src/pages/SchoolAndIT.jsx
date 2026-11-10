import React from 'react'
import { motion } from 'framer-motion'
import { Check, ArrowRight, School, Laptop, ShieldCheck, Zap, Heart, Star, Award } from 'lucide-react'

// Assets
import heroImg from '../assets/images/school_it_hero.png'
import schoolImg from '../assets/images/school_section.png'
import itImg from '../assets/images/it_section.png'
import comparisonBg from '../assets/images/comparison_bg.png'
import showcaseImg from '../assets/images/product_showcase.png'
import bulkCtaImg from '../assets/images/bulk_orders_cta.png'
import nutImg from '../assets/images/floating_nut.png'
import chocImg from '../assets/images/floating_choc.png'

const SchoolAndIT = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.7, ease: 'easeOut' }
  }

  const staggerContainer = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  return (
    <div style={{ background: '#FFF5E1', minHeight: '100vh', overflow: 'hidden' }}>
      
      {/* Floating Elements */}
      <motion.img 
        src={nutImg} 
        alt="" 
        style={{ position: 'absolute', top: '15%', left: '5%', width: 120, zIndex: 1, pointerEvents: 'none', filter: 'blur(1px)', opacity: 0.6 }}
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.img 
        src={chocImg} 
        alt="" 
        style={{ position: 'absolute', top: '40%', right: '8%', width: 140, zIndex: 1, pointerEvents: 'none', filter: 'blur(2px)', opacity: 0.5 }}
        animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.img 
        src={nutImg} 
        alt="" 
        style={{ position: 'absolute', bottom: '20%', left: '10%', width: 100, zIndex: 1, pointerEvents: 'none', filter: 'blur(1px)', opacity: 0.4 }}
        animate={{ y: [0, -15, 0], rotate: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Hero Section */}
      <section style={{ position: 'relative', minHeight: '90vh', display: 'flex', alignItems: 'center', paddingTop: 80, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
          <img src={heroImg} alt="Hero" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.65)' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to right, rgba(44, 18, 0, 0.8), rgba(44, 18, 0, 0.4))' }}></div>
        </div>

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 10, width: '100%' }}>
          <div style={{ maxWidth: 700 }}>
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="section-label" 
              style={{ color: '#FDE68A' }}
            >
              Fueling Growth & Performance
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hero-title"
              style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 900, color: '#fff', marginBottom: 24, lineHeight: 1.1 }}
            >
              Healthy Energy for <span style={{ color: '#C8960C' }}>Schools</span> & <span style={{ color: '#C8960C' }}>IT Teams</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{ fontSize: 'clamp(16px, 1.2vw, 20px)', color: 'rgba(255,255,255,0.9)', marginBottom: 40, lineHeight: 1.6, fontFamily: 'Poppins, sans-serif' }}
            >
              Kbite brings nutritious dry fruit bars, protein-rich chocolates, and healthy snacks for growing children and busy professionals.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}
            >
              <button className="btn-primary" style={{ padding: '16px 40px' }} onClick={() => document.getElementById('schools').scrollIntoView({ behavior: 'smooth' })}>
                For Schools
              </button>
              <button className="btn-outline" style={{ border: '1.5px solid #fff', color: '#fff', padding: '16px 40px' }} onClick={() => document.getElementById('it-teams').scrollIntoView({ behavior: 'smooth' })}>
                For IT Companies
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* For Schools Section */}
      <section id="schools" style={{ padding: '120px 0', position: 'relative' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 60, alignItems: 'center' }}>
            <motion.div {...fadeInUp}>
              <span className="section-label">Nurturing Young Minds</span>
              <h2 className="section-title" style={{ fontSize: 'clamp(32px, 3.5vw, 48px)', marginBottom: 28 }}>
                Healthy Snack for <span className="gold">Growing Children</span>
              </h2>
              <p style={{ color: '#4A2D06', lineHeight: 1.8, marginBottom: 24, fontSize: 17 }}>
                Kbite provides specially made dry fruit bars and chocolates for school children. Each bar contains 80% premium dry fruits and 20% rich chocolate, making it much healthier than regular chocolates available in the market.
              </p>
              <p style={{ color: '#4A2D06', lineHeight: 1.8, marginBottom: 32, fontSize: 17 }}>
                Unlike other chocolate brands that contain high sugar and artificial ingredients, Kbite products are made with almonds, cashews, dates, raisins, pistachios, and natural cocoa. They give quick energy, better focus, and support healthy growth.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {["School lunch boxes", "Short breaks", "Sports activities", "Study time snacks", "Healthy gifting in schools"].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#2C1200', fontWeight: 500 }}>
                    <div style={{ background: '#C8960C', borderRadius: '50%', padding: 4, display: 'flex' }}>
                      <Check size={14} color="#fff" strokeWidth={3} />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              {...fadeInUp}
              style={{ position: 'relative' }}
            >
              <div style={{ borderRadius: 32, overflow: 'hidden', boxShadow: '0 32px 80px rgba(44, 18, 0, 0.15)', border: '8px solid #fff' }}>
                <img src={schoolImg} alt="Schools" style={{ width: '100%', display: 'block' }} />
              </div>
              {/* Floating badge */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{ position: 'absolute', bottom: -30, left: -30, background: '#fff', padding: '24px 32px', borderRadius: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 16, zIndex: 5 }}
              >
                <div style={{ background: '#FFF5E1', padding: 12, borderRadius: 16 }}>
                  <School color="#C8960C" size={32} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 20, color: '#2C1200' }}>100%</div>
                  <div style={{ fontSize: 12, color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Kid Approved</div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 30, marginTop: 100 }}
          >
            {[
              { title: "80% Dry Fruits + 20% Chocolate", icon: <Heart fill="#C8960C" color="#C8960C" />, desc: "The perfect balance of health and taste." },
              { title: "Quick Energy & Better Focus", icon: <Zap fill="#C8960C" color="#C8960C" />, desc: "Ideal for exams and sports activities." },
              { title: "Healthy Alternative", icon: <ShieldCheck fill="#C8960C" color="#C8960C" />, desc: "Say goodbye to high-sugar snacks." }
            ].map((card, idx) => (
              <motion.div 
                key={idx}
                variants={fadeInUp}
                className="card-hover"
                style={{ background: '#fff', padding: 40, borderRadius: 24, border: '1px solid rgba(200,150,12,0.1)' }}
              >
                <div style={{ marginBottom: 24 }}>{card.icon}</div>
                <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 22, fontWeight: 800, marginBottom: 12, color: '#2C1200' }}>{card.title}</h3>
                <p style={{ color: '#666', fontSize: 15, lineHeight: 1.6 }}>{card.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Comparison Section */}
      <section style={{ position: 'relative', padding: '120px 0', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
          <img src={comparisonBg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(26, 0, 0, 0.85)' }}></div>
        </div>

        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 10 }}>
          <motion.div {...fadeInUp} style={{ textAlign: 'center', marginBottom: 60 }}>
            <span className="section-label" style={{ color: '#C8960C' }}>Why Choose Us</span>
            <h2 className="section-title" style={{ color: '#fff', fontSize: 'clamp(32px, 3.5vw, 42px)' }}>
              Kbite Better Than <span className="gold">Regular Chocolates</span>
            </h2>
          </motion.div>

          <motion.div 
            {...fadeInUp}
            style={{ overflowX: 'auto', borderRadius: 24, border: '1px solid rgba(200,150,12,0.3)', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)' }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 600 }}>
              <thead>
                <tr style={{ background: 'rgba(200,150,12,0.1)' }}>
                  <th style={{ padding: '24px 32px', color: '#fff', fontWeight: 600, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Comparison Features</th>
                  <th style={{ padding: '24px 32px', color: '#C8960C', fontWeight: 800, fontSize: 18, textAlign: 'center', fontFamily: '"Playfair Display", serif' }}>Kbite</th>
                  <th style={{ padding: '24px 32px', color: '#aaa', fontWeight: 500, fontSize: 14, textAlign: 'center' }}>Regular Brands</th>
                </tr>
              </thead>
              <tbody>
                {[
                  "80% Dry Fruits", "Natural Ingredients", "Low Sugar", "High Protein", "Quick Energy Release", "Better for Children", "No Artificial Ingredients"
                ].map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '20px 32px', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{row}</td>
                    <td style={{ padding: '20px 32px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                        <Check size={16} style={{ marginRight: 6 }} /> YES
                      </div>
                    </td>
                    <td style={{ padding: '20px 32px', textAlign: 'center', color: '#ff4444', fontSize: 13, fontWeight: 600 }}>NO / LIMITED</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* For IT Employees Section */}
      <section id="it-teams" style={{ padding: '120px 0', background: '#fff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 70, alignItems: 'center' }}>
            
            <motion.div 
              {...fadeInUp}
              style={{ order: { md: 2 } }}
            >
              <span className="section-label">For the High Performers</span>
              <h2 className="section-title" style={{ fontSize: 'clamp(32px, 3.5vw, 48px)', marginBottom: 28 }}>
                Healthy Energy for <span className="gold">Busy IT Professionals</span>
              </h2>
              <p style={{ color: '#4A2D06', lineHeight: 1.8, marginBottom: 24, fontSize: 17 }}>
                IT employees often work under high pressure, skip meals, and do not follow a proper diet. Kbite helps them stay active and energetic with healthy protein bars, dark chocolate dry fruit bars, mixed dry fruits, and nutritious snacks.
              </p>
              <p style={{ color: '#4A2D06', lineHeight: 1.8, marginBottom: 32, fontSize: 17 }}>
                These products help reduce tiredness, improve focus, and provide lasting energy during long working hours.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 40 }}>
                {["Office snack breaks", "Evening hunger", "Team meetings", "WFH professionals", "Corporate gifting"].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#555', fontSize: 15 }}>
                    <div style={{ width: 8, height: 8, background: '#C8960C', borderRadius: '50%' }}></div>
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              {...fadeInUp}
              style={{ position: 'relative' }}
            >
              <div style={{ borderRadius: 32, overflow: 'hidden', boxShadow: '0 32px 80px rgba(44, 18, 0, 0.12)' }}>
                <img src={itImg} alt="IT Professionals" style={{ width: '100%', display: 'block' }} />
              </div>
              {/* Stats card */}
              <div style={{ position: 'absolute', top: -40, right: -20, background: '#C8960C', color: '#fff', padding: '28px 32px', borderRadius: 24, boxShadow: '0 20px 40px rgba(200,150,12,0.3)', zIndex: 5 }}>
                <div style={{ fontSize: 32, fontWeight: 900, fontFamily: '"Playfair Display", serif', marginBottom: 4 }}>High</div>
                <div style={{ fontSize: 12, opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Protein Content</div>
              </div>
            </motion.div>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginTop: 80 }}
          >
            {[
              { title: "High Protein Bars", icon: <Star fill="#C8960C" color="#C8960C" /> },
              { title: "Dry Fruit Chocolates", icon: <Award fill="#C8960C" color="#C8960C" /> },
              { title: "Mixed Dry Fruit Packs", icon: <Heart fill="#C8960C" color="#C8960C" /> },
              { title: "Corporate Gift Boxes", icon: <Laptop color="#C8960C" /> }
            ].map((card, idx) => (
              <motion.div 
                key={idx}
                variants={fadeInUp}
                style={{ background: '#FFFBF4', padding: 32, borderRadius: 20, border: '1px solid rgba(200,150,12,0.08)', textAlign: 'center' }}
              >
                <div style={{ display: 'inline-flex', marginBottom: 20, background: '#fff', padding: 16, borderRadius: '50%', boxShadow: '0 10px 20px rgba(0,0,0,0.04)' }}>{card.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#2C1200' }}>{card.title}</h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Product Showcase */}
      <section style={{ padding: '120px 0', background: '#FFF5E1' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <motion.div {...fadeInUp} style={{ textAlign: 'center', marginBottom: 80 }}>
            <span className="section-label">Our Selection</span>
            <h2 className="section-title" style={{ fontSize: 'clamp(32px, 3.5vw, 42px)' }}>
              Premium Range for <span className="gold">Institutions</span>
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}>
            {[
              { title: "Dry Fruit Bars", desc: "A power-packed snack with 80% whole nuts and natural sweetness.", img: showcaseImg },
              { title: "Protein Chocolate Bars", desc: "Guilt-free indulgence with rich cocoa and premium Whey or Plant protein.", img: showcaseImg },
              { title: "Mixed Dry Fruit Packs", desc: "Handpicked premium almonds, cashews, and raisins for daily energy.", img: showcaseImg },
              { title: "School Snack Boxes", desc: "Specially curated weekly packs for children's healthy snacking habits.", img: showcaseImg },
              { title: "Corporate Gift Packs", desc: "Luxury gift boxes that leave a lasting impression on your clients and teams.", img: showcaseImg }
            ].map((product, idx) => (
              <motion.div 
                key={idx}
                {...fadeInUp}
                className="card-hover"
                style={{ background: '#fff', borderRadius: 24, overflow: 'hidden', border: '1px solid rgba(200,150,12,0.1)' }}
              >
                <div style={{ height: 260, overflow: 'hidden' }}>
                  <img src={product.img} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: 32 }}>
                  <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 24, fontWeight: 800, color: '#2C1200', marginBottom: 12 }}>{product.title}</h3>
                  <p style={{ color: '#666', fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>{product.desc}</p>
                  <button className="btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                    Learn More <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bulk Orders / CTA Section */}
      <section style={{ padding: '100px 0 140px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <motion.div 
            {...fadeInUp}
            style={{ position: 'relative', borderRadius: 48, overflow: 'hidden', padding: '100px 60px', textAlign: 'center', background: '#1A0000' }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
              <img src={bulkCtaImg} alt="Bulk Orders" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle, rgba(200,150,12,0.1) 0%, rgba(26,0,0,0.8) 100%)' }}></div>
            </div>

            <div style={{ position: 'relative', zIndex: 10 }}>
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }} 
                transition={{ duration: 4, repeat: Infinity }}
                style={{ display: 'inline-flex', background: 'rgba(200,150,12,0.2)', padding: 20, borderRadius: '50%', marginBottom: 32 }}
              >
                <div style={{ background: '#C8960C', padding: 16, borderRadius: '50%', display: 'flex' }}>
                  <Award color="#fff" size={40} />
                </div>
              </motion.div>
              
              <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(32px, 4.5vw, 60px)', fontWeight: 900, color: '#fff', marginBottom: 24 }}>
                Looking for Bulk Orders for <br/> <span className="gold">Schools or IT Companies?</span>
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18, maxWidth: 800, margin: '0 auto 48px', lineHeight: 1.6 }}>
                Partner with Kbite to provide healthy and tasty snacks for students and employees. We offer customized packaging and corporate discounts.
              </p>
              <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="btn-primary" style={{ padding: '18px 48px', fontSize: 16 }}>
                  Contact Us
                </button>
                <button className="btn-outline" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.3)', padding: '18px 48px', fontSize: 16 }}>
                   Request Bulk Order
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CSS overrides for specific elements not in global CSS */}
      <style>{`
        .btn-outline:hover {
          background: rgba(200, 150, 12, 0.08);
          border-color: #C8960C;
          color: #C8960C;
        }
      `}</style>
    </div>
  )
}

export default SchoolAndIT
