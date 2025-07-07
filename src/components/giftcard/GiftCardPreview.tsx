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
    <div className="sticky top-8">
      <div className="p-8 min-h-[600px]">
        {/* Header */}
        <div className="relative mb-8">
          {/* Removed floating elements as they're now in the main page */}
        </div>
        
        {/* Enhanced Gift Card */}
        <div
          className="relative bg-gradient-to-br from-purple-500 via-fuchsia-500 to-violet-400 backdrop-blur-xl rounded-3xl p-10 text-white shadow-2xl mb-6 overflow-hidden border border-white/20 dark:border-gray-700/30 transition-all duration-300"
          style={{
            minHeight: '400px'
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
          <div className="absolute top-6 right-6">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <div className="absolute bottom-6 left-6">
            <Gift className="h-10 w-10 text-white/40" />
          </div>
          
          {/* Additional decorative elements like in ProductCard */}
          <div className="absolute top-4 right-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-violet-400 rounded-full blur-xl"></div>
          </div>
          <div className="absolute bottom-4 left-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-violet-400 rounded-full blur-lg"></div>
          </div>
          
          {/* Brand name */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <Star className="h-5 w-5 text-amber-300" />
              <h4 className="text-xl font-bold text-white font-dosis">
                Twinkle Jingle
              </h4>
              <Star className="h-5 w-5 text-amber-300" />
            </div>
            <p className="text-sm text-white/75 font-manrope">Premium eGift Card</p>
          </div>
          
          {/* Amount with enhanced styling */}
          <div className="text-center mb-6">
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl px-4 py-2 shadow-lg border border-white/20 dark:border-gray-700/30 inline-block">
              <span className="text-3xl font-bold text-purple-600 dark:text-amber-400">
                ${selectedAmount || '0'}
              </span>
            </div>
            <div className="text-lg opacity-90 font-medium mt-2">
              Gift Card Value
            </div>
          </div>
          
          {/* Personal message inside card */}
          {personalMessage && (
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4 text-center border border-white/10">
              <p className="text-sm italic leading-relaxed">
                "{personalMessage}"
              </p>
            </div>
          )}
          
          {/* Recipient and sender info with better styling */}
          <div className="text-center space-y-4">
            {!isForSelf && recipientName && (
              <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-violet-400 rounded-full px-3 py-1.5 shadow-lg inline-block">
                <Heart className="h-4 w-4 text-white" />
                <span className="text-white text-sm font-semibold">For: {recipientName}</span>
              </div>
            )}
            
            {senderName && (
              <div className="flex items-center space-x-2 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5 inline-block border border-white/10">
                <Gift className="h-4 w-4 text-white" />
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