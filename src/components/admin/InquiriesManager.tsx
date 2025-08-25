import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Calendar, Eye, MessageSquare, CheckCircle, Clock, AlertCircle, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  service_name: string;
  selected_options: any[];
  total_price: number | null;
  status: 'pending' | 'contacted' | 'quoted' | 'closed';
  notes: string | null;
  created_at: string;
  updated_at: string;
  event_date?: string;
  event_time?: string;
  guest_count?: number;
  special_requests?: string;
}

interface InquiryRaw {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  service_name: string;
  selected_options: string;
  total_price: number | null;
  status: 'pending' | 'contacted' | 'quoted' | 'closed';
  notes: string | null;
  created_at: string;
  updated_at: string;
  event_date?: string;
  event_time?: string;
  guest_count?: number;
  special_requests?: string;
}

const InquiriesManager: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [notes, setNotes] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching inquiries:', error);
      } else {
        const processedData = (data as InquiryRaw[] || []).map(inquiry => ({
          ...inquiry,
          selected_options: inquiry.selected_options ? JSON.parse(inquiry.selected_options) : []
        }));
        setInquiries(processedData);
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateInquiryStatus = async (id: string, status: string, notes?: string) => {
    setUpdatingStatus(true);
    try {
      const updateData: any = { status };
      if (notes !== undefined) {
        updateData.notes = notes;
      }

      const { error } = await supabase
        .from('inquiries')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Error updating inquiry:', error);
        alert('Error updating inquiry status');
      } else {
        await fetchInquiries();
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry({ ...selectedInquiry, status: status as any, notes: notes || selectedInquiry.notes });
        }
      }
    } catch (error) {
      console.error('Error updating inquiry:', error);
      alert('Error updating inquiry status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'contacted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'quoted': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'closed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'contacted': return <MessageSquare className="w-4 h-4" />;
      case 'quoted': return <AlertCircle className="w-4 h-4" />;
      case 'closed': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => 
    statusFilter === 'all' || inquiry.status === statusFilter
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewInquiry = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setNotes(inquiry.notes || '');
  };

  const handleSaveNotes = async () => {
    if (selectedInquiry) {
      await updateInquiryStatus(selectedInquiry.id, selectedInquiry.status, notes);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white font-dosis">Event Inquiries</h2>
        <div className="flex items-center space-x-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-700 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 font-manrope"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="quoted">Quoted</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['pending', 'contacted', 'quoted', 'closed'].map(status => {
          const count = inquiries.filter(i => i.status === status).length;
          return (
            <div key={status} className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 capitalize">{status}</p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
                <div className={`p-2 rounded-full ${getStatusColor(status)}`}>
                  {getStatusIcon(status)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inquiries List */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
        {filteredInquiries.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No inquiries found</p>
            <p className="text-sm">Inquiries will appear here when customers submit event requests.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{inquiry.name}</p>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                          <Mail className="w-3 h-3 mr-1" />
                          {inquiry.email}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                          <Phone className="w-3 h-3 mr-1" />
                          {inquiry.phone}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{inquiry.service_name}</p>
                      {inquiry.selected_options && inquiry.selected_options.length > 0 && (
                        <p className="text-sm text-gray-500">
                          {inquiry.selected_options.length} option(s) selected
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(inquiry.status)}`}>
                        {getStatusIcon(inquiry.status)}
                        <span className="ml-1 capitalize">{inquiry.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(inquiry.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleViewInquiry(inquiry)}
                        icon={Eye}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <Modal
          isOpen={!!selectedInquiry}
          onClose={() => setSelectedInquiry(null)}
          title={`Inquiry Details`}
        >
          <div className="space-y-4">
            {/* Header Card with Customer Name and Status */}
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-2xl p-4 border border-rose-100 dark:border-rose-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white font-dosis">{selectedInquiry.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 font-manrope">{selectedInquiry.service_name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(selectedInquiry.status)}`}>
                    {getStatusIcon(selectedInquiry.status)}
                    <span className="ml-2 capitalize">{selectedInquiry.status}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white font-dosis">Email Address</h4>
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-manrope break-all">{selectedInquiry.email}</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white font-dosis">Phone Number</h4>
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-manrope">{selectedInquiry.phone}</p>
              </div>
            </div>

            {/* Event Address Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white font-dosis">Event Address</h4>
              </div>
              <p className="text-gray-700 dark:text-gray-300 font-manrope leading-relaxed">{selectedInquiry.address}</p>
            </div>

            {/* Selected Options */}
            {selectedInquiry.selected_options && selectedInquiry.selected_options.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white font-dosis">Selected Options</h4>
                  <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {selectedInquiry.selected_options.length} item{selectedInquiry.selected_options.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="space-y-2">
                  {selectedInquiry.selected_options.map((option, index) => (
                    <div key={index} className="flex justify-between items-center bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 p-3 rounded-xl border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                        <span className="font-medium text-gray-900 dark:text-white font-manrope">{option.name}</span>
                      </div>
                      <span className="text-gray-600 dark:text-gray-300 font-semibold font-manrope">
                        {typeof option.price === 'number' ? `$${option.price.toLocaleString()}` : 'Price upon request'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status and Notes Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Status Update */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white font-dosis">Update Status</h4>
                </div>
                <select
                  value={selectedInquiry.status}
                  onChange={(e) => updateInquiryStatus(selectedInquiry.id, e.target.value)}
                  disabled={updatingStatus}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-manrope transition-all duration-200"
                >
                  <option value="pending">Pending</option>
                  <option value="contacted">Contacted</option>
                  <option value="quoted">Quoted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* Notes */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white font-dosis">Notes</h4>
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-manrope transition-all duration-200 resize-none"
                  placeholder="Add notes about this inquiry..."
                />
                <div className="mt-3">
                  <Button
                    onClick={handleSaveNotes}
                    disabled={updatingStatus}
                    size="sm"
                    className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200"
                  >
                    {updatingStatus ? 'Saving...' : 'Save Notes'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Timestamps Footer */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 dark:text-white font-dosis text-sm">Created</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300 font-manrope">{formatDate(selectedInquiry.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 dark:text-white font-dosis text-sm">Last Updated</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300 font-manrope">{formatDate(selectedInquiry.updated_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default InquiriesManager;