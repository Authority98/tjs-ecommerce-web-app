import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, Gift, Heart, Sparkles } from 'lucide-react'
import { CATEGORY_CONFIGS } from '../utils/categories'

const CategorySelection: React.FC = () => {

  const floatingElements = [
    { icon: Star, delay: 0, x: '10%', y: '20%' },
    { icon: Gift, delay: 0.5, x: '80%', y: '15%' },
    { icon: Heart, delay: 1, x: '15%', y: '70%' },
    { icon: Sparkles, delay: 1.5, x: '85%', y: '75%' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-tl from-purple-50 via-violet-100 to-fuchsia-200 dark:from-purple-900 dark:via-violet-700 dark:to-purple-800 relative overflow-hidden">
      {/* Floating Background Elements */}
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute opacity-10 dark:opacity-5"
          style={{ left: element.x, top: element.y }}
          animate={{
            y: [0, -4, 0],
            rotate: [0, 2, -2, 0],
          }}
          transition={{
            duration: 0.8,
            delay: element.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <element.icon className="h-16 w-16 text-[#F7B541]" />
        </motion.div>
      ))}

      {/* Categories Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.08, delay: 0.02 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 font-dosis">
              Select Your Category
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose from our premium collection to create your perfect holiday experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {CATEGORY_CONFIGS.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.06, delay: 0.02 * index }}
                whileHover={{ y: -0.4, scale: 1.001, transition: { duration: 0 } }}
                className="group"
              >
                <Link to={category.id === 'gift-card' ? '/gift-cards' : `/products/${category.id}`}>
                  <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${category.bgGradient} shadow-xl group-hover:shadow-2xl ${category.hoverShadow} transition-all duration-20 border border-white/20 dark:border-gray-700/30 h-full`}>
                    {/* Icon Container */}
                    <div className="relative p-8 text-center">
                      <motion.div
                        className="mx-auto mb-6 relative flex items-center justify-center"
                        whileHover={{ scale: 1.002 }}
                        transition={{ duration: 0.02 }}
                      >
                        <div className={`w-24 h-24 ${category.iconBg} rounded-3xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-20`}>
                          <category.icon className="h-12 w-12 text-white" />
                        </div>
                        
                        {/* Floating sparkles around icon */}
                        <motion.div
                          className="absolute -top-2 -right-2"
                          animate={{ 
                            rotate: [0, 72],
                            scale: [1, 1.04, 1]
                          }}
                          transition={{ 
                            duration: 0.6,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <Sparkles className="h-6 w-6 text-yellow-400" />
                        </motion.div>
                      </motion.div>
                      
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 group-hover:text-purple-600 dark:group-hover:text-amber-400 transition-colors duration-20 font-dosis">
                        {category.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8 px-2">
                        {category.description}
                      </p>
                      
                      {/* CTA Button */}
                      <motion.div
                        className={`inline-flex items-center px-8 py-4 bg-gradient-to-r ${category.gradient} text-white font-semibold rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-20`}
              whileHover={{ scale: 1.001 }}
              whileTap={{ scale: 0.998 }}
                      >
                        <span>Explore Collection</span>
                        <motion.span
                          className="ml-2"
                          animate={{ x: [0, 1, 0] }}
                          transition={{ duration: 0.3, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </motion.div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-20">
                      <div className={`w-16 h-16 bg-gradient-to-r ${category.gradient} rounded-full blur-xl`} />
                    </div>
                    <div className="absolute bottom-4 left-4 opacity-20 group-hover:opacity-40 transition-opacity duration-20">
                      <div className={`w-12 h-12 bg-gradient-to-r ${category.gradient} rounded-full blur-lg`} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default CategorySelection