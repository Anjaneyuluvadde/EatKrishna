import { supabase } from './supabase'

export const createOrder = async (order) => {
  try {
    // 1. Robust Filtering (Ensure mutually exclusive)
    const customizedItems = order.items.filter(item => 
      item.type === 'customized' || (item.ingredients && item.ingredients.length > 0)
    )
    const normalItems = order.items.filter(item => 
      item.type !== 'customized' && (!item.ingredients || item.ingredients.length === 0)
    )

    console.log('--- ORDER CREATION DEBUG ---')
    console.log('TOTAL ITEMS:', order.items.length)
    console.log('NORMAL ITEMS:', normalItems.length, normalItems)
    console.log('CUSTOMIZED ITEMS:', customizedItems.length, customizedItems)

    let primaryOrderId = null
    const notificationItems = []

    // 2. Insert Normal Items to product_orders
    if (normalItems.length > 0) {
      // Calculate specific total for normal items only
      const normalSubtotal = normalItems.reduce((acc, item) => acc + (item.price * item.qty), 0)
      const normalShipping = normalSubtotal >= 500 ? 0 : 49
      const normalTotal = normalSubtotal + normalShipping

      const productOrderPayload = {
        order_number: `EK-${Date.now()}`,

        customer_name: order.customer_name,
        customer_phone: order.customer_phone,
        customer_email: order.customer_email,

        customer_address: order.address,
        customer_city: order.city,
        customer_pincode: order.pincode,

        payment_method: order.payment_method,
        payment_status: 'pending',

        subtotal: normalSubtotal,
        shipping: normalShipping,
        total: normalTotal,

        order_status: 'pending',
        items: normalItems
      }

      console.log('Inserting to product_orders:', productOrderPayload.order_number)
      const { data, error: pError } = await supabase
        .from('product_orders')
        .insert([productOrderPayload])
        .select()
      
      if (pError) throw pError
      if (data?.[0]) {
        primaryOrderId = data[0].order_number
        data[0].items.forEach(i => notificationItems.push({
          name: i.name || i.title,
          qty: i.qty || i.quantity || 1,
          price: i.price || 0,
          size: i.selected_size || i.size || i.weight || 'Standard'
        }))
      }
    }

    // 3. Insert Customized Items to customized_orders
    for (const [index, item] of customizedItems.entries()) {
      const customPayload = {
        order_number: `CK-${Date.now()}-${index}`,

        customer_name: order.customer_name,
        customer_phone: order.customer_phone,
        customer_email: order.customer_email,

        customer_address: order.address,
        customer_city: order.city,
        customer_pincode: order.pincode,

        payment_method: order.payment_method,
        payment_status: 'pending',
        order_status: 'pending',

        customized_product_name: item.name,
        quantity: item.qty,
        total_price: item.price,

        ingredients: item.ingredients,
        customizations: item.customizations
      }

      console.log('Inserting to customized_orders:', customPayload.order_number)
      const { data, error: cError } = await supabase
        .from('customized_orders')
        .insert([customPayload])
        .select()
      
      if (cError) throw cError
      if (data?.[0]) {
        if (!primaryOrderId) primaryOrderId = data[0].order_number
        notificationItems.push({
          name: data[0].customized_product_name,
          qty: data[0].quantity,
          price: data[0].total_price,
          size: data[0].customizations?.size || 'Custom'
        })
      }
    }

    // 4. Trigger WhatsApp Notification
    try {
      if (primaryOrderId) {
        await supabase.functions.invoke('send-whatsapp-order', {
          body: {
            orderNumber: primaryOrderId,
            customerName: order.customer_name,
            customerPhone: order.customer_phone,
            customerEmail: order.customer_email,
            address: `${order.address}, ${order.city} ${order.pincode}`,
            paymentMethod: order.payment_method,
            subtotal: order.subtotal,
            shipping: order.shipping,
            total: order.total_amount,
            orderDate: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            items: notificationItems
          }
        })
      }
    } catch (funcErr) {
      console.warn('WhatsApp notification failed to send:', funcErr)
    }

    return { success: true }
  } catch (error) {
    console.error('Order creation failed:', error)
    return { success: false, error: error.message }
  }
}

export const createProductOrder = async (order) => {
  const orderPayload = {
    order_number: `EK-${Date.now()}`,

    customer_name: order.customer_name,
    customer_phone: order.customer_phone,
    customer_email: order.customer_email,

    customer_address: order.address,
    customer_city: order.city,
    customer_pincode: order.pincode,

    payment_method: order.payment_method,
    payment_status: 'pending',

    subtotal: order.subtotal,
    shipping: order.shipping,
    total: order.total_amount,

    order_status: 'pending',

    items: order.items
  }

  return await supabase
    .from('product_orders')
    .insert([orderPayload])
    .select()
}

export const createCustomizedOrder = async (order) => {
  const customOrderPayload = {
    order_number: `CK-${Date.now()}`,

    customer_name: order.customer_name,
    customer_phone: order.customer_phone,
    customer_email: order.customer_email,

    customer_address: order.address,
    customer_city: order.city,
    customer_pincode: order.pincode,

    payment_method: order.payment_method,
    payment_status: 'pending',
    order_status: 'pending',

    customized_product_name: order.customized_product_name,
    quantity: order.quantity,
    total_price: order.total_price,

    ingredients: order.ingredients,
    customizations: order.customizations
  }

  return await supabase
    .from('customized_orders')
    .insert([customOrderPayload])
    .select()
}

export const cancelOrder = async (orderId, type, reason) => {
  const table = type === 'normal' ? 'product_orders' : 'customized_orders'
  
  return await supabase
    .from(table)
    .update({
      order_status: 'cancelled',
      cancel_reason: reason,
      cancelled_at: new Date().toISOString()
    })
    .eq('id', orderId)
    .select()
}

