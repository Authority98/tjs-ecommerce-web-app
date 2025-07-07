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
          category: 'decorations' | 'ribbons' | 'trees' | 'centrepieces'
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
          category: 'decorations' | 'ribbons' | 'trees' | 'centrepieces'
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
          category?: 'decorations' | 'ribbons' | 'trees' | 'centrepieces'
          color?: string
          decorated?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_name: string
          customer_email: string
          customer_phone: string
          delivery_address: string
          product_id: string
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
        }
        Insert: {
          id?: string
          customer_name: string
          customer_email: string
          customer_phone: string
          delivery_address: string
          product_id: string
          tree_height?: string
          tree_width?: string
          tree_type?: string
          rental_period?: number
          decor_level?: number
          installation_date?: string
          teardown_date?: string
          rush_order?: boolean
          total_amount: number
          status?: 'pending' | 'confirmed' | 'delivered' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_name?: string
          customer_email?: string
          customer_phone?: string
          delivery_address?: string
          product_id?: string
          tree_height?: string
          tree_width?: string
          tree_type?: string
          rental_period?: number
          decor_level?: number
          installation_date?: string
          teardown_date?: string
          rush_order?: boolean
          total_amount?: number
          status?: 'pending' | 'confirmed' | 'delivered' | 'completed'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}