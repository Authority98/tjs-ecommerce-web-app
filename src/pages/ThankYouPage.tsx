import React, { useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'

import { CheckCircle, Gift, Calendar, Phone, Mail, Home, Sparkles, Star } from 'lucide-react'

const ThankYouPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const orderNumber = searchParams.get('orderNumber')
  const total = searchParams.get('total')
  const orderType = searchParams.get('orderType') // 'giftcard' or 'product'
  const isGiftCard = orderType === 'giftcard'

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0)
  }, [])

  const floatingElements = [
    { icon: Star, delay: 0, x: '10%', y: '20%' },
    { icon: Sparkles, delay: 0.5, x: '85%', y: '15%' },
    { icon: Gift, delay: 1, x: '15%', y: '75%' },
    { icon: CheckCircle, delay: 1.5, x: '80%', y: '80%' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-100 dark:from-purple-900 dark:via-violet-800 dark:to-fuchsia-900 relative overflow-hidden">
      {/* Floating Background Elements */}
      {floatingElements.map((element, index) => (
        <div
          key={index}
          className="absolute opacity-10 dark:opacity-5 pointer-events-none"
          style={{ left: element.x, top: element.y }}
        >
          <element.icon className="h-12 w-12 text-purple-600 dark:text-amber-400" />
        </div>
      ))}

      {/* Success Confetti Effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-fuchsia-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 relative z-10">
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

        {/* Order Details Card */}
        <div className="bg-white/80 dark:bg-purple-950/20 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-12 border border-white/20 dark:border-gray-700/30">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 font-dosis">
              Order Confirmed
            </h2>
            <div className="inline-flex items-center space-x-3 bg-purple-50 dark:bg-purple-900/20 rounded-2xl px-6 py-3">
              <Gift className="h-6 w-6 text-purple-600 dark:text-amber-400" />
              <div className="text-left">
                <div className="text-sm text-gray-600 dark:text-gray-300">Order Number</div>
                <div className="text-xl font-bold text-purple-600 dark:text-amber-400">
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
                <span className="text-gray-600 dark:text-gray-300">Total Amount</span>
                <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  ${total || '299'}
                </span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
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
                      <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-purple-600 dark:text-amber-400 text-sm font-bold">1</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 dark:text-white">Gift Card Processing</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Your gift card has been processed and sent to the recipient</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-purple-600 dark:text-amber-400 text-sm font-bold">2</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 dark:text-white">Digital Delivery</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Gift card details will be emailed to the recipient</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-purple-600 dark:text-amber-400 text-sm font-bold">3</span>
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
                      <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-purple-600 dark:text-amber-400 text-sm font-bold">1</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 dark:text-white">Confirmation Call</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">We'll call you within 24 hours to confirm details</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-purple-600 dark:text-amber-400 text-sm font-bold">2</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 dark:text-white">Professional Setup</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Our team will handle delivery and installation</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-purple-600 dark:text-amber-400 text-sm font-bold">3</span>
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

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 rounded-3xl p-8 mb-12 border border-purple-200/50 dark:border-purple-700/30">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center font-dosis">
            Need Help? We're Here for You
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <Phone className="h-6 w-6 text-purple-600 dark:text-amber-400" />
              </div>
              <div className="font-semibold text-gray-800 dark:text-white">Call Us</div>
              <div className="text-gray-600 dark:text-gray-300">(555) 123-4567</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="h-6 w-6 text-purple-600 dark:text-amber-400" />
              </div>
              <div className="font-semibold text-gray-800 dark:text-white">Email Us</div>
              <div className="text-gray-600 dark:text-gray-300">support@twinklejingle.com</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="h-6 w-6 text-purple-600 dark:text-amber-400" />
              </div>
              <div className="font-semibold text-gray-800 dark:text-white">Business Hours</div>
              <div className="text-gray-600 dark:text-gray-300">Mon-Fri: 9AM-6PM</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold text-lg rounded-2xl shadow-lg"
          >
            <Home className="h-5 w-5 mr-2" />
            Continue Shopping
          </Link>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-800 dark:text-white font-semibold text-lg rounded-2xl border-2 border-gray-300 dark:border-gray-500 shadow-lg"
          >
            <Gift className="h-5 w-5 mr-2" />
            Print Receipt
          </button>
        </div>

        {/* Social Sharing */}
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Share your Christmas joy with friends and family!
          </p>
          <div className="flex justify-center space-x-4">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <div className="w-2 h-2 bg-purple-500 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThankYouPage