import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Save, X, Calendar, DollarSign } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import Button from '../ui/Button'

interface EventCategory {
  id: string
  name: string
  description: string
  display_order: number
  is_active: boolean
}

interface EventService {
  id: string
  category_id: string
  name: string
  description: string
  starting_price: number
  price_type: 'starting_from' | 'fixed' | 'upon_request' | 'custom_quotation'
  display_order: number
  is_active: boolean
}

const EventsManager: React.FC = () => {
  const [categories, setCategories] = useState<EventCategory[]>([])
  const [services, setServices] = useState<EventService[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [editingService, setEditingService] = useState<EventService | null>(null)
  const [showServiceForm, setShowServiceForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    starting_price: 0,
    price_type: 'starting_from' as const,
    display_order: 1
  })

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (selectedCategory) {
      fetchServices(selectedCategory)
    }
  }, [selectedCategory])

  const fetchData = async () => {
    try {
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('events_categories')
        .select('*')
        .order('display_order')

      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError)
        // Use fallback data
        setCategories([
          { id: '1', name: 'Personal Celebrations', description: 'Birthday parties, baby showers, engagements, weddings, anniversaries and family gatherings', display_order: 1, is_active: true },
          { id: '2', name: 'Corporate & Commercial', description: 'Corporate dinners, product launches, festive office décor, and retail installations', display_order: 2, is_active: true },
          { id: '3', name: 'Festive & Seasonal Décor', description: 'Christmas décor, lunar new year styling, themed seasonal events', display_order: 3, is_active: true },
          { id: '4', name: 'Add-On Services', description: 'Event planning, venue sourcing, entertainment, and logistics management', display_order: 4, is_active: true }
        ])
      } else {
        setCategories(categoriesData || [])
      }

      // Set first category as selected if none selected
      if (!selectedCategory && (categoriesData?.length || 4) > 0) {
        setSelectedCategory(categoriesData?.[0]?.id || '1')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchServices = async (categoryId: string) => {
    try {
      const { data: servicesData, error: servicesError } = await supabase
        .from('events_services')
        .select('*')
        .eq('category_id', categoryId)
        .order('display_order')

      if (servicesError) {
        console.error('Error fetching services:', servicesError)
        // Use fallback data based on category
        const fallbackServices = getFallbackServices(categoryId)
        setServices(fallbackServices)
      } else {
        setServices(servicesData || [])
      }
    } catch (error) {
      console.error('Error:', error)
      const fallbackServices = getFallbackServices(categoryId)
      setServices(fallbackServices)
    }
  }

  const getFallbackServices = (categoryId: string): EventService[] => {
    const fallbackData: Record<string, EventService[]> = {
      '1': [
        { id: '1', category_id: '1', name: 'Birthday Parties', description: 'Custom birthday party decorations and setup', starting_price: 800, price_type: 'starting_from', display_order: 1, is_active: true },
        { id: '2', category_id: '1', name: 'Baby Showers & Gender Reveals', description: 'Beautiful baby shower and gender reveal decorations', starting_price: 1200, price_type: 'starting_from', display_order: 2, is_active: true },
        { id: '3', category_id: '1', name: 'Engagements & Weddings', description: 'Elegant engagement and wedding decoration services', starting_price: 3500, price_type: 'starting_from', display_order: 3, is_active: true },
        { id: '4', category_id: '1', name: 'Anniversaries & Family Gatherings', description: 'Special anniversary and family celebration décor', starting_price: 1000, price_type: 'starting_from', display_order: 4, is_active: true }
      ],
      '2': [
        { id: '5', category_id: '2', name: 'Corporate Dinners & Galas', description: 'Professional corporate event decorations', starting_price: 5000, price_type: 'starting_from', display_order: 1, is_active: true },
        { id: '6', category_id: '2', name: 'Product Launches & Brand Activations', description: 'Brand-focused launch event styling', starting_price: 4500, price_type: 'starting_from', display_order: 2, is_active: true },
        { id: '7', category_id: '2', name: 'Festive Office Décor', description: 'Seasonal office decoration services', starting_price: 2500, price_type: 'starting_from', display_order: 3, is_active: true },
        { id: '8', category_id: '2', name: 'Retail & Mall Installations', description: 'Large-scale retail decoration projects', starting_price: 0, price_type: 'upon_request', display_order: 4, is_active: true }
      ],
      '3': [
        { id: '9', category_id: '3', name: 'Christmas Décor (Office / Mall / Home)', description: 'Comprehensive Christmas decoration services', starting_price: 3000, price_type: 'starting_from', display_order: 1, is_active: true },
        { id: '10', category_id: '3', name: 'Lunar New Year / Deepavali / Hari Raya Styling', description: 'Traditional festival decoration services', starting_price: 2800, price_type: 'starting_from', display_order: 2, is_active: true },
        { id: '11', category_id: '3', name: 'Themed Seasonal Events', description: 'Custom themed seasonal event decorations', starting_price: 0, price_type: 'upon_request', display_order: 3, is_active: true }
      ],
      '4': [
        { id: '12', category_id: '4', name: 'Event Planning & Coordination', description: 'Full event planning and coordination services', starting_price: 1500, price_type: 'starting_from', display_order: 1, is_active: true },
        { id: '13', category_id: '4', name: 'Venue Sourcing & Styling', description: 'Venue finding and styling services', starting_price: 0, price_type: 'upon_request', display_order: 2, is_active: true },
        { id: '14', category_id: '4', name: 'Entertainment, Performers & Emcees', description: 'Entertainment and performance coordination', starting_price: 0, price_type: 'upon_request', display_order: 3, is_active: true },
        { id: '15', category_id: '4', name: 'Logistics & Project Management', description: 'Complete event logistics management', starting_price: 0, price_type: 'custom_quotation', display_order: 4, is_active: true }
      ]
    }
    return fallbackData[categoryId] || []
  }

  const handleAddService = () => {
    setEditingService(null)
    setFormData({
      name: '',
      description: '',
      starting_price: 0,
      price_type: 'starting_from',
      display_order: services.length + 1
    })
    setShowServiceForm(true)
  }

  const handleEditService = (service: EventService) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      description: service.description,
      starting_price: service.starting_price,
      price_type: service.price_type,
      display_order: service.display_order
    })
    setShowServiceForm(true)
  }

  const handleSaveService = async () => {
    try {
      if (editingService) {
        // Update existing service
        const { error } = await supabase
          .from('events_services')
          .update({
            name: formData.name,
            description: formData.description,
            starting_price: formData.starting_price,
            price_type: formData.price_type,
            display_order: formData.display_order
          })
          .eq('id', editingService.id)

        if (error) throw error
      } else {
        // Create new service
        const { error } = await supabase
          .from('events_services')
          .insert({
            category_id: selectedCategory,
            name: formData.name,
            description: formData.description,
            starting_price: formData.starting_price,
            price_type: formData.price_type,
            display_order: formData.display_order,
            is_active: true
          })

        if (error) throw error
      }

      // Refresh services
      await fetchServices(selectedCategory)
      setShowServiceForm(false)
      setEditingService(null)
    } catch (error) {
      console.error('Error saving service:', error)
      alert('Failed to save service. Please try again.')
    }
  }

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    try {
      const { error } = await supabase
        .from('events_services')
        .delete()
        .eq('id', serviceId)

      if (error) throw error

      // Refresh services
      await fetchServices(selectedCategory)
    } catch (error) {
      console.error('Error deleting service:', error)
      alert('Failed to delete service. Please try again.')
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Event Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-4 rounded-xl text-left transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <h4 className="font-semibold mb-2">{category.name}</h4>
              <p className="text-sm opacity-80">{category.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Services Management */}
      {selectedCategory && (
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">
              Services for {categories.find(c => c.id === selectedCategory)?.name}
            </h3>
            <Button
              icon={Plus}
              onClick={handleAddService}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              Add Service
            </Button>
          </div>

          {/* Services Grid */}
          <div className="grid gap-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white/10 rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="h-5 w-5 text-emerald-400" />
                    <h4 className="font-semibold text-white">{service.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      service.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {service.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{service.description}</p>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium">{formatPrice(service)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditService(service)}
                    className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Service Form Modal */}
      {showServiceForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button
                onClick={() => setShowServiceForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter service name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter service description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Type
                </label>
                <select
                  value={formData.price_type}
                  onChange={(e) => setFormData({ ...formData, price_type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="starting_from">Starting From</option>
                  <option value="fixed">Fixed Price</option>
                  <option value="upon_request">Price Upon Request</option>
                  <option value="custom_quotation">Custom Quotation</option>
                </select>
              </div>

              {(formData.price_type === 'starting_from' || formData.price_type === 'fixed') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={formData.starting_price}
                    onChange={(e) => setFormData({ ...formData, starting_price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter price"
                    min="0"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter display order"
                  min="1"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleSaveService}
                icon={Save}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600"
              >
                {editingService ? 'Update' : 'Create'} Service
              </Button>
              <Button
                onClick={() => setShowServiceForm(false)}
                variant="ghost"
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EventsManager