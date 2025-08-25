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
        setInquiries(data || []);
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
          title={`Inquiry Details - ${selectedInquiry.name}`}
        >
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Customer Name</label>
                <p className="text-gray-900">{selectedInquiry.name}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <p className="text-gray-900">{selectedInquiry.email}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <p className="text-gray-900">{selectedInquiry.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Service</label>
                <p className="text-gray-900">{selectedInquiry.service_name}</p>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Event Address</label>
              <p className="text-gray-900">{selectedInquiry.address}</p>
            </div>

            {/* Selected Options */}
            {selectedInquiry.selected_options && selectedInquiry.selected_options.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Selected Options</label>
                <div className="space-y-2">
                  {selectedInquiry.selected_options.map((option, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                      <span className="font-medium">{option.name}</span>
                      <span className="text-gray-600">
                        {typeof option.price === 'number' ? `$${option.price.toLocaleString()}` : 'Price upon request'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status Update */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                value={selectedInquiry.status}
                onChange={(e) => updateInquiryStatus(selectedInquiry.id, e.target.value)}
                disabled={updatingStatus}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              >
                <option value="pending">Pending</option>
                <option value="contacted">Contacted</option>
                <option value="quoted">Quoted</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                placeholder="Add notes about this inquiry..."
              />
              <div className="mt-2">
                <Button
                  onClick={handleSaveNotes}
                  disabled={updatingStatus}
                  size="sm"
                >
                  Save Notes
                </Button>
              </div>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Created</label>
                <p className="text-sm text-gray-600">{formatDate(selectedInquiry.created_at)}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Last Updated</label>
                <p className="text-sm text-gray-600">{formatDate(selectedInquiry.updated_at)}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default InquiriesManager;