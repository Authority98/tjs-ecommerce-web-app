import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, EyeOff, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import Button from '../ui/Button'

interface DiscountCode {
  id: string
  code: string
  description: string | null
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  min_order_amount: number
  max_uses: number | null
  used_count: number
  is_active: boolean
  valid_from: string | null
  valid_until: string | null
  created_at: string
  updated_at: string
}

interface DiscountCodeFormData {
  code: string
  description: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  min_order_amount: number
  max_uses: number | null
  is_active: boolean
  valid_from: string
  valid_until: string
}

const DiscountCodesManager: React.FC = () => {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCode, setEditingCode] = useState<DiscountCode | null>(null)
  const [formData, setFormData] = useState<DiscountCodeFormData>({
    code: '',
    description: '',
    discount_type: 'percentage',
    discount_value: 0,
    min_order_amount: 0,
    max_uses: null,
    is_active: true,
    valid_from: '',
    valid_until: ''
  })

  useEffect(() => {
    fetchDiscountCodes()
  }, [])

  // Handle body scroll lock when modal is open
  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showForm])

  const fetchDiscountCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('discount_codes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setDiscountCodes(data || [])
    } catch (error) {
      console.error('Error fetching discount codes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const submitData = {
        ...formData,
        valid_from: formData.valid_from || null,
        valid_until: formData.valid_until || null,
        max_uses: formData.max_uses || null
      }

      if (editingCode) {
        const { error } = await supabase
          .from('discount_codes')
          .update(submitData)
          .eq('id', editingCode.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('discount_codes')
          .insert([submitData])

        if (error) throw error
      }

      await fetchDiscountCodes()
      handleCloseForm()
    } catch (error) {
      console.error('Error saving discount code:', error)
      alert('Failed to save discount code. Please try again.')
    }
  }

  const handleEdit = (code: DiscountCode) => {
    setEditingCode(code)
    setFormData({
      code: code.code,
      description: code.description || '',
      discount_type: code.discount_type,
      discount_value: code.discount_value,
      min_order_amount: code.min_order_amount,
      max_uses: code.max_uses,
      is_active: code.is_active,
      valid_from: code.valid_from ? new Date(code.valid_from).toISOString().slice(0, 16) : '',
      valid_until: code.valid_until ? new Date(code.valid_until).toISOString().slice(0, 16) : ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this discount code?')) return

    try {
      const { error } = await supabase
        .from('discount_codes')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchDiscountCodes()
    } catch (error) {
      console.error('Error deleting discount code:', error)
      alert('Failed to delete discount code. Please try again.')
    }
  }

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('discount_codes')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (error) throw error
      await fetchDiscountCodes()
    } catch (error) {
      console.error('Error updating discount code status:', error)
      alert('Failed to update discount code status. Please try again.')
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingCode(null)
    setFormData({
      code: '',
      description: '',
      discount_type: 'percentage',
      discount_value: 0,
      min_order_amount: 0,
      max_uses: null,
      is_active: true,
      valid_from: '',
      valid_until: ''
    })
  }

  const formatDiscountValue = (type: string, value: number) => {
    return type === 'percentage' ? `${value}%` : `$${value}`
  }

  if (loading) {
    return <div className="text-white">Loading discount codes...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white font-dosis">Discount Codes</h2>
        <Button
          icon={Plus}
          onClick={() => setShowForm(true)}
          className="shadow-lg"
        >
          Add Discount Code
        </Button>
      </div>

      {/* Discount Codes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {discountCodes.map((code) => (
          <div
            key={code.id}
            className="bg-white/80 dark:bg-purple-950/20 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white font-mono">
                  {code.code}
                </h3>
                {code.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {code.description}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleActive(code.id, code.is_active)}
                  className={`p-2 rounded-lg ${
                    code.is_active
                      ? 'text-green-600 hover:bg-green-100'
                      : 'text-gray-400 hover:bg-gray-100'
                  }`}
                  title={code.is_active ? 'Active' : 'Inactive'}
                >
                  {code.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button
                  onClick={() => handleEdit(code)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                  title="Edit"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(code.id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Discount:</span>
                <span className="font-semibold text-purple-600 dark:text-purple-400">
                  {formatDiscountValue(code.discount_type, code.discount_value)}
                </span>
              </div>
              
              {code.min_order_amount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Min Order:</span>
                  <span className="font-semibold">${code.min_order_amount}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Usage:</span>
                <span className="font-semibold">
                  {code.used_count}{code.max_uses ? `/${code.max_uses}` : ''}
                </span>
              </div>
              
              {code.valid_until && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Expires:</span>
                  <span className="font-semibold">
                    {new Date(code.valid_until).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            <div className={`mt-4 px-3 py-1 rounded-full text-xs font-bold text-center ${
              code.is_active
                ? 'bg-green-200 text-green-900 dark:bg-green-800 dark:text-green-100'
                : 'bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
            }`}>
              {code.is_active ? 'Active' : 'Inactive'}
            </div>
          </div>
        ))}
      </div>

      {discountCodes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white text-lg">No discount codes created yet.</p>
          <p className="text-gray-300 mt-2">Create your first discount code to get started!</p>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/80 dark:bg-purple-950/20 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 bg-opacity-95 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {editingCode ? 'Edit Discount Code' : 'Create Discount Code'}
                </h3>
                <button
                  onClick={handleCloseForm}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Code *
                    </label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono"
                      placeholder="SAVE20"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Discount Type *
                    </label>
                    <select
                      value={formData.discount_type}
                      onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as 'percentage' | 'fixed' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Discount Value *
                    </label>
                    <input
                      type="number"
                      value={formData.discount_value}
                      onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder={formData.discount_type === 'percentage' ? '20' : '10.00'}
                      min="0"
                      max={formData.discount_type === 'percentage' ? '100' : undefined}
                      step={formData.discount_type === 'percentage' ? '1' : '0.01'}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Minimum Order Amount
                    </label>
                    <input
                      type="number"
                      value={formData.min_order_amount}
                      onChange={(e) => setFormData({ ...formData, min_order_amount: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="20% off all products"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Valid From
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.valid_from}
                      onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Valid Until
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.valid_until}
                      onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Maximum Uses
                  </label>
                  <input
                    type="number"
                    value={formData.max_uses || ''}
                    onChange={(e) => setFormData({ ...formData, max_uses: e.target.value ? parseInt(e.target.value) : null })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Leave empty for unlimited uses"
                    min="1"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Active
                  </label>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                  >
                    {editingCode ? 'Update' : 'Create'} Discount Code
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DiscountCodesManager