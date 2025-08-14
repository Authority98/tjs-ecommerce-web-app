import React, { useEffect } from 'react'
import { Calendar, Clock, Zap, Check, Palette } from 'lucide-react'
import { RENTAL_PERIODS, DeliveryConfiguration, DeliveryAddOn, DECOR_LEVELS } from '../types'
import { showSuccessToast } from '../utils/toast'
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
  eventSize?: 'small' | 'medium' | 'large'
  setEventSize?: (size: 'small' | 'medium' | 'large') => void
  onNext: () => void
  onBack: () => void
  isTreeOrder: boolean
  deliveryConfig?: DeliveryConfiguration
  selectedDeliveryAddOns: string[]
  setSelectedDeliveryAddOns: (addOns: string[]) => void
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
  eventSize,
  setEventSize,
  onNext,
  onBack,
  isTreeOrder,
  deliveryConfig,
  selectedDeliveryAddOns,
  setSelectedDeliveryAddOns,
  installationSelected,
  setInstallationSelected,
  teardownSelected,
  setTeardownSelected
}) => {
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

  // Handle delivery add-on selection
  const handleDeliveryAddOnToggle = (addOnId: string) => {
    if (selectedDeliveryAddOns.includes(addOnId)) {
      setSelectedDeliveryAddOns(selectedDeliveryAddOns.filter(id => id !== addOnId))
    } else {
      setSelectedDeliveryAddOns([...selectedDeliveryAddOns, addOnId])
    }
  }

  // Get enabled delivery add-ons
  const enabledDeliveryAddOns = deliveryConfig?.addOns.filter(addOn => addOn.enabled) || []

  // Helper function to check if a date is weekend
  const isWeekend = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDay()
    return day === 0 || day === 6 // Sunday or Saturday
  }

  // Helper function to get timing surcharge
  const getTimingSurcharge = (time: string) => {
    if (!time) return 0
    const hour = parseInt(time.split(':')[0])
    
    if (hour >= 22) return 150 // Late-night (after 10pm)
    if (hour >= 18) return 80  // Evening (6pm-10pm)
    return 0
  }

  // Helper function to get day type surcharge
  const getDayTypeSurcharge = (dateString: string) => {
    if (!dateString) return 0
    // For now, just check weekend. Public holiday logic would need a separate API/database
    return isWeekend(dateString) ? 100 : 0
  }

  // Calculate total surcharge for a given date and time
  const calculateTotalSurcharge = (dateString: string, time: string) => {
    return getTimingSurcharge(time) + getDayTypeSurcharge(dateString)
  }

  // Auto-enable installation service when installation date and time are selected
  useEffect(() => {
    if (installationDate && installationTime && !installationSelected) {
      setInstallationSelected(true)
      const timeSurcharge = getTimingSurcharge(installationTime)
      const daySurcharge = getDayTypeSurcharge(installationDate)
      const totalSurcharge = timeSurcharge + daySurcharge
      
      let message = 'Installation service enabled'
      if (totalSurcharge > 0) {
        const charges = []
        if (timeSurcharge > 0) {
          const timeType = installationTime >= '18:00' ? (installationTime >= '22:00' ? 'late-night' : 'evening') : 'standard'
          charges.push(`${timeType} time +$${timeSurcharge}`)
        }
        if (daySurcharge > 0) {
          const dayType = isWeekend(installationDate) ? 'weekend' : 'holiday'
          charges.push(`${dayType} +$${daySurcharge}`)
        }
        message += ` with ${charges.join(' and ')} (Total: +$${totalSurcharge})`
      }
      showSuccessToast(message)
    }
  }, [installationDate, installationTime])

  // Auto-enable teardown service when teardown date and time are selected (for tree orders)
  useEffect(() => {
    if (isTreeOrder && teardownDate && teardownTime && !teardownSelected) {
      setTeardownSelected(true)
      const timeSurcharge = getTimingSurcharge(teardownTime)
      const daySurcharge = getDayTypeSurcharge(teardownDate)
      const totalSurcharge = timeSurcharge + daySurcharge
      
      let message = 'Teardown service enabled'
      if (totalSurcharge > 0) {
        const charges = []
        if (timeSurcharge > 0) {
          const timeType = teardownTime >= '18:00' ? (teardownTime >= '22:00' ? 'late-night' : 'evening') : 'standard'
          charges.push(`${timeType} time +$${timeSurcharge}`)
        }
        if (daySurcharge > 0) {
          const dayType = isWeekend(teardownDate) ? 'weekend' : 'holiday'
          charges.push(`${dayType} +$${daySurcharge}`)
        }
        message += ` with ${charges.join(' and ')} (Total: +$${totalSurcharge})`
      }
      showSuccessToast(message)
    }
  }, [teardownDate, teardownTime, isTreeOrder])

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
        {isTreeOrder ? 'Installation & Service Scheduling' : 'Delivery Scheduling'}
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
                  type: '',
                  eventSize: eventSize
                }}
                onDecorLevelSelect={setDecorationLevel}
                onEventSizeSelect={setEventSize}
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
                <span>{isTreeOrder ? 'Installation Date & Time' : 'Delivery Date & Time'} {isTreeOrder && '*'}</span>
                <Tooltip content={isTreeOrder ? "Select your preferred date and time for tree installation and decoration" : "Select your preferred delivery date and time"} />
              </div>
            </label>
            <input
              type="datetime-local"
              id="installationDateTime"
              value={installationDate && installationTime ? `${installationDate}T${installationTime}` : ''}
              onChange={(e) => {
                const [date, time] = e.target.value.split('T')
                setInstallationDate(date || '')
                setInstallationTime(time || '')
              }}
              min={`${today}T00:00`}
              className="w-full p-2 border border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-700/60 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
              required={isTreeOrder}
            />
          </div>

          {isTreeOrder && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" style={{color: '#F59E0B'}} />
                  <span>Teardown Date & Time *</span>
                  <Tooltip content="Schedule when you'd like us to remove the tree and decorations" />
                </div>
              </label>
              <input
                 type="datetime-local"
                 id="teardownDateTime"
                 value={teardownDate && teardownTime ? `${teardownDate}T${teardownTime}` : ''}
                 onChange={(e) => {
                   const [date, time] = e.target.value.split('T')
                   setTeardownDate(date || '')
                   setTeardownTime(time || '')
                 }}
                 min={getMinTeardownDate() ? `${getMinTeardownDate()}T00:00` : ''}
                 className="w-full p-2 border border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-700/60 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                 required
               />
             </div>
           )}
         </div>

        {/* Separator */}
        <div className="border-t border-gray-200 dark:border-gray-600 my-6"></div>
        
        {/* Delivery Add-ons and Rush Order - positioned under teardown */}
        {(enabledDeliveryAddOns.length > 0 || true) && (
          <div className="mt-4">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 text-sm flex items-center">
              <Check className="h-4 w-4 text-amber-600 dark:text-amber-400 mr-2" />
              Delivery Add-ons
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Rush Order */}
              {(() => {
                const rushOrderAddOn = deliveryConfig?.addOns.find(addOn => addOn.id === 'rush-order' && addOn.enabled)
                if (!rushOrderAddOn) return null
                
                return (
                  <button
                    type="button"
                    onClick={() => setRushOrder(!rushOrder)}
                    className={`p-2 rounded-lg border text-center transition-all duration-200 text-sm ${
                      rushOrder
                        ? 'border-amber-400 bg-amber-50/60 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
                        : 'border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800 dark:text-white">
                        {rushOrderAddOn.name}
                      </span>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                          +${rushOrderAddOn.fee}
                        </span>
                        {rushOrder && (
                          <Check className="h-3 w-3 text-amber-500" />
                        )}
                      </div>
                    </div>
                  </button>
                )
              })()}
              
              {/* Other Delivery Add-ons (excluding rush-order which is handled separately) */}
              {enabledDeliveryAddOns.filter(addOn => addOn.id !== 'rush-order').map((addOn) => {
                const isSelected = selectedDeliveryAddOns.includes(addOn.id)
                return (
                  <button
                    key={addOn.id}
                    type="button"
                    onClick={() => handleDeliveryAddOnToggle(addOn.id)}
                    className={`p-2 rounded-lg border text-center transition-all duration-200 text-sm ${
                      isSelected
                        ? 'border-amber-400 bg-amber-50/60 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
                        : 'border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800 dark:text-white">
                        {addOn.name}
                      </span>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                          +${addOn.fee}
                        </span>
                        {isSelected && (
                          <Check className="h-3 w-3 text-amber-500" />
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
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
            Continue to Customer Details
          </button>
        </div>
      </form>
    </div>
  )
}

export default SchedulingForm