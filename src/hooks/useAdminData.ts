import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import { Product, Order } from '../types'
import { useToast } from './useToast'

interface UseAdminDataReturn {
  // Data
  products: Product[]
  orders: Order[]
  filteredProducts: Product[]
  loading: boolean
  
  // Filters
  selectedCategory: 'all' | 'decorations' | 'ribbons' | 'trees' | 'centrepieces'
  setSelectedCategory: (category: 'all' | 'decorations' | 'ribbons' | 'trees' | 'centrepieces') => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  
  // Auth
  isAuthenticated: boolean
  setIsAuthenticated: (auth: boolean) => void
  checkingAuth: boolean
  
  // Actions
  fetchProducts: () => Promise<void>
  fetchOrders: () => Promise<void>
  deleteProduct: (productId: string) => Promise<void>
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>
  checkAuthStatus: () => Promise<void>
  handleLogout: () => Promise<void>
  
  // Stats
  stats: {
    totalOrders: number
    totalRevenue: number
    pendingOrders: number
    totalProducts: number
  }
}

export const useAdminData = (): UseAdminDataReturn => {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'decorations' | 'ribbons' | 'trees' | 'centrepieces'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  
  const { showProductDeleted, showOrderUpdated, showNetworkError } = useToast()

  // Memoized filtered products
  const filteredProducts = useMemo(() => {
    let filtered = products

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [products, selectedCategory, searchQuery])

  // Memoized stats
  const stats = useMemo(() => {
    return {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.total_amount, 0),
      pendingOrders: orders.filter(order => order.status === 'pending').length,
      totalProducts: products.length
    }
  }, [orders, products])

  // Auth functions
  const checkAuthStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
    } catch (error) {
      console.error('Error checking auth status:', error)
    } finally {
      setCheckingAuth(false)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setIsAuthenticated(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Data fetching functions
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      showNetworkError()
    } finally {
      setLoading(false)
    }
  }

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          products (
            id,
            title,
            category,
            images
          ),
          gift_cards (
            id,
            amount,
            recipient_name,
            recipient_email,
            sender_name,
            personal_message,
            scheduled_date,
            is_for_self
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
      showNetworkError()
    }
  }

  // CRUD operations
  const deleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) throw error
      
      setProducts(products.filter(p => p.id !== productId))
      showProductDeleted()
    } catch (error) {
      console.error('Error deleting product:', error)
      showNetworkError()
    }
  }

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)

      if (error) throw error
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      ))
      showOrderUpdated()
    } catch (error) {
      console.error('Error updating order status:', error)
      showNetworkError()
    }
  }

  // Effects
  useEffect(() => {
    checkAuthStatus()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts()
      fetchOrders()
    }
  }, [isAuthenticated])

  return {
    // Data
    products,
    orders,
    filteredProducts,
    loading,
    
    // Filters
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    
    // Auth
    isAuthenticated,
    setIsAuthenticated,
    checkingAuth,
    
    // Actions
    fetchProducts,
    fetchOrders,
    deleteProduct,
    updateOrderStatus,
    checkAuthStatus,
    handleLogout,
    
    // Stats
    stats
  }
}