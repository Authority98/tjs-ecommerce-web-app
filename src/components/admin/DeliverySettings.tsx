import React, { useState, useEffect } from 'react'
import { Settings, Truck, MapPin, Clock, Plus, Trash2, Save } from 'lucide-react'
import { 
  DeliveryConfiguration, 
  DeliveryZone, 
  DistanceBasedConfig, 
  DeliveryAddOn,
  DEFAULT_DELIVERY_ZONES,
  DEFAULT_DISTANCE_CONFIG,
  DEFAULT_DELIVERY_ADDONS
} from '../../types'
import Button from '../ui/Button'
import { supabase } from '../../lib/supabase'

const DeliverySettings: React.FC = () => {
  const [config, setConfig] = useState<DeliveryConfiguration>({
    model: 'zone',
    zoneBasedConfig: {
      zones: DEFAULT_DELIVERY_ZONES
    },
    distanceBasedConfig: DEFAULT_DISTANCE_CONFIG,
    addOns: DEFAULT_DELIVERY_ADDONS,
    isActive: true
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newZone, setNewZone] = useState({ name: '', postalCodes: '', fee: 0 })
  const [showAddZone, setShowAddZone] = useState(false)

  useEffect(() => {
    // Check if user is authenticated before loading config
    const checkAuthAndLoad = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          await loadDeliveryConfig()
        } else {
          console.log('User not authenticated, using default config')
          setLoading(false)
        }
      } catch (error) {
        console.error('Error checking auth:', error)
        setLoading(false)
      }
    }
    
    checkAuthAndLoad()
  }, [])

  const loadDeliveryConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('delivery_configurations')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)

      if (data && data.length > 0 && !error) {
        // Convert snake_case to camelCase for the frontend
        const configData = data[0]
        const convertedData = {
          ...configData,
          id: configData.id, // Preserve the ID for updates
          addOns: configData.add_ons,
          isActive: configData.is_active,
          zoneBasedConfig: configData.zones ? { zones: configData.zones } : undefined,
          distanceBasedConfig: configData.distance_config
        }
        setConfig(convertedData)
      } else if (error) {
        console.error('Error loading delivery config:', error)
        console.log('Using default configuration')
      } else {
        console.log('No active delivery configuration found, using default configuration')
      }
    } catch (error) {
      console.error('Error loading delivery config:', error)
      console.log('Using default configuration')
    } finally {
      setLoading(false)
    }
  }

  const saveConfig = async () => {
    setSaving(true)
    try {
      // Check authentication before saving
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        alert('You must be logged in to save delivery configuration.')
        return
      }
      
      // Convert camelCase to snake_case for the database
      const dbConfig: any = {
        model: config.model,
        add_ons: config.addOns,
        is_active: config.isActive,
        zones: config.zoneBasedConfig?.zones || [],
        distance_config: config.distanceBasedConfig || {}
      }
      
      // Include ID if updating existing config
      if (config.id) {
        dbConfig.id = config.id
      }
      
      const { error } = await supabase
        .from('delivery_configurations')
        .upsert([dbConfig])

      if (error) throw error
      
      // Show success message
      alert('Delivery configuration saved successfully!')
    } catch (error) {
      console.error('Error saving config:', error)
      alert('Error saving configuration. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const updateZone = (zoneId: string, updates: Partial<DeliveryZone>) => {
    if (!config.zoneBasedConfig) return
    
    const updatedZones = config.zoneBasedConfig.zones.map(zone => 
      zone.id === zoneId ? { ...zone, ...updates } : zone
    )
    
    setConfig({
      ...config,
      zoneBasedConfig: {
        ...config.zoneBasedConfig,
        zones: updatedZones
      }
    })
  }

  const addZone = () => {
    if (!newZone.name || !newZone.postalCodes || newZone.fee <= 0) {
      alert('Please fill in all zone details')
      return
    }

    const zone: DeliveryZone = {
      id: newZone.name.toLowerCase().replace(/\s+/g, '-'),
      name: newZone.name,
      postalCodes: newZone.postalCodes.split(',').map(code => code.trim()),
      fee: newZone.fee
    }

    if (!config.zoneBasedConfig) {
      setConfig({
        ...config,
        zoneBasedConfig: { zones: [zone] }
      })
    } else {
      setConfig({
        ...config,
        zoneBasedConfig: {
          ...config.zoneBasedConfig,
          zones: [...config.zoneBasedConfig.zones, zone]
        }
      })
    }

    setNewZone({ name: '', postalCodes: '', fee: 0 })
    setShowAddZone(false)
  }

  const removeZone = (zoneId: string) => {
    if (!config.zoneBasedConfig) return
    
    const updatedZones = config.zoneBasedConfig.zones.filter(zone => zone.id !== zoneId)
    setConfig({
      ...config,
      zoneBasedConfig: {
        ...config.zoneBasedConfig,
        zones: updatedZones
      }
    })
  }

  const updateAddOn = (addOnId: string, updates: Partial<DeliveryAddOn>) => {
    const updatedAddOns = config.addOns.map(addOn => 
      addOn.id === addOnId ? { ...addOn, ...updates } : addOn
    )
    
    setConfig({
      ...config,
      addOns: updatedAddOns
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border border-white/20 dark:border-gray-700/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <Settings className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white font-dosis">Delivery Settings</h2>
              <p className="text-gray-600 dark:text-gray-400">Configure delivery charges and zones</p>
            </div>
          </div>
          <Button
            onClick={saveConfig}
            disabled={saving}
            icon={Save}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {saving ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>

        {/* Delivery Model Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Delivery Model</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setConfig({ ...config, model: 'zone' })}
              className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                config.model === 'zone'
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <MapPin className={`h-5 w-5 ${
                  config.model === 'zone' ? 'text-purple-600' : 'text-gray-500'
                }`} />
                <span className="font-semibold text-gray-800 dark:text-white">Zone-Based Delivery</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Set delivery fees based on postal code zones
              </p>
            </button>

            <button
              onClick={() => setConfig({ ...config, model: 'distance' })}
              className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                config.model === 'distance'
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <Truck className={`h-5 w-5 ${
                  config.model === 'distance' ? 'text-purple-600' : 'text-gray-500'
                }`} />
                <span className="font-semibold text-gray-800 dark:text-white">Distance-Based Delivery</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Calculate fees based on delivery distance
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Zone-Based Configuration */}
      {config.model === 'zone' && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border border-white/20 dark:border-gray-700/30">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Delivery Zones</h3>
            <Button
              onClick={() => setShowAddZone(true)}
              icon={Plus}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Add Zone
            </Button>
          </div>

          {/* Add Zone Form */}
          {showAddZone && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-gray-800 dark:text-white mb-4">Add New Zone</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Zone Name
                  </label>
                  <input
                    type="text"
                    value={newZone.name}
                    onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Central"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Postal Codes (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newZone.postalCodes}
                    onChange={(e) => setNewZone({ ...newZone, postalCodes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., 01, 02, 03"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Delivery Fee ($)
                  </label>
                  <input
                    type="number"
                    value={newZone.fee}
                    onChange={(e) => setNewZone({ ...newZone, fee: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="40"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-4">
                <Button onClick={addZone} className="bg-green-600 hover:bg-green-700 text-white">
                  Add Zone
                </Button>
                <Button 
                  onClick={() => setShowAddZone(false)} 
                  variant="ghost"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Zones Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-600">
                  <th className="text-left py-3 px-4 font-semibold text-gray-800 dark:text-white">Zone Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800 dark:text-white">Postal Codes</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800 dark:text-white">Fee</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {config.zoneBasedConfig?.zones.map((zone) => (
                  <tr key={zone.id} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={zone.name}
                        onChange={(e) => updateZone(zone.id, { name: e.target.value })}
                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={zone.postalCodes?.join(', ') || ''}
                        onChange={(e) => updateZone(zone.id, { 
                          postalCodes: e.target.value.split(',').map(code => code.trim()) 
                        })}
                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span className="mr-1">$</span>
                        <input
                          type="number"
                          value={zone.fee}
                          onChange={(e) => updateZone(zone.id, { fee: Number(e.target.value) })}
                          className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => removeZone(zone.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Distance-Based Configuration */}
      {config.model === 'distance' && config.distanceBasedConfig && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border border-white/20 dark:border-gray-700/30">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Distance-Based Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Base Fee ($)
              </label>
              <input
                type="number"
                value={config.distanceBasedConfig.baseFee}
                onChange={(e) => setConfig({
                  ...config,
                  distanceBasedConfig: {
                    ...config.distanceBasedConfig!,
                    baseFee: Number(e.target.value)
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <p className="text-xs text-gray-500 mt-1">Base fee for 0-{config.distanceBasedConfig.baseDistance}km</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Base Distance (km)
              </label>
              <input
                type="number"
                value={config.distanceBasedConfig.baseDistance}
                onChange={(e) => setConfig({
                  ...config,
                  distanceBasedConfig: {
                    ...config.distanceBasedConfig!,
                    baseDistance: Number(e.target.value)
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Additional Charge per km ($)
              </label>
              <input
                type="number"
                step="0.1"
                value={config.distanceBasedConfig.additionalChargePerKm}
                onChange={(e) => setConfig({
                  ...config,
                  distanceBasedConfig: {
                    ...config.distanceBasedConfig!,
                    additionalChargePerKm: Number(e.target.value)
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <p className="text-xs text-gray-500 mt-1">Charge per km beyond base distance</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Maximum Range (km)
              </label>
              <input
                type="number"
                value={config.distanceBasedConfig.maxRange}
                onChange={(e) => setConfig({
                  ...config,
                  distanceBasedConfig: {
                    ...config.distanceBasedConfig!,
                    maxRange: Number(e.target.value)
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <p className="text-xs text-gray-500 mt-1">Maximum delivery distance</p>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Add-ons */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border border-white/20 dark:border-gray-700/30">
        <div className="flex items-center space-x-3 mb-6">
          <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Delivery Add-ons</h3>
        </div>
        
        <div className="space-y-4">
          {config.addOns.map((addOn) => (
            <div key={addOn.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={addOn.enabled}
                  onChange={(e) => updateAddOn(addOn.id, { enabled: e.target.checked })}
                  className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                />
                <div>
                  <input
                    type="text"
                    value={addOn.name}
                    onChange={(e) => updateAddOn(addOn.id, { name: e.target.value })}
                    className="font-medium text-gray-800 dark:text-white bg-transparent border-none focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600 dark:text-gray-400">$</span>
                <input
                  type="number"
                  value={addOn.fee}
                  onChange={(e) => updateAddOn(addOn.id, { fee: Number(e.target.value) })}
                  className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DeliverySettings