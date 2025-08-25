import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, DollarSign, Info } from 'lucide-react';
import { supabase } from '../lib/supabase';
import PageLayout from '../components/PageLayout';
import LoadingSpinner from '../components/LoadingSpinner';

interface EventService {
  id: string;
  name: string;
  description: string;
  starting_price: number;
  price_type: 'starting_from' | 'fixed' | 'upon_request' | 'custom_quotation';
  display_order: number;
  is_active: boolean;
}

const EventServiceDetailPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<EventService | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (serviceId) {
      fetchService(serviceId);
    }
  }, [serviceId]);

  const fetchService = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('events_services')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching service:', error);
      } else {
        setService(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (service: EventService) => {
    switch (service.price_type) {
      case 'starting_from':
        return `From $${service.starting_price.toLocaleString()}`;
      case 'fixed':
        return `$${service.starting_price.toLocaleString()}`;
      case 'upon_request':
        return 'Price upon request';
      case 'custom_quotation':
        return 'Custom quotation';
      default:
        return 'Contact us';
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!service) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Service not found</h2>
            <Link to="/events" className="text-emerald-400 hover:text-emerald-300">
              Back to Events
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen relative overflow-hidden">
        {/* Back Button */}
        <div className="absolute top-8 left-8 z-20">
          <Link 
            to="/events" 
            className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20 transition-all duration-200"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to All Events
          </Link>
        </div>

        {/* Service Details Section */}
        <section className="py-20 px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-white mb-6" style={{fontFamily: 'Dancing Script', fontWeight: 500, fontSize: '30px', lineHeight: '39px', color: '#d9a66c'}}>
                {service.name}
              </h1>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-dosis">
                Event Service Details
              </h2>
              <p className="text-xl text-white max-w-3xl mx-auto">
                {service.description}
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl border border-white/20 dark:border-gray-700/30 rounded-3xl p-8 md:p-12 lg:p-16 mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4 font-dosis">Pricing</h3>
                  <div className="flex items-center text-emerald-400 text-3xl font-bold mb-4">
                    <DollarSign className="w-8 h-8 mr-2" />
                    <span>{formatPrice(service)}</span>
                  </div>
                  <p className="text-gray-300 mb-4">
                    {service.price_type === 'starting_from' && 'This is a starting price, final quotation may vary based on your specific requirements.'}
                    {service.price_type === 'upon_request' && 'Please contact us for a personalized quotation based on your event details.'}
                    {service.price_type === 'custom_quotation' && 'A custom quotation will be provided after understanding your unique needs.'}
                  </p>
                  <button 
                    onClick={() => navigate('/contact', { state: { service: service.name } })}
                    className="inline-flex items-center px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300"
                  >
                    Enquire Now
                    <span className="ml-2">→</span>
                  </button>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4 font-dosis">What's Included</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li><Info className="w-5 h-5 inline-block mr-2 text-blue-400" /> Detailed consultation</li>
                    <li><Info className="w-5 h-5 inline-block mr-2 text-blue-400" /> Professional setup and teardown</li>
                    <li><Info className="w-5 h-5 inline-block mr-2 text-blue-400" /> Custom design and styling</li>
                    <li><Info className="w-5 h-5 inline-block mr-2 text-blue-400" /> On-site coordination (for selected packages)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Add more sections as needed, e.g., gallery, testimonials */}

          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default EventServiceDetailPage;