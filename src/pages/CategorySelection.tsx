import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { CATEGORY_CONFIGS } from '../utils/categories'
import './CategorySelection.css'

const CategorySelection: React.FC = () => {

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
            style={{ 
              width: `${element.size}px`, 
              height: 'auto' 
            }} 
          />
        </div>
      ))}

      {/* Categories Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-white mb-6" style={{fontFamily: 'Dancing Script', fontWeight: 500, fontSize: '30px', lineHeight: '39px', color: '#d9a66c'}}>
              Hello There!
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-dosis">
              Select Your Category
            </h2>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Choose from our premium collection to create your perfect holiday experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {CATEGORY_CONFIGS.map((category, index) => (
              <div
                key={category.id}
                className="group"
              >
                <Link to={category.id === 'gift-card' ? '/gift-cards' : category.id === 'events' ? '/events' : `/products/${category.id}`}>
                  <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${category.bgGradient} shadow-xl border border-white/20 dark:border-gray-700/30 h-full bg-opacity-95 backdrop-blur-sm`}>
                    {/* Icon Container */}
                    <div className="relative p-8 text-center">
                      <div className="mx-auto mb-6 relative flex items-center justify-center">
                        <div className={`w-24 h-24 ${category.iconBg} rounded-3xl flex items-center justify-center shadow-lg`}>
                          <category.icon className="h-12 w-12 text-white" />
                        </div>
                        
                        {/* Floating sparkles around icon */}
                        <div className="absolute -top-2 -right-2">
                          <Sparkles className="h-6 w-6 text-yellow-400" />
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 font-dosis">
                        {category.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8 px-2">
                        {category.description}
                      </p>
                      
                      {/* CTA Button */}
                      <div className={`inline-flex items-center px-8 py-4 bg-gradient-to-r ${category.gradient} text-white font-semibold rounded-2xl shadow-lg`}>
                        <span>Explore Collection</span>
                        <span className="ml-2">→</span>
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-4 right-4 -z-10">
                      <div className={`w-16 h-16 bg-gradient-to-r ${category.gradient} rounded-full blur-xl opacity-40`} />
                    </div>
                    <div className="absolute bottom-4 left-4 -z-10">
                      <div className={`w-12 h-12 bg-gradient-to-r ${category.gradient} rounded-full blur-lg opacity-40`} />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default CategorySelection