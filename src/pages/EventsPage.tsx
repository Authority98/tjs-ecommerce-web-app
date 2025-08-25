import React, { useState, useEffect } from 'react';

import { supabase } from '../lib/supabase';
import InquiryModal from '../components/InquiryModal';
import { Sparkles, Cake, Baby, Heart, Users, Briefcase, Factory, Building, Gift, Calendar } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import PageLayout from '../components/PageLayout';

interface EventService {
  id: string
  name: string
  description: string
  starting_price: number
  price_type: 'starting_from' | 'fixed' | 'upon_request' | 'custom_quotation'
  display_order: number
  is_active: boolean
}

const EventsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<EventService | null>(null);

  const handleOpenModal = (service: EventService) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };
  const getIconForService = (serviceName: string) => {
    switch (serviceName) {
      case 'Birthday Parties': return <Cake className="w-6 h-6 mr-2 text-rose-400" />;
      case 'Baby Showers & Gender Reveals': return <Baby className="w-6 h-6 mr-2 text-blue-400" />;
      case 'Engagements & Weddings': return <Heart className="w-6 h-6 mr-2 text-pink-400" />;
      case 'Anniversaries & Family Gatherings': return <Users className="w-6 h-6 mr-2 text-purple-400" />;
      case 'Corporate Dinners & Galas': return <Briefcase className="w-6 h-6 mr-2 text-indigo-400" />;
      case 'Product Launches & Brand Activations': return <Sparkles className="w-6 h-6 mr-2 text-yellow-400" />;
      case 'Festive Office Décor': return <Building className="w-6 h-6 mr-2 text-green-400" />;
      case 'Retail & Mall Installations': return <Factory className="w-6 h-6 mr-2 text-gray-400" />;
      case 'Christmas Décor (Office / Mall / Home)': return <Gift className="w-6 h-6 mr-2 text-red-400" />;
      case 'Lunar New Year / Deepavali / Hari Raya Styling': return <Sparkles className="w-6 h-6 mr-2 text-orange-400" />;
      case 'Themed Seasonal Events': return <Sparkles className="w-6 h-6 mr-2 text-teal-400" />;
      case 'Event Planning & Coordination': return <Calendar className="w-6 h-6 mr-2 text-cyan-400" />;
      case 'Venue Sourcing & Styling': return <Sparkles className="w-6 h-6 mr-2 text-lime-400" />;
      case 'Entertainment, Performers & Emcees': return <Sparkles className="w-6 h-6 mr-2 text-fuchsia-400" />;
      case 'Logistics & Project Management': return <Sparkles className="w-6 h-6 mr-2 text-amber-400" />;
      default: return <Sparkles className="w-6 h-6 mr-2 text-gray-400" />;
    }
  };
  const [events, setEvents] = useState<EventService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('events_services')
        .select('*')
        .eq('is_active', true)
        .order('display_order')
        .limit(4);
      
      if (error) {
        console.error('Error fetching events:', error);
      } else {
        setEvents(data || []);
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);

  const formatPrice = (service: EventService) => {
    switch (service.price_type) {
      case 'starting_from':
        return `$${service.starting_price.toLocaleString()}`
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
    return <LoadingSpinner />;
  }

  return (
    <>
      <PageLayout>
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-white mb-6" style={{fontFamily: 'Dancing Script', fontWeight: 500, fontSize: '30px', lineHeight: '39px', color: '#d9a66c'}}>
                Our Event Services
              </h1>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-dosis">
                Find the Perfect Service for Your Occasion
              </h2>
              <p className="text-xl text-white max-w-3xl mx-auto">
                Explore our comprehensive range of event services designed to make your celebration unforgettable.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {events.map((event) => (
                <div key={event.id} className="group">
                  <div className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 h-full transform hover:scale-105 hover:shadow-2xl`}>
                    {/* Decorative Elements */}
                    <div className="absolute -top-4 -right-16 w-24 h-24 bg-white/10 rounded-full blur-2xl z-0"></div>
                    <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-3xl z-0"></div>
                    <div className="relative p-8 flex flex-col items-center text-center">
                      <div className="mb-4 flex justify-center items-center">
                        <div className="p-4 bg-rose-100 dark:bg-rose-900/30 rounded-full inline-flex items-center justify-center shadow-lg">
                          {React.cloneElement(getIconForService(event.name), { className: 'w-10 h-10 text-rose-500 dark:text-rose-300' })}
                        </div>
                      </div>
                      <div className="mt-4 text-center">
                        <button
                          onClick={() => handleOpenModal(event)}
                          className="inline-flex items-center px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-full shadow-lg transition-all duration-300"
                        >
                          Enquire Now
                          <span className="ml-2">→</span>
                        </button>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3 line-clamp-2 font-dosis text-center">
                        {event.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 leading-relaxed font-manrope">
                        {event.description}
                      </p>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </PageLayout>
      {isModalOpen && selectedService && (
          <InquiryModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            serviceName={selectedService.name}
          />
        )}
    </>
  );
};

export default EventsPage;