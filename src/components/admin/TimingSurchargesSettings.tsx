import React, { useState, useEffect } from 'react'
import { Settings, Clock, Calendar, Save, Plus, Trash2 } from 'lucide-react'
import { TimingSurcharge } from '../../types'
import Button from '../ui/Button'
import { supabase } from '../../lib/supabase'

const TimingSurchargesSettings: React.FC = () => {
  const [surcharges, setSurcharges] = useState<TimingSurcharge[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSurcharges()
  }, [])

  const loadSurcharges = async () => {
    try {
      const { data, error } = await supabase
        .from('timing_surcharges')
        .select('*')
        .order('surcharge_type', { ascending: true })
        .order('surcharge_amount', { ascending: true })

      if (error) throw error
      setSurcharges(data || [])
    } catch (error) {
      console.error('Error loading timing surcharges:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSurcharges = async () => {
    setSaving(true)
    try {
      for (const surcharge of surcharges) {
        if (surcharge.id.startsWith('new-')) {
          // Create new surcharge
          const { error } = await supabase
            .from('timing_surcharges')
            .insert({
              surcharge_type: surcharge.surcharge_type,
              name: surcharge.name,
              description: surcharge.description,
              surcharge_amount: surcharge.surcharge_amount,
              time_start: surcharge.time_start,
              time_end: surcharge.time_end,
              day_types: surcharge.day_types,
              is_active: surcharge.is_active
            })

          if (error) throw error
        } else {
          // Update existing surcharge
          const { error } = await supabase
            .from('timing_surcharges')
            .update({
              name: surcharge.name,
              description: surcharge.description,
              surcharge_amount: surcharge.surcharge_amount,
              time_start: surcharge.time_start,
              time_end: surcharge.time_end,
              day_types: surcharge.day_types,
              is_active: surcharge.is_active,
              updated_at: new Date().toISOString()
            })
            .eq('id', surcharge.id)

          if (error) throw error
        }
      }
      
      alert('Timing surcharges updated successfully!')
      await loadSurcharges() // Reload to get proper IDs for new items
    } catch (error) {
      console.error('Error saving timing surcharges:', error)
      alert('Error saving timing surcharges. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const updateSurcharge = (id: string, updates: Partial<TimingSurcharge>) => {
    setSurcharges(surcharges.map(surcharge => 
      surcharge.id === id ? { ...surcharge, ...updates } : surcharge
    ))
  }

  const addNewSurcharge = () => {
    const newSurcharge: TimingSurcharge = {
      id: `new-${Date.now()}`,
      surcharge_type: 'day_based',
      name: 'New Day Surcharge',
      description: '',
      surcharge_amount: 0,
      time_start: undefined,
      time_end: undefined,
      day_types: ['weekend'],
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    setSurcharges([...surcharges, newSurcharge])
  }

  const deleteSurcharge = async (id: string) => {
    if (id.startsWith('new-')) {
      // Remove from local state only
      setSurcharges(surcharges.filter(s => s.id !== id))
      return
    }

    if (!confirm('Are you sure you want to delete this surcharge?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('timing_surcharges')
        .delete()
        .eq('id', id)

      if (error) throw error
      setSurcharges(surcharges.filter(s => s.id !== id))
    } catch (error) {
      console.error('Error deleting surcharge:', error)
      alert('Error deleting surcharge. Please try again.')
    }
  }

  const dayBasedSurcharges = surcharges.filter(s => s.surcharge_type === 'day_based')

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
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
              <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white font-dosis">Day Surcharges</h2>
              <p className="text-gray-600 dark:text-gray-400">Configure additional charges based on day type (weekends, holidays)</p>
            </div>
          </div>
          <Button
            onClick={saveSurcharges}
            disabled={saving}
            icon={Save}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        {/* Day-Based Surcharges */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
              <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400 mr-2" />
              Day-Based Surcharges
            </h3>
            <Button
              onClick={addNewSurcharge}
              icon={Plus}
              className="bg-orange-600 hover:bg-orange-700 text-white text-sm px-3 py-1"
            >
              Add Day Surcharge
            </Button>
          </div>
          <div className="space-y-3">
            {dayBasedSurcharges.map((surcharge) => (
              <div key={surcharge.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={surcharge.is_active}
                      onChange={(e) => updateSurcharge(surcharge.id, { is_active: e.target.checked })}
                      className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={surcharge.name}
                      onChange={(e) => updateSurcharge(surcharge.id, { name: e.target.value })}
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                      placeholder="Surcharge name"
                    />
                  </div>
                  <div>
                    <select
                      value={surcharge.day_types?.[0] || 'weekend'}
                      onChange={(e) => updateSurcharge(surcharge.id, { day_types: [e.target.value] })}
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                    >
                      <option value="weekend">Weekend</option>
                      <option value="public_holiday">Public Holiday</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      value={surcharge.surcharge_amount}
                      onChange={(e) => updateSurcharge(surcharge.id, { surcharge_amount: Number(e.target.value) })}
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <button
                      onClick={() => deleteSurcharge(surcharge.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-700">
          <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">Current Configuration:</h4>
          <div className="text-sm text-orange-700 dark:text-orange-400 space-y-1">
            {dayBasedSurcharges.filter(s => s.is_active).length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 italic">No active day surcharges configured</p>
            ) : (
              dayBasedSurcharges
                .filter(s => s.is_active)
                .map((surcharge) => (
                  <p key={surcharge.id}>
                    <strong>{surcharge.name}:</strong> +${surcharge.surcharge_amount}
                    {surcharge.day_types && (
                      <span className="text-xs ml-1">({surcharge.day_types.join(', ')})</span>
                    )}
                  </p>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TimingSurchargesSettings