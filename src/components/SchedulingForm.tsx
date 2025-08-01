import React from 'react'
import { Calendar, Clock, Zap, Check } from 'lucide-react'
import { RENTAL_PERIODS } from '../types'

interface SchedulingFormProps {
  installationDate: string
  setInstallationDate: (date: string) => void
  teardownDate: string
  setTeardownDate: (date: string) => void
  rushOrder: boolean
  setRushOrder: (rush: boolean) => void
  rentalPeriod?: number
  setRentalPeriod?: (period: number) => void
  onNext: () => void
  onBack: () => void
  isTreeOrder: boolean
}

const SchedulingForm: React.FC<SchedulingFormProps> = ({
  installationDate,
  setInstallationDate,
  teardownDate,
  setTeardownDate,
  rushOrder,
  setRushOrder,
  rentalPeriod = 45,
  setRentalPeriod,
  onNext,
  onBack,
  isTreeOrder
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
          <label htmlFor="installationDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" style={{color: '#F59E0B'}} />
              <span>{isTreeOrder ? 'Installation Date' : 'Delivery Date'} {isTreeOrder && '*'}</span>
            </div>
          </label>
          <input
            type="date"
            id="installationDate"
            value={installationDate}
            onChange={(e) => setInstallationDate(e.target.value)}
            min={today}
            className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-lg"
            required={isTreeOrder}
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 ml-1">
            {isTreeOrder 
              ? 'Select your preferred date for tree installation and decoration'
              : 'Select your preferred delivery date'
            }
          </p>
        </div>

        {isTreeOrder && (
          <div>
            <label htmlFor="teardownDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" style={{color: '#F59E0B'}} />
                <span>Teardown Date</span>
              </div>
            </label>
            <input
              type="date"
              id="teardownDate"
              value={teardownDate}
              onChange={(e) => setTeardownDate(e.target.value)}
              min={getMinTeardownDate()}
              className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-lg"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 ml-1">
              Optional: Schedule when you'd like us to remove the tree and decorations
            </p>
          </div>
        )}

        <div className="bg-gradient-to-r from-amber-50/80 to-orange-50/80 dark:from-amber-950/20 dark:to-orange-950/20 rounded-2xl p-6 border border-amber-200/50 dark:border-amber-700/30">
          <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center">
            <Zap className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />
            Add-on Services
          </h3>
          
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