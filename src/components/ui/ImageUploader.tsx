import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Trash2, X } from 'lucide-react'
import Button from './Button'

interface ImageUploaderProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
  loading?: boolean
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onImagesChange,
  maxImages = 5,
  loading = false
}) => {
  const [uploadingImages, setUploadingImages] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setUploadingImages(true)
    
    try {
      // For now, we'll create placeholder URLs
      // In a real app, you'd upload to Supabase Storage or similar service
      const newImageUrls = files.map((file, index) => {
        // Create a placeholder URL - in production, upload to storage
        return `https://images.pexels.com/photos/1708166/pexels-photo-1708166.jpeg?auto=compress&cs=tinysrgb&w=800&t=${Date.now()}-${index}`
      })
      
      const updatedImages = [...images, ...newImageUrls].slice(0, maxImages)
      onImagesChange(updatedImages)
    } catch (error) {
      console.error('Error uploading images:', error)
    } finally {
      setUploadingImages(false)
    }
  }

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index)
    onImagesChange(updatedImages)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Product Images ({images.length}/{maxImages})
        </label>
        
        {images.length < maxImages && (
          <div className="relative">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={loading || uploadingImages}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={Upload}
              loading={uploadingImages}
              disabled={loading || uploadingImages}
            >
              {uploadingImages ? 'Uploading...' : 'Add Images'}
            </Button>
          </div>
        )}
      </div>

      {/* Image Preview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative group"
          >
            <img
              src={image}
              alt={`Product ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-1 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:from-red-600 hover:to-rose-600"
              disabled={loading}
            >
              <X className="h-3 w-3" />
            </button>
          </motion.div>
        ))}

        {/* Add Image Placeholder */}
        {images.length < maxImages && (
          <div className="relative">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={loading || uploadingImages}
            />
            <div className="w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors cursor-pointer">
              <div className="text-center">
                <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {uploadingImages ? 'Uploading...' : 'Add Image'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {images.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
          No images uploaded yet. Add some images to showcase your product.
        </p>
      )}
    </div>
  )
}

export default ImageUploader