import hero1 from '../assets/images/kbite_hero.png'
import hero2 from '../assets/images/premium_banner.png'
import hero3 from '../assets/images/kitchen_scene.png'

import prodBesan from '../assets/images/besan_laddu_product.png'
import prodMotichoor from '../assets/images/motichoor_laddu_product.png'
import prodDryFruit from '../assets/images/dry_fruit_laddu_product.png'
import prodCoconut from '../assets/images/coconut_laddu_product.png'
import prodKaju from '../assets/images/kaju_laddu_product.png'

import catBesan from '../assets/images/besan_laddu_card.png'
import catDryFruit from '../assets/images/dry_fruit_laddu_card.png'
import catKaju from '../assets/images/kaju_laddu_card.png'
import motichoorCard from '../assets/images/motichoor_laddu_card.png'

import festiveBanner from '../assets/images/festive_banner.png'
import familyMoment from '../assets/images/family_moment.png'
import shopInterior from '../assets/images/shop_interior.png'

export { hero1, catBesan, motichoorCard, festiveBanner, familyMoment, shopInterior }

export const PRODUCTS = [
  {
    id: '1',
    name: 'Premium Assorted Sweets Box',
    category: 'sweets',
    price: 899,
    originalPrice: 1200,
    image: catKaju,
    description: 'A luxurious assortment of handcrafted Indian sweets including Kaju Katli, Gulab Jamun, Motichoor Ladoo, and Barfi. Perfect for gifting on festivals and special occasions.',
    rating: 4.8, reviews: 124, badge: 'Bestseller', weight: '500g',
  },
  {
    id: '2',
    name: 'Golden Besan Ladoo',
    category: 'ladoos',
    price: 499,
    originalPrice: 650,
    image: prodBesan,
    description: 'Classic besan ladoos made with pure desi ghee and roasted chickpea flour. Melt-in-mouth texture with rich saffron aroma. A timeless favourite.',
    rating: 4.9, reviews: 312, badge: 'Popular', weight: '400g',
  },
  {
    id: '3',
    name: 'Premium Dry Fruits Mix',
    category: 'dry-fruits',
    price: 1299,
    originalPrice: 1600,
    image: prodDryFruit,
    description: 'Hand-picked premium mix of almonds, cashews, pistachios, walnuts, and raisins. Nutritious, flavourful, and ideal for gifting.',
    rating: 4.7, reviews: 89, badge: 'Premium', weight: '1kg',
  },
  {
    id: '4',
    name: 'Festival Special Gift Box',
    category: 'sweets',
    price: 1499,
    originalPrice: 2000,
    image: hero2,
    description: 'Curated festival gift box with our finest sweets and premium dry fruits in an elegant wooden box. A perfect festive present for loved ones.',
    rating: 4.9, reviews: 67, badge: 'Gift', weight: '800g',
  },
  {
    id: '5',
    name: 'Motichoor Ladoo',
    category: 'ladoos',
    price: 399,
    originalPrice: 500,
    image: prodMotichoor,
    description: 'Fine-grain motichoor ladoos soaked in rose saffron syrup. A timeless Indian classic made fresh every morning.',
    rating: 4.6, reviews: 201, badge: null, weight: '500g',
  },
  {
    id: '6',
    name: 'Assorted Mithai Platter',
    category: 'sweets',
    price: 799,
    originalPrice: 1000,
    image: hero2,
    description: 'A beautiful platter of mixed Indian mithai — kaju barfi, peda, halwa, and chocolate barfi. Perfect for celebrations.',
    rating: 4.8, reviews: 156, badge: null, weight: '600g',
  },
  {
    id: '7',
    name: 'Cashew Nuts Premium',
    category: 'dry-fruits',
    price: 699,
    originalPrice: 900,
    image: catDryFruit,
    description: 'Whole W240 grade cashews. Crunchy, buttery, and irresistible. Ideal for snacking and cooking alike.',
    rating: 4.7, reviews: 88, badge: null, weight: '500g',
  },
  {
    id: '8',
    name: 'Kaju Katli Special',
    category: 'sweets',
    price: 699,
    originalPrice: 900,
    image: prodKaju,
    description: 'Silver-leaf topped kaju katli made with premium cashews, pure ghee, and rose water. The crown jewel of Indian mithai.',
    rating: 4.9, reviews: 445, badge: 'Bestseller', weight: '400g',
  },
  {
    id: '9',
    name: 'Almond Supreme Box',
    category: 'dry-fruits',
    price: 899,
    originalPrice: 1100,
    image: catDryFruit,
    description: 'Premium California almonds — whole, raw, and naturally nutritious. Rich in Vitamin E and healthy fats.',
    rating: 4.8, reviews: 134, badge: null, weight: '750g',
  },
  {
    id: '10',
    name: 'Coconut Ladoo',
    category: 'ladoos',
    price: 349,
    originalPrice: 450,
    image: prodCoconut,
    description: 'Soft coconut ladoos with cardamom, rolled in desiccated coconut flakes. A light, guilt-free indulgence.',
    rating: 4.5, reviews: 97, badge: null, weight: '400g',
  },
  {
    id: '11',
    name: 'Pistachio Gift Box',
    category: 'dry-fruits',
    price: 1095,
    originalPrice: 1400,
    image: prodDryFruit,
    description: 'Roasted and salted Iranian pistachios in a premium gift box. Vibrant green kernels, rich and flavourful.',
    rating: 4.9, reviews: 112, badge: 'Premium', weight: '500g',
  },
  {
    id: '12',
    name: 'Rasgulla Classic Box',
    category: 'sweets',
    price: 299,
    originalPrice: 400,
    image: prodCoconut,
    description: 'Light, spongy rasgullas in sugar syrup with a hint of rose water. Made fresh daily from pure chenna.',
    rating: 4.6, reviews: 267, badge: null, weight: '1kg (12 pcs)',
  },
]

export const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'dry-fruits', label: 'Dry Fruits' },
  { id: 'ladoos', label: 'Ladoos' },
  { id: 'sweets', label: 'Sweets' },
]

export const CATEGORY_DATA = {
  'dry-fruits': {
    label: 'Dry Fruits',
    image: catDryFruit,
    desc: 'Hand-picked premium nuts & fruits',
  },
  'ladoos': {
    label: 'Ladoos',
    image: catBesan,
    desc: 'Traditional & flavoured ladoos',
  },
  'sweets': {
    label: 'Sweets',
    image: catKaju,
    desc: 'Handmade mithai & barfis',
  },
}

export const TESTIMONIALS = [
  { id: 1, name: 'Priya Sharma', city: 'Mumbai', rating: 5, text: 'The Kesar Ladoos are absolutely divine! The quality and freshness is unmatched. My entire family loved it.' },
  { id: 2, name: 'Rajesh Gupta', city: 'Delhi', rating: 5, text: 'Ordered the Festival Gift Box for Diwali. The packaging was gorgeous and quality exceptional. Highly recommend!' },
  { id: 3, name: 'Ananya K.', city: 'Bengaluru', rating: 5, text: 'Kbite has become our go-to for every festival. Healthy, delicious, and so beautifully packed.' },
  { id: 4, name: 'Vikram Patel', city: 'Ahmedabad', rating: 5, text: 'The Mysore Pak tasted exactly like what my grandmother used to make. Authentic, pure, and made with love.' },
]

export const HERO_SLIDES = [
  {
    image: hero1,
    title: 'Divine Sweetness',
    subtitle: 'in Every Bite',
    desc: 'Handcrafted with love, blessed with tradition',
  },
  {
    image: hero2,
    title: 'Premium Ladoos',
    subtitle: 'Made Fresh Daily',
    desc: 'Traditional recipes, pure ingredients',
  },
  {
    image: hero3,
    title: 'Finest Dry Fruits',
    subtitle: 'Natures Best',
    desc: 'Hand-picked, premium quality, delivered fresh',
  },
]

