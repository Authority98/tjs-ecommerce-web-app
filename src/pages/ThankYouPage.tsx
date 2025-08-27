import React, { useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'

import { CheckCircle, Gift, Calendar, Phone, Mail, Home, Sparkles, Star } from 'lucide-react'

const ThankYouPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const orderNumber = searchParams.get('orderNumber')
  const total = searchParams.get('total')
  const orderType = searchParams.get('orderType') // 'giftcard' or 'product'
  const category = searchParams.get('category') || ''
  const isGiftCard = orderType === 'giftcard'
  const isTreeOrder = category === 'trees'

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0)
  }, [])

  const floatingElements = [
    { image: '/assets/images/Vector-Smart-Object-1ss-1.png', delay: 0, x: '31%', y: '35%', size: 54 },
    { image: '/assets/images/Vector-Smart-Object1.png', delay: 0.5, x: '80%', y: '9%', size: 183 },
    { image: '/assets/images/Vector-Smart-Object-2.png', delay: 1.5, x: '2%', y: '75%', size: 100 },
    { image: '/assets/images/plush.png', delay: 1.2, x: '85%', y: '45%', size: 63 },
    { image: '/assets/images/Vector-Smart-Object-1ss-1.png', delay: 1.7, x: '40%', y: '80%', size: 54 },
    { image: '/assets/images/Vector-Smart-Object2-1-ss.png', delay: 0.3, x: '13%', y: '16%', size: 81 },
    { image: '/assets/images/sircle2.png', delay: 0.8, x: '80%', y: '67%', size: 66 },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating Background Elements */}
      {floatingElements.map((element, index) => (
        <div
          key={index}
          className="absolute transition-all duration-700 ease-in-out z-0"
          style={{ 
            left: element.x, 
            top: element.y,
            transform: element.image.includes('Vector-Smart-Object2-1-ss.png') ? 'rotate(256deg)' : 
                      element.image.includes('Vector-Smart-Object1.png') ? 'rotate(260deg)' : 
                      element.image.includes('plush.png') ? 'rotate(76deg)' : 
                      `rotate(${index * 45}deg)`
          }}
        >
          <img 
            src={element.image} 
            alt="Decorative element" 
            className="hover:filter hover:brightness-125 transition-all duration-300"
            style={{ 
              width: `${element.size}px`, 
              height: 'auto'
            }} 
          />
        </div>
      ))}

      <div className="max-w-4xl mx-auto px-4 py-16 relative z-20">
        <div className="text-center mb-12">
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full flex items-center justify-center shadow-2xl">
                <CheckCircle className="h-16 w-16 text-white" />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-400/20 to-fuchsia-400/20 rounded-full" />
            </div>
          </div>

        </div>

        {/* Order Details Card - Using Trees Category Design */}
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 rounded-3xl shadow-xl p-8 mb-12 border border-white/20 dark:border-gray-700/30 relative">
          {/* Decorative Elements */}
          <div className="absolute top-4 right-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-500 rounded-full blur-xl z-0 opacity-40"></div>
          </div>
          <div className="absolute bottom-4 left-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-500 rounded-full blur-lg z-0 opacity-40"></div>
          </div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 font-dosis">
              Order Confirmed
            </h2>
            <div className="inline-flex items-center space-x-3 bg-purple-50 dark:bg-purple-900/20 rounded-2xl px-6 py-3">
              <Gift className="h-6 w-6 text-violet-600 dark:text-violet-400" />
              <div className="text-left">
                <div className="text-sm text-gray-600 dark:text-gray-300">Order Number</div>
                <div className="text-xl font-bold text-violet-600 dark:text-violet-400">
                  {orderNumber || 'TJ-123456-ABC'}
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 font-dosis">
                Order Summary
              </h3>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                <span className="text-gray-700 dark:text-white font-medium">Total Amount</span>
                <span className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                  ${total || '299'}
                </span>
              </div>
              {/* Tree order pricing notice */}
              {isTreeOrder && (
                <div className="text-sm bg-amber-100/50 dark:bg-amber-900/30 p-3 rounded-xl text-amber-800 dark:text-amber-200 font-medium italic border border-amber-200/50 dark:border-amber-700/30">
                  We will send over a payment link to your email and phone, after determining the final price for your order
                </div>
              )}
              <div className="text-sm bg-purple-100/50 dark:bg-purple-900/30 p-3 rounded-xl text-gray-700 dark:text-white font-medium">
                A confirmation email has been sent to your inbox with all the details.
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 font-dosis">
                What's Next?
              </h3>
              <div className="space-y-3">
                {isGiftCard ? (
                  // Gift Card Flow
                  <>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-violet-600 dark:text-violet-400 text-sm font-bold">1</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 dark:text-white">Gift Card Processing</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Your gift card has been processed and sent to the recipient</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-violet-600 dark:text-violet-400 text-sm font-bold">2</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 dark:text-white">Digital Delivery</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Gift card details will be emailed to the recipient</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-violet-600 dark:text-violet-400 text-sm font-bold">3</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 dark:text-white">Ready to Redeem</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Recipient can use the gift card for any of our services</div>
                      </div>
                    </div>
                  </>
                ) : (
                  // Regular Product Flow
                  <>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-violet-600 dark:text-violet-400 text-sm font-bold">1</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 dark:text-white">Confirmation Call</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">We'll call you within 24 hours to confirm details</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-violet-600 dark:text-violet-400 text-sm font-bold">2</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 dark:text-white">Time Coordination</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Our team will contact you to arrange the specific timing for your service</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-violet-600 dark:text-violet-400 text-sm font-bold">3</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 dark:text-white">Professional Setup</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Our team will handle delivery and installation</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-violet-600 dark:text-violet-400 text-sm font-bold">4</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 dark:text-white">Enjoy the Magic</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Relax and enjoy your perfect Christmas setup</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>



        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 text-white font-semibold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <Gift className="h-5 w-5 mr-2" />
            Print Receipt
          </button>
        </div>


      </div>
    </div>
  )
}

export default ThankYouPage