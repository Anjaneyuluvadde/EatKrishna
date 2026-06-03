import { supabase } from './supabase'

export const fetchProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_sizes (
        id,
        size_label,
        price
      )
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  console.log('Products Data:', data)
  console.log('Products Error:', error)

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data
}

export const fetchProductById = async (id) => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_sizes (
        id,
        size_label,
        price
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  return data
}