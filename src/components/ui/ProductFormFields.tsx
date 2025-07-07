import React from 'react'
import { Palette, Check } from 'lucide-react'
import { PRODUCT_COLORS } from '../../types'
import Input from './Input'

interface ProductFormData {
  title: string
  description: string
  price: number
  category: 'decorations' | 'ribbons' | 'trees' | 'centrepieces'
  decorated: boolean
}

interface ProductFormFieldsProps {
  formData: ProductFormData
  onFormDataChange: (data: ProductFormData) => void
  selectedColors: string[]
  onColorsChange: (colors: string[]) => void
  loading?: boolean
}

const ProductFormFields: React.FC<ProductFormFieldsProps> = ({
  formData,
  onFormDataChange,
  selectedColors,
  onColorsChange,
  loading = false
}) => {
  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    onFormDataChange({
      ...formData,
      [field]: value
    })
  }

  const toggleColor = (colorValue: string) => {
    if (selectedColors.includes(colorValue)) {
      onColorsChange(selectedColors.filter(c => c !== colorValue))
    } else {
      onColorsChange([...selectedColors, colorValue])
    }
  }

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Product Title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          required
          disabled={loading}
          placeholder="Enter product title"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Price ($)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#F7B541] focus:border-[#F7B541]"
            required
            disabled={loading}
            placeholder="0.00"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#F7B541] focus:border-[#F7B541]"
          required
          disabled={loading}
          placeholder="Describe your product..."
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Category
        </label>
        <select
          value={formData.category}
          onChange={(e) => handleInputChange('category', e.target.value as ProductFormData['category'])}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#F7B541] focus:border-[#F7B541]"
          required
          disabled={loading}
        >
          <option value="decorations">Decorations</option>
          <option value="ribbons">Ribbons</option>
          <option value="trees">Trees</option>
          <option value="centrepieces">Centre Pieces</option>
        </select>
      </div>

      {/* Colors - For Trees, Decorations, Ribbons, and Centre Pieces */}
      {(formData.category === 'trees' || formData.category === 'decorations' || formData.category === 'ribbons' || formData.category === 'centrepieces') && (
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <Palette className="h-5 w-5 text-[#511B7D] dark:text-[#F7B541]" />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Available Colors ({selectedColors.length} selected)
            </label>
          </div>
          
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {PRODUCT_COLORS.map((color) => {
              const isSelected = selectedColors.includes(color.value)
              
              return (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => toggleColor(color.value)}
                  className={`relative p-3 rounded-xl border-2 ${
                    isSelected
                      ? 'border-[#F7B541] bg-[#F7B541]/10 dark:bg-[#511B7D]/20'
                      : 'border-gray-200 dark:border-gray-600'
                  }`}
                  disabled={loading}
                >
                  <div
                    className="w-8 h-8 rounded-lg mx-auto mb-2 border border-gray-200 dark:border-gray-600"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 block">
                    {color.name}
                  </span>
                  
                  {isSelected && (
                    <div
                      className="absolute top-1 right-1 bg-[#F7B541] rounded-full p-1"
                    >
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Decorated Toggle - For Trees only */}
      {formData.category === 'trees' && (
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="decorated"
            checked={formData.decorated}
            onChange={(e) => handleInputChange('decorated', e.target.checked)}
            className="w-4 h-4 text-emerald-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-[#F7B541] focus:ring-2"
            disabled={loading}
          />
          <label htmlFor="decorated" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Pre-decorated
          </label>
        </div>
      )}
    </div>
  )
}

export default ProductFormFields