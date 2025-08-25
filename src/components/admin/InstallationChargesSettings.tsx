import React, { useState, useEffect } from 'react'
import { Settings, Wrench, Save } from 'lucide-react'
import { InstallationCharge } from '../../types'
import Button from '../ui/Button'
import { supabase } from '../../lib/supabase'

const InstallationChargesSettings: React.FC = () => {
  const [charges, setCharges] = useState<InstallationCharge[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadCharges()
  }, [])

  const loadCharges = async () => {
    try {
      const { data, error } = await supabase
        .from('installation_charges')
        .select('*')
        .order('service_type')

      if (error) throw error
      setCharges(data || [])
    } catch (error) {
      console.error('Error loading installation charges:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveCharges = async () => {
    setSaving(true)
    try {
      for (const charge of charges) {
        const { error } = await supabase
          .from('installation_charges')
          .update({
            base_charge: charge.base_charge,
            is_active: charge.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', charge.id)

        if (error) throw error
      }
      
      alert('Installation charges updated successfully!')
    } catch (error) {
      console.error('Error saving installation charges:', error)
      alert('Error saving installation charges. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const updateCharge = (id: string, updates: Partial<InstallationCharge>) => {
    setCharges(charges.map(charge => 
      charge.id === id ? { ...charge, ...updates } : charge
    ))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border border-white/20 dark:border-gray-700/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Wrench className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white font-dosis">Assembling/Dismentaling Charges</h2>
        <p className="text-gray-600 dark:text-gray-400">Configure base charges for assembling and dismentaling services</p>
            </div>
          </div>
          <Button
            onClick={saveCharges}
            disabled={saving}
            icon={Save}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        {/* Charges Configuration */}
        <div className="space-y-4">
          {charges.map((charge) => (
            <div key={charge.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={charge.is_active}
                  onChange={(e) => updateCharge(charge.id, { is_active: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <div>
                  <span className="font-medium text-gray-800 dark:text-white capitalize">
                    {charge.service_type}
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Base charge for {charge.service_type} service
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600 dark:text-gray-400">$</span>
                <input
                  type="number"
                  value={charge.base_charge}
                  onChange={(e) => updateCharge(charge.id, { base_charge: Number(e.target.value) })}
                  className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
          <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">How it works:</h4>
          <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
            <li>• Base charges are applied when customers select assembling/dismentaling services</li>
            <li>• Additional timing surcharges may apply based on selected date and time</li>
            <li>• Disable a service by unchecking the checkbox to hide it from customers</li>
            <li>• Set base charge to $0 to only apply timing surcharges</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default InstallationChargesSettings