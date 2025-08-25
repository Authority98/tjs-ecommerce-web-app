import React, { useState, useEffect } from 'react';

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

  const calculateTotalPrice = () => {
    const total = selectedOptions.reduce((sum, option) => {
      if (typeof option.price === 'number') {
        return sum + option.price;
      }
      return sum; // 'request' prices are not added to total
    }, 0);
    return total > 0 ? `$${total.toLocaleString()}` : 'Price upon request';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., send data to backend)
    console.log({
      name,
      email,
      phone,
      address,
      serviceName,
      selectedOptions,
      totalPrice: calculateTotalPrice()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center p-4 z-50 animate-fade-in">
      <div className="relative bg-gradient-to-br from-gray-800 to-black text-white rounded-2xl shadow-2xl p-8 w-full max-w-lg transform scale-95 animate-scale-in border border-rose-500">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-3xl font-bold text-rose-400 mb-6 text-center font-dosis">Inquire About {serviceName}</h2>
        <p className="text-gray-300 mb-6 text-center">Please fill out the form below and we'll get back to you shortly.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-gray-300 text-sm font-semibold mb-2">Name:</label>
            <input
              type="text"
              id="name"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-rose-500 focus:border-rose-500 transition-all duration-200"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-300 text-sm font-semibold mb-2">Email:</label>
            <input
              type="email"
              id="email"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-rose-500 focus:border-rose-500 transition-all duration-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-gray-300 text-sm font-semibold mb-2">Phone:</label>
            <input
              type="tel"
              id="phone"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-rose-500 focus:border-rose-500 transition-all duration-200"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-gray-300 text-sm font-semibold mb-2">Address:</label>
            <textarea
              id="address"
              rows={3}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-rose-500 focus:border-rose-500 transition-all duration-200 resize-y"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          {availableOptions.length > 0 && (
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-3">Select Options:</label>
              <div className="space-y-2">
                {availableOptions.map((option, index) => (
                  <div key={index} className="flex items-center bg-gray-700 p-3 rounded-lg border border-gray-600">
                    <input
                      type="checkbox"
                      id={`option-${index}`}
                      name="serviceOption"
                      checked={selectedOptions.some(item => item.name === option.name)}
                      onChange={(e) => handleOptionChange(option, e.target.checked)}
                      className="form-checkbox h-5 w-5 text-rose-500 bg-gray-900 border-gray-500 rounded focus:ring-rose-500 transition-colors duration-200"
                    />
                    <label htmlFor={`option-${index}`} className="ml-3 text-gray-200 flex-grow cursor-pointer">
                      {option.name}
                      <span className="block text-sm text-gray-400">
                        {typeof option.price === 'number' ? `$${option.price.toLocaleString()}` : 'Price upon request'}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-right text-xl font-bold text-rose-300 mt-6 pt-4 border-t border-gray-700">
            Total: {calculateTotalPrice()}
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-rose-600 hover:bg-rose-700 rounded-lg text-white font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-opacity-50"
            >
              Submit Inquiry
            </button>
          </div>
        </form>
      </div>
    </div>
  );

};

export default InquiryModal;