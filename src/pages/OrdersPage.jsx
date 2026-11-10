import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../services/supabase'
import { useAuth } from '../context/AuthContext'
import { Package, Clock, CheckCircle, PackageOpen, LayoutGrid, List, ArrowRight, ShoppingBag, X, AlertCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { cancelOrder } from '../services/orderService'
import { AnimatePresence } from 'framer-motion'

const OrderTracking = ({ status }) => {
  const getActiveStep = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
      case 'confirmed':
        return 1;
      case 'processing':
      case 'preparing':
        return 2;
      case 'completed':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 1;
    }
  };

  const activeStep = getActiveStep(status);
  const steps = ['Confirmed', 'Preparing', 'Completed', 'Delivered'];
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '24px 0', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '12px', left: 0, right: 0, height: 2, background: '#eee', transform: 'translateY(-50%)', zIndex: 1 }} />
      
      <div style={{ 
        position: 'absolute', top: '12px', left: 0, 
        width: `${((activeStep - 1) / (steps.length - 1)) * 100}%`, 
        height: 2, background: '#C8960C', transform: 'translateY(-50%)', zIndex: 1,
        transition: 'width 0.5s ease'
      }} />

      {steps.map((step, index) => {
        const stepNum = index + 1;
        const isCompleted = stepNum < activeStep;
        const isActive = stepNum === activeStep;
        
        return (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, position: 'relative' }}>
            <div style={{
              width: 24, height: 24, borderRadius: '50%',
              background: isCompleted || isActive ? '#C8960C' : '#fff',
              border: `2px solid ${isCompleted || isActive ? '#C8960C' : '#ccc'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: isCompleted || isActive ? '#fff' : '#ccc',
              fontSize: 12, fontWeight: 700,
              transition: 'all 0.3s ease'
            }}>
              {isCompleted ? '✓' : stepNum}
            </div>
            <span style={{ 
              marginTop: 8, fontSize: 11, fontFamily: 'Poppins,sans-serif',
              color: isActive ? '#C8960C' : (isCompleted ? '#333' : '#aaa'),
              fontWeight: isActive ? 600 : 400,
              textAlign: 'center'
            }}>
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const OrdersPage = () => {
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState([])
  const [customOrders, setCustomOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Cancellation state
  const [cancelModal, setCancelModal] = useState({ isOpen: false, orderId: null, type: null })
  const [cancelReason, setCancelReason] = useState('')
  const [isCancelling, setIsCancelling] = useState(false)

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) return
    setIsCancelling(true)
    try {
      // Update order status using service
      const { error } = await cancelOrder(cancelModal.orderId, cancelModal.type, cancelReason.trim())

      if (error) throw error

      // Refresh
      fetchOrders()
      setCancelModal({ isOpen: false, orderId: null, type: null })
      setCancelReason('')
      alert('Order cancelled successfully.')
    } catch (err) {
      console.error('Error cancelling order:', err)
      alert('Failed to cancel order. Please try again.')
    } finally {
      setIsCancelling(false)
    }
  }

  const handleDeleteOrder = async (orderId, type) => {
    if (!window.confirm('Are you sure you want to remove this order from your history? This action cannot be undone.')) return

    try {
      const table = type === 'normal' ? 'product_orders' : 'customized_orders'
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', orderId)

      if (error) throw error

      // Refresh
      fetchOrders()
    } catch (err) {
      console.error('Error deleting order:', err)
      alert('Failed to remove order. Please try again.')
    }
  }

  useEffect(() => {
    if (user?.email) {
      fetchOrders()
    } else if (!authLoading) {
      setLoading(false)
    }
  }, [user, authLoading])

  const fetchOrders = async () => {
    try {
      setLoading(true)

      // Fetch normal orders
      const { data: pOrders, error: pError } = await supabase
        .from('product_orders')
        .select('*')
        .eq('customer_email', user.email)
        .order('created_at', { ascending: false })

      if (pError) throw pError
      setOrders(pOrders || [])

      // Fetch customized orders
      const { data: cOrders, error: cError } = await supabase
        .from('customized_orders')
        .select('*')
        .eq('customer_email', user.email)
        .order('created_at', { ascending: false })

      if (cError) throw cError
      setCustomOrders(cOrders || [])

    } catch (err) {
      console.error('Error fetching orders:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return { bg: '#E1F9EB', text: '#10B981' }
      case 'pending': return { bg: '#FFF5E1', text: '#F59E0B' }
      case 'processing': return { bg: '#EFF6FF', text: '#3B82F6' }
      case 'cancelled': return { bg: '#FEF2F2', text: '#EF4444' }
      default: return { bg: '#F3F4F6', text: '#6B7280' }
    }
  }

  if (authLoading || loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF5E1' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{ width: 40, height: 40, border: '4px solid rgba(200,150,12,0.1)', borderTopColor: '#C8960C', borderRadius: '50%' }} />
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FFF5E1', padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>🔒</div>
        <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 32, color: '#2C1200', marginBottom: 16 }}>Please Login to view orders</h2>
        <p style={{ color: '#666', marginBottom: 32 }}>Unlock your order history and track your healthy treats.</p>
        <Link to="/login" className="btn-primary" style={{ textDecoration: 'none' }}>Login Now</Link>
      </div>
    )
  }

  const hasNoOrders = orders.length === 0 && customOrders.length === 0

  return (
    <div style={{ background: '#FFF5E1', minHeight: '100vh', paddingTop: 120, paddingBottom: 80 }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px' }}>

        <header style={{ marginBottom: 48, textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="section-label">Order History</span>
            <h1 className="section-title" style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
              My <span className="gold">Orders</span>
            </h1>
          </motion.div>
        </header>

        {hasNoOrders ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '80px 40px', background: '#fff', borderRadius: 32, border: '1px solid rgba(200,150,12,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'inline-flex', background: '#FFF5E1', padding: 24, borderRadius: '50%', marginBottom: 24 }}>
              <PackageOpen size={48} color="#C8960C" />
            </div>
            <h3 style={{ fontSize: 24, fontWeight: 700, color: '#2C1200', marginBottom: 12 }}>No orders yet</h3>
            <p style={{ color: '#666', marginBottom: 32 }}>Your journey with Kbite starts with your first order.</p>
            <Link to="/products" className="btn-primary" style={{ textDecoration: 'none' }}>Start Shopping</Link>
          </motion.div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 60 }}>

            {/* Normal Orders */}
            {orders.length > 0 && (
              <section>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <ShoppingBag size={24} color="#C8960C" />
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: '#2C1200' }}>Product Orders ({orders.length})</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {orders.map((order) => (
                    <motion.div
                      key={order.id}
                      whileHover={{ y: -4 }}
                      onClick={() => {
                        const firstItem = order.items?.[0]
                        const productId = firstItem?.product_id || firstItem?.id
                        if (productId) {
                          navigate(`/product/${productId}`)
                        } else {
                          navigate('/products')
                        }
                      }}
                      style={{ background: '#fff', borderRadius: 24, border: '1px solid rgba(200,150,12,0.1)', padding: 32, boxShadow: '0 10px 30px rgba(0,0,0,0.03)', position: 'relative', cursor: 'pointer' }}
                    >
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteOrder(order.id, 'normal') }}
                        style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(0,0,0,0.03)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#999', transition: 'all 0.2s ease', zIndex: 10 }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.03)'}
                      >
                        <X size={16} />
                      </button>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20, marginBottom: 24, paddingRight: 40 }}>
                        <div>
                          <div style={{ fontSize: 13, color: '#999', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order ID</div>
                          <div style={{ fontWeight: 700, color: '#2C1200' }}>#{order.order_number}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 12 }}>
                          <span style={{
                            padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                            background: getStatusColor(order.order_status).bg, color: getStatusColor(order.order_status).text
                          }}>
                            {order.order_status || 'Pending'}
                          </span>
                          {order.order_status?.toLowerCase() === 'pending' && (
                            <button
                              onClick={(e) => { e.stopPropagation(); setCancelModal({ isOpen: true, orderId: order.id, type: 'normal' }) }}
                              style={{ padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: '#FEF2F2', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.1)', cursor: 'pointer' }}
                            >
                              Cancel Order
                            </button>
                          )}
                          {order.order_status?.toLowerCase() === 'cancelled' && order.cancel_reason && (
                            <div style={{ fontSize: 12, color: '#EF4444', background: '#FEF2F2', padding: '4px 12px', borderRadius: 8, marginTop: 4, fontWeight: 500 }}>
                              Reason: {order.cancel_reason}
                            </div>
                          )}
                        </div>
                      </div>

                      <OrderTracking status={order.order_status} />

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, borderTop: '1px solid #f5f5f5', borderBottom: '1px solid #f5f5f5', padding: '20px 0', marginBottom: 24 }}>
                        {order.items?.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div style={{ width: 44, height: 44, background: '#FFF5E1', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Package size={20} color="#C8960C" />
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, color: '#2C1200', fontSize: 14 }}>{item.name}</div>
                                <div style={{ fontSize: 12, color: '#666' }}>Qty: {item.quantity || item.qty} | ₹{item.price}</div>
                              </div>
                            </div>
                            <div style={{ fontWeight: 600, color: '#2C1200' }}>₹{(item.price * (item.quantity || item.qty)).toFixed(2)}</div>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: 14, color: '#666' }}>
                          <Clock size={14} style={{ marginRight: 6, display: 'inline' }} />
                          {new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                          <div style={{ fontSize: 12, color: '#C8960C', marginTop: 8, fontWeight: 600 }}>
                            Expect your order at your doorstep within 3 days.
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>Total Amount</div>
                          <div style={{ fontSize: 24, fontWeight: 800, color: '#C8960C' }}>₹{order.total.toFixed(2)}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Customized Orders */}
            {customOrders.length > 0 && (
              <section>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <LayoutGrid size={24} color="#C8960C" />
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: '#2C1200' }}>Customized Laddu Orders ({customOrders.length})</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {customOrders.map((order) => (
                    <motion.div
                      key={order.id}
                      whileHover={{ y: -4 }}
                      onClick={() => navigate('/products')}
                      style={{ background: '#fff', borderRadius: 24, border: '1px solid rgba(200,150,12,0.1)', padding: 32, boxShadow: '0 10px 30px rgba(0,0,0,0.03)', position: 'relative', cursor: 'pointer' }}
                    >
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteOrder(order.id, 'custom') }}
                        style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(0,0,0,0.03)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#999', transition: 'all 0.2s ease', zIndex: 10 }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.03)'}
                      >
                        <X size={16} />
                      </button>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20, marginBottom: 24, paddingRight: 40 }}>
                        <div>
                          <div style={{ fontSize: 13, color: '#999', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order ID</div>
                          <div style={{ fontWeight: 700, color: '#2C1200' }}>#{order.order_number}</div>
                        </div>
                        <span style={{
                          padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                          background: getStatusColor(order.order_status).bg, color: getStatusColor(order.order_status).text
                        }}>
                          {order.order_status || 'Pending'}
                        </span>
                        {order.order_status?.toLowerCase() === 'pending' && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setCancelModal({ isOpen: true, orderId: order.id, type: 'custom' }) }}
                            style={{ padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: '#FEF2F2', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.1)', cursor: 'pointer' }}
                          >
                            Cancel Order
                          </button>
                        )}
                        {order.order_status?.toLowerCase() === 'cancelled' && order.cancel_reason && (
                          <div style={{ fontSize: 12, color: '#EF4444', background: '#FEF2F2', padding: '4px 12px', borderRadius: 8, marginTop: 4, fontWeight: 500 }}>
                            Reason: {order.cancel_reason}
                          </div>
                        )}
                      </div>

                      <OrderTracking status={order.order_status} />

                      <div style={{ background: '#FFFBF4', borderRadius: 16, padding: '24px', marginBottom: 24, border: '1px dashed rgba(200,150,12,0.2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                          <h3 style={{ fontWeight: 700, color: '#2C1200' }}>{order.customized_product_name}</h3>
                          <div style={{ fontWeight: 800, color: '#C8960C' }}>₹{order.total_price.toFixed(2)}</div>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {order.ingredients?.map((ing, idx) => (
                            <span key={idx} style={{ background: '#fff', padding: '4px 10px', borderRadius: 6, fontSize: 11, color: '#666', border: '1px solid #f0f0f0' }}>{typeof ing === 'object' ? ing.name : ing}</span>
                          ))}
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: 14, color: '#666' }}>
                          <Clock size={14} style={{ marginRight: 6, display: 'inline' }} />
                          {new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                          <div style={{ fontSize: 12, color: '#C8960C', marginTop: 8, fontWeight: 600 }}>
                            Order will be delivered within 3 days
                          </div>
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#2C1200' }}>
                          Quantity: {order.quantity}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

          </div>
        )}
      </div>

      {/* Cancel Reason Modal */}
      <AnimatePresence>
        {cancelModal.isOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCancelModal({ ...cancelModal, isOpen: false })}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} />

            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              style={{ position: 'relative', width: '100%', maxWidth: 450, background: '#fff', borderRadius: 24, padding: 32, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>

              <button onClick={() => setCancelModal({ ...cancelModal, isOpen: false })} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}>
                <X size={24} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ background: '#FEF2F2', padding: 12, borderRadius: '50%' }}>
                  <AlertCircle color="#EF4444" size={24} />
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: '#2C1200' }}>Cancel Order</h3>
              </div>

              <p style={{ color: '#666', marginBottom: 24, lineHeight: 1.6 }}>Please let us know the reason for cancellation. This helps us improve our service.</p>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#2C1200', marginBottom: 8 }}>Reason for Cancellation</label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g., Changed my mind, Ordered by mistake..."
                  style={{ width: '100%', height: 120, padding: 16, borderRadius: 12, border: '1.5px solid #eee', background: '#f9f9f9', outline: 'none', fontSize: 14, fontFamily: 'inherit', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => setCancelModal({ ...cancelModal, isOpen: false })}
                  style={{ flex: 1, padding: '14px', borderRadius: 12, border: '1.5px solid #eee', background: '#fff', color: '#666', fontWeight: 600, cursor: 'pointer' }}
                >
                  Go Back
                </button>
                <button
                  disabled={isCancelling || !cancelReason.trim()}
                  onClick={handleCancelOrder}
                  style={{
                    flex: 1, padding: '14px', borderRadius: 12, border: 'none',
                    background: cancelReason.trim() ? '#EF4444' : '#fee2e2',
                    color: '#fff', fontWeight: 600, cursor: cancelReason.trim() ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  {isCancelling ? 'Cancelling...' : 'Confirm Cancel'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default OrdersPage
