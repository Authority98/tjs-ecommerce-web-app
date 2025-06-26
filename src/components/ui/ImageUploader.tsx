import React, { useState } from 'react'
import { Upload, Trash2, X } from 'lucide-react'
import Button from './Button'
import { supabase } from '../../lib/supabase'

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
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setUploadingImages(true)
    setUploadError(null)
    
    try {
      const newImageUrls: string[] = []
      
      for (const file of files) {
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setUploadError(`File ${file.name} is too large. Maximum size is 5MB.`)
          continue
        }
        
        // Generate unique filename
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        
        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(fileName, file)
        
        if (error) {
          console.error('Error uploading file:', error)
          if (error.message.includes('Bucket not found')) {
            setUploadError('Storage bucket not configured. Please contact administrator.')
          } else {
            setUploadError(`Failed to upload ${file.name}: ${error.message}`)
          }
          continue
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName)
        
        newImageUrls.push(publicUrl)
      }
      
      if (newImageUrls.length > 0) {
        const updatedImages = [...images, ...newImageUrls].slice(0, maxImages)
        onImagesChange(updatedImages)
      }
    } catch (error) {
      console.error('Error uploading images:', error)
      setUploadError('Failed to upload images. Please try again.')
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
          <div
            key={index}
            className="relative group"
          >
            <img
              src={image}
              alt={`Product ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
              onError={(e) => {
                console.error('Failed to load image:', image)
                e.currentTarget.src = 'https://images.pexels.com/photos/1708166/pexels-photo-1708166.jpeg?auto=compress&cs=tinysrgb&w=400'
              }}
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-1 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-full"
              disabled={loading}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
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
            <div className="w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center cursor-pointer">
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

      {uploadError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-600 dark:text-red-400">{uploadError}</p>
        </div>
      )}

      {images.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
          No images uploaded yet. Add some images to showcase your product.
        </p>
      )}
    </div>
  )
}

export default ImageUploader