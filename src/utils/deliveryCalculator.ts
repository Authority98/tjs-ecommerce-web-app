import { DeliveryConfiguration, DeliveryZone, DeliveryAddOn } from '../types'

export interface DeliveryCalculationResult {
  baseFee: number
  addOnFees: number
  totalFee: number
  zone?: string
  appliedAddOns: string[]
  error?: string
}

export interface DeliveryCalculationInput {
  zone: string // zone ID for zone-based calculation
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
    // Calculate base fee using zone-based calculation
    const zoneResult = calculateZoneFee(config.zoneBasedConfig?.zones || [], input.zone)
    result.baseFee = zoneResult.fee
    result.zone = zoneResult.zoneName
    
    if (zoneResult.error) {
      result.error = zoneResult.error
      return result
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
 * Calculate delivery fee from zone ID
 */
function calculateZoneFee(zones: DeliveryZone[], zoneId: string): { fee: number; zoneName?: string; error?: string } {
  const zone = zones.find(z => z.id === zoneId)
  
  if (!zone) {
    return {
      fee: 0,
      error: `Zone '${zoneId}' not found`
    }
  }
  
  return {
    fee: zone.fee,
    zoneName: zone.name
  }
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
export function getAvailableZones(zones: DeliveryZone[]): Array<{ name: string; fee: number }> {
  return zones.map(zone => ({
    name: zone.name,
    fee: zone.fee
  }))
}



/**
 * Format delivery fee for display
 */
export function formatDeliveryFee(fee: number): string {
  return `$${fee.toFixed(2)}`
}