import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import InquiryModal from '../components/InquiryModal';
import { 
  Sparkles, Cake, Baby, Heart, Users, Briefcase, Factory, Building, 
  Gift, Calendar, MapPin, Phone, Mail, Star, ArrowRight, Zap,
  PartyPopper, Crown, Palette, Music, Camera, Lightbulb
} from 'lucide-react';
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

interface ServiceCategory {
  title: string
  icon: React.ReactNode
  gradient: string
  services: {
    name: string
    price: string
    icon: React.ReactNode
    description: string
  }[]
}

const EventsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [hoveredService, setHoveredService] = useState<string | null>(null);

  const handleOpenModal = (serviceName: string) => {
    setSelectedService(serviceName);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService('');
  };
  // Service categories with creative organization
  const serviceCategories: ServiceCategory[] = [
    {
      title: "Personal Celebrations",
      icon: <PartyPopper className="w-8 h-8" />,
      gradient: "from-pink-500 via-rose-500 to-red-500",
      services: [
        {
          name: "Birthday Parties",
          price: "From $800",
          icon: <Cake className="w-6 h-6" />,
          description: "Magical birthday celebrations that create lasting memories"
        },
        {
          name: "Baby Showers & Gender Reveals",
          price: "From $1,200",
          icon: <Baby className="w-6 h-6" />,
          description: "Celebrate new beginnings with style and joy"
        },
        {
          name: "Engagements & Weddings",
          price: "From $3,500",
          icon: <Heart className="w-6 h-6" />,
          description: "Your dream wedding brought to life with elegance"
        },
        {
          name: "Anniversaries & Family Gatherings",
          price: "From $1,000",
          icon: <Users className="w-6 h-6" />,
          description: "Celebrate love and family bonds in beautiful settings"
        }
      ]
    },
    {
      title: "Corporate & Commercial",
      icon: <Crown className="w-8 h-8" />,
      gradient: "from-blue-500 via-indigo-500 to-purple-500",
      services: [
        {
          name: "Corporate Dinners & Galas",
          price: "From $5,000",
          icon: <Briefcase className="w-6 h-6" />,
          description: "Sophisticated corporate events that impress and inspire"
        },
        {
          name: "Product Launches & Brand Activations",
          price: "From $4,500",
          icon: <Zap className="w-6 h-6" />,
          description: "Launch your brand with impact and memorable experiences"
        },
        {
          name: "Festive Office Décor",
          price: "From $2,500",
          icon: <Building className="w-6 h-6" />,
          description: "Transform your workspace into a festive wonderland"
        },
        {
          name: "Retail & Mall Installations",
          price: "Price upon request",
          icon: <Factory className="w-6 h-6" />,
          description: "Large-scale installations that captivate customers"
        }
      ]
    },
    {
      title: "Festive & Seasonal Décor",
      icon: <Palette className="w-8 h-8" />,
      gradient: "from-green-500 via-emerald-500 to-teal-500",
      services: [
        {
          name: "Christmas Décor (Office / Mall / Home)",
          price: "From $3,000",
          icon: <Gift className="w-6 h-6" />,
          description: "Magical Christmas decorations for any space"
        },
        {
          name: "Lunar New Year / Deepavali / Hari Raya Styling",
          price: "From $2,800",
          icon: <Sparkles className="w-6 h-6" />,
          description: "Cultural celebrations with authentic festive styling"
        },
        {
          name: "Themed Seasonal Events",
          price: "Price upon request",
          icon: <Calendar className="w-6 h-6" />,
          description: "Custom seasonal themes that capture the spirit"
        }
      ]
    },
    {
      title: "Add-On Services",
      icon: <Lightbulb className="w-8 h-8" />,
      gradient: "from-orange-500 via-amber-500 to-yellow-500",
      services: [
        {
          name: "Event Planning & Coordination",
          price: "From $1,500",
          icon: <Calendar className="w-6 h-6" />,
          description: "Full-service event planning from concept to execution"
        },
        {
          name: "Venue Sourcing & Styling",
          price: "Price upon request",
          icon: <MapPin className="w-6 h-6" />,
          description: "Find and style the perfect venue for your event"
        },
        {
          name: "Entertainment, Performers & Emcees",
          price: "Price upon request",
          icon: <Music className="w-6 h-6" />,
          description: "Professional entertainment to elevate your event"
        },
        {
          name: "Logistics & Project Management",
          price: "Custom quotation",
          icon: <Camera className="w-6 h-6" />,
          description: "Seamless coordination for flawless execution"
        }
      ]
    }
  ];


  return (
    <>
      <PageLayout>
        {/* Hero Section */}
        <section className="py-8 px-4 relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-2">
              <h1 className="text-white mb-2" style={{fontFamily: 'Dancing Script', fontWeight: 500, fontSize: '40px', lineHeight: '52px', color: '#d9a66c'}}>
                Event Services
              </h1>
            </div>
          </div>
        </section>

        {/* Interactive Service Categories */}
        <section className="py-4 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Category Navigation */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {serviceCategories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setActiveCategory(index)}
                  className={`group relative px-6 py-3 rounded-xl font-semibold transition-all duration-500 transform hover:scale-105 ${
                    activeCategory === index
                      ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-white shadow-xl scale-105'
                      : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20'
                  }`}
                >
                  <span className="text-sm">{category.title}</span>
                  {activeCategory === index && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Active Category Services */}
            <div className="relative">
              <div className="bg-gradient-to-br from-rose-500 via-pink-500 to-purple-500 rounded-3xl p-1 shadow-2xl">
                <div className="bg-black/20 backdrop-blur-xl rounded-3xl p-8">

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {serviceCategories[activeCategory].services.map((service, serviceIndex) => (
                      <div
                        key={serviceIndex}
                        className="group relative"
                        onMouseEnter={() => setHoveredService(service.name)}
                        onMouseLeave={() => setHoveredService(null)}
                      >
                        <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-4 h-full transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:-translate-y-2">
                          {/* Floating Elements */}
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-bounce"></div>
                          <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                          
                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                              <div className={`p-3 rounded-xl transition-all duration-300 ${
                                hoveredService === service.name 
                                  ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-white shadow-lg scale-110' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {service.icon}
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-500 font-medium">Starting</div>
                                <div className="text-lg font-bold text-gray-800">{service.price}</div>
                              </div>
                            </div>
                            
                            <h4 className="text-lg font-bold text-gray-800 mb-2 font-dosis leading-tight">
                              {service.name}
                            </h4>
                            
                            <p className="text-gray-600 text-sm leading-relaxed mb-4 font-manrope">
                              {service.description}
                            </p>
                            
                            <button
                              onClick={() => handleOpenModal(service.name)}
                              className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                                hoveredService === service.name
                                  ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-white shadow-lg'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              <div className="flex items-center justify-center space-x-2">
                                <span>Enquire Now</span>
                                <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${
                                  hoveredService === service.name ? 'translate-x-1' : ''
                                }`} />
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


      </PageLayout>
      
      {isModalOpen && (
        <InquiryModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          serviceName={selectedService}
        />
      )}
    </>
  );
};

export default EventsPage;