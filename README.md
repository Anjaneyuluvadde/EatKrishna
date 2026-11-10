# 🪈 Kbite — Premium Indian Sweets E-Commerce

A fully working React + Vite e-commerce website for a premium Indian sweets brand.
Works completely out of the box — no backend needed for demo.

## ⚡ Quick Start

```bash
npm install
npm run dev
```
Open http://localhost:5173

## 📄 Pages
| Route | Page |
|---|---|
| `/` | Homepage — hero slider, featured products, categories, festival banner, testimonials |
| `/products` | Products listing — filter by All / Dry Fruits / Ladoos / Sweets |
| `/product/:id` | Product detail — gallery, add to cart, wishlist, tabs |
| `/cart` | Shopping cart — qty controls, order summary |
| `/checkout` | Checkout — delivery form, payment method |
| `/order-success` | Order confirmation |
| `/login` | Login / Sign Up |
| `/wishlist` | Wishlist page |

## 🔌 Connect Supabase (optional)

1. Create project → https://supabase.com
2. Copy `.env.example` to `.env` and add your credentials
3. Run this SQL in Supabase SQL editor:

```sql
create table products (
  id uuid default gen_random_uuid() primary key,
  name text, category text, price numeric,
  image text, description text, badge text,
  rating numeric, reviews int, original_price numeric,
  weight text, created_at timestamptz default now()
);

create table orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users,
  items jsonb, total_price numeric,
  status text default 'pending',
  created_at timestamptz default now()
);
```

## 🎨 Design System
- Gold: `#C8960C` | Background cream: `#FFF5E1` | Maroon hero: `#8B0000`
- Fonts: Playfair Display (headings) + Poppins (body)
- Animations: Framer Motion throughout

## 🛠 Tech Stack
React 18 · Vite · Tailwind CSS v3 · Framer Motion · React Router v6 · Supabase · react-hot-toast · lucide-react
