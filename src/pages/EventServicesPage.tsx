import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, DollarSign, Info } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface EventService {
  id: string
  name: string
  description: string
  starting_price: number
  price_type: 'starting_from' | 'fixed' | 'upon_request' | 'custom_quotation'
  display_order: number
  is_active: boolean
}

interface EventCategory {
  id: string
  name: string
  description: string
}

const EventServicesPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>()
  const navigate = useNavigate()
  const [services, setServices] = useState<EventService[]>([])
  const [category, setCategory] = useState<EventCategory | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (categoryId) {
      fetchCategoryAndServices(categoryId)
    }
  }, [categoryId])

  const fetchCategoryAndServices = async (catId: string) => {
    try {
      // Fetch category details
      const { data: categoryData, error: categoryError } = await supabase
        .from('events_categories')
        .select('*')
        .eq('id', catId)
        .single()

      // Fetch services for this category
      const { data: servicesData, error: servicesError } = await supabase
        .from('events_services')
        .select('*')
        .eq('category_id', catId)
        .eq('is_active', true)
        .order('display_order')

      if (categoryError || servicesError) {
        console.error('Error fetching data:', categoryError || servicesError)
        // Fallback to hardcoded data
        setFallbackData(catId)
      } else {
        setCategory(categoryData)
        setServices(servicesData || [])
      }
    } catch (error) {
      console.error('Error:', error)
      setFallbackData(catId)
    } finally {
      setLoading(false)
    }
  }

  const setFallbackData = (catId: string) => {
    const fallbackCategories = {
      '1': {
        id: '1',
        name: 'Personal Celebrations',
        description: 'Birthday parties, baby showers, engagements, weddings, anniversaries and family gatherings'
      },
      '2': {
        id: '2',
        name: 'Corporate & Commercial',
        description: 'Corporate dinners, product launches, festive office décor, and retail installations'
      },
      '3': {
        id: '3',
        name: 'Festive & Seasonal Décor',
        description: 'Christmas décor, lunar new year styling, themed seasonal events'
      },
      '4': {
        id: '4',
        name: 'Add-On Services',
        description: 'Event planning, venue sourcing, entertainment, and logistics management'
      }
    }

    const fallbackServices = {
      '1': [
        { id: '1', name: 'Birthday Parties', description: 'Custom birthday party decorations and setup', starting_price: 800, price_type: 'starting_from' as const, display_order: 1, is_active: true },
        { id: '2', name: 'Baby Showers & Gender Reveals', description: 'Beautiful baby shower and gender reveal decorations', starting_price: 1200, price_type: 'starting_from' as const, display_order: 2, is_active: true },
        { id: '3', name: 'Engagements & Weddings', description: 'Elegant engagement and wedding decoration services', starting_price: 3500, price_type: 'starting_from' as const, display_order: 3, is_active: true },
        { id: '4', name: 'Anniversaries & Family Gatherings', description: 'Special anniversary and family celebration décor', starting_price: 1000, price_type: 'starting_from' as const, display_order: 4, is_active: true }
      ],
      '2': [
        { id: '5', name: 'Corporate Dinners & Galas', description: 'Professional corporate event decorations', starting_price: 5000, price_type: 'starting_from' as const, display_order: 1, is_active: true },
        { id: '6', name: 'Product Launches & Brand Activations', description: 'Brand-focused launch event styling', starting_price: 4500, price_type: 'starting_from' as const, display_order: 2, is_active: true },
        { id: '7', name: 'Festive Office Décor', description: 'Seasonal office decoration services', starting_price: 2500, price_type: 'starting_from' as const, display_order: 3, is_active: true },
        { id: '8', name: 'Retail & Mall Installations', description: 'Large-scale retail decoration projects', starting_price: 0, price_type: 'upon_request' as const, display_order: 4, is_active: true }
      ],
      '3': [
        { id: '9', name: 'Christmas Décor (Office / Mall / Home)', description: 'Comprehensive Christmas decoration services', starting_price: 3000, price_type: 'starting_from' as const, display_order: 1, is_active: true },
        { id: '10', name: 'Lunar New Year / Deepavali / Hari Raya Styling', description: 'Traditional festival decoration services', starting_price: 2800, price_type: 'starting_from' as const, display_order: 2, is_active: true },
        { id: '11', name: 'Themed Seasonal Events', description: 'Custom themed seasonal event decorations', starting_price: 0, price_type: 'upon_request' as const, display_order: 3, is_active: true }
      ],
      '4': [
        { id: '12', name: 'Event Planning & Coordination', description: 'Full event planning and coordination services', starting_price: 1500, price_type: 'starting_from' as const, display_order: 1, is_active: true },
        { id: '13', name: 'Venue Sourcing & Styling', description: 'Venue finding and styling services', starting_price: 0, price_type: 'upon_request' as const, display_order: 2, is_active: true },
        { id: '14', name: 'Entertainment, Performers & Emcees', description: 'Entertainment and performance coordination', starting_price: 0, price_type: 'upon_request' as const, display_order: 3, is_active: true },
        { id: '15', name: 'Logistics & Project Management', description: 'Complete event logistics management', starting_price: 0, price_type: 'custom_quotation' as const, display_order: 4, is_active: true }
      ]
    }

    setCategory(fallbackCategories[catId as keyof typeof fallbackCategories] || null)
    setServices(fallbackServices[catId as keyof typeof fallbackServices] || [])
  }

  const formatPrice = (service: EventService) => {
    switch (service.price_type) {
      case 'starting_from':
        return `From $${service.starting_price.toLocaleString()}`
      case 'fixed':
        return `$${service.starting_price.toLocaleString()}`
      case 'upon_request':
        return 'Price upon request'
      case 'custom_quotation':
        return 'Custom quotation'
      default:
        return 'Contact us'
    }
  }

  const handleServiceSelect = (service: EventService) => {
    // Navigate to checkout or contact form with service details
    navigate('/checkout', {
      state: {
        eventService: {
          id: service.id,
          name: service.name,
          description: service.description,
          price: service.starting_price,
          priceType: service.price_type,
          category: category?.name
        }
      }
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Category not found</h2>
          <Link to="/events" className="text-emerald-400 hover:text-emerald-300">
            Back to Events
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Back Button */}
      <div className="absolute top-8 left-8 z-20">
        <Link 
          to="/events" 
          className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20 transition-all duration-200"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Event Types
        </Link>
      </div>

      {/* Services Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-white mb-6" style={{fontFamily: 'Dancing Script', fontWeight: 500, fontSize: '30px', lineHeight: '39px', color: '#d9a66c'}}>
              {category.name}
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-dosis">
              Our Services
            </h2>
            <p className="text-xl text-white max-w-3xl mx-auto">
              {category.description}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="group cursor-pointer"
                onClick={() => handleServiceSelect(service)}
              >
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm shadow-xl border border-white/20 h-full hover:scale-105 transition-all duration-300">
                  {/* Service Card Content */}
                  <div className="relative p-8">
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                        <Calendar className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-4 font-dosis">
                      {service.name}
                    </h3>
                    
                    <p className="text-gray-300 leading-relaxed mb-6 text-sm">
                      {service.description}
                    </p>
                    
                    {/* Price */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center text-emerald-400">
                        <DollarSign className="h-5 w-5 mr-1" />
                        <span className="font-semibold">{formatPrice(service)}</span>
                      </div>
                    </div>
                    
                    {/* CTA Button */}
                    <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg w-full justify-center">
                      <span>Select Service</span>
                      <span className="ml-2">→</span>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4 -z-10">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur-xl opacity-40" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-16 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                <Info className="h-6 w-6 text-emerald-400 mr-2" />
                <h3 className="text-xl font-bold text-white">Package Information</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Every package includes consultation, customized design proposal, set-up, and teardown. 
                Final costs depend on venue, scale, and customization requirements.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default EventServicesPage