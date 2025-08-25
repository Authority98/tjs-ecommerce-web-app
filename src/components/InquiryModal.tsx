import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle, Mail, Phone, MapPin, User } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ServiceOption {
  name: string;
  price: number | 'request';
}

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
}

const InquiryModal: React.FC<InquiryModalProps> = ({ isOpen, onClose, serviceName }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<ServiceOption[]>([]);
  const [availableOptions, setAvailableOptions] = useState<ServiceOption[]>([]);

  useEffect(() => {
    const getOptions = (service: string): ServiceOption[] => {
      switch (service) {
        case 'Birthday Parties': return [{ name: 'Standard Package', price: 800 }, { name: 'Premium Package', price: 1200 }];
        case 'Baby Showers & Gender Reveals': return [{ name: 'Basic Setup', price: 1200 }, { name: 'Deluxe Setup', price: 1800 }];
        case 'Engagements & Weddings': return [{ name: 'Engagement Special', price: 3500 }, { name: 'Wedding Grand', price: 5000 }];
        case 'Anniversaries & Family Gatherings': return [{ name: 'Family Reunion', price: 1000 }, { name: 'Anniversary Gala', price: 1500 }];
        case 'Corporate Dinners & Galas': return [{ name: 'Corporate Standard', price: 5000 }, { name: 'Corporate Premium', price: 7500 }];
        case 'Product Launches & Brand Activations': return [{ name: 'Launch Basic', price: 4500 }, { name: 'Launch Pro', price: 6000 }];
        case 'Festive Office Décor': return [{ name: 'Office Festive Basic', price: 2500 }, { name: 'Office Festive Custom', price: 'request' }];
        case 'Retail & Mall Installations': return [{ name: 'Retail Standard', price: 'request' }, { name: 'Mall Grand', price: 'request' }];
        case 'Christmas Décor (Office / Mall / Home)': return [{ name: 'Christmas Home', price: 3000 }, { name: 'Christmas Office/Mall', price: 'request' }];
        case 'Lunar New Year / Deepavali / Hari Raya Styling': return [{ name: 'LNY Basic', price: 2800 }, { name: 'LNY Premium', price: 'request' }];
        case 'Themed Seasonal Events': return [{ name: 'Themed Basic', price: 'request' }, { name: 'Themed Custom', price: 'request' }];
        case 'Event Planning & Coordination': return [{ name: 'Coordination Basic', price: 1500 }, { name: 'Coordination Full', price: 2500 }];
        case 'Venue Sourcing & Styling': return [{ name: 'Venue Basic', price: 'request' }, { name: 'Venue Premium', price: 'request' }];
        case 'Entertainment, Performers & Emcees': return [{ name: 'Entertainment Basic', price: 'request' }, { name: 'Entertainment Premium', price: 'request' }];
        case 'Logistics & Project Management': return [{ name: 'Logistics Basic', price: 'request' }, { name: 'Logistics Full', price: 'request' }];
        default: return [];
      }
    };
    setAvailableOptions(getOptions(serviceName));
    setSelectedOptions([]); // Reset selected options when serviceName changes
  }, [serviceName]);

  if (!isOpen) return null;

  const handleOptionChange = (option: ServiceOption, isChecked: boolean) => {
    if (isChecked) {
      setSelectedOptions((prev) => [...prev, option]);
    } else {
      setSelectedOptions((prev) => prev.filter((item) => item.name !== option.name));
    }
  };

  const calculateTotalPriceNumeric = () => {
    return selectedOptions.reduce((sum, option) => {
      if (typeof option.price === 'number') {
        return sum + option.price;
      }
      return sum; // 'request' prices are not added to total
    }, 0);
  };

  const calculateTotalPrice = () => {
    const total = calculateTotalPriceNumeric();
    return total > 0 ? `$${total.toLocaleString()}` : 'Price upon request';
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const inquiryData = {
        name,
        email,
        phone,
        address,
        service_name: serviceName,
        selected_options: JSON.stringify(selectedOptions),
        total_price: calculateTotalPriceNumeric()
      };

      console.log('Submitting inquiry data:', inquiryData);

      const { data, error } = await supabase
        .from('inquiries')
        .insert([inquiryData])
        .select();

      if (error) {
        console.error('Error submitting inquiry:', error);
        console.error('Error details:', error.message, error.details, error.hint);
        alert(`There was an error submitting your inquiry: ${error.message}. Please try again.`);
      } else {
        console.log('Inquiry submitted successfully:', data);
        setIsSubmitted(true);
        setTimeout(() => {
          onClose();
          // Reset form state
          setName('');
          setEmail('');
          setPhone('');
          setAddress('');
          setSelectedOptions([]);
          setIsSubmitted(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('There was an error submitting your inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center p-4 z-[9999]">
        <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm transform animate-pulse">
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-gray-800 mb-2 font-dosis">Thank You!</h3>
            <p className="text-sm text-gray-600 font-manrope">Your inquiry has been submitted successfully. We'll get back to you soon!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center p-4 z-[9999]">
      <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg transform transition-all duration-300 border border-gray-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 hover:bg-gray-100 rounded-full"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 font-dosis">Get a Quote</h2>
          <p className="text-sm text-gray-600 font-manrope">Tell us about your <span className="text-rose-500 font-semibold">{serviceName}</span> requirements</p>
        </div>


        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700 text-xs font-semibold mb-2 flex items-center">
              <User className="w-3 h-3 mr-1 text-rose-500" />
              Full Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter your full name"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-200 font-manrope"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-gray-700 text-xs font-semibold mb-2 flex items-center">
                <Mail className="w-3 h-3 mr-1 text-rose-500" />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="your.email@example.com"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-200 font-manrope"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-gray-700 text-xs font-semibold mb-2 flex items-center">
                <Phone className="w-3 h-3 mr-1 text-rose-500" />
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                placeholder="+65 1234 5678"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-200 font-manrope"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="address" className="block text-gray-700 text-xs font-semibold mb-2 flex items-center">
              <MapPin className="w-3 h-3 mr-1 text-rose-500" />
              Event Address
            </label>
            <textarea
              id="address"
              rows={2}
              placeholder="Enter the full address where the event will take place"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-200 resize-none font-manrope"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          {availableOptions.length > 0 && (
            <div>
              <label className="block text-gray-700 text-xs font-semibold mb-3">Service Options:</label>
              <div className="space-y-2">
                {availableOptions.map((option, index) => (
                  <div key={index} className="flex items-center bg-white border border-gray-100 p-3 rounded-xl hover:border-rose-200 transition-all duration-200">
                    <input
                      type="checkbox"
                      id={`option-${index}`}
                      name="serviceOption"
                      checked={selectedOptions.some(item => item.name === option.name)}
                      onChange={(e) => handleOptionChange(option, e.target.checked)}
                      className="form-checkbox h-5 w-5 text-rose-500 bg-white border-gray-300 rounded focus:ring-rose-500 transition-colors duration-200"
                    />
                    <label htmlFor={`option-${index}`} className="ml-3 text-gray-800 flex-grow cursor-pointer font-manrope">
                      <span className="text-sm font-semibold">{option.name}</span>
                      <span className="block text-xs text-gray-500 mt-1">
                        {typeof option.price === 'number' ? `$${option.price.toLocaleString()}` : 'Price upon request'}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}



          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm text-gray-700 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 font-manrope"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 rounded-xl text-sm text-white font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-manrope"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-3 h-3 mr-2" />
                  Submit Inquiry
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

};

export default InquiryModal;