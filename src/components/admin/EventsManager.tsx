import { Plus, Edit, Trash, Save, X, Calendar, DollarSign } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import React, { useState, useEffect } from 'react'
import Button from '../ui/Button'
import Modal from '../ui/Modal'

interface EventService {
  id: string
  name: string
  description: string
  starting_price: number
  price_type: 'starting_from' | 'fixed' | 'upon_request' | 'custom_quotation'
  display_order: number
  button_text: string
  is_active: boolean
  icon: string
}

const EventsManager: React.FC = () => {
  const [services, setServices] = useState<EventService[]>([])
  const [loading, setLoading] = useState(true)
  const [editingService, setEditingService] = useState<EventService | null>(null)
  const [showServiceForm, setShowServiceForm] = useState(false)
  const [formData, setFormData] = useState<Omit<EventService, 'id' | 'is_active'>>({
    name: '',
    description: '',
    starting_price: 0,
    price_type: 'starting_from',
    display_order: 1,
    button_text: 'Book Now',
    icon: '',
  })

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      // Fetch all services
      const { data: servicesData, error: servicesError } = await supabase
        .from('events_services')
        .select('*')
        .order('display_order')

      if (servicesError) {
        console.error('Error fetching services:', servicesError)
        setServices([])
      } else {
        setServices(servicesData || [])
      }



    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }



  const handleEditService = (service: EventService) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      description: service.description,
      starting_price: service.starting_price,
      price_type: service.price_type,
      display_order: service.display_order,
      button_text: service.button_text,
      icon: service.icon,
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
            display_order: formData.display_order,
            button_text: formData.button_text,
            icon: formData.icon,
          })
          .eq('id', editingService.id)

        if (error) throw error
      } else {
        // Create new service
        const { error } = await supabase
          .from('events_services')
          .insert({
            name: formData.name,
            description: formData.description,
            starting_price: formData.starting_price,
            price_type: formData.price_type,
            display_order: formData.display_order,
            button_text: formData.button_text,
            is_active: true,
            icon: formData.icon
          })

        if (error) throw error
      }

      // Refresh services
      await fetchInitialData()
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
      await fetchInitialData()
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
    <div className="p-4">

      <div className="mb-4 flex justify-between items-center">


      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
            <div className="p-4 flex-grow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{service.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-700 mb-2">
                <span>Price:</span>
                <span className="font-medium">{formatPrice(service)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-700 mb-2">
                <span>Display Order:</span>
                <span className="font-medium">{service.display_order}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-700 mb-2">
                <span>Button Text:</span>
                <span className="font-medium">{service.button_text}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-700">
                <span>Active:</span>
                <span className={`font-medium ${service.is_active ? 'text-green-600' : 'text-red-600'}`}>
                  {service.is_active ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-start space-x-2">
              <Button variant="secondary" onClick={() => handleEditService(service)} icon={Edit}>Edit</Button>
              <Button variant="danger" onClick={() => handleDeleteService(service.id)} icon={Trash}>Delete</Button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={showServiceForm}
        onClose={() => setShowServiceForm(false)}
        title={editingService ? 'Edit Event' : 'Add New Event'}
      >
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Event Title</label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="icon" className="block text-sm font-medium text-gray-700">Icon (Lucide Icon Name)</label>
            <input
              type="text"
              id="icon"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="e.g., Calendar, DollarSign"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>
          <div>
            <label htmlFor="starting_price" className="block text-sm font-medium text-gray-700">Starting Price</label>
            <input
              type="number"
              id="starting_price"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={formData.starting_price}
              onChange={(e) => setFormData({ ...formData, starting_price: parseFloat(e.target.value) })}
            />
          </div>
          <div>
            <label htmlFor="price_type" className="block text-sm font-medium text-gray-700">Price Type</label>
            <select
              id="price_type"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={formData.price_type}
              onChange={(e) => setFormData({ ...formData, price_type: e.target.value as 'starting_from' | 'fixed' | 'upon_request' | 'custom_quotation' })}
            >
              <option value="starting_from">Starting From</option>
              <option value="fixed">Fixed Price</option>
              <option value="upon_request">Upon Request</option>
              <option value="custom_quotation">Custom Quotation</option>
            </select>
          </div>
          <div>
            <label htmlFor="display_order" className="block text-sm font-medium text-gray-700">Display Order</label>
            <input
              type="number"
              id="display_order"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <label htmlFor="button_text" className="block text-sm font-medium text-gray-700">Button Text</label>
            <input
              type="text"
              id="button_text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={formData.button_text}
              onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
            />
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button onClick={handleSaveService}><Save className="mr-2" size={18} /> Save</Button>
            <Button onClick={() => setShowServiceForm(false)} variant="secondary"><X className="mr-2" size={18} /> Cancel</Button>
          </div>
        </div>
      </Modal>


    </div>
  )
}


export default EventsManager