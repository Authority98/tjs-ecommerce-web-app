import React, { useState, useEffect } from 'react'
import { Calendar, Clock, Sparkles, TreePine, Wrench, Trash2, Palette, Check } from 'lucide-react'
import { RENTAL_PERIODS, TimingSurcharge, getMenPowerLabel, calculateMenPowerCharge } from '../types'
import { showSuccessToast } from '../utils/toast'
import { supabase } from '../lib/supabase'
import Tooltip from './ui/Tooltip'
import DecorationLevelSelection from './DecorationLevelSelection'

interface SchedulingFormProps {
  installationDate: string
  setInstallationDate: (date: string) => void
  installationTime: string
  setInstallationTime: (time: string) => void
  teardownDate: string
  setTeardownDate: (date: string) => void
  teardownTime: string
  setTeardownTime: (time: string) => void
  rushOrder: boolean
  setRushOrder: (rush: boolean) => void
  rentalPeriod?: number
  setRentalPeriod?: (period: number) => void
  decorationLevel?: number
  setDecorationLevel?: (level: number) => void

  menPower: number
  setMenPower: (power: number) => void
  onNext: () => void
  onBack: () => void
  isTreeOrder: boolean
  isEventService?: boolean
  installationSelected: boolean
  setInstallationSelected: (selected: boolean) => void
  teardownSelected: boolean
  setTeardownSelected: (selected: boolean) => void
}

const SchedulingForm: React.FC<SchedulingFormProps> = ({
  installationDate,
  setInstallationDate,
  installationTime,
  setInstallationTime,
  teardownDate,
  setTeardownDate,
  teardownTime,
  setTeardownTime,
  rushOrder,
  setRushOrder,
  rentalPeriod = 45,
  setRentalPeriod,
  decorationLevel = 50,
  setDecorationLevel,

  menPower,
  setMenPower,
  onNext,
  onBack,
  isTreeOrder,
  isEventService = false,
  installationSelected,
  setInstallationSelected,
  teardownSelected,
  setTeardownSelected
}) => {
  const [timingSurcharges, setTimingSurcharges] = useState<TimingSurcharge[]>([])

  // Load timing surcharges on component mount
  useEffect(() => {
    loadTimingSurcharges()
  }, [])

  const loadTimingSurcharges = async () => {
    try {
      const { data, error } = await supabase
        .from('timing_surcharges')
        .select('*')
        .eq('is_active', true)
        .order('surcharge_type', { ascending: true })
        .order('surcharge_amount', { ascending: true })

      if (error) throw error
      setTimingSurcharges(data || [])
    } catch (error) {
      console.error('Error loading timing surcharges:', error)
    }
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext()
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0]
  
  // Get minimum teardown date (day after installation)
  const getMinTeardownDate = () => {
    if (!installationDate) return today
    const installDate = new Date(installationDate)
    installDate.setDate(installDate.getDate() + 1)
    return installDate.toISOString().split('T')[0]
  }



  // Helper function to check if a date is weekend
  const isWeekend = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDay()
    return day === 0 || day === 6 // Sunday or Saturday
  }

  // Helper function to get timing surcharge (removed - only day-based surcharges now)
  const getTimingSurcharge = (time: string) => {
    return 0 // No time-based surcharges anymore
  }

  // Helper function to get day type surcharge
  const getDayTypeSurcharge = (dateString: string) => {
    if (!dateString) return 0
    
    // Find matching day-based surcharge from database
    const dayBasedSurcharges = timingSurcharges.filter(s => s.surcharge_type === 'day_based')
    
    for (const surcharge of dayBasedSurcharges) {
      if (surcharge.day_types && surcharge.day_types.includes('weekend') && isWeekend(dateString)) {
        return surcharge.surcharge_amount
      }
      // Add public holiday logic here when implemented
      if (surcharge.day_types && surcharge.day_types.includes('public_holiday')) {
        // TODO: Implement public holiday detection
      }
    }
    
    // Fallback to hardcoded values if no database surcharges found
    return isWeekend(dateString) ? 100 : 0
  }

  // Calculate total surcharge for a given date and time
  const calculateTotalSurcharge = (dateString: string, time: string) => {
    return getTimingSurcharge(time) + getDayTypeSurcharge(dateString)
  }

  // Auto-enable installation service when installation date is selected
  useEffect(() => {
    if (installationDate && !installationSelected) {
      setInstallationSelected(true)
      const daySurcharge = getDayTypeSurcharge(installationDate)
      
      let message = 'Installation service enabled'
      if (daySurcharge > 0) {
        const dayType = isWeekend(installationDate) ? 'weekend' : 'holiday'
        message += ` with ${dayType} surcharge (+$${daySurcharge})`
      }
      showSuccessToast(message)
    }
  }, [installationDate])

  // Auto-enable teardown service when teardown date is selected (for tree orders and event services)
  useEffect(() => {
    if ((isTreeOrder || isEventService) && teardownDate && !teardownSelected) {
      setTeardownSelected(true)
      const daySurcharge = getDayTypeSurcharge(teardownDate)
      
      let message = 'Teardown service enabled'
      if (daySurcharge > 0) {
        const dayType = isWeekend(teardownDate) ? 'weekend' : 'holiday'
        message += ` with ${dayType} surcharge (+$${daySurcharge})`
      }
      showSuccessToast(message)
    }
  }, [teardownDate, isTreeOrder, isEventService])

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/15 dark:to-orange-950/15 rounded-3xl shadow-xl p-8 border border-white/20 dark:border-gray-700/30 relative">
      {/* Decorative Elements */}
      <div className="absolute top-4 right-4">
        <div className="w-16 h-16 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 rounded-full blur-xl z-0 opacity-40"></div>
      </div>
      <div className="absolute bottom-4 left-4">
        <div className="w-12 h-12 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 rounded-full blur-lg z-0 opacity-40"></div>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 font-dosis">
        {isTreeOrder ? 'Installation & Service Scheduling' : isEventService ? 'Event Service Scheduling' : 'Delivery Scheduling'}
      </h2>
      
      {/* Header separator */}
      <div className="border-t border-gray-200 dark:border-gray-600 mb-6"></div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Decoration Level Selection - Only for tree orders */}
        {isTreeOrder && setDecorationLevel && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <div className="flex items-center space-x-2">
                <Palette className="h-4 w-4" style={{color: '#F59E0B'}} />
                <span>Decoration Level *</span>
                <Tooltip content="Choose your preferred decoration level for the tree" />
              </div>
            </label>
            <DecorationLevelSelection
                selectedOptions={{ 
                  decorLevel: decorationLevel,
                  height: '',
                  width: '',
                  type: ''
                }}
                onDecorLevelSelect={setDecorationLevel}
              />
          </div>
        )}
        
        {/* Rental Period Selection - Only for tree orders */}
        {isTreeOrder && setRentalPeriod && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" style={{color: '#F59E0B'}} />
                <span>Rental Period *</span>
                <Tooltip content="Choose how long you'd like to keep your decorated tree" />
              </div>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
              {RENTAL_PERIODS.map((period) => (
                <button
                  key={period.days}
                  type="button"
                  onClick={() => setRentalPeriod(period.days)}
                  className={`p-2 rounded-lg border text-center transition-all duration-200 text-sm ${
                    rentalPeriod === period.days
                      ? 'border-amber-400 bg-amber-50/60 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
                      : 'border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800 dark:text-white">
                      {period.label}
                    </span>
                    <div className="flex items-center space-x-1">
                      {period.additionalCost > 0 && (
                        <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                          +${period.additionalCost}
                        </span>
                      )}
                      {rentalPeriod === period.days && (
                        <Check className="h-3 w-3 text-amber-500" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

          </div>
        )}
        
        {/* Separator */}
        <div className="border-t border-gray-200 dark:border-gray-600 my-6"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" style={{color: '#F59E0B'}} />
                <span>{isTreeOrder ? 'Installation Date' : isEventService ? 'Event Date' : 'Delivery Date'} {(isTreeOrder || isEventService) && '*'}</span>
                <Tooltip content={isTreeOrder ? "Select your preferred date for tree installation and decoration" : isEventService ? "Select your preferred date for the event service" : "Select your preferred delivery date"} />
              </div>
            </label>
            <input
              type="date"
              id="installationDate"
              value={installationDate}
              onChange={(e) => {
                setInstallationDate(e.target.value)
                // Clear time when date changes since we're only using dates now
                setInstallationTime('')
              }}
              min={today}
              className="w-full p-2 border border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-700/60 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
              required={isTreeOrder || isEventService}
            />
          </div>

          {(isTreeOrder || isEventService) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" style={{color: '#F59E0B'}} />
                  <span>Teardown Date *</span>
                  <Tooltip content={isTreeOrder ? "Select the date when you'd like us to remove the tree and decorations" : "Select the date when you'd like us to clean up after the event"} />
                </div>
              </label>
              <input
                 type="date"
                 id="teardownDate"
                 value={teardownDate}
                 onChange={(e) => {
                   setTeardownDate(e.target.value)
                   // Clear time when date changes since we're only using dates now
                   setTeardownTime('')
                 }}
                 min={getMinTeardownDate()}
                 className="w-full p-2 border border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-700/60 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                 required
               />
             </div>
           )}
         </div>

        {/* Men Power Selection - Only for tree orders */}
        {isTreeOrder && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <div className="flex items-center space-x-2">
                <Wrench className="h-4 w-4" style={{color: '#F59E0B'}} />
                <span>Men Power *</span>
                <Tooltip content="Select the number of workers needed for your tree installation" />
              </div>
            </label>
            <select
              value={menPower}
              onChange={(e) => setMenPower(Number(e.target.value))}
              className="w-full p-2 border border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-700/60 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
              required
            >
              <option value={2}>1-2 Workers - Included</option>
              <option value={4}>3-4 Workers - +$120</option>
              <option value={5}>5 Workers - +$250</option>
            </select>
          </div>
        )}

        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-amber-200 dark:border-amber-700/30 text-amber-700 dark:text-amber-300 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg hover:shadow-md transition-all duration-300"
          >
            Back
          </button>
          <button
            type="submit"
            className="flex-1 py-3 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-amber-400/30 transition-all duration-300"
          >
            Continue to Delivery
          </button>
        </div>
      </form>
    </div>
  )
}

export default SchedulingForm