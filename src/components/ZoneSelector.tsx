import React, { useState } from 'react'
import { MapPin, ChevronDown, Search } from 'lucide-react'
import { DeliveryConfiguration } from '../types'

interface ZoneSelectorProps {
  deliveryConfig?: DeliveryConfiguration
  selectedZone?: string
  selectedArea?: string
  onZoneChange: (zone: string, area: string, postalCode: string, fee: number) => void
  className?: string
}

// Static zone configuration with areas and fees
const ZONE_AREAS = {
  'central': {
    name: 'Central (CBD)',
    fee: 40,
    areas: [
      'Downtown Core',
      'Marina East',
      'Marina South',
      'Museum',
      'Newton',
      'Orchard',
      'Outram',
      'River Valley',
      'Rochor',
      'Singapore River',
      'Straits View',
      'Toa Payoh',
      'Bishan',
      'Bukit Merah',
      'Bukit Timah',
      'Queenstown',
      'Marine Parade',
      'Geylang',
      'Kallang',
      'Tanglin',
      'Other'
    ]
  },
  'north': {
    name: 'North',
    fee: 50,
    areas: [
      'Yishun',
      'Sembawang',
      'Woodlands',
      'Admiralty',
      'Marsiling',
      'Kranji',
      'Lim Chu Kang',
      'Sungei Kadut',
      'Mandai',
      'Central Water Catchment',
      'Simpang',
      'Other'
    ]
  },
  'northeast': {
    name: 'Northeast',
    fee: 45,
    areas: [
      'Ang Mo Kio',
      'Hougang',
      'North-Eastern Islands',
      'Punggol',
      'Seletar',
      'Sengkang',
      'Serangoon',
      'Other'
    ]
  },
  'east': {
    name: 'East',
    fee: 45,
    areas: [
      'Bedok',
      'Changi',
      'Changi Bay',
      'Paya Lebar',
      'Pasir Ris',
      'Tampines',
      'Other'
    ]
  },
  'west': {
    name: 'West',
    fee: 50,
    areas: [
      'Boon Lay',
      'Bukit Batok',
      'Bukit Panjang',
      'Choa Chu Kang',
      'Clementi',
      'Jurong East',
      'Jurong West',
      'Pioneer',
      'Tengah',
      'Tuas',
      'Western Islands',
      'Western Water Catchment',
      'Other'
    ]
  },
  'jurong-island': {
    name: 'Jurong Island',
    fee: 120,
    areas: [
      'Jurong Island (Industrial)',
      'Jurong Island (Petrochemical)',
      'Jurong Island (Logistics)',
      'Jurong Island (Manufacturing)',
      'Other'
    ]
  },
  'sentosa': {
    name: 'Sentosa',
    fee: 80,
    areas: [
      'Sentosa Cove',
      'Resorts World Sentosa',
      'Sentosa Island (Beach)',
      'Sentosa Island (Central)',
      'Imbiah Lookout',
      'Other'
    ]
  }
}

const ZoneSelector: React.FC<ZoneSelectorProps> = ({
  deliveryConfig,
  selectedZone,
  selectedArea,
  onZoneChange,
  className = ''
}) => {
  const [isZoneOpen, setIsZoneOpen] = useState(false)
  const [isAreaOpen, setIsAreaOpen] = useState(false)
  const [currentZone, setCurrentZone] = useState<string>(selectedZone || '')
  const [currentArea, setCurrentArea] = useState<string>(selectedArea || '')
  const [zoneSearchTerm, setZoneSearchTerm] = useState('')
  const [areaSearchTerm, setAreaSearchTerm] = useState('')

  const handleZoneSelect = (zoneId: string) => {
    setCurrentZone(zoneId)
    setCurrentArea('') // Reset area when zone changes
    setZoneSearchTerm('')
    setIsZoneOpen(false)
    
    // Calculate delivery fee immediately when zone is selected
    const fee = ZONE_AREAS[zoneId as keyof typeof ZONE_AREAS]?.fee || 0
    onZoneChange(zoneId, '', '', fee)
  }

  const handleAreaSelect = (area: string) => {
    setCurrentArea(area)
    setAreaSearchTerm('')
    setIsAreaOpen(false)
    
    if (currentZone) {
      const fee = ZONE_AREAS[currentZone as keyof typeof ZONE_AREAS]?.fee || 0
      onZoneChange(currentZone, area, '', fee)
    }
  }

  const getCurrentZoneName = () => {
    return ZONE_AREAS[currentZone as keyof typeof ZONE_AREAS]?.name || ''
  }

  const getCurrentAreas = () => {
    const areas = ZONE_AREAS[currentZone as keyof typeof ZONE_AREAS]?.areas || []
    return areas.filter(area => 
      area.toLowerCase().includes(areaSearchTerm.toLowerCase())
    )
  }

  const getFilteredZones = () => {
    return Object.entries(ZONE_AREAS).filter(([zoneId, zone]) => 
      zone.name.toLowerCase().includes(zoneSearchTerm.toLowerCase())
    )
  }

  const getCurrentFee = () => {
    return ZONE_AREAS[currentZone as keyof typeof ZONE_AREAS]?.fee || 0
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
        <MapPin className="h-5 w-5 text-amber-500" />
        Delivery Zone Selection
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select your zone *
          </label>
          <div className="relative">
            {currentZone ? (
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-orange-600 z-10" />
            ) : (
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
            )}
            <input
              type="text"
              placeholder={currentZone ? getCurrentZoneName() : "Search zones..."}
              value={currentZone && !isZoneOpen ? getCurrentZoneName() : zoneSearchTerm}
              onChange={(e) => setZoneSearchTerm(e.target.value)}
              onFocus={() => setIsZoneOpen(true)}
              onBlur={() => setTimeout(() => setIsZoneOpen(false), 200)}
              className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm ${
                currentZone 
                  ? 'border-orange-300 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-600 text-black dark:text-white'
                  : 'border-gray-300 dark:border-amber-400/30 bg-white dark:bg-amber-950/10 text-black dark:text-white'
              }`}
            />
            <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-transform pointer-events-none ${
              currentZone ? 'text-orange-600' : 'text-gray-400'
            } ${isZoneOpen ? 'rotate-180' : ''}`} />
          </div>
          
          {isZoneOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-hidden">
              <div className="max-h-60 overflow-y-auto">
                {getFilteredZones().map(([zoneId, zone]) => (
                  <button
                    key={zoneId}
                    type="button"
                    onClick={() => {
                      handleZoneSelect(zoneId)
                      setZoneSearchTerm('')
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-amber-50 dark:hover:bg-amber-900/20 flex items-center justify-between border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                  >
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{zone.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {zone.areas.length} areas
                      </div>
                    </div>
                    <div className="text-amber-600 dark:text-amber-400 font-semibold">
                      ${zone.fee}
                    </div>
                  </button>
                ))}
                {getFilteredZones().length === 0 && (
                  <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
                    No zones found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select your area *
          </label>
          <div className="relative">
            {currentArea ? (
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-orange-600 z-10" />
            ) : (
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
            )}
            <input
              type="text"
              placeholder={currentArea || (!currentZone ? "Select zone first..." : "Search areas...")}
              value={currentArea && !isAreaOpen ? currentArea : areaSearchTerm}
              onChange={(e) => setAreaSearchTerm(e.target.value)}
              onFocus={() => currentZone && setIsAreaOpen(true)}
              onBlur={() => setTimeout(() => setIsAreaOpen(false), 200)}
              disabled={!currentZone}
              className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm ${
                 currentArea 
                   ? 'border-orange-300 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-600 text-black dark:text-white'
                   : !currentZone
                   ? 'border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                   : 'border-gray-300 dark:border-amber-400/30 bg-white dark:bg-amber-950/10 text-black dark:text-white'
               }`}
            />
            <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-transform pointer-events-none ${
              currentArea ? 'text-orange-600' : !currentZone ? 'text-gray-300' : 'text-gray-400'
            } ${isAreaOpen ? 'rotate-180' : ''}`} />
          </div>
          
          {isAreaOpen && currentZone && (
            <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-hidden">
              <div className="max-h-60 overflow-y-auto">
                {getCurrentAreas().map((area, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      handleAreaSelect(area)
                      setAreaSearchTerm('')
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-amber-50 dark:hover:bg-amber-900/20 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">{area}</div>
                  </button>
                ))}
                {getCurrentAreas().length === 0 && (
                  <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
                    No areas found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {currentZone && currentArea && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Delivery Fee</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{getCurrentZoneName()} • {currentArea}</div>
            </div>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              ${getCurrentFee()}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ZoneSelector