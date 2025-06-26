import React from 'react'
import { Calendar, Clock, Zap } from 'lucide-react'

interface SchedulingFormProps {
  installationDate: string
  setInstallationDate: (date: string) => void
  teardownDate: string
  setTeardownDate: (date: string) => void
  rushOrder: boolean
  setRushOrder: (rush: boolean) => void
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
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/20 dark:border-gray-700/30">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 font-dosis">
        {isTreeOrder ? 'Installation & Service Scheduling' : 'Delivery Scheduling'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="installationDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" style={{color: '#9333E9'}} />
              <span>{isTreeOrder ? 'Installation Date' : 'Delivery Date'} {isTreeOrder && '*'}</span>
            </div>
          </label>
          <input
            type="date"
            id="installationDate"
            value={installationDate}
            onChange={(e) => setInstallationDate(e.target.value)}
            min={today}
            className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-purple-600 text-lg"
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
                <Calendar className="h-4 w-4" style={{color: '#9333E9'}} />
                <span>Teardown Date</span>
              </div>
            </label>
            <input
              type="date"
              id="teardownDate"
              value={teardownDate}
              onChange={(e) => setTeardownDate(e.target.value)}
              min={getMinTeardownDate()}
              className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-purple-600 text-lg"
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
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg"
          >
            Back
          </button>
          <button
            type="submit"
            className="flex-1 py-3 text-white font-bold rounded-lg"
            style={{background: 'linear-gradient(to right, #9333E9, #7C3AED)'}}
          >
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  )
}

export default SchedulingForm