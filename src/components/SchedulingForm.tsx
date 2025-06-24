import React from 'react'
import { motion } from 'framer-motion'
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/20 dark:border-gray-700/30"
    >
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        {isTreeOrder ? 'Installation & Service Scheduling' : 'Delivery Scheduling'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="installationDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-emerald-600" />
              <span>{isTreeOrder ? 'Installation Date' : 'Delivery Date'} {isTreeOrder && '*'}</span>
            </div>
          </label>
          <div className="relative">
            <input
              type="date"
              id="installationDate"
              value={installationDate}
              onChange={(e) => setInstallationDate(e.target.value)}
              min={today}
              className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-lg"
              required={isTreeOrder}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
          </div>
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
                <Calendar className="h-4 w-4 text-emerald-600" />
                <span>Teardown Date</span>
              </div>
            </label>
            <div className="relative">
              <input
                type="date"
                id="teardownDate"
                value={teardownDate}
                onChange={(e) => setTeardownDate(e.target.value)}
                min={getMinTeardownDate()}
                className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-lg"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
            </div>
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
          
          <motion.label
            whileHover={{ scale: 1.02 }}
            className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
              rushOrder
                ? 'border-amber-500 bg-amber-100/50 dark:bg-amber-900/30 shadow-lg'
                : 'border-gray-200 dark:border-gray-600 hover:border-amber-300 dark:hover:border-amber-500 bg-white/60 dark:bg-gray-700/40'
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
          </motion.label>
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all"
          >
            Continue to Payment
          </button>
        </div>
      </form>
    </motion.div>
  )
}

export default SchedulingForm