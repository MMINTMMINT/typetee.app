import axios from 'axios'
import { generateDesignImage } from './imageGenerator'

const PRINTIFY_API_URL = 'https://api.printify.com/v1'
const PRINTIFY_API_KEY = process.env.PRINTIFY_API_KEY!
const PRINTIFY_SHOP_ID = process.env.PRINTIFY_SHOP_ID!

interface OrderData {
  shirtColor: string
  size: string
  mode: string
  text: string
  asciiArt: string
  font: string
  textSize: number
  placement: string
  shippingInfo: {
    email: string
    name: string
    address: string
    city: string
    state: string
    zip: string
    country: string
  }
}

export async function createPrintifyOrder(orderData: OrderData) {
  try {
    // Generate print-ready design image (4606x5787px)
    const designImageUrl = await generateDesignImage(orderData)
    
    // Determine supplier based on country
    const supplierId = orderData.shippingInfo.country === 'US' 
      ? process.env.PRINTIFY_SUPPLIER_US 
      : process.env.PRINTIFY_SUPPLIER_UK
    
    // Determine product ID based on shirt color
    const productId = orderData.shirtColor === 'black'
      ? process.env.PRINTIFY_PRODUCT_ID_BLACK
      : process.env.PRINTIFY_PRODUCT_ID_WHITE
    
    // Map size to Printify variant ID (these would be specific to your product)
    const sizeMap: Record<string, string> = {
      'S': 'small_variant_id',
      'M': 'medium_variant_id',
      'L': 'large_variant_id',
      'XL': 'xl_variant_id',
      '2XL': '2xl_variant_id',
    }
    
    // Upload design to Printify
    const uploadResponse = await axios.post(
      `${PRINTIFY_API_URL}/uploads/images.json`,
      {
        file_name: `design-${Date.now()}.png`,
        url: designImageUrl,
      },
      {
        headers: {
          'Authorization': `Bearer ${PRINTIFY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )
    
    const imageId = uploadResponse.data.id
    
    // Create print areas based on placement
    const printAreas = {
      front: orderData.placement === 'front' ? [
        {
          variant_ids: [sizeMap[orderData.size]],
          placeholders: [
            {
              position: 'front',
              images: [
                {
                  id: imageId,
                  x: 0.5,
                  y: 0.5,
                  scale: 1,
                  angle: 0,
                },
              ],
            },
          ],
        },
      ] : [],
      back: orderData.placement === 'back' ? [
        {
          variant_ids: [sizeMap[orderData.size]],
          placeholders: [
            {
              position: 'back',
              images: [
                {
                  id: imageId,
                  x: 0.5,
                  y: 0.5,
                  scale: 1,
                  angle: 0,
                },
              ],
            },
          ],
        },
      ] : [],
    }
    
    // Create order
    const orderResponse = await axios.post(
      `${PRINTIFY_API_URL}/shops/${PRINTIFY_SHOP_ID}/orders.json`,
      {
        external_id: `order-${Date.now()}`,
        line_items: [
          {
            product_id: productId,
            variant_id: sizeMap[orderData.size],
            quantity: 1,
            print_areas: printAreas,
          },
        ],
        shipping_method: 1, // Standard shipping
        send_shipping_notification: true,
        address_to: {
          first_name: orderData.shippingInfo.name.split(' ')[0],
          last_name: orderData.shippingInfo.name.split(' ').slice(1).join(' '),
          email: orderData.shippingInfo.email,
          address1: orderData.shippingInfo.address,
          city: orderData.shippingInfo.city,
          region: orderData.shippingInfo.state,
          zip: orderData.shippingInfo.zip,
          country: orderData.shippingInfo.country,
        },
      },
      {
        headers: {
          'Authorization': `Bearer ${PRINTIFY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )
    
    // Send to production
    await axios.post(
      `${PRINTIFY_API_URL}/shops/${PRINTIFY_SHOP_ID}/orders/${orderResponse.data.id}/send_to_production.json`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${PRINTIFY_API_KEY}`,
        },
      }
    )
    
    return orderResponse.data
  } catch (error) {
    console.error('Printify API error:', error)
    throw new Error('Failed to create Printify order')
  }
}
