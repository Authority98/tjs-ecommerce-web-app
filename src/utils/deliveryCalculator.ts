import { DeliveryConfiguration, DeliveryZone, DistanceBasedConfig, DeliveryAddOn } from '../types'

export interface DeliveryCalculationResult {
  baseFee: number
  addOnFees: number
  totalFee: number
  zone?: string
  distance?: number
  appliedAddOns: string[]
  error?: string
}

export interface DeliveryCalculationInput {
  postalCode?: string
  distance?: number // in kilometers
  selectedAddOns?: string[] // array of add-on IDs
}

/**
 * Calculate delivery fee based on configuration and input parameters
 */
export function calculateDeliveryFee(
  config: DeliveryConfiguration,
  input: DeliveryCalculationInput
): DeliveryCalculationResult {
  const result: DeliveryCalculationResult = {
    baseFee: 0,
    addOnFees: 0,
    totalFee: 0,
    appliedAddOns: []
  }

  try {
    // Calculate base fee based on model
    if (config.model === 'zone') {
      if (!input.postalCode) {
        result.error = 'Postal code is required for zone-based delivery'
        return result
      }
      
      const zoneResult = calculateZoneBasedFee(config.zoneBasedConfig?.zones || [], input.postalCode)
      result.baseFee = zoneResult.fee
      result.zone = zoneResult.zoneName
      
      if (zoneResult.error) {
        result.error = zoneResult.error
        return result
      }
    } else if (config.model === 'distance') {
      if (input.distance === undefined) {
        result.error = 'Distance is required for distance-based delivery'
        return result
      }
      
      const distanceResult = calculateDistanceBasedFee(config.distanceBasedConfig!, input.distance)
      result.baseFee = distanceResult.fee
      result.distance = input.distance
      
      if (distanceResult.error) {
        result.error = distanceResult.error
        return result
      }
    }

    // Calculate add-on fees
    if (input.selectedAddOns && input.selectedAddOns.length > 0) {
      const addOnResult = calculateAddOnFees(config.addOns, input.selectedAddOns)
      result.addOnFees = addOnResult.totalFee
      result.appliedAddOns = addOnResult.appliedAddOns
    }

    result.totalFee = result.baseFee + result.addOnFees
    return result
  } catch (error) {
    result.error = 'Error calculating delivery fee'
    return result
  }
}

/**
 * Calculate zone-based delivery fee
 */
function calculateZoneBasedFee(zones: DeliveryZone[], postalCode: string): { fee: number; zoneName?: string; error?: string } {
  // Extract first 2 digits of postal code for prefix matching
  const postalPrefix = postalCode.substring(0, 2)
  
  // Find matching zone - check for exact postal code match first, then prefix match
  const matchingZone = zones.find(zone => {
    // First check for exact full postal code match
    if (zone.postalCodes.includes(postalCode)) {
      return true
    }
    // Then check for 2-digit prefix match (backward compatibility)
    return zone.postalCodes.includes(postalPrefix)
  })
  
  if (!matchingZone) {
    return {
      fee: 0,
      error: `Delivery not available for postal code ${postalCode}`
    }
  }
  
  return {
    fee: matchingZone.fee,
    zoneName: matchingZone.name
  }
}

/**
 * Calculate distance-based delivery fee
 */
function calculateDistanceBasedFee(config: DistanceBasedConfig, distance: number): { fee: number; error?: string } {
  if (distance > config.maxRange) {
    return {
      fee: 0,
      error: `Delivery not available beyond ${config.maxRange}km`
    }
  }
  
  let fee = config.baseFee
  
  if (distance > config.baseDistance) {
    const extraDistance = distance - config.baseDistance
    fee += extraDistance * config.additionalChargePerKm
  }
  
  return { fee: Math.round(fee * 100) / 100 } // Round to 2 decimal places
}

/**
 * Calculate add-on fees
 */
function calculateAddOnFees(addOns: DeliveryAddOn[], selectedAddOnIds: string[]): { totalFee: number; appliedAddOns: string[] } {
  let totalFee = 0
  const appliedAddOns: string[] = []
  
  selectedAddOnIds.forEach(addOnId => {
    const addOn = addOns.find(a => a.id === addOnId && a.enabled)
    if (addOn) {
      totalFee += addOn.fee
      appliedAddOns.push(addOn.name)
    }
  })
  
  return { totalFee, appliedAddOns }
}

/**
 * Get available zones for display
 */
export function getAvailableZones(zones: DeliveryZone[]): Array<{ name: string; fee: number; postalCodes: string[] }> {
  return zones.map(zone => ({
    name: zone.name,
    fee: zone.fee,
    postalCodes: zone.postalCodes
  }))
}

/**
 * Validate postal code format (Singapore)
 */
export function validateSingaporePostalCode(postalCode: string): boolean {
  // Singapore postal codes are 6 digits
  const regex = /^\d{6}$/
  return regex.test(postalCode)
}

/**
 * Format delivery fee for display
 */
export function formatDeliveryFee(fee: number): string {
  return `$${fee.toFixed(2)}`
}