import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { calculateCustomizedLadduPrice } from '../utils/pricingLogic'
import { supabase } from '../services/supabase'

export default function CartPage() {
  const { items, addToCart, removeFromCart, updateQty, total, updateItemSize } = useCart()
  const navigate = useNavigate()
  const shipping = total >= 500 ? 0 : 49

  const [customizedSizes, setCustomizedSizes] = useState([])
  const [selectedCustomizedSizes, setSelectedCustomizedSizes] = useState({})

  useEffect(() => {
    const fetchSizes = async () => {
      if (!supabase) return;
      try {
        const { data, error } = await supabase
          .from('sizes')
          .select('size, weight_grams, price, variety_id')
          .eq('is_active', true);

        if (!error && data) {
          const mapped = data.map(s => ({
            label: s.size,
            weight: s.weight_grams,
            price: s.price,
            variety_id: s.variety_id
          }));
          setCustomizedSizes(mapped);
        }
      } catch (err) {
        console.error('Error fetching sizes:', err);
      }
    };
    fetchSizes();
  }, []);

  const handleSizeQtyChange = (item, varietyId, sizeLabel, delta) => {
    const selectedSize = item.customizations?.selectedSizes?.find(s => String(s.variety_id) === String(varietyId) && s.size === sizeLabel);
    const currentQty = selectedSize ? (selectedSize.qty ?? selectedSize.quantity ?? 0) : 0;
    console.log("before update", sizeLabel, currentQty);
    const newQty = Math.max(0, currentQty + delta);
    console.log("after update", sizeLabel, newQty);

    const breakdown = item.customizations?.pricingBreakdown || {};
    const otherCosts = (Number(breakdown.ingredientsCost) || 0) +
      (Number(breakdown.baseItemsCost) || 0) +
      (Number(breakdown.varietiesCost) || 0);

    let newSizesCost = 0;
    const selectedSizeObjs = [];

    const updatedStructuredData = (item.customizations?.selectedVarieties || []).map(v => {
      const allSizesForVar = customizedSizes.filter(s => s.variety_id === v.id);
      
      const vSizes = allSizesForVar.map(s => {
        const isCurrentSize = String(v.id) === String(varietyId) && s.label === sizeLabel;
        const currentSelectedSize = item.customizations?.selectedSizes?.find(ss => String(ss.variety_id) === String(v.id) && ss.size === s.label);
        const q = isCurrentSize ? newQty : (currentSelectedSize ? (currentSelectedSize.qty ?? currentSelectedSize.quantity ?? 0) : 0);
        
        if (q > 0) {
          newSizesCost += (Number(s.price) || 0) * q;
          selectedSizeObjs.push({
            size: s.label,
            weight_grams: s.weight,
            price: s.price,
            variety_id: v.id,
            qty: q
          });
        }
        return { label: s.label, quantity: q, price: s.price };
      }).filter(s => s.quantity > 0);
      
      return { id: v.id, name: v.name, sizes: vSizes };
    });

    const newPrice = otherCosts + newSizesCost;

    const newSizeString = selectedSizeObjs
      .map(s => `${s.size} x${s.qty}`)
      .join(', ');

    updateItemSize(item.id, { 
      size_label: newSizeString, 
      price: newPrice,
      customizations: {
        ...item.customizations,
        selectedSizes: selectedSizeObjs,
        structuredData: updatedStructuredData,
        pricingBreakdown: {
          ...breakdown,
          sizesCost: newSizesCost,
          finalPrice: newPrice
        }
      }
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FFF5E1', paddingTop: 80 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '36px clamp(16px, 4vw, 24px) 64px' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontFamily: 'Poppins,sans-serif', fontSize: 14, marginBottom: 20 }}>
            <ArrowLeft size={15} /> Continue Shopping
          </button>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: 'clamp(28px,5vw,40px)', fontWeight: 700, color: '#333', margin: 0 }}>
              Shopping <span style={{ color: '#C8960C' }}>Cart</span>
            </h1>
          </div>
        </motion.div>

        {items.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', paddingTop: 80 }}>
            <ShoppingBag size={72} color="#ddd" style={{ margin: '0 auto 20px' }} />
            <p style={{ fontFamily: '"Playfair Display",serif', fontSize: 26, color: '#bbb', marginBottom: 8 }}>Your cart is empty</p>
            <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 14, color: '#ccc', marginBottom: 28 }}>Add some divine sweets to get started!</p>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => navigate('/products')}
              style={{ padding: '13px 32px', background: '#C8960C', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'Poppins,sans-serif', fontSize: 15, fontWeight: 600 }}>
              Browse Products
            </motion.button>
          </motion.div>
        ) : (
          <div className="responsive-grid-cart" style={{ alignItems: 'start' }}>
            <div>
              <AnimatePresence>
                {(() => {
                  const groupedItems = [];
                  items.forEach(item => {
                    if (item.type === 'customized') {
                      groupedItems.push(item);
                    } else {
                      const existing = groupedItems.find(i => i.product_id === item.product_id && i.type !== 'customized');
                      if (existing) {
                        existing.sizes = existing.sizes || [];
                        existing.sizes.push({ size: item.selected_size, qty: item.qty, id: item.id });
                      } else {
                        groupedItems.push({
                          ...item,
                          sizes: [{ size: item.selected_size, qty: item.qty, id: item.id }]
                        });
                      }
                    }
                  });
                  return groupedItems.map(item => {
                    const itemPrice = Number(item.price) || 0;
                    const itemQty = Number(item.qty) || 0;

                    if (item.type === 'customized') {
                      const { customizations, ingredients } = item;
                      const breakdown = customizations?.pricingBreakdown || {};
                      return (
                        <motion.div key={item.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                          style={{ padding: '20px', borderRadius: 14, background: '#FFFBF2', border: '1.5px solid rgba(200,150,12,0.15)', display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontFamily: 'Poppins,sans-serif', fontSize: 13, fontWeight: 700, color: '#C8960C', letterSpacing: '0.05em', margin: 0 }}>CUSTOMIZE LADDU</h3>
                            <button onClick={() => removeFromCart(item.id)} style={{ background: 'rgba(255,0,0,0.05)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                              <Trash2 size={15} color="#ff4d4d" />
                            </button>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div>
                              <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 12, color: '#888', display: 'block', marginBottom: 4 }}>Selected Variety:</span>
                              <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 14, fontWeight: 600, color: '#333' }}>{customizations?.varieties || 'N/A'}</span>
                            </div>
                            <div>
                              <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 12, color: '#888', display: 'block', marginBottom: 4 }}>Total Weight:</span>
                              <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 14, fontWeight: 600, color: '#333' }}>{breakdown.totalWeightGrams || 0}g</span>
                            </div>
                          </div>

                          <div>
                            <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 12, color: '#888', display: 'block', marginBottom: 8 }}>Selected Varieties & Sizes:</span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 12 }}>
                              {customizations?.structuredData ? (
                                customizations.structuredData.map((v, idx) => {
                                  // Find all sizes for this variety in customizedSizes!
                                  const allSizesForVar = customizedSizes.filter(s => s.variety_id === v.id);
                                  
                                  return (
                                    <div key={idx} style={{ background: '#fff', padding: '16px', borderRadius: 12, border: '1px solid rgba(200,150,12,0.1)', marginBottom: 12 }}>
                                      <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 14, fontWeight: 600, color: '#C8960C', display: 'block', marginBottom: 8 }}>{typeof v.name === 'object' ? v.name.name : v.name}</span>
                                      
                                      {/* Render size options with quantity controls! */}
                                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
                                        {allSizesForVar.map(size => {
                                          const sizeObj = v.sizes?.find(s => s.label === size.label);
                                          const qty = sizeObj ? sizeObj.quantity : 0;
                                          console.log("render qty", size.label, qty);
                                          
                                          return (
                                            <div key={size.label} style={{
                                              display: 'flex',
                                              alignItems: 'center',
                                              gap: 8,
                                              background: qty > 0 ? '#FFF5E1' : '#fff',
                                              padding: '6px 12px',
                                              borderRadius: 8,
                                              border: qty > 0 ? '1.5px solid #C8960C' : '1px solid #ddd',
                                              fontFamily: 'Poppins,sans-serif',
                                              fontSize: 12
                                            }}>
                                              <span style={{ fontWeight: qty > 0 ? 600 : 400, color: qty > 0 ? '#C8960C' : '#333' }}>{size.label}</span>
                                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', padding: '2px 6px', borderRadius: 6, border: '1px solid rgba(200,150,12,0.3)' }}>
                                                <button onClick={() => handleSizeQtyChange(item, v.id, size.label, -1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: '#C8960C', padding: 2 }}>
                                                  <Minus size={12} />
                                                </button>
                                                <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 13, fontWeight: 700, minWidth: 15, textAlign: 'center', color: '#333' }}>{qty}</span>
                                                <button onClick={() => handleSizeQtyChange(item, v.id, size.label, 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: '#C8960C', padding: 2 }}>
                                                  <Plus size={12} />
                                                </button>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                      
                                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, borderTop: '1px solid #f0f0f0', paddingTop: 8 }}>
                                        <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 13, color: '#666' }}>Subtotal:</span>
                                        <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 14, fontWeight: 700, color: '#C8960C' }}>
                                          ₹{v.sizes.reduce((sum, s) => sum + (Number(s.price) || 0) * s.quantity, 0)}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })
                              ) : (
                                (item.selected_size || '').split(',').map((s, idx) => (
                                  s.trim() && <span key={idx} style={{ fontFamily: 'Poppins,sans-serif', fontSize: 14, fontWeight: 500, color: '#333' }}>• {s.trim().replace('x', '× ')}</span>
                                ))
                              )}
                            </div>
                          </div>

                          <div>
                            <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 12, color: '#888', display: 'block', marginBottom: 8 }}>Selected Ingredients:</span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                              {(ingredients || []).map((ing, idx) => (
                                <span key={idx} style={{ fontFamily: 'Poppins,sans-serif', fontSize: 12, background: '#fff', border: '1px solid rgba(0,0,0,0.08)', padding: '6px 12px', borderRadius: 20, color: '#555', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                  {typeof ing === 'object' ? ing.name : ing}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', borderTop: '1px dashed rgba(200,150,12,0.3)', paddingTop: 16, marginTop: 4 }}>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 12, color: '#888', display: 'block', marginBottom: 2 }}>Price:</span>
                              <p style={{ fontFamily: '"Playfair Display",serif', fontSize: 20, fontWeight: 700, color: '#1A0000', margin: 0 }}>
                                ₹{(itemPrice * itemQty).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    }

                    // Standard Item Rendering
                    return (
                      <motion.div key={item.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                        style={{ background: '#fff', borderRadius: 20, padding: '24px', marginBottom: 20, border: '1px solid rgba(200,150,12,0.12)', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                        <div style={{ display: 'flex', gap: 20, alignItems: 'start' }}>
                          {item.image && (
                            <img src={item.image} alt={item.name} style={{ width: 80, height: 80, borderRadius: 14, objectFit: 'cover', cursor: 'pointer', border: '1.5px solid rgba(200,150,12,0.1)' }} onClick={() => item.product_id && navigate(`/product/${item.product_id}`)} />
                          )}
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                              <div>
                                <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: 20, fontWeight: 700, color: '#333', marginBottom: 4, cursor: item.product_id ? 'pointer' : 'default' }} onClick={() => item.product_id && navigate(`/product/${item.product_id}`)}>
                                  {item.name}
                                </h2>
                                <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 12, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>{(item.category || 'Product').replace('-', ' ')}</p>
                              </div>
                              <button onClick={() => removeFromCart(item.id)} style={{ background: 'rgba(255,0,0,0.05)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                                <Trash2 size={15} color="#ff4d4d" />
                              </button>
                            </div>

                            {/* Select Size Option */}
                            {item.product_sizes && item.product_sizes.length > 0 ? (
                              <div style={{ marginBottom: 16 }}>
                                <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 12, color: '#888', display: 'block', marginBottom: 6 }}>Size:</span>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                  {item.product_sizes.map(size => {
                                    const sizeInGroup = item.sizes?.find(s => s.size === size.size_label);
                                    const qty = sizeInGroup ? sizeInGroup.qty : 0;
                                    const isSelected = qty > 0;

                                    return (
                                      <div
                                        key={size.id}
                                        style={{
                                          display: 'flex',
                                          flexDirection: 'column',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          padding: isSelected ? '8px' : '12px',
                                          border: isSelected ? '1.5px solid #C8960C' : '1px solid #ddd',
                                          borderRadius: 12,
                                          background: isSelected ? '#FFF5E1' : '#fff',
                                          cursor: isSelected ? 'default' : 'pointer',
                                          transition: 'all 0.2s',
                                          minWidth: 80
                                        }}
                                        onClick={() => {
                                          if (!isSelected) {
                                            addToCart({ ...item, id: item.product_id }, size, 1);
                                          }
                                        }}
                                      >
                                        <span style={{
                                          fontFamily: 'Poppins,sans-serif',
                                          fontSize: 14,
                                          fontWeight: isSelected ? 600 : 400,
                                          color: isSelected ? '#C8960C' : '#666',
                                          marginBottom: isSelected ? 6 : 0
                                        }}>
                                          {size.size_label}
                                        </span>

                                        {isSelected && (
                                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', padding: '2px 6px', borderRadius: 6, border: '1px solid rgba(200,150,12,0.3)' }}>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (qty === 1) {
                                                  removeFromCart(sizeInGroup.id);
                                                } else {
                                                  updateQty(sizeInGroup.id, qty - 1);
                                                }
                                              }}
                                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C8960C', display: 'flex', padding: 2 }}
                                            >
                                              <Minus size={12} />
                                            </button>
                                            <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 13, fontWeight: 700, minWidth: 15, textAlign: 'center', color: '#333' }}>
                                              {qty}
                                            </span>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                updateQty(sizeInGroup.id, qty + 1);
                                              }}
                                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C8960C', display: 'flex', padding: 2 }}
                                            >
                                              <Plus size={12} />
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ) : (
                              <div style={{ marginBottom: 16 }}>
                                <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 13, color: '#666' }}>Standard Size</span>
                              </div>
                            )}

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', borderTop: '1px dashed rgba(200,150,12,0.2)', paddingTop: 16 }}>
                              <p style={{ fontFamily: '"Playfair Display",serif', fontSize: 20, fontWeight: 700, color: '#1A0000', margin: 0 }}>
                                ₹{(() => {
                                  const groupTotalPrice = item.sizes?.reduce((sum, s) => {
                                    const sizeObj = item.product_sizes?.find(ps => ps.size_label === s.size);
                                    const price = sizeObj ? Number(sizeObj.price) : 0;
                                    return sum + price * s.qty;
                                  }, 0) || 0;
                                  return groupTotalPrice.toLocaleString();
                                })()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  });
                })()}
              </AnimatePresence>
            </div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              style={{ background: '#fff', borderRadius: 16, padding: '24px', border: '1px solid rgba(200,150,12,0.15)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', position: 'sticky', top: 96 }}>
              <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: 20, fontWeight: 700, color: '#333', marginBottom: 20 }}>Order Summary</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                {(() => {
                  const groupedSummaryItems = [];
                  items.forEach(item => {
                    if (item.type === 'customized') {
                      groupedSummaryItems.push(item);
                    } else {
                      const existing = groupedSummaryItems.find(i => i.product_id === item.product_id && i.type !== 'customized');
                      if (existing) {
                        existing.sizes = existing.sizes || [];
                        existing.sizes.push({ size: item.selected_size, qty: item.qty, id: item.id });
                      } else {
                        groupedSummaryItems.push({
                          ...item,
                          sizes: [{ size: item.selected_size, qty: item.qty, id: item.id }]
                        });
                      }
                    }
                  });

                  return groupedSummaryItems.map(item => {
                    const itemPrice = Number(item.price) || 0;
                    const itemQty = Number(item.qty) || 0;

                    if (item.type === 'customized') {
                      return (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', paddingBottom: 10, borderBottom: '1px dashed rgba(0,0,0,0.05)', marginBottom: 8 }}>
                          <div style={{ flex: 1, paddingRight: 8 }}>
                            <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 13, color: '#333', fontWeight: 600, display: 'block' }}>
                              {item.name} <span style={{ fontWeight: 400, color: '#666' }}>×{itemQty}</span>
                            </span>
                            {item.customizations?.structuredData ? (
                              item.customizations.structuredData.filter(v => v.sizes.length > 0).map((v, idx) => (
                                <div key={idx} style={{ marginTop: 4 }}>
                                  <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 12, color: '#C8960C', fontWeight: 600 }}>{typeof v.name === 'object' ? v.name.name : v.name}</span>
                                  <div style={{ paddingLeft: 8 }}>
                                    {v.sizes.map((s, sIdx) => (
                                      <span key={sIdx} style={{ fontFamily: 'Poppins,sans-serif', fontSize: 11, color: '#666', display: 'block' }}>
                                        {s.label} × {s.quantity}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 12, color: '#666', display: 'block', marginTop: 2 }}>
                                {typeof item.customizations?.varieties === 'object' 
                                  ? (Array.isArray(item.customizations.varieties) 
                                      ? item.customizations.varieties.map(v => typeof v === 'object' ? v.name : v).join(', ')
                                      : item.customizations.varieties.name || '')
                                  : item.customizations?.varieties}
                              </span>
                            )}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 4 }}>
                              <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 11, color: '#888', fontWeight: 600 }}>Sizes:</span>
                              {(item.selected_size || '').split(',').map((s, idx) => (
                                s.trim() && <span key={idx} style={{ fontFamily: 'Poppins,sans-serif', fontSize: 11, color: '#666' }}>
                                  • {s.trim().replace('x', '× ')}
                                </span>
                              ))}
                            </div>
                          </div>
                          <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 13, color: '#333', fontWeight: 600, flexShrink: 0, marginTop: 2 }}>
                            ₹{(itemPrice * itemQty).toLocaleString()}
                          </span>
                        </div>
                      );
                    }

                    // Grouped normal item rendering in summary
                    const groupTotalPrice = item.sizes?.reduce((sum, s) => {
                      const sizeObj = item.product_sizes?.find(ps => ps.size_label === s.size);
                      const price = sizeObj ? Number(sizeObj.price) : 0;
                      return sum + price * s.qty;
                    }, 0) || 0;

                    return (
                      <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingBottom: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 13, color: '#333', fontWeight: 600, flex: 1 }}>
                            {item.name}
                          </span>
                          <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 13, color: '#333', fontWeight: 600 }}>
                            ₹{groupTotalPrice.toLocaleString()}
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingLeft: 8 }}>
                          {item.sizes?.map((s, idx) => (
                            <span key={idx} style={{ fontFamily: 'Poppins,sans-serif', fontSize: 12, color: '#666' }}>
                              {s.size} × {s.qty}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  });
                })()}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ fontFamily: '"Playfair Display",serif', fontSize: 18, fontWeight: 700, color: '#333' }}>Total</span>
                <span style={{ fontFamily: '"Playfair Display",serif', fontSize: 22, fontWeight: 700, color: '#C8960C' }}>₹{(total + shipping).toLocaleString()}</span>
              </div>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/checkout')}
                style={{ width: '100%', padding: '14px 0', background: '#C8960C', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'Poppins,sans-serif', fontSize: 15, fontWeight: 600, marginBottom: 10, letterSpacing: '0.02em' }}>
                PROCEED TO CHECKOUT
              </motion.button>
              <button onClick={() => navigate('/products')} style={{ width: '100%', padding: '11px 0', background: 'none', border: '1.5px solid rgba(200,150,12,0.3)', borderRadius: 10, color: '#C8960C', fontFamily: 'Poppins,sans-serif', fontSize: 14, cursor: 'pointer' }}>
                Continue Shopping
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
