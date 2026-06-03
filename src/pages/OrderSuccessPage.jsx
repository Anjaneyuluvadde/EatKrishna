import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { CheckCircle, Home, ShoppingBag } from 'lucide-react'

export default function OrderSuccessPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const realOrderId = location.state?.orderId
  const orderNum = realOrderId ? `#EK${realOrderId}` : '#EK' + Date.now().toString().slice(-6)

  return (
    <div style={{ minHeight: '100vh', background: '#FFF5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px clamp(16px, 4vw, 24px) 40px' }}>
      <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 150, damping: 20 }}
        style={{ background: '#fff', borderRadius: 24, padding: '48px 40px', maxWidth: 440, width: '100%', textAlign: 'center', border: '1px solid rgba(200,150,12,0.15)', boxShadow: '0 20px 60px rgba(200,150,12,0.1)' }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #C8960C, #F0D060)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <CheckCircle size={40} color="#fff" />
        </motion.div>
        <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: 30, fontWeight: 700, color: '#333', marginBottom: 8 }}>Order Placed! 🙏</h1>
        <p style={{ fontFamily: '"Playfair Display",serif', fontSize: 16, color: '#C8960C', fontStyle: 'italic', marginBottom: 16 }}>Jai Shri Krishna</p>
        <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 14, color: '#888', lineHeight: 1.7, marginBottom: 24 }}>
          Your divine sweets are on their way! We've sent a confirmation to your email. Expect delivery in 3-5 business days.
        </p>
        <div style={{ background: '#FFF5E1', borderRadius: 12, padding: '14px 20px', marginBottom: 28 }}>
          <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 11, color: '#C8960C', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Order Number</p>
          <p style={{ fontFamily: '"Playfair Display",serif', fontSize: 20, fontWeight: 700, color: '#333' }}>{orderNum}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/')}
            style={{ width: '100%', padding: '13px 0', background: '#C8960C', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'Poppins,sans-serif', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Home size={16} /> Back to Home
          </motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/products')}
            style={{ width: '100%', padding: '12px 0', background: 'none', border: '1.5px solid rgba(200,150,12,0.3)', borderRadius: 10, color: '#C8960C', cursor: 'pointer', fontFamily: 'Poppins,sans-serif', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <ShoppingBag size={16} /> Continue Shopping
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
