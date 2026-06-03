import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ek_cart') || '[]') } catch { return [] }
  })
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ek_wish') || '[]') } catch { return [] }
  })
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => { localStorage.setItem('ek_cart', JSON.stringify(items)) }, [items])
  useEffect(() => { localStorage.setItem('ek_wish', JSON.stringify(wishlist)) }, [wishlist])

  const addToCart = (product, selectedSize, qty = 1) => {
    const cleanQty = Number(qty) || 1;
    // 1. Handle Customized items separately (unique entries)
    if (product.type === 'customized') {
      setItems(prev => [...prev, {
        ...product,
        id: product.id || `custom-${Date.now()}`,
        qty: cleanQty,
        price: Number(product.price) || 0
      }]);
      toast.success('Added to cart!', { icon: '✨' });
      return;
    }

    // 2. Standard product logic (allow merging same size)
    const sizeLabel = selectedSize?.size_label || product.weight || 'Standard';
    const exists = items.find(i => i.product_id === product.id && i.selected_size === sizeLabel);

    if (exists) {
      setItems(prev => prev.map(i => (i.product_id === product.id && i.selected_size === sizeLabel)
        ? { ...i, qty: (Number(i.qty) || 0) + cleanQty }
        : i));
      toast.success('Quantity updated!');
    } else {
      setItems(prev => [...prev, {
        id: Date.now(),
        product_id: product.id,
        name: product.name || product.title,
        image: product.image_url || product.image,
        category: product.category,
        selected_size: sizeLabel,
        price: Number(selectedSize?.price || product.price) || 0,
        product_sizes: product.product_sizes || [],
        qty: cleanQty
      }]);
      toast.success('Added to cart!', { icon: '✨' });
    }
  }

  const updateItemSize = (itemId, newSize) => {
    const itemToUpdate = items.find(i => i.id === itemId);
    if (!itemToUpdate) return;

    // Check if after changing size, it matches another existing item
    const otherItem = items.find(i =>
      i.id !== itemId &&
      i.product_id === itemToUpdate.product_id &&
      i.selected_size === newSize.size_label
    );

    if (otherItem) {
      // Merge with existing item and remove current one
      setItems(prev => prev
        .map(i => i.id === otherItem.id ? { ...i, qty: (Number(i.qty) || 0) + (Number(itemToUpdate.qty) || 0) } : i)
        .filter(i => i.id !== itemId));
      toast.success(`Merged with existing ${newSize.size_label} selection`);
    } else {
      // Just update the size and price
      setItems(prev => prev.map(i => i.id === itemId ? {
        ...i,
        selected_size: newSize.size_label,
        price: Number(newSize.price) || 0,
        customizations: newSize.customizations || i.customizations
      } : i));
    }
  }

  const removeFromCart = id => { setItems(prev => prev.filter(i => i.id !== id)); toast.success('Removed') }
  const updateQty = (id, qty) => {
    const cleanQty = Number(qty);
    if (isNaN(cleanQty) || cleanQty < 1) {
      removeFromCart(id);
      return
    };
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty: cleanQty } : i))
  }
  const clearCart = () => setItems([])

  const toggleWishlist = product => {
    const exists = wishlist.find(i => i.id === product.id);
    if (exists) {
      setWishlist(prev => prev.filter(i => i.id !== product.id));
      toast.success('Removed from wishlist', { icon: '💔' });
    } else {
      setWishlist(prev => [...prev, product]);
      toast.success('Added to wishlist!', { icon: '❤️' });
    }
  }
  const isInWishlist = id => wishlist.some(i => i.id === id)

  const count = items.reduce((s, i) => s + (Number(i.qty) || 0), 0)
  const total = items.reduce((s, i) => s + (Number(i.price) || 0) * (Number(i.qty) || 0), 0)

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, count, total, isOpen, setIsOpen, wishlist, toggleWishlist, isInWishlist, updateItemSize }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
