import React from 'react'
import { motion } from 'framer-motion'
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
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 min-h-[600px]"
      >
        {/* Header with floating elements */}
        <div className="relative mb-8">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-2 -right-2 text-pink-400"
          >
            <Heart className="h-6 w-6" />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-1 -left-1 text-yellow-400"
          >
            <Star className="h-5 w-5" />
          </motion.div>
          
        </div>
        
        {/* Enhanced Gift Card */}
        <motion.div
          whileHover={{
            rotateY: 8,
            rotateX: 5,
            z: 60,
            scale: 1.05,
            boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)'
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="relative bg-gradient-to-br from-pink-400 via-purple-500 to-violet-600 rounded-3xl p-10 text-white shadow-2xl mb-6 overflow-hidden"
          style={{
            transformStyle: 'preserve-3d',
            perspective: '1000px',
            minHeight: '400px'
          }}
        >
          {/* Animated background sparkles */}
          <div className="absolute inset-0">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0]
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  delay: Math.random() * 3,
                  repeat: Infinity
                }}
              />
            ))}
          </div>
          
          {/* Decorative corner elements */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-6 right-6"
          >
            <Sparkles className="h-8 w-8 text-yellow-300" />
          </motion.div>
          <motion.div
            animate={{ 
              rotate: [0, 15, -15, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-6 left-6"
          >
            <Gift className="h-10 w-10 text-white/40" />
          </motion.div>
          
          {/* Brand name */}
          <div className="text-center mb-6">
            <motion.h4
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-xl font-bold opacity-90"
            >
              🎄 Twinkle Jingle
            </motion.h4>
            <p className="text-sm opacity-75">Premium eGift Card</p>
          </div>
          
          {/* Amount with enhanced styling */}
          <motion.div
            key={selectedAmount}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center mb-6"
          >
            <div className="text-5xl font-bold mb-2 drop-shadow-lg">
              ${selectedAmount || '0'}
            </div>
            <div className="text-lg opacity-90 font-medium">
              Gift Card Value
            </div>
          </motion.div>
          
          {/* Personal message inside card */}
          {personalMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-4 text-center"
            >
              <p className="text-sm italic leading-relaxed">
                "{personalMessage}"
              </p>
            </motion.div>
          )}
          
          {/* Recipient and sender info with better styling */}
          <div className="text-center space-y-4">
            {!isForSelf && recipientName && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-block"
              >
                <span className="text-sm font-medium">💝 For: {recipientName}</span>
              </motion.div>
            )}
            
            {senderName && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/15 backdrop-blur-sm rounded-full px-4 py-1 inline-block"
              >
                <span className="text-xs opacity-90">💌 From: {senderName}</span>
              </motion.div>
            )}
          </div>
        </motion.div>
        

      </motion.div>
    </div>
  )
}

export default GiftCardPreview