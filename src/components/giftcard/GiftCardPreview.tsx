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
        {/* Header with floating elements */}
        <div className="relative mb-8">
          <div className="absolute -top-2 -right-2 text-pink-400">
            <Heart className="h-6 w-6" />
          </div>
          <div className="absolute -top-1 -left-1 text-yellow-400">
            <Star className="h-5 w-5" />
          </div>
          
        </div>
        
        {/* Enhanced Gift Card */}
        <div
          className="relative bg-gradient-to-br from-pink-400 via-purple-500 to-violet-600 rounded-3xl p-10 text-white shadow-2xl mb-6 overflow-hidden"
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
          
          {/* Decorative corner elements */}
          <div className="absolute top-6 right-6">
            <Sparkles className="h-8 w-8 text-yellow-300" />
          </div>
          <div className="absolute bottom-6 left-6">
            <Gift className="h-10 w-10 text-white/40" />
          </div>
          
          {/* Brand name */}
          <div className="text-center mb-6">
            <h4 className="text-xl font-bold opacity-90">
              🎄 Twinkle Jingle
            </h4>
            <p className="text-sm opacity-75">Premium eGift Card</p>
          </div>
          
          {/* Amount with enhanced styling */}
          <div className="text-center mb-6">
            <div className="text-5xl font-bold mb-2 drop-shadow-lg">
              ${selectedAmount || '0'}
            </div>
            <div className="text-lg opacity-90 font-medium">
              Gift Card Value
            </div>
          </div>
          
          {/* Personal message inside card */}
          {personalMessage && (
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-4 text-center">
              <p className="text-sm italic leading-relaxed">
                "{personalMessage}"
              </p>
            </div>
          )}
          
          {/* Recipient and sender info with better styling */}
          <div className="text-center space-y-4">
            {!isForSelf && recipientName && (
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
                <span className="text-sm font-medium">💝 For: {recipientName}</span>
              </div>
            )}
            
            {senderName && (
              <div className="bg-white/15 backdrop-blur-sm rounded-full px-4 py-1 inline-block">
                <span className="text-xs opacity-90">💌 From: {senderName}</span>
              </div>
            )}
          </div>
        </div>
        

      </div>
    </div>
  )
}

export default GiftCardPreview