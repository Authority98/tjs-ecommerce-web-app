export interface Product {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  category: 'decorations' | 'ribbons' | 'trees' | 'centrepieces'
  color?: string
  decorated?: boolean
  created_at: string
  updated_at: string
}

export interface TreeOptions {
  height: string
  width: string
  type: string
  rentalPeriod: number
  decorLevel: number
}

export interface CustomerDetails {
  name: string
  email: string
  phone: string
  deliveryAddress: string
}

export interface OrderSummary {
  type?: 'product' | 'giftcard'
  product?: Product
  giftCard?: {
    amount: number
    recipientName?: string
    recipientEmail?: string
    senderName?: string
    personalMessage?: string
    scheduledDate?: string
    isForSelf?: boolean
  }
  treeOptions?: TreeOptions
  customerDetails?: CustomerDetails
  installationDate?: string
  teardownDate?: string
  rushOrder?: boolean
  totalAmount: number
}

export interface TreeSize {
  height: {
    metric: string
    imperial: string
  }
  width: {
    metric: string  
    imperial: string
  }
}

export const PRODUCT_COLORS = [
  { name: 'Blue', value: 'blue', hex: '#3B82F6' },
  { name: 'Burlap', value: 'burlap', hex: '#D2B48C' },
  { name: 'Champagne Gold', value: 'champagne-gold', hex: '#F7E7CE' },
  { name: 'Gold', value: 'gold', hex: '#FFD700' },
  { name: 'Green', value: 'green', hex: '#10B981' },
  { name: 'Platinum', value: 'platinum', hex: '#E5E7EB' },
  { name: 'Red', value: 'red', hex: '#EF4444' },
  { name: 'Silver', value: 'silver', hex: '#9CA3AF' },
  { name: 'White', value: 'white', hex: '#FFFFFF' }
]

export const TREE_SIZES: TreeSize[] = [
  {
    height: { metric: '1.5 m', imperial: '4–5 ft' },
    width: { metric: '0.9 m', imperial: '2–3 ft' }
  },
  {
    height: { metric: '1.8 m', imperial: '5–6 ft' },
    width: { metric: '1.2 m', imperial: '3–4 ft' }
  },
  {
    height: { metric: '2.1 m', imperial: '6–7 ft' },
    width: { metric: '1.5 m', imperial: '4–5 ft' }
  },
  {
    height: { metric: '2.4 m', imperial: '7–8 ft' },
    width: { metric: '1.8 m', imperial: '5–6 ft' }
  },
  {
    height: { metric: '2.7 m', imperial: '8–9 ft' },
    width: { metric: '2.1 m', imperial: '6–7 ft' }
  },
  {
    height: { metric: '3.0 m', imperial: '9–10 ft' },
    width: { metric: '2.4 m', imperial: '7–8 ft' }
  },
  {
    height: { metric: '3.3 m', imperial: '10–11 ft' },
    width: { metric: '2.7 m', imperial: '8–9 ft' }
  },
  {
    height: { metric: '3.6 m', imperial: '11–12 ft' },
    width: { metric: '3.0 m', imperial: '9–10 ft' }
  },
  {
    height: { metric: '4.5 m', imperial: '14–15 ft' },
    width: { metric: '3.9 m', imperial: '12–13 ft' }
  },
  {
    height: { metric: '5.4 m', imperial: '17–18 ft' },
    width: { metric: '4.8 m', imperial: '15–16 ft' }
  }
]

export const TREE_TYPES = [
  'Hyper-realistic Artificial Fir Tree',
  'Live Balsam Fir',
  'Live Blue Spruce',
  'Live Caucasian/Nordmann Fir',
  'Live Douglas Fir',
  'Live Fraser Fir',
  'Live Noble Fir',
  'Live Scotch Pine',
  'Live Virginia Pine',
  'Live White Pine'
]

export const RENTAL_PERIODS = [
  { days: 45, label: '45 Days', additionalCost: 0 },
  { days: 60, label: '60 Days', additionalCost: 100 },
  { days: 90, label: '90 Days', additionalCost: 200 }
]

export const DECOR_LEVELS = [
  { percentage: 100, label: 'Full Decor', description: '100%' },
  { percentage: 75, label: 'Two Third Decor', description: '75%' },
  { percentage: 50, label: 'Half Decor', description: '50%' }
]

export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  delivery_address: string
  product_id?: string
  gift_card_id?: string
  order_type: 'product' | 'giftcard'
  tree_height?: string
  tree_width?: string
  tree_type?: string
  rental_period?: number
  decor_level?: number
  installation_date?: string
  teardown_date?: string
  rush_order?: boolean
  total_amount: number
  status: 'pending' | 'confirmed' | 'delivered' | 'completed'
  created_at: string
  updated_at: string
  products?: Product
  gift_cards?: {
    id: string
    amount: number
    recipient_name: string
    recipient_email: string
    sender_name: string
    personal_message?: string
    scheduled_date?: string
    is_for_self: boolean
  }
}