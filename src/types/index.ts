export interface Product {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  category: 'decorations' | 'ribbons' | 'trees'
  color?: string
  decorated?: boolean
  created_at: string
  updated_at: string
}

export interface TreeOptions {
  height: string
  width: string
  type: string
  rentalPeriod?: number
  decorLevel: number
}

export interface CustomerDetails {
  name: string
  email: string
  phone: string
  deliveryAddress: string
  // Singapore-specific address fields
  unitNumber?: string
  buildingName?: string
  streetAddress?: string
  postalCode?: string
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

export interface TreeType {
  name: string
  category: 'Live' | 'Artificial'
  status: 'available' | 'unavailable' | 'custom'
  description?: string
}

export const TREE_TYPES: TreeType[] = [
  // Live Trees
  {
    name: 'Noble Fir',
    category: 'Live',
    status: 'available',
    description: 'Price to be announced in October'
  },
  {
    name: 'Nordmann Fir',
    category: 'Live',
    status: 'available',
    description: 'Price to be announced in October'
  },
  {
    name: 'Fraser Fir',
    category: 'Live',
    status: 'available',
    description: 'Price to be announced in October'
  },
  {
    name: 'Balsam Fir',
    category: 'Live',
    status: 'unavailable',
    description: 'Unavailable for now'
  },
  {
    name: 'Blue Spruce',
    category: 'Live',
    status: 'unavailable',
    description: 'Unavailable for now'
  },
  {
    name: 'Douglas Fir',
    category: 'Live',
    status: 'unavailable',
    description: 'Unavailable for now'
  },
  {
    name: 'Scotch Pine',
    category: 'Live',
    status: 'unavailable',
    description: 'Unavailable for now'
  },
  {
    name: 'Virginia Pine',
    category: 'Live',
    status: 'unavailable',
    description: 'Unavailable for now'
  },
  {
    name: 'White Pine',
    category: 'Live',
    status: 'unavailable',
    description: 'Unavailable for now'
  },
  // Artificial Trees
  {
    name: 'Hyper-realistic Artificial Fir Tree',
    category: 'Artificial',
    status: 'available',
    description: 'Premium quality artificial tree'
  },
  {
    name: 'Custom Tree',
    category: 'Artificial',
    status: 'custom',
    description: 'Price upon request'
  }
]

export const RENTAL_PERIODS = [
  { days: 45, label: '45 Days', additionalCost: 0 },
  { days: 60, label: '60 Days', additionalCost: 100 },
  { days: 90, label: '90 Days', additionalCost: 200 }
]

export const DECOR_LEVELS = [
  { 
    percentage: 100, 
    label: 'All-Inclusive Premium Decor Package', 
    description: '✨ Complete venue transformation with full decor setup, premium props, ambient lighting, elegant floral arrangements, and professional teardown service',
    notes: '🎯 Perfect for clients seeking a luxurious, hands-off experience with zero stress and maximum impact'
  },
  { percentage: 75, label: 'Two Third Decor', description: '75%' },
  { percentage: 50, label: 'Half Decor', description: '50%' }
]

// Delivery Configuration Types
export interface DeliveryZone {
  id: string
  name: string
  postalCodes: string[]
  fee: number
}

export interface DistanceBasedConfig {
  baseFee: number
  baseDistance: number
  additionalChargePerKm: number
  maxRange: number
}

export interface DeliveryAddOn {
  id: string
  name: string
  fee: number
  enabled: boolean
}

export interface DeliveryConfiguration {
  id?: string
  model: 'zone' | 'distance'
  zoneBasedConfig?: {
    zones: DeliveryZone[]
  }
  distanceBasedConfig?: DistanceBasedConfig
  addOns: DeliveryAddOn[]
  isActive: boolean
  created_at?: string
  updated_at?: string
}

// Default delivery configurations
export const DEFAULT_DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: 'central',
    name: 'Central (CBD)',
    postalCodes: [],
    fee: 40
  },
  {
    id: 'north',
    name: 'North',
    postalCodes: [],
    fee: 50
  },
  {
    id: 'east',
    name: 'East',
    postalCodes: [],
    fee: 45
  },
  {
    id: 'west',
    name: 'West',
    postalCodes: [],
    fee: 50
  },
  {
    id: 'sentosa',
    name: 'Sentosa',
    postalCodes: [],
    fee: 80
  },
  {
    id: 'jurong-island',
    name: 'Jurong Island',
    postalCodes: [],
    fee: 120
  }
]

export const DEFAULT_DISTANCE_CONFIG: DistanceBasedConfig = {
  baseFee: 30,
  baseDistance: 10,
  additionalChargePerKm: 2,
  maxRange: 30
}

export const DEFAULT_DELIVERY_ADDONS: DeliveryAddOn[] = [
  {
    id: 'no-lift',
    name: 'No lift access',
    fee: 60,
    enabled: true
  },
  {
    id: 'permits',
    name: 'Permit/licensing needed',
    fee: 80,
    enabled: true
  },
  {
    id: 'specific-timing',
    name: 'Specific delivery timing',
    fee: 50,
    enabled: true
  }
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