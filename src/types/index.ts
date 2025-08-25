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
  postalCode?: string
  unitNumber?: string
  buildingName?: string
  streetAddress?: string
  // Zone-based delivery fields
  deliveryZone?: string
  deliveryArea?: string
  deliveryFee?: number
}

export interface OrderSummary {
  type?: 'product' | 'giftcard' | 'event'
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
  eventService?: {
    id: string
    name: string
    category: string
    price: number
    priceType: 'fixed' | 'from' | 'upon_request' | 'custom'
    description?: string
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
  { percentage: 50, label: 'Basic Decor', description: 'Essential decorations' },
  { 
    percentage: 100, 
    label: 'Premium Decor', 
    description: 'Complete decoration package',
    notes: 'Full service with professional setup',
    detailedDescription: '✨ Complete venue transformation with full decor setup, premium props, ambient lighting, elegant floral arrangements, and professional teardown service. Perfect for clients seeking a luxurious, hands-off experience with zero stress and maximum impact.'
  }
]

// Delivery Configuration Types
export interface DeliveryZone {
  id: string
  name: string
  fee: number
}

export interface DeliveryAddOn {
  id: string
  name: string
  fee: number
  enabled: boolean
}

export interface DeliveryConfiguration {
  id?: string
  model: 'zone'
  zoneBasedConfig?: {
    zones: DeliveryZone[]
  }
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
    fee: 40
  },
  {
    id: 'north',
    name: 'North',
    fee: 50
  },
  {
    id: 'northeast',
    name: 'Northeast',
    fee: 45
  },
  {
    id: 'east',
    name: 'East',
    fee: 45
  },
  {
    id: 'west',
    name: 'West',
    fee: 50
  },
  {
    id: 'sentosa',
    name: 'Sentosa',
    fee: 80
  },
  {
    id: 'jurong-island',
    name: 'Jurong Island',
    fee: 120
  }
]

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
    id: 'rush-order',
    name: 'Rush Order',
    fee: 150,
    enabled: true
  }
]

export interface InstallationCharge {
  id: string
  service_type: 'installation' | 'teardown'
  base_charge: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface TimingSurcharge {
  id: string
  surcharge_type: 'day_based'
  name: string
  description?: string
  surcharge_amount: number
  day_types?: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  delivery_address: string
  product_id?: string
  gift_card_id?: string
  event_service_id?: string
  order_type: 'product' | 'giftcard' | 'event'
  tree_height?: string
  tree_width?: string
  tree_type?: string
  rental_period?: number
  decor_level?: number
  installation_date?: string
  installation_time?: string
  teardown_date?: string
  teardown_time?: string
  rush_order?: boolean
  installation_charges?: number
  teardown_charges?: number
  timing_surcharges?: number
  selected_delivery_addons?: DeliveryAddOn[]
  rush_order_fee?: number
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