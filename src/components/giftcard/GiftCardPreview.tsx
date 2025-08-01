import React from 'react'
import { Gift, Sparkles, Heart, Star } from 'lucide-react'

interface GiftCardPreviewProps {
  selectedAmount: number
  recipientName: string
  senderName: string
  personalMessage: string
  isForSelf: boolean | undefined
}

const GiftCardPreview: React.FC<GiftCardPreviewProps> = ({
  selectedAmount,
  recipientName,
  senderName,
  personalMessage,
  isForSelf
}) => {
  return (
    <div className="lg:sticky lg:top-8">
      <div className="p-4 sm:p-6 lg:p-8 min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]">
        {/* Header */}
        <div className="relative mb-4 sm:mb-6 lg:mb-8">
          {/* Removed floating elements as they're now in the main page */}
        </div>
        
        {/* Enhanced Gift Card */}
        <div
          className="relative bg-gradient-to-br from-purple-500 via-fuchsia-500 to-violet-400 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-2xl mb-4 sm:mb-6 overflow-hidden border border-white/20 dark:border-gray-700/30 transition-all duration-300"
          style={{
            minHeight: '300px'
          }}
        >
          {/* Animated background sparkles */}
          <div className="absolute inset-0">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
              />
            ))}
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -top-4 -right-16 w-24 h-24 bg-white/10 rounded-full blur-2xl z-0"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-3xl z-0"></div>
          
          {/* Decorative corner elements */}
          <div className="absolute top-4 sm:top-6 right-4 sm:right-6">
            <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6">
            <Gift className="h-8 w-8 sm:h-10 sm:w-10 text-white/40" />
          </div>
          
          {/* Additional decorative elements like in ProductCard */}
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-violet-400 rounded-full blur-xl"></div>
          </div>
          <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-violet-400 rounded-full blur-lg"></div>
          </div>
          
          {/* Brand name */}
          <div className="text-center mb-4 sm:mb-6">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <Star className="h-4 w-4 sm:h-5 sm:w-5 text-amber-300" />
              <h4 className="text-lg sm:text-xl font-bold text-white font-dosis">
                Twinkle Jingle
              </h4>
              <Star className="h-4 w-4 sm:h-5 sm:w-5 text-amber-300" />
            </div>
            <p className="text-xs sm:text-sm text-white/75 font-manrope">Premium eGift Card</p>
          </div>
          
          {/* Amount with enhanced styling */}
          <div className="text-center mb-4 sm:mb-6">
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 shadow-lg border border-white/20 dark:border-gray-700/30 inline-block">
              <span className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-amber-400">
                ${selectedAmount || '0'}
              </span>
            </div>
            <div className="text-sm sm:text-lg opacity-90 font-medium mt-2">
              Gift Card Value
            </div>
          </div>
          
          {/* Personal message inside card */}
          {personalMessage && (
            <div className="bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 text-center border border-white/10">
              <p className="text-xs sm:text-sm italic leading-relaxed">
                "{personalMessage}"
              </p>
            </div>
          )}
          
          {/* Recipient and sender info with better styling */}
          <div className="text-center space-y-2 sm:space-y-4">
            {!isForSelf && recipientName && (
              <div className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-violet-400 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 shadow-lg inline-block">
                <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                <span className="text-white text-xs sm:text-sm font-semibold">For: {recipientName}</span>
              </div>
            )}
            
            {senderName && (
              <div className="flex items-center space-x-1 sm:space-x-2 bg-white/15 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1 sm:py-1.5 inline-block border border-white/10">
                <Gift className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                <span className="text-white text-xs">From: {senderName}</span>
              </div>
            )}
          </div>
        </div>
        

      </div>
    </div>
  )
}

export default GiftCardPreview