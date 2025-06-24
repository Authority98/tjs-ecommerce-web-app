import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TreePine, Sparkles, Ribbon, Star, Gift, Heart } from 'lucide-react'

const CategorySelection: React.FC = () => {
  const categories = [
    {
      id: 'trees',
      title: 'Christmas Trees',
      description: 'Premium Christmas trees with professional decoration services and custom styling options',
      icon: TreePine,
      gradient: 'from-emerald-600 via-green-600 to-forest-500',
      bgGradient: 'from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20',
      accent: 'emerald',
      iconBg: 'bg-emerald-500',
      hoverShadow: 'hover:shadow-emerald-500/25'
    },
    {
      id: 'decorations',
      title: 'Christmas Decorations',
      description: 'Exquisite ornaments and magical decorative pieces to transform your space into a winter wonderland',
      icon: Sparkles,
      gradient: 'from-red-500 via-pink-500 to-rose-400',
      bgGradient: 'from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20',
      accent: 'red',
      iconBg: 'bg-red-500',
      hoverShadow: 'hover:shadow-red-500/25'
    },
    {
      id: 'ribbons',
      title: 'Premium Ribbons',
      description: 'Luxurious ribbons and elegant bows crafted to add the perfect finishing touch to your holiday décor',
      icon: Ribbon,
      gradient: 'from-purple-500 via-violet-500 to-indigo-400',
      bgGradient: 'from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20',
      accent: 'purple',
      iconBg: 'bg-purple-500',
      hoverShadow: 'hover:shadow-purple-500/25'
    }
  ]

  const floatingElements = [
    { icon: Star, delay: 0, x: '10%', y: '20%' },
    { icon: Gift, delay: 0.5, x: '80%', y: '15%' },
    { icon: Heart, delay: 1, x: '15%', y: '70%' },
    { icon: Sparkles, delay: 1.5, x: '85%', y: '75%' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-950 relative overflow-hidden">
      {/* Floating Background Elements */}
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute opacity-10 dark:opacity-5"
          style={{ left: element.x, top: element.y }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 4,
            delay: element.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <element.icon className="h-16 w-16 text-emerald-600" />
        </motion.div>
      ))}

      {/* Categories Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
              Select Your Category
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose from our premium collection to create your perfect holiday experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 * index }}
                whileHover={{ y: -12, scale: 1.02 }}
                className="group"
              >
                <Link to={`/products/${category.id}`}>
                  <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${category.bgGradient} shadow-xl group-hover:shadow-2xl ${category.hoverShadow} transition-all duration-700 border border-white/20 dark:border-gray-700/30 h-full`}>
                    {/* Icon Container */}
                    <div className="relative p-8 text-center">
                      <motion.div
                        className="mx-auto mb-6 relative flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        <div className={`w-24 h-24 ${category.iconBg} rounded-3xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-500`}>
                          <category.icon className="h-12 w-12 text-white" />
                        </div>
                        
                        {/* Floating sparkles around icon */}
                        <motion.div
                          className="absolute -top-2 -right-2"
                          animate={{ 
                            rotate: [0, 360],
                            scale: [1, 1.2, 1]
                          }}
                          transition={{ 
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <Sparkles className="h-6 w-6 text-yellow-400" />
                        </motion.div>
                      </motion.div>
                      
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {category.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8 px-2">
                        {category.description}
                      </p>
                      
                      {/* CTA Button */}
                      <motion.div
                        className={`inline-flex items-center px-8 py-4 bg-gradient-to-r ${category.gradient} text-white font-semibold rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>Explore Collection</span>
                        <motion.span
                          className="ml-2"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </motion.div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity">
                      <div className={`w-16 h-16 bg-gradient-to-r ${category.gradient} rounded-full blur-xl`} />
                    </div>
                    <div className="absolute bottom-4 left-4 opacity-20 group-hover:opacity-40 transition-opacity">
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