import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ShoppingCart, Star, Plus, Minus, Shield, Truck, Leaf, Heart, Share2 } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import ProductCard from '../components/ProductCard'
import { PRODUCTS } from '../utils/data'
import { fetchProductById } from '../services/productService'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { items, addToCart, removeFromCart, updateQty, toggleWishlist, isInWishlist } = useCart()
  const { user } = useAuth()
  const [tab, setTab] = useState('description')
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true)
      // Try local data first
      let found = PRODUCTS.find(p => p.id === id)
      
      if (!found) {
        // Fetch from Supabase if not in local data
        const dbProduct = await fetchProductById(id)
        if (dbProduct) {
          found = {
            ...dbProduct,
            name: dbProduct.title || dbProduct.name,
            image: dbProduct.image_url || dbProduct.image
          }
        }
      }
      
      setProduct(found)
      setLoading(false)
    }
    
    loadProduct()
    window.scrollTo(0, 0);
  }, [id])

  const related = PRODUCTS.filter(p => p.id !== id && p.category === product?.category).slice(0, 4)
  const inWish = product ? isInWishlist(product.id) : false

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF5E1' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{ width: 40, height: 40, border: '4px solid rgba(200,150,12,0.1)', borderTopColor: '#C8960C', borderRadius: '50%' }} />
      </div>
    )
  }

  if (!product) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FFF5E1', paddingTop: 60 }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>😔</div>
      <p style={{ fontFamily: '"Playfair Display",serif', fontSize: 24, color: '#999', marginBottom: 16 }}>Product not found</p>
      <button onClick={() => navigate('/products')} className="btn-primary">← Back to Products</button>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#FFF5E1', paddingTop: 60 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px clamp(16px, 4vw, 20px) 64px' }}>
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontFamily: 'Poppins,sans-serif', fontSize: 14, marginBottom: 28 }}>
          <ArrowLeft size={16} /> Back
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 52, marginBottom: 56 }}>
          {/* Image */}
          <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}>
            <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(200,150,12,0.12)', position: 'relative' }}>
              <img src={product.image} alt={product.name} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }} />
              {product.badge && (
                <span style={{ position: 'absolute', top: 14, left: 14, background: '#C8960C', color: '#fff', fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20, fontFamily: 'Poppins,sans-serif' }}>
                  {product.badge}
                </span>
              )}
              <div style={{ position: 'absolute', top: 14, right: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
                  onClick={() => toggleWishlist(product)}
                  style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,245,225,0.92)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Heart size={17} fill={inWish ? '#C8960C' : 'none'} color={inWish ? '#C8960C' : '#888'} />
                </motion.button>
                <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
                  onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success('Link copied!') }}
                  style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,245,225,0.92)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Share2 size={15} color="#888" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 11, color: '#C8960C', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>
              {(product?.category || 'Product').replace('-', ' ')}
            </p>
            <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 700, color: '#333', lineHeight: 1.2, marginBottom: 14 }}>
              {product.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={15} fill={i < Math.floor(product.rating) ? '#C8960C' : 'none'} color="#C8960C" />)}
              </div>
              <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 13, fontWeight: 600, color: '#C8960C' }}>{product.rating}</span>
              <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 13, color: '#aaa' }}>({product.reviews} reviews)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 20 }}>
              <span style={{ fontFamily: '"Playfair Display",serif', fontSize: 32, fontWeight: 700, color: '#C8960C' }}>
                ₹{product.product_sizes?.length > 0 ? product.product_sizes[0].price : product.price}
              </span>
              {product.originalPrice && (
                <span style={{ fontSize: 20, color: '#aaa', textDecoration: 'line-through', fontFamily: 'Poppins,sans-serif', marginLeft: 8 }}>
                  ₹{product.originalPrice}
                </span>
              )}
              <span style={{ fontSize: 13, color: '#888', fontFamily: 'Poppins,sans-serif', fontWeight: 500, marginLeft: 8 }}>
                {product.product_sizes?.length > 0 ? 'Starting Price' : ''}
              </span>
            </div>

            {/* Multi-Weight Selection Table (Grouped Logic) */}
            {product.product_sizes && product.product_sizes.length > 0 ? (
              <div style={{ marginBottom: 32, background: 'rgba(200,150,12,0.03)', borderRadius: 16, padding: '20px', border: '1px solid rgba(200,150,12,0.1)' }}>
                <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 12, color: '#888', fontWeight: 600, textTransform: 'uppercase', marginBottom: 16, letterSpacing: '0.05em' }}>Choose Weights & Quantity:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {product.product_sizes.map((size) => {
                    const cartItem = items.find(i => i.product_id === product.id && i.selected_size === size.size_label);
                    return (
                      <div key={size.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: '#fff',
                        padding: '12px 18px',
                        borderRadius: 12,
                        border: cartItem ? '1.5px solid #C8960C' : '1px solid rgba(200,150,12,0.12)',
                        boxShadow: cartItem ? '0 4px 12px rgba(200,150,12,0.08)' : '0 2px 6px rgba(0,0,0,0.02)'
                      }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 14, fontWeight: 700, color: cartItem ? '#C8960C' : '#333', marginBottom: 2 }}>{size.size_label}</p>
                          <p style={{ fontFamily: '"Playfair Display",serif', fontSize: 16, fontWeight: 700, color: cartItem ? '#333' : '#C8960C' }}>₹{size.price}</p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                          {cartItem ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#FFF5E1', padding: '6px 14px', borderRadius: 10, border: '1.5px solid rgba(200,150,12,0.3)' }}>
                              <button onClick={() => updateQty(cartItem.id, cartItem.qty - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C8960C', display: 'flex' }}><Minus size={15} /></button>
                              <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 16, fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{cartItem.qty}</span>
                              <button onClick={() => updateQty(cartItem.id, cartItem.qty + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C8960C', display: 'flex' }}><Plus size={15} /></button>
                            </div>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                if (!user) {
                                  toast.error('Please login to add items to cart');
                                  navigate('/login', { state: { from: location } });
                                  return;
                                }
                                addToCart(product, size, 1);
                              }}
                              style={{
                                background: '#C8960C',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 10,
                                padding: '10px 20px',
                                fontFamily: 'Poppins,sans-serif',
                                fontSize: 14,
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                boxShadow: '0 4px 10px rgba(200,150,12,0.2)'
                              }}
                            >
                              <Plus size={16} /> Add
                            </motion.button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 28 }}>
                {(() => {
                  const cartItem = items.find(i => i.product_id === product.id && i.selected_size === 'Standard');
                  return cartItem ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, border: '1.5px solid #C8960C', borderRadius: 12, padding: '10px 24px', background: '#fff', flex: 1, justifyContent: 'center' }}>
                      <button onClick={() => updateQty(cartItem.id, cartItem.qty - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C8960C', display: 'flex' }}><Minus size={18} /></button>
                      <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 20, fontWeight: 700, minWidth: 32, textAlign: 'center' }}>{cartItem.qty}</span>
                      <button onClick={() => updateQty(cartItem.id, cartItem.qty + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C8960C', display: 'flex' }}><Plus size={18} /></button>
                    </div>
                  ) : (
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        if (!user) {
                          toast.error('Please login to add items to cart');
                          navigate('/login', { state: { from: location } });
                          return;
                        }
                        addToCart(product, null, 1);
                      }}
                      className="btn-primary"
                      style={{ flex: 1, justifyContent: 'center', padding: '13px 0', fontSize: 15 }}>
                      <ShoppingCart size={17} /> Add to Cart — ₹{product.price.toLocaleString()}
                    </motion.button>
                  );
                })()}
              </div>
            )}

            {product.weight && !product.product_sizes?.length && <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 13, color: '#999', marginBottom: 18 }}>Weight: {product.weight}</p>}

            <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 14, color: '#666', lineHeight: 1.75, marginBottom: 20 }}>
              {product.description}
            </p>

            <button onClick={() => toggleWishlist(product)}
              style={{ width: '100%', padding: '11px 0', background: 'none', border: '1.5px solid rgba(200,150,12,0.28)', borderRadius: 10, color: inWish ? '#C8960C' : '#888', fontFamily: 'Poppins,sans-serif', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginBottom: 10 }}>
              <Heart size={15} fill={inWish ? '#C8960C' : 'none'} color={inWish ? '#C8960C' : '#888'} />
              {inWish ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: 20, paddingTop: 20, marginTop: 16, borderTop: '1px solid rgba(200,150,12,0.1)' }}>
              {[{ icon: Shield, text: 'FSSAI Certified' }, { icon: Leaf, text: '100% Pure' }, { icon: Truck, text: 'Free on ₹500+' }].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Icon size={14} color="#C8960C" />
                  <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 12, color: '#888' }}>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', borderBottom: '2px solid rgba(200,150,12,0.12)', marginBottom: 24 }}>
            {['description', 'details', 'reviews'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{ padding: '10px 24px', background: 'none', border: 'none', borderBottom: tab === t ? '2px solid #C8960C' : '2px solid transparent', marginBottom: -2, cursor: 'pointer', fontFamily: 'Poppins,sans-serif', fontSize: 14, fontWeight: tab === t ? 600 : 400, color: tab === t ? '#C8960C' : '#888', textTransform: 'capitalize' }}>
                {t}
              </button>
            ))}
          </div>
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            {tab === 'description' && <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 14, color: '#666', lineHeight: 1.8, maxWidth: 700 }}>{product.description} Made using traditional recipes passed down through generations. We source only the finest, natural ingredients ensuring purity, freshness, and divine taste in every bite.</p>}
            {tab === 'details' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12, maxWidth: 640 }}>
                {[['Category', product.category.replace('-', ' ')], ['Weight', product.weight || 'N/A'], ['Shelf Life', '15 days'], ['Storage', 'Cool & dry place'], ['Made In', 'India'], ['Certification', 'FSSAI']].map(([label, value]) => (
                  <div key={label} style={{ background: '#fff', borderRadius: 10, padding: '12px 16px', border: '1px solid rgba(200,150,12,0.1)' }}>
                    <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 10, color: '#C8960C', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{label}</p>
                    <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 14, color: '#333', textTransform: 'capitalize' }}>{value}</p>
                  </div>
                ))}
              </div>
            )}
            {tab === 'reviews' && (
              <div style={{ display: 'flex', gap: 14, flexDirection: 'column', maxWidth: 560 }}>
                {[{ name: 'Priya S.', rating: 5, text: 'Absolutely divine! The quality is unmatched. Will order again!' }, { name: 'Rahul M.', rating: 5, text: 'Gifted for Diwali. Everyone loved it! Premium packaging too.' }].map((r, i) => (
                  <div key={i} style={{ background: '#fff', borderRadius: 12, padding: '16px 18px', border: '1px solid rgba(200,150,12,0.1)' }}>
                    <div style={{ display: 'flex', gap: 1, marginBottom: 8 }}>{[...Array(r.rating)].map((_, j) => <Star key={j} size={13} fill="#C8960C" color="#C8960C" />)}</div>
                    <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 13, color: '#555', lineHeight: 1.65, marginBottom: 8 }}>"{r.text}"</p>
                    <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 12, color: '#C8960C', fontWeight: 600 }}>— {r.name}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {related.length > 0 && (
          <div>
            <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: 30, fontWeight: 700, color: '#333', marginBottom: 24 }}>
              You May Also <span style={{ color: '#C8960C' }}>Like</span>
            </h2>
            <div className="products-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
