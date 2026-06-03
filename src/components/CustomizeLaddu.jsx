import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Plus, Minus } from 'lucide-react'
import customCardBanner from '../assets/images/custom_laddu_banner.png'

import { supabase } from '../services/supabase'
import { calculateCustomizedLadduPrice } from '../utils/pricingLogic'

// Static Fallbacks (Uncomment if needed)
/*
const VARIETY_TYPES = [
  { name: 'Protein Laddu', price: 1800, weight: '800g' },
  { name: 'Nutrition Bar', price: 2000, weight: '800g' },
  { name: 'Protein Bite', price: 2000, weight: '800g' },
  { name: 'Protein Chocolate Bite', price: 2200, weight: '800g' },
  { name: 'Protein Mix', price: 1600, weight: '800g' },
]

const SIZES = [
  { size: '800g', price: 2000 },
  { size: '400g', price: 1000 },
  { size: '200g', price: 500 },
]
*/

export default function CustomizeLaddu({ isOpen, onClose }) {
  const [step, setStep] = useState(1)
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [selectedVarietyIds, setSelectedVarietyIds] = useState([])
  const [selectedSizes, setSelectedSizes] = useState({}) // { index: qty }
  const [quantity, setQuantity] = useState(1)
  const [ingredients, setIngredients] = useState([])
  const [varieties, setVarieties] = useState([])
  const [sizes, setSizes] = useState([])
  const [baseItemPrice, setBaseItemPrice] = useState(300)
  const { addToCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchVarieties()
    fetchSettings()

    const channelVarieties = supabase?.channel('varieties-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'varieties' }, fetchVarieties)
      .subscribe()

    const channelSizes = supabase?.channel('sizes-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sizes' }, fetchSizes)
      .subscribe()

    const channelSettings = supabase?.channel('settings-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, fetchSettings)
      .subscribe()

    return () => {
      supabase?.removeChannel(channelVarieties)
      supabase?.removeChannel(channelSizes)
      supabase?.removeChannel(channelSettings)
    }
  }, [])

  const fetchAllOptions = () => {
    fetchIngredients()
    fetchVarieties()
    fetchSettings()
    // Sizes are fetched via useEffect listening to selectedVarietyId
  }

  const fetchSettings = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('settings').select('*')
      if (!error && data && data.length > 0) {
        const priceSetting = data.find(s => s.key === 'base_item_price_per_kg' || s.name === 'base_item_price_per_kg')
        if (priceSetting && priceSetting.value) {
          setBaseItemPrice(Number(priceSetting.value))
          return;
        }
        if (data[0].base_item_price_per_kg) {
          setBaseItemPrice(Number(data[0].base_item_price_per_kg))
          return;
        }
      }
    } catch (err) { }
  }


  const fetchVarieties = async () => {
    if (!supabase) return

    const { data, error } = await supabase
      .from('varieties')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true })

    console.log('VARIETIES:', data)
    console.log('VARIETY ERROR:', error)

    if (!error) {
      setVarieties(data || [])
    }
  }

  const fetchSizes = async () => {
    if (!supabase || selectedVarietyIds.length === 0) {
      setSizes([])
      return
    }

    const { data, error } = await supabase
      .from('sizes')
      .select('*')
      .in('variety_id', selectedVarietyIds)
      .eq('is_active', true)
      .order('price', { ascending: false })

    console.log('SIZES:', data)
    console.log('SIZE ERROR:', error)

    if (!error) {
      setSizes(data || [])
    }
  }

  useEffect(() => {
    fetchSizes()
  }, [selectedVarietyIds])

  // Enhanced Body Scroll Lock
  useEffect(() => {
    if (isOpen) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollBarWidth}px`;
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    fetchIngredients()

    const channel = supabase
      ?.channel('ingredients-live')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ingredients'
        },
        () => {
          fetchIngredients()
        }
      )
      .subscribe()

    return () => {
      supabase?.removeChannel(channel)
    }
  }, [])

  const fetchIngredients = async () => {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .order('created_at', { ascending: false })

    console.log('INGREDIENTS:', data)
    console.log('INGREDIENT ERROR:', error)

    if (!error) {
      setIngredients(data || [])
    }
  }

  const handleIngredientToggle = (ingredient) => {
    if (selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(selectedIngredients.filter(i => i !== ingredient))
    } else if (selectedIngredients.length < 11) {
      setSelectedIngredients([...selectedIngredients, ingredient])
    } else {
      toast.error('Maximum 11 ingredients allowed')
    }
  }

  const handleVarietySelect = (varietyId) => {
    setSelectedVarietyIds(prev => {
      const newIds = prev.includes(varietyId)
        ? prev.filter(id => id !== varietyId)
        : [...prev, varietyId];
      return newIds;
    });
    setSelectedSizes({})
  }

  const handleSizeQty = (sizeId, delta) => {
    setSelectedSizes(prev => {
      const currentQty = prev[sizeId] || 0
      const newQty = Math.max(0, currentQty + delta)

      const newSizes = { ...prev }
      if (newQty === 0) {
        delete newSizes[sizeId]
      } else {
        newSizes[sizeId] = newQty
      }
      return newSizes
    })
  }

  const canProceed = () => {
    if (step === 1) return selectedIngredients.length >= 3
    if (step === 2) return selectedVarietyIds.length > 0
    if (step === 3) return Object.keys(selectedSizes).length > 0
    return true
  }

  // Calculate pricing dynamically
  const pricingDetails = useMemo(() => {
    const selectedIngObjs = ingredients.filter(i => selectedIngredients.includes(i.name));
    const selectedVarObjs = varieties.filter(v => selectedVarietyIds.includes(v.id));
    const selectedSizeObjs = Object.entries(selectedSizes).map(([sizeId, qty]) => {
      const sizeObj = sizes.find(s => s.id === sizeId);
      return { ...sizeObj, qty };
    }).filter(s => s.id);

    return calculateCustomizedLadduPrice({
      selectedIngredients: selectedIngObjs,
      selectedVarieties: selectedVarObjs,
      selectedSizes: selectedSizeObjs,
      baseItemPricePerKg: baseItemPrice
    });
  }, [ingredients, selectedIngredients, varieties, selectedVarietyIds, sizes, selectedSizes, baseItemPrice]);

  const getVarietyName = () => {
    return varieties
      .filter(v => selectedVarietyIds.includes(v.id))
      .map(v => v.name)
      .join(', ');
  }
  const getSizeName = () => {
    return Object.entries(selectedSizes)
      .map(([sizeId, qty]) => {
        const sizeObj = sizes.find(s => s.id === sizeId);
        return sizeObj ? `${sizeObj.size} x${qty}` : '';
      })
      .filter(Boolean)
      .join(', ')
  }

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to order your custom laddu');
      onClose();
      navigate('/login');
      return;
    }
    if (pricingDetails.finalPrice === 0) {
      toast.error('Invalid configuration or missing selections');
      return;
    }

    // Create a structured selectedSizes array
    const structuredSizes = Object.entries(selectedSizes).map(([sizeId, qty]) => {
      const sizeObj = sizes.find(s => s.id === sizeId);
      return {
        id: sizeId,
        size: sizeObj?.size,
        weight_grams: Number(sizeObj?.weight_grams) || 0,
        quantity: qty,
        price: sizeObj?.price,
        variety_id: sizeObj?.variety_id
      };
    }).filter(s => s.id);

    // Create structured data for grouped display
    const structuredData = selectedVarietyIds.map(varietyId => {
      const variety = varieties.find(v => v.id === varietyId);
      const varietySizes = Object.entries(selectedSizes)
        .map(([sizeId, qty]) => {
          const sizeObj = sizes.find(s => s.id === sizeId);
          if (sizeObj && sizeObj.variety_id === varietyId) {
            return { label: sizeObj.size, quantity: qty, price: sizeObj.price };
          }
          return null;
        })
        .filter(Boolean);
      return { id: varietyId, name: variety?.name, sizes: varietySizes };
    });

    addToCart({
      id: `custom-${Date.now()}`,
      type: 'customized',
      name: 'Customized Laddu',
      qty: Number(quantity) || 1,
      price: pricingDetails.finalPrice,
      selected_size: getSizeName(),
      ingredients: ingredients.filter(i => selectedIngredients.includes(i.name)),
      customizations: {
        size: getSizeName(),
        selectedSizes: structuredSizes,
        varieties: getVarietyName(),
        selectedVarieties: varieties.filter(v => selectedVarietyIds.includes(v.id)),
        pricingBreakdown: pricingDetails,
        structuredData: structuredData
      }
    })

    toast.success('Added to cart!')
    onClose()
    resetForm()
  }

  const resetForm = () => {
    setStep(1)
    setSelectedIngredients([])
    setSelectedVarietyIds([])
    setSelectedSizes({})
    setQuantity(1)
  }

  if (!isOpen) return null

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 998, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        style={{
          background: '#fff',
          borderRadius: 24,
          maxWidth: 750,
          width: '95%',
          maxHeight: '88vh',
          overflow: 'hidden', // Changed from overflowY: 'auto'
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column'
        }}>

        {/* Sticky Header Section */}
        <div style={{
          padding: 'clamp(24px, 5vw, 40px) clamp(24px, 5vw, 40px) 16px',
          background: '#fff',
          zIndex: 10,
          borderBottom: '1px solid rgba(200,150,12,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: 28, fontWeight: 700, color: '#1A0000', margin: 0 }}>
              Krishna Special Laddu
            </h1>
            <button onClick={() => { onClose(); resetForm(); }} style={{ background: 'none', border: 'none', fontSize: 28, cursor: 'pointer', color: '#9CA3AF', padding: 4 }}>
              ✕
            </button>
          </div>

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {[1, 2, 3, 4].map((s) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: s === step ? '#C8960C' : '#D1D5DB', // Changed from #E85D04 to gold
                  color: '#fff',
                  fontWeight: 700, fontSize: 18,
                  transition: 'all 0.3s'
                }}>
                  {s}
                </div>
                {s < 4 && <div style={{ width: 40, height: 2, background: '#D1D5DB' }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Scrollable Content Section */}
        <div className="custom-scrollbar" style={{
          overflowY: 'auto',
          padding: '24px clamp(24px, 5vw, 40px) clamp(24px, 5vw, 40px)',
          flex: 1
        }}>

          {/* Dynamic Image Banner */}
          <div style={{
            width: '100%',
            height: '220px',
            borderRadius: '16px',
            overflow: 'hidden',
            marginBottom: '32px',
            position: 'relative',
            boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
            border: '1px solid rgba(200,150,12,0.1)'
          }}>
            <motion.img
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              src={customCardBanner}
              alt="Customize Laddu"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(26,0,0,0.8) 0%, rgba(26,0,0,0.2) 50%, transparent 100%)'
            }} />
            <div style={{ position: 'absolute', bottom: '20px', left: '24px' }}>
              <span style={{ color: '#fff', fontFamily: '"Playfair Display", serif', fontSize: '26px', fontWeight: 700, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                Create Your Masterpiece
              </span>
              <p style={{ color: 'rgba(255,245,225,0.8)', fontFamily: 'Poppins, sans-serif', fontSize: '13px', margin: '4px 0 0 0' }}>
                Handcrafted just for your taste
              </p>
            </div>
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h2 style={{ fontFamily: 'Poppins,sans-serif', fontSize: 20, fontWeight: 700, color: '#1A0000', marginBottom: 8 }}>
                  Step 1: Select Ingredients
                </h2>
                <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 14, color: '#666', marginBottom: 4 }}>
                  Choose 3 to 11 ingredients for your custom laddu
                </p>
                <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 13, color: '#999', marginBottom: 24 }}>
                  Selected: {selectedIngredients.length} / 11
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 32 }}>
                  {ingredients.map((ing) => (
                    <label
                      key={ing.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '16px 18px',
                        border: '1.5px solid rgba(200,150,12,0.15)',
                        borderRadius: 12,
                        cursor: 'pointer',
                        background: selectedIngredients.includes(ing.name)
                          ? 'rgba(200,150,12,0.05)'
                          : '#fff',
                        transition: 'all 0.2s'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedIngredients.includes(ing.name)}
                        onChange={() => handleIngredientToggle(ing.name)}
                        style={{ width: 18, height: 18, cursor: 'pointer' }}
                      />
                      <span
                        style={{
                          fontFamily: 'Poppins,sans-serif',
                          fontSize: 14,
                          color: '#333'
                        }}
                      >
                        {ing.name}
                      </span>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h2 style={{ fontFamily: 'Poppins,sans-serif', fontSize: 20, fontWeight: 700, color: '#1A0000', marginBottom: 8 }}>
                  Step 2: Select Variety Type
                </h2>
                <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 14, color: '#666', marginBottom: 24 }}>
                  Choose a variety type for your custom laddu
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                  {varieties.map((v) => {
                    const isSelected = selectedVarietyIds.includes(v.id);
                    return (
                      <label key={v.id} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px',
                        border: isSelected ? '2px solid #C8960C' : '1.5px solid rgba(200,150,12,0.15)',
                        borderRadius: 12, cursor: 'pointer', background: isSelected ? 'rgba(200,150,12,0.04)' : '#fff',
                        transition: 'all 0.2s'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <input type="checkbox" checked={isSelected} onChange={() => handleVarietySelect(v.id)}
                            style={{ width: 18, height: 18, cursor: 'pointer' }} />
                          <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 14, color: '#333' }}>{v.name}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h2 style={{ fontFamily: 'Poppins,sans-serif', fontSize: 20, fontWeight: 700, color: '#1A0000', marginBottom: 8 }}>
                  Step 3: Select Size
                </h2>
                <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 14, color: '#666', marginBottom: 24 }}>
                  Choose the size for your custom laddu
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 32 }}>
                  {selectedVarietyIds.map(varietyId => {
                    const variety = varieties.find(v => v.id === varietyId);
                    const varietySizes = sizes.filter(s => s.variety_id === varietyId);
                    
                    if (varietySizes.length === 0) return null;
                    
                    return (
                      <div key={varietyId}>
                        <h3 style={{ fontFamily: 'Poppins,sans-serif', fontSize: 15, fontWeight: 600, color: '#1A0000', marginBottom: 12 }}>
                          {variety?.name}
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 16 }}>
                          {varietySizes.map((s) => {
                            const qty = selectedSizes[s.id] || 0;
                            const isSelected = qty > 0;
                            return (
                              <div key={s.id}
                                onClick={() => !isSelected && handleSizeQty(s.id, 1)}
                                style={{
                                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: isSelected ? '16px 12px' : '16px',
                                  border: isSelected ? '1.5px solid #C8960C' : '1px solid #e0e0e0',
                                  borderRadius: 14, background: isSelected ? '#FFFBF2' : '#fff',
                                  cursor: isSelected ? 'default' : 'pointer',
                                  transition: 'all 0.2s',
                                  boxShadow: isSelected ? '0 4px 12px rgba(200,150,12,0.08)' : '0 2px 6px rgba(0,0,0,0.02)'
                                }}>
                                <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 14, fontWeight: isSelected ? 600 : 500, color: isSelected ? '#C8960C' : '#555', marginBottom: isSelected ? 12 : 6, transition: 'all 0.2s' }}>
                                  {s.size}
                                </span>

                                {isSelected ? (
                                  <>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(200,150,12,0.3)', marginBottom: 8, width: '100%', justifyContent: 'center' }}>
                                      <button onClick={(e) => { e.stopPropagation(); handleSizeQty(s.id, -1); }} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: '#C8960C', padding: 2 }}>
                                        <Minus size={15} />
                                      </button>
                                      <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 16, fontWeight: 700, minWidth: 20, textAlign: 'center', color: '#333' }}>{qty}</span>
                                      <button onClick={(e) => { e.stopPropagation(); handleSizeQty(s.id, 1); }} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: '#C8960C', padding: 2 }}>
                                        <Plus size={15} />
                                      </button>
                                    </div>
                                    <p style={{ fontFamily: '"Playfair Display",serif', fontSize: 16, fontWeight: 700, color: '#1A0000', margin: 0 }}>₹{s.price * qty}</p>
                                  </>
                                ) : (
                                  <p style={{ fontFamily: '"Playfair Display",serif', fontSize: 15, fontWeight: 600, color: '#888', margin: 0 }}>₹{s.price}</p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h2 style={{ fontFamily: 'Poppins,sans-serif', fontSize: 20, fontWeight: 700, color: '#1A0000', marginBottom: 16 }}>
                  Summary
                </h2>
                <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 13, color: '#999', marginBottom: 24 }}>
                  Review your custom laddu details
                </p>

                {/* Selected Ingredients */}
                <div style={{ marginBottom: 28 }}>
                  <h3 style={{ fontFamily: 'Poppins,sans-serif', fontSize: 13, fontWeight: 600, color: '#1A0000', marginBottom: 12 }}>
                    Selected Ingredients
                  </h3>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {selectedIngredients.map((ing) => (
                      <span key={ing} style={{
                        padding: '6px 14px', background: 'rgba(200,150,12,0.1)', borderRadius: 20,
                        fontFamily: 'Poppins,sans-serif', fontSize: 12, color: '#555'
                      }}>
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Breakdown Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid rgba(200,150,12,0.1)' }}>

                  <div style={{ background: '#fcfcfc', borderRadius: 12, padding: 16, border: '1px solid #f0f0f0' }}>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 14, fontWeight: 600, color: '#333' }}>Selected Weight:</span>
                      <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 14, fontWeight: 600, color: '#C8960C' }}>{pricingDetails.totalWeightGrams}g</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 13, color: '#555' }}>Ingredients Weight:</span>
                      <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 13, color: '#555' }}></span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                      <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 13, color: '#555' }}>Base Items Weight:</span>
                      <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 13, color: '#555' }}></span>
                    </div>

                    {/* Ingredients Breakdown */}
                    <div style={{ marginBottom: 16 }}>
                      <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 13, fontWeight: 600, color: '#555', margin: '0 0 8px 0' }}>Ingredient Breakdown:</p>
                      {pricingDetails.ingredientBreakdown.map((ing, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Poppins,sans-serif', fontSize: 13, color: '#666', marginBottom: 4 }}>
                          <span>{ing.name}</span>
                        </div>
                      ))}
                    </div>

                    {/* Cost Breakdown */}
                    <div style={{ borderTop: '1px dashed #ddd', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {/* Ingredient Cost Hidden */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Poppins,sans-serif', fontSize: 13, color: '#555' }}>
                        <span>Base Cost:</span>
                        <span>₹{Math.round(pricingDetails.baseItemsCost)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Poppins,sans-serif', fontSize: 13, color: '#555' }}>
                        <span>Size Cost:</span>
                        <span>₹{pricingDetails.sizesCost}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Poppins,sans-serif', fontSize: 13, color: '#555' }}>
                        <span>Variety Cost:</span>
                        <span>₹{pricingDetails.varietiesCost}</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Poppins,sans-serif', fontSize: 18, fontWeight: 700, color: '#1A0000', marginTop: 12, paddingTop: 12, borderTop: '1px solid #ddd' }}>
                        <span>Final Total:</span>
                        <span style={{ color: '#C8960C' }}>₹{Math.round(pricingDetails.finalPrice)}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Fixed Footer Section */}
        <div style={{
          padding: '24px clamp(24px, 5vw, 40px)',
          borderTop: '1px solid rgba(200,150,12,0.1)',
          display: 'flex',
          gap: 12,
          justifyContent: 'flex-end',
          background: '#fff',
          zIndex: 10
        }}>
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} style={{
              padding: '12px 24px', border: '1.5px solid rgba(200,150,12,0.2)', borderRadius: 10,
              background: '#fff', cursor: 'pointer', fontFamily: 'Poppins,sans-serif', fontSize: 14, fontWeight: 600, color: '#333'
            }}>
              ← Back
            </button>
          )}
          {step < 4 ? (
            <button onClick={() => canProceed() && setStep(step + 1)} disabled={!canProceed()} style={{
              padding: '12px 32px', background: canProceed() ? '#C8960C' : '#ddd', color: '#fff',
              border: 'none', borderRadius: 10, cursor: canProceed() ? 'pointer' : 'not-allowed',
              fontFamily: 'Poppins,sans-serif', fontSize: 14, fontWeight: 600
            }}>
              Next →
            </button>
          ) : (
            <>
              <button onClick={() => { onClose(); resetForm(); }} style={{
                padding: '12px 24px', border: '1.5px solid rgba(200,150,12,0.2)', borderRadius: 10,
                background: '#fff', cursor: 'pointer', fontFamily: 'Poppins,sans-serif', fontSize: 14, fontWeight: 600, color: '#333'
              }}>
                Close
              </button>
              <button onClick={handleAddToCart} style={{
                padding: '12px 32px', background: '#C8960C', color: '#fff',
                border: 'none', borderRadius: 10, cursor: 'pointer',
                fontFamily: 'Poppins,sans-serif', fontSize: 14, fontWeight: 600
              }}>
                Add to Cart
              </button>
            </>
          )}
        </div>

        {/* Custom scrollbar styles */}
        <style dangerouslySetInnerHTML={{
          __html: `
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(200,150,12,0.05);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(200,150,12,0.2);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(200,150,12,0.4);
          }
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: rgba(200,150,12,0.2) rgba(200,150,12,0.05);
          }
        `}} />
      </motion.div>
    </motion.div>
  )
}
