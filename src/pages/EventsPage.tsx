import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Sparkles } from 'lucide-react';
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
  const [events, setEvents] = useState<EventService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('events_services')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
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
    return <LoadingSpinner />;
  }

  return (
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

          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
            {events.map((event) => (
              <div key={event.id} className="group">
                <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl border border-white/20 dark:border-gray-700/30 h-full bg-opacity-95 backdrop-blur-sm`}>
                  <div className="relative p-8">
                    <h3 className="text-2xl font-bold text-white mb-2 font-dosis">
                      {event.name}
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      {event.description}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-lg font-semibold text-emerald-400">
                        {formatPrice(event)}
                      </span>
                      <Link to={`/events/service/${event.id}`} className="inline-flex items-center px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300">
                        View Details
                        <span className="ml-2">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default EventsPage;