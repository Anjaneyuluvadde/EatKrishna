import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'
import customCardBanner from '../assets/images/custom_laddu_banner.png'

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeFromCart, updateQty, total, updateItemSize } = useCart()
  const navigate = useNavigate()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 60 }}
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(400px, 100vw)',
              maxWidth: '100vw', background: '#FFF5E1', zIndex: 70,
              display: 'flex', flexDirection: 'column',
              boxShadow: '-4px 0 30px rgba(0,0,0,0.12)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '18px 24px', borderBottom: '1px solid rgba(200,150,12,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: '#fff',
            }}>
              <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: 20, color: '#333', fontWeight: 700 }}>
                Shopping Cart
              </h2>
              <button onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <X size={20} color="#666" />
              </button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
              {items.length === 0 ? (
                <div style={{ textAlign: 'center', paddingTop: 80 }}>
                  <ShoppingBag size={56} color="#ddd" style={{ margin: '0 auto 16px' }} />
                  <p style={{ color: '#999', fontFamily: 'Poppins,sans-serif', fontSize: 14 }}>
                    Your cart is empty
                  </p>
                  <button
                    onClick={() => { setIsOpen(false); navigate('/products') }}
                    style={{
                      marginTop: 20, padding: '10px 24px', background: '#C8960C',
                      color: '#fff', border: 'none', borderRadius: 8,
                      fontFamily: 'Poppins,sans-serif', fontSize: 13, cursor: 'pointer',
                    }}
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {items.map(item => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      style={{
                        display: 'flex', gap: 14, alignItems: 'center',
                        background: '#fff', borderRadius: 12, padding: 12,
                        border: '1px solid rgba(200,150,12,0.1)',
                      }}
                    >
                      {(item.image || item.type === 'customized') && (
                        <img
                          src={
                            item.type === 'customized'
                              ? customCardBanner
                              : (item.image || '').replace('http://', 'https://')
                          }
                          alt={item.name || 'Customized Laddu'}
                          style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
                        />
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontFamily: 'Poppins,sans-serif', fontSize: 13, fontWeight: 500,
                          color: '#333', marginBottom: 4,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {item.name}
                        </p>
                        <p style={{ fontFamily: '"Playfair Display",serif', fontSize: 14, color: '#C8960C', fontWeight: 700 }}>
                          ₹{item.price}
                        </p>

                        {/* Size selection hidden in mini cart */}
                        <div className="selected-size-text">
                          Selected: {item.selected_size}
                        </div>
                        {/* Qty controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                          <button onClick={() => updateQty(item.id, item.qty - 1)}
                            style={{
                              width: 24, height: 24, borderRadius: 6, border: '1px solid #C8960C',
                              background: 'none', cursor: 'pointer', display: 'flex',
                              alignItems: 'center', justifyContent: 'center',
                            }}>
                            <Minus size={11} color="#C8960C" />
                          </button>
                          <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 13, fontWeight: 600, minWidth: 20, textAlign: 'center' }}>
                            {item.qty}
                          </span>
                          <button onClick={() => updateQty(item.id, item.qty + 1)}
                            style={{
                              width: 24, height: 24, borderRadius: 6, border: '1px solid #C8960C',
                              background: 'none', cursor: 'pointer', display: 'flex',
                              alignItems: 'center', justifyContent: 'center',
                            }}>
                            <Plus size={11} color="#C8960C" />
                          </button>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                        <button onClick={() => removeFromCart(item.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                          <X size={16} color="#ccc" />
                        </button>
                        <p style={{ fontFamily: '"Playfair Display",serif', fontSize: 14, fontWeight: 700, color: '#333' }}>
                          ₹{(item.price * item.qty).toLocaleString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div style={{
                padding: '16px 24px', background: '#fff',
                borderTop: '1px solid rgba(200,150,12,0.15)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                  <span style={{ fontFamily: 'Poppins,sans-serif', color: '#666', fontSize: 14 }}>Subtotal</span>
                  <span style={{ fontFamily: '"Playfair Display",serif', fontSize: 18, fontWeight: 700, color: '#C8960C' }}>
                    ₹{total.toLocaleString()}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setIsOpen(false); navigate('/cart') }}
                  style={{
                    width: '100%', padding: '13px 0', background: '#C8960C',
                    color: '#fff', border: 'none', borderRadius: 10,
                    fontFamily: 'Poppins,sans-serif', fontSize: 15, fontWeight: 600,
                    cursor: 'pointer', letterSpacing: '0.02em',
                  }}
                >
                  Proceed to Checkout
                </motion.button>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    width: '100%', marginTop: 10, padding: '10px 0', background: 'none',
                    border: '1.5px solid #C8960C', borderRadius: 10, color: '#C8960C',
                    fontFamily: 'Poppins,sans-serif', fontSize: 14, cursor: 'pointer',
                  }}
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
