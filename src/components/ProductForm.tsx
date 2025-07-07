import React from 'react'
import { X } from 'lucide-react'
import { Product } from '../types'
import { useProductForm } from '../hooks/useProductForm'
import Button from './ui/Button'
import ImageUploader from './ui/ImageUploader'
import ProductFormFields from './ui/ProductFormFields'

interface ProductFormProps {
  product?: Product | null
  onClose: () => void
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onClose }) => {
  const {
    formData,
    selectedColors,
    setSelectedColors,
    loading,
    handleSubmit,
    updateFormField
  } = useProductForm({
    product,
    onSuccess: onClose
  })

  const handleFormDataChange = (newFormData: typeof formData) => {
    Object.entries(newFormData).forEach(([key, value]) => {
      updateFormField(key as keyof typeof formData, value)
    })
  }

  const handleImagesChange = (images: string[]) => {
    updateFormField('images', images)
  }

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {product ? 'Edit Product' : 'Add New Product'}
        </h2>
        <button
          onClick={onClose}
          className="p-2 text-gray-500"
          disabled={loading}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Basic Fields */}
        <ProductFormFields
          formData={{
            title: formData.title,
            description: formData.description,
            price: formData.price,
            category: formData.category,
            decorated: formData.decorated
          }}
          onFormDataChange={handleFormDataChange}
          selectedColors={selectedColors}
          onColorsChange={setSelectedColors}
          loading={loading}
        />

        {/* Image Upload */}
        <ImageUploader
          images={formData.images}
          onImagesChange={handleImagesChange}
          loading={loading}
        />

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
          >
            {product ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ProductForm