import React, { useState, useEffect } from 'react';

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
  const [serviceOptions, setServiceOptions] = useState<string[]>([]);

  useEffect(() => {
    // Dynamically set service options based on serviceName
    switch (serviceName) {
      case 'Birthday Parties':
      case 'Baby Showers & Gender Reveals':
      case 'Engagements & Weddings':
      case 'Anniversaries & Family Gatherings':
        setServiceOptions(['Personal Celebrations Option 1', 'Personal Celebrations Option 2']);
        break;
      case 'Corporate Dinners & Galas':
      case 'Product Launches & Brand Activations':
      case 'Festive Office Décor':
      case 'Retail & Mall Installations':
        setServiceOptions(['Corporate & Commercial Option 1', 'Corporate & Commercial Option 2']);
        break;
      case 'Christmas Décor (Office / Mall / Home)':
      case 'Lunar New Year / Deepavali / Hari Raya Styling':
      case 'Themed Seasonal Events':
        setServiceOptions(['Festive & Seasonal Décor Option 1', 'Festive & Seasonal Décor Option 2']);
        break;
      case 'Event Planning & Coordination':
      case 'Venue Sourcing & Styling':
      case 'Entertainment, Performers & Emcees':
      case 'Logistics & Project Management':
        setServiceOptions(['Add-On Services Option 1', 'Add-On Services Option 2']);
        break;
      default:
        setServiceOptions([]);
        break;
    }
  }, [serviceName]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., send data to backend)
    console.log({
      name,
      email,
      phone,
      address,
      serviceName,
      serviceOptions
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="relative p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Inquire About {serviceName}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Name:</label>
            <input
              type="text"
              id="name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white dark:border-gray-600"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Email:</label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white dark:border-gray-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Phone:</label>
            <input
              type="tel"
              id="phone"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white dark:border-gray-600"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Address:</label>
            <textarea
              id="address"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white dark:border-gray-600"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          {serviceOptions.length > 0 && (
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Service Options:</label>
              {serviceOptions.map((option, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`option-${index}`}
                    name="serviceOption"
                    value={option}
                    className="mr-2 leading-tight"
                  />
                  <label htmlFor={`option-${index}`} className="text-gray-700 dark:text-gray-300 text-sm">{option}</label>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit Inquiry
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline dark:bg-gray-600 dark:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InquiryModal;