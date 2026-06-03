import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function ProductCard({ product, index = 0 }) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const inWish = isInWishlist(product.id)

  const [selectedSize, setSelectedSize] = useState(() => {
    if (!product.product_sizes || product.product_sizes.length === 0) return null;
    return product.product_sizes[1] || product.product_sizes[0];
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className="card-hover"
      style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(200,150,12,0.1)', cursor: 'pointer' }}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }} onClick={() => navigate(`/product/${product.id}`)}>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.55s ease', display: 'block' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.07)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        />
        {/* Overlay on hover */}
        <div className="img-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', transition: 'background 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0 }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.18)'; e.currentTarget.style.opacity = 1 }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0)'; e.currentTarget.style.opacity = 0 }}>
          <Eye size={28} color="#fff" />
        </div>
        {/* Badge */}
        {product.badge && (
          <span style={{ position: 'absolute', top: 10, left: 10, background: '#C8960C', color: '#fff', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, fontFamily: 'Poppins,sans-serif' }}>
            {product.badge}
          </span>
        )}
        {/* Wishlist */}
        <motion.button
          whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.88 }}
          onClick={e => { e.stopPropagation(); toggleWishlist(product) }}
          style={{ position: 'absolute', top: 10, right: 10, width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,245,225,0.92)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
          <Heart size={15} fill={inWish ? '#C8960C' : 'none'} color={inWish ? '#C8960C' : '#888'} />
        </motion.button>
      </div>

      {/* Info */}
      <div style={{ padding: '13px 14px 15px' }} onClick={() => navigate(`/product/${product.id}`)}>
        <p style={{ fontSize: 10, color: '#C8960C', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4, fontFamily: 'Poppins,sans-serif' }}>
          {product.category.replace('-', ' ')}
        </p>
        <h3 className="line-clamp-2" style={{ fontFamily: '"Playfair Display",serif', fontSize: 15, fontWeight: 700, color: '#333', marginBottom: 7, lineHeight: 1.35 }}>
          {product.name}
        </h3>

        {/* Stars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 9 }}>
          <div style={{ display: 'flex', gap: 1 }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={11} fill={i < Math.floor(product.rating) ? '#C8960C' : 'none'} color="#C8960C" />
            ))}
          </div>
          <span style={{ fontSize: 11, color: '#aaa', fontFamily: 'Poppins,sans-serif' }}>({product.reviews})</span>
        </div>

        {/* Price row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
          <div>
            <span style={{ fontFamily: '"Playfair Display",serif', fontSize: 18, fontWeight: 700, color: '#C8960C' }}>
              ₹{selectedSize ? selectedSize.price : product.price}
            </span>
            {product.originalPrice && (
              <span style={{ fontSize: 12, color: '#ccc', textDecoration: 'line-through', marginLeft: 6, fontFamily: 'Poppins,sans-serif' }}>
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          {(product.discount || (product.originalPrice && !selectedSize)) && (
            <span style={{ fontSize: 11, background: '#fef3e2', color: '#8B6800', padding: '2px 7px', borderRadius: 12, fontWeight: 600, fontFamily: 'Poppins,sans-serif' }}>
              {product.discount || `${Math.round((1 - product.price / product.originalPrice) * 100)}% off`}
            </span>
          )}
        </div>

      </div>

      {/* Add to cart */}
      <div style={{ padding: '0 14px 14px' }}>
        <motion.button
          whileHover={{ scale: 1.02, filter: 'brightness(1.1)' }} whileTap={{ scale: 0.97 }}
          onClick={e => { 
            e.stopPropagation();
            if (!user) {
              toast.error('Please login to add items to cart');
              navigate('/login', { state: { from: location } });
              return;
            }
            addToCart(product, selectedSize);
          }}
          style={{ width: '100%', padding: '11px 0', background: 'linear-gradient(135deg, #C8960C 0%, #A07808 100%)', color: '#fff', border: 'none', borderRadius: 8, fontFamily: 'Poppins,sans-serif', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.3s ease', boxShadow: '0 4px 12px rgba(200,150,12,0.2)' }}
        >
          <ShoppingCart size={14} /> Add to Cart
        </motion.button>
      </div>
    </motion.div>
  )
}