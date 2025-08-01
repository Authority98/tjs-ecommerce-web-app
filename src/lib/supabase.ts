import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          title: string
          description: string
          price: number
          images: string[]
          category: 'decorations' | 'ribbons' | 'trees' | 'centerpieces'
          color?: string
          decorated?: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          price: number
          images: string[]
          category: 'decorations' | 'ribbons' | 'trees' | 'centerpieces'
          color?: string
          decorated?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          price?: number
          images?: string[]
          category?: 'decorations' | 'ribbons' | 'trees' | 'centerpieces'
          color?: string
          decorated?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      discount_codes: {
        Row: {
          id: string
          code: string
          description: string | null
          discount_type: 'percentage' | 'fixed'
          discount_value: number
          min_order_amount: number
          max_uses: number | null
          used_count: number
          is_active: boolean
          valid_from: string | null
          valid_until: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          description?: string | null
          discount_type: 'percentage' | 'fixed'
          discount_value: number
          min_order_amount?: number
          max_uses?: number | null
          used_count?: number
          is_active?: boolean
          valid_from?: string | null
          valid_until?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          description?: string | null
          discount_type?: 'percentage' | 'fixed'
          discount_value?: number
          min_order_amount?: number
          max_uses?: number | null
          used_count?: number
          is_active?: boolean
          valid_from?: string | null
          valid_until?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      gift_cards: {
        Row: {
          id: string
          amount: number
          recipient_name?: string
          recipient_email?: string
          sender_name?: string
          personal_message?: string
          scheduled_date?: string
          is_for_self: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          amount: number
          recipient_name?: string
          recipient_email?: string
          sender_name?: string
          personal_message?: string
          scheduled_date?: string
          is_for_self?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          amount?: number
          recipient_name?: string
          recipient_email?: string
          sender_name?: string
          personal_message?: string
          scheduled_date?: string
          is_for_self?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number?: string
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
          payment_intent_id?: string
          discount_code_id?: string
          discount_amount?: number
          status: 'pending' | 'confirmed' | 'delivered' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number?: string
          customer_name: string
          customer_email: string
          customer_phone: string
          delivery_address: string
          product_id?: string
          gift_card_id?: string
          order_type?: 'product' | 'giftcard'
          tree_height?: string
          tree_width?: string
          tree_type?: string
          rental_period?: number
          decor_level?: number
          installation_date?: string
          teardown_date?: string
          rush_order?: boolean
          total_amount: number
          payment_intent_id?: string
          discount_code_id?: string
          discount_amount?: number
          status?: 'pending' | 'confirmed' | 'delivered' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          customer_name?: string
          customer_email?: string
          customer_phone?: string
          delivery_address?: string
          product_id?: string
          gift_card_id?: string
          order_type?: 'product' | 'giftcard'
          tree_height?: string
          tree_width?: string
          tree_type?: string
          rental_period?: number
          decor_level?: number
          installation_date?: string
          teardown_date?: string
          rush_order?: boolean
          total_amount?: number
          payment_intent_id?: string
          discount_code_id?: string
          discount_amount?: number
          status?: 'pending' | 'confirmed' | 'delivered' | 'completed'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}