import React, { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ImageSliderProps {
  images: string[]
  alt: string
  className?: string
  showDots?: boolean
  showArrows?: boolean
  autoPlay?: boolean
  autoPlayInterval?: number
  onImageClick?: (index: number) => void
}

const ImageSlider: React.FC<ImageSliderProps> = ({
  images,
  alt,
  className = "",
  showDots = true,
  showArrows = true,
  autoPlay = false,
  autoPlayInterval = 4000,
  onImageClick
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState<number | null>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const hasMultipleImages = images.length > 1
  const displayImages = images.length > 0 ? images : [
    "https://images.pexels.com/photos/1708166/pexels-photo-1708166.jpeg?auto=compress&cs=tinysrgb&w=800"
  ]

  // Auto-play with progress bar
  useEffect(() => {
    if (!autoPlay || !hasMultipleImages || isHovered) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayImages.length)
    }, autoPlayInterval)
    return () => clearInterval(interval)
  }, [autoPlay, autoPlayInterval, displayImages.length, hasMultipleImages, isHovered])

  // Progress bar animation
  useEffect(() => {
    if (!autoPlay || !hasMultipleImages || isHovered) return
    if (progressRef.current) {
      progressRef.current.style.transition = "none"
      progressRef.current.style.width = "0%"
      setTimeout(() => {
        if (progressRef.current) {
          progressRef.current.style.transition = `width ${autoPlayInterval}ms linear`
          progressRef.current.style.width = "100%"
        }
      }, 20)
    }
  }, [currentIndex, autoPlay, autoPlayInterval, hasMultipleImages, isHovered])

  // Touch/drag support
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setDragStartX(e.touches[0].clientX)
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || dragStartX === null) return
    const diff = e.touches[0].clientX - dragStartX
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToPrevious()
      else goToNext()
      setIsDragging(false)
      setDragStartX(null)
    }
  }
  const handleTouchEnd = () => {
    setIsDragging(false)
    setDragStartX(null)
  }

  const goToSlide = (index: number) => setCurrentIndex(index)
  const goToPrevious = () => setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)
  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % displayImages.length)

  return (
    <div
      className={`relative overflow-hidden rounded-xl shadow-lg group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
      aria-label={alt}
      role="region"
    >
      {/* Main Image Display with fade/slide animation */}
      <div className="relative w-full h-full aspect-[4/3] bg-gray-100">
        <img
          key={currentIndex}
          src={displayImages[currentIndex]}
          alt={`${alt} ${currentIndex + 1}`}
          className="w-full h-full object-cover rounded-xl select-none"
          draggable={false}
          onClick={() => onImageClick?.(currentIndex)}
          onError={e => {
            e.currentTarget.src = "https://images.pexels.com/photos/1708166/pexels-photo-1708166.jpeg?auto=compress&cs=tinysrgb&w=800"
          }}
        />
        {/* Progress Bar */}
        {autoPlay && hasMultipleImages && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-black/10 rounded-b-xl overflow-hidden">
            <div ref={progressRef} className="h-full bg-primary" style={{ width: 0 }} />
          </div>
        )}
        {/* Navigation Arrows */}
        {hasMultipleImages && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToPrevious()
              }}
              className="absolute top-1/2 left-4 -translate-y-1/2 z-10 bg-black/60 text-white h-10 w-10 p-0 flex items-center justify-center rounded-full shadow-md focus:outline-none"
              aria-label="Previous image"
              tabIndex={0}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
              className="absolute top-1/2 right-4 -translate-y-1/2 z-10 bg-black/60 text-white h-10 w-10 p-0 flex items-center justify-center rounded-full shadow-md focus:outline-none"
              aria-label="Next image"
              tabIndex={0}
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>
      {/* Image Counter */}
      {hasMultipleImages && (
        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-3 py-1 rounded-full shadow-md">
          {currentIndex + 1}/{displayImages.length}
        </div>
      )}
    </div>
  )
}

export default ImageSlider