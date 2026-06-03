import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, CreditCard, Phone, Mail, User } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { createOrder } from '../services/orderService'

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [payment, setPayment] = useState('cod')
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', pincode: '' })

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please login to proceed to checkout')
      navigate('/login', { state: { from: { pathname: '/checkout' } } })
    }
  }, [user, authLoading, navigate])

  useEffect(() => {
    if (user && !form.name) {
      setForm(f => ({
        ...f,
        name: user.user_metadata?.full_name || '',
        email: user.email || ''
      }))
    }
  }, [user])
  const shipping = total >= 500 ? 0 : 49
  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleOrder = async e => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.address || !form.city || !form.pincode) return toast.error('Please fill all fields')

    setLoading(true)

    const orderItems = items.map(item => ({
      ...item,
      // Ensure Price is a number for the database
      price: Number(item.price)
    }))

    const result = await createOrder({
      customer_name: form.name,
      customer_phone: form.phone,
      customer_email: form.email,
      address: form.address,
      city: form.city,
      pincode: form.pincode,
      payment_method: payment,
      subtotal: total,
      shipping: shipping,
      total_amount: total + shipping,
      items: orderItems
    })

    if (result.success) {
      setOrderPlaced(true)
      toast.success('Order placed successfully! 🙏')
      clearCart()
      navigate('/order-success', {
        state: { orderId: result.orderId },
        replace: true
      })
    } else {
      toast.error('Failed to place order. Please try again.')
      setLoading(false)
    }
  }

  const inp = { width: '100%', padding: '11px 14px', borderRadius: 8, border: '1.5px solid rgba(200,150,12,0.2)', background: '#FFFBF4', fontFamily: 'Poppins,sans-serif', fontSize: 14, color: '#333', outline: 'none', boxSizing: 'border-box' }

  useEffect(() => {
    if (!items.length && !orderPlaced) {
      navigate('/products', { replace: true })
    }
  }, [items.length, orderPlaced, navigate])

  if (authLoading) return (
    <div style={{ minHeight: '100vh', background: '#FFF5E1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(200,150,12,0.1)', borderTopColor: '#C8960C', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  )

  if (!items.length && !orderPlaced) return null

  return (
    <div style={{ minHeight: '100vh', background: '#FFF5E1', paddingTop: 80 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px clamp(16px, 4vw, 24px) 64px' }}>
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontFamily: 'Poppins,sans-serif', fontSize: 14, marginBottom: 24 }}>
          <ArrowLeft size={15} /> Back to Cart
        </button>
        <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: 36, fontWeight: 700, color: '#333', marginBottom: 32 }}>Checkout</h1>
        <form onSubmit={handleOrder}>
          <div className="responsive-grid-checkout" style={{ alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Delivery */}
              <div style={{ background: '#fff', borderRadius: 16, padding: '24px', border: '1px solid rgba(200,150,12,0.12)' }}>
                <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: 20, fontWeight: 700, color: '#333', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MapPin size={18} color="#C8960C" /> Delivery Details
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                  <input name="name" value={form.name} onChange={onChange} placeholder="Full name" style={inp} />
                  <input name="phone" value={form.phone} onChange={onChange} placeholder="Phone number" style={inp} />
                  <input name="email" type="email" value={form.email} onChange={onChange} placeholder="Email" style={{ ...inp, gridColumn: '1/-1' }} />
                  <textarea name="address" value={form.address} onChange={onChange} placeholder="Street address" rows={2} style={{ ...inp, gridColumn: '1/-1', resize: 'none' }} />
                  <input name="city" value={form.city} onChange={onChange} placeholder="City" style={inp} />
                  <input name="pincode" value={form.pincode} onChange={onChange} placeholder="Pincode" style={inp} />
                </div>
              </div>
              {/* Payment */}
              <div style={{ background: '#fff', borderRadius: 16, padding: '24px', border: '1px solid rgba(200,150,12,0.12)' }}>
                <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: 20, fontWeight: 700, color: '#333', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CreditCard size={18} color="#C8960C" /> Payment Method
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[['cod', 'Cash on Delivery', 'Pay when you receive'], ['upi', 'UPI / Net Banking', 'Razorpay secure payment'], ['card', 'Credit / Debit Card', 'Visa, Mastercard, Rupay']].map(([val, label, sub]) => (
                    <label key={val} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 10, border: `1.5px solid ${payment === val ? '#C8960C' : 'rgba(200,150,12,0.15)'}`, background: payment === val ? 'rgba(200,150,12,0.04)' : '#fff', cursor: 'pointer' }}>
                      <input type="radio" value={val} checked={payment === val} onChange={() => setPayment(val)} style={{ accentColor: '#C8960C', width: 16, height: 16 }} />
                      <div>
                        <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 14, fontWeight: 500, color: '#333' }}>{label}</p>
                        <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 12, color: '#aaa' }}>{sub}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="checkout-summary-card" style={{ background: '#fff', borderRadius: 16, padding: '24px', border: '1px solid rgba(200,150,12,0.12)' }}>
              <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: 20, fontWeight: 700, color: '#333', marginBottom: 18 }}>Order Summary</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16, maxHeight: 220, overflowY: 'auto' }}>
                {items.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <img src={item.image} alt={item.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 12, color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                      <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 11, color: '#aaa' }}>Qty: {item.qty}</p>
                    </div>
                    <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 13, fontWeight: 600, color: '#C8960C', flexShrink: 0 }}>₹{(item.price * item.qty).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid rgba(200,150,12,0.12)', paddingTop: 14, marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 13, color: '#888' }}>Subtotal</span>
                  <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 13, color: '#333' }}>₹{total.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 13, color: '#888' }}>Shipping</span>
                  <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 13, color: shipping === 0 ? '#2e7d32' : '#333' }}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <span style={{ fontFamily: '"Playfair Display",serif', fontSize: 18, fontWeight: 700, color: '#333' }}>Total</span>
                <span style={{ fontFamily: '"Playfair Display",serif', fontSize: 22, fontWeight: 700, color: '#C8960C' }}>₹{(total + shipping).toLocaleString()}</span>
              </div>
              <motion.button type="submit" disabled={loading} whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }}
                style={{ width: '100%', padding: '14px 0', background: loading ? '#e0c97a' : '#C8960C', color: '#fff', border: 'none', borderRadius: 10, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Poppins,sans-serif', fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {loading ? <div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> : 'Place Order 🙏'}
              </motion.button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
