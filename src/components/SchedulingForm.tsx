import React, { useEffect } from 'react'
import { Calendar, Clock, Zap, Check } from 'lucide-react'
import { RENTAL_PERIODS, DeliveryConfiguration, DeliveryAddOn } from '../types'
import { showSuccessToast } from '../utils/toast'

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
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rental Period Selection - Only for tree orders */}
        {isTreeOrder && setRentalPeriod && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" style={{color: '#F59E0B'}} />
                <span>Rental Period *</span>
              </div>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
              {RENTAL_PERIODS.map((period) => (
                <button
                  key={period.days}
                  type="button"
                  onClick={() => setRentalPeriod(period.days)}
                  className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                    rentalPeriod === period.days
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 shadow-lg'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-amber-300'
                  }`}
                >
                  <div className="flex justify-center mb-2">
                    <div className={`p-2 rounded-full ${
                      rentalPeriod === period.days
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                    }`}>
                      <Clock className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="font-bold text-lg text-gray-800 dark:text-white mb-1">
                    {period.label}
                  </div>
                  {period.additionalCost > 0 && (
                    <div className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                      +${period.additionalCost}
                    </div>
                  )}
                  {rentalPeriod === period.days && (
                    <div className="mt-2">
                      <Check className="h-4 w-4 text-amber-500 mx-auto" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 ml-1">
              Choose how long you'd like to keep your decorated tree
            </p>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" style={{color: '#F59E0B'}} />
              <span>{isTreeOrder ? 'Installation Date & Time' : 'Delivery Date & Time'} {isTreeOrder && '*'}</span>
            </div>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="date"
                id="installationDate"
                value={installationDate}
                onChange={(e) => setInstallationDate(e.target.value)}
                min={today}
                className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-lg"
                required={isTreeOrder}
              />
            </div>
            <div>
              <input
                type="time"
                id="installationTime"
                value={installationTime}
                onChange={(e) => setInstallationTime(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-lg"
              />
            </div>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 ml-1">
            {isTreeOrder 
              ? 'Select your preferred date and time for tree installation and decoration'
              : 'Select your preferred delivery date and time'
            }
          </p>
        </div>

        {isTreeOrder && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" style={{color: '#F59E0B'}} />
                <span>Teardown Date & Time *</span>
              </div>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="date"
                  id="teardownDate"
                  value={teardownDate}
                  onChange={(e) => setTeardownDate(e.target.value)}
                  min={getMinTeardownDate()}
                  className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-lg"
                  required
                />
              </div>
              <div>
                <input
                  type="time"
                  id="teardownTime"
                  value={teardownTime}
                  onChange={(e) => setTeardownTime(e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-lg"
                  required
                />
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 ml-1">
              Schedule when you'd like us to remove the tree and decorations
            </p>
          </div>
        )}

        <div className="bg-gradient-to-r from-amber-50/80 to-orange-50/80 dark:from-amber-950/20 dark:to-orange-950/20 rounded-2xl p-6 border border-amber-200/50 dark:border-amber-700/30">
          <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center">
            <Zap className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />
            Add-on Services
          </h3>
          
          <div className="space-y-3">
            {/* Rush Order */}
            <label
              className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer ${
                rushOrder
                  ? 'border-amber-500 bg-amber-100/50 dark:bg-amber-900/30 shadow-lg'
                  : 'border-gray-200 dark:border-gray-600 bg-white/60 dark:bg-gray-700/40'
              }`}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={rushOrder}
                  onChange={(e) => setRushOrder(e.target.checked)}
                  className="sr-only"
                />
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${rushOrder ? 'bg-amber-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'}`}>
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-800 dark:text-white">Rush Order</span>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Priority scheduling within 48 hours
                    </div>
                  </div>
                </div>
              </div>
              <span className="text-xl font-bold text-amber-600 dark:text-amber-400">+$150</span>
            </label>



            {/* Delivery Add-ons */}
            {enabledDeliveryAddOns.length > 0 && (
              <>
                <div className="border-t border-amber-200/50 dark:border-amber-700/30 pt-3 mt-3">
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 text-sm">Delivery Add-ons</h4>
                </div>
                {enabledDeliveryAddOns.map((addOn) => {
                  const isSelected = selectedDeliveryAddOns.includes(addOn.id)
                  return (
                    <label
                      key={addOn.id}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer ${
                        isSelected
                          ? 'border-amber-500 bg-amber-100/50 dark:bg-amber-900/30 shadow-lg'
                          : 'border-gray-200 dark:border-gray-600 bg-white/60 dark:bg-gray-700/40'
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleDeliveryAddOnToggle(addOn.id)}
                          className="sr-only"
                        />
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${isSelected ? 'bg-amber-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'}`}>
                            <Check className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="font-bold text-gray-800 dark:text-white">{addOn.name}</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xl font-bold text-amber-600 dark:text-amber-400">+${addOn.fee}</span>
                    </label>
                  )
                })}
              </>
            )}
          </div>
        </div>

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
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  )
}

export default SchedulingForm