import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import CustomizeLadduSection from '../components/CustomizeLadduSection'
import CustomizeLaddu from '../components/CustomizeLaddu'
import { CATEGORIES } from '../utils/data'
import { fetchProducts } from '../services/productService'

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [active, setActive] = useState(searchParams.get('category') || 'all')
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [customizeLadduOpen, setCustomizeLadduOpen] = useState(false)

  useEffect(() => {
    const load = async () => {
      const data = await fetchProducts()
      // Normalize data to match ProductCard props structure
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
      setProducts(normalized)
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) setActive(cat)
  }, [searchParams])

  const handleCat = (id) => {
    setActive(id)
    if (id === 'all') searchParams.delete('category')
    else setSearchParams({ category: id })
  }

  const normalize = (s) => (s || '').toLowerCase().trim().replace(/\s+/g, '-').replace(/s$/, '')
  const filtered = products
    .filter(p => active === 'all' || normalize(p.category) === normalize(active))
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ minHeight: '100vh', background: '#FFF5E1', paddingTop: 80 }}>
      {/* Search & Header Section — matching screenshot exactly */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(40px, 8vw, 60px) clamp(16px, 4vw, 24px) clamp(20px, 4vw, 40px)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: 44 }}
        >
          <p style={{
            fontFamily: 'Poppins,sans-serif', fontSize: 11,
            color: '#2C1200', letterSpacing: '0.3em',
            textTransform: 'uppercase', marginBottom: 12, fontWeight: 600
          }}>
            Explore Our Range
          </p>
          <h1 style={{
            fontFamily: '"Playfair Display",serif',
            fontSize: 'clamp(36px, 6vw, 56px)',
            fontWeight: 900, color: '#333', marginBottom: 32,
            letterSpacing: '-0.02em'
          }}>
            Our <span style={{ color: '#2C1200' }}>Products</span>
          </h1>

          {/* Search bar specifically as in screenshot */}
          <div style={{ maxWidth: 500, margin: '0 auto 32px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search sweets, ladoos..."
              style={{
                width: '100%', padding: '14px 14px 14px 48px',
                borderRadius: 12, border: '1px solid #EAEAEA',
                background: '#fff', fontFamily: 'Poppins,sans-serif',
                fontSize: 15, outline: 'none', color: '#333',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
              }}
            />
          </div>

          {/* Category Tabs specifically as in screenshot */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 12,
            flexWrap: 'wrap'
          }}>
            {CATEGORIES.map(cat => (
              <motion.button
                key={cat.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleCat(cat.id)}
                style={{
                  padding: '10px 24px', borderRadius: 10,
                  fontFamily: 'Poppins,sans-serif', fontSize: 14, fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.3s ease',
                  border: active === cat.id ? 'none' : '1px solid #EAEAEA',
                  background: active === cat.id ? '#C1923F' : '#fff',
                  color: active === cat.id ? '#fff' : '#666',
                  boxShadow: active === cat.id ? '0 4px 12px rgba(193, 146, 63, 0.3)' : 'none'
                }}
              >
                {cat.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Count */}
        <p style={{
          fontFamily: 'Poppins,sans-serif', fontSize: 14, color: '#888',
          marginBottom: 24, paddingLeft: 4
        }}>
          Showing {filtered.length} product{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* Grid — 4 columns matching screenshot */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <div style={{ width: 44, height: 44, border: '3px solid #EAEAEA', borderTopColor: '#C1923F', borderRadius: '50%', margin: '0 auto', animation: 'spin 1s linear infinite' }} />
            <p style={{ fontFamily: 'Poppins,sans-serif', color: '#999', marginTop: 16 }}>Loading fresh delicacies...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <p style={{ fontFamily: '"Playfair Display",serif', fontSize: 22, color: '#999' }}>
              No products found
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 20,
          }}>
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* Customize Section */}
      <div style={{ paddingBottom: 64 }}>
        <CustomizeLadduSection onOpen={() => setCustomizeLadduOpen(true)} />
      </div>

      {/* Modal */}
      <AnimatePresence>
        <CustomizeLaddu isOpen={customizeLadduOpen} onClose={() => setCustomizeLadduOpen(false)} />
      </AnimatePresence>
    </div>
  )
}
