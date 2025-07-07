import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Product } from '../types'
import { useToast } from './useToast'

interface ProductFormData {
  title: string
  description: string
  price: number
  category: 'decorations' | 'ribbons' | 'trees'
  color: string
  decorated: boolean
  images: string[]
}

interface UseProductFormProps {
  product?: Product | null
  onSuccess?: () => void
}

interface UseProductFormReturn {
  formData: ProductFormData
  setFormData: (data: ProductFormData) => void
  selectedColors: string[]
  setSelectedColors: (colors: string[]) => void
  loading: boolean
  handleSubmit: (e: React.FormEvent) => Promise<void>
  updateFormField: <K extends keyof ProductFormData>(field: K, value: ProductFormData[K]) => void
}

export const useProductForm = ({ product, onSuccess }: UseProductFormProps = {}): UseProductFormReturn => {
  const [formData, setFormData] = useState<ProductFormData>({
    title: product?.title || '',
    description: product?.description || '',
    price: product?.price || 0,
    category: product?.category || 'trees',
    color: product?.color || '',
    decorated: product?.decorated || false,
    images: product?.images || []
  })

  const [selectedColors, setSelectedColors] = useState<string[]>(
    product?.color ? product.color.split(',') : []
  )

  const [loading, setLoading] = useState(false)
  
  const { showProductAdded, showProductUpdated, showNetworkError } = useToast()

  const updateFormField = <K extends keyof ProductFormData>(field: K, value: ProductFormData[K]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.description.trim() || formData.price <= 0) {
      showNetworkError()
      return
    }

    setLoading(true)

    try {
      const productData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: formData.price,
        category: formData.category,
        color: selectedColors.length > 0 ? selectedColors.join(',') : null,
        decorated: formData.decorated,
        images: formData.images
      }

      if (product) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id)

        if (error) throw error
        showProductUpdated()
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert([productData])

        if (error) throw error
        showProductAdded()
      }

      onSuccess?.()
    } catch (error) {
      console.error('Error saving product:', error)
      showNetworkError()
    } finally {
      setLoading(false)
    }
  }

  return {
    formData,
    setFormData,
    selectedColors,
    setSelectedColors,
    loading,
    handleSubmit,
    updateFormField
  }
}