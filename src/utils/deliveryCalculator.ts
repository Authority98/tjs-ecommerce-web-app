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
  postalCode?: string
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
    // Calculate base fee using zone-based model
    if (!input.postalCode) {
      result.error = 'Postal code is required for delivery'
      return result
    }
    
    const zoneResult = calculateZoneBasedFee(config.zoneBasedConfig?.zones || [], input.postalCode)
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
 * Calculate zone-based delivery fee
 */
function calculateZoneBasedFee(zones: DeliveryZone[], postalCode: string): { fee: number; zoneName?: string; error?: string } {
  // Normalize postal code to 6 digits with leading zeros
  const normalizedPostalCode = String(postalCode).padStart(6, '0')
  
  // Jurong Island allowlist (6-digit exact matches)
  const jurongIslandCodes = new Set([
    '627475', '627490', '627495', '627500', '627521', '627525', '627526', '627527', '627528', '627529',
    '627535', '627536', '627537', '627570', '627571', '627572', '627590', '627591', '627595', '627596',
    '627597', '627600', '627610', '627611', '627612', '627614', '627620', '627621', '627628', '627630',
    '627640', '627641', '627642', '627643', '627644', '627645', '627646', '627647', '627700', '627711',
    '627712', '627713', '627714', '627715', '627716', '627717', '627718', '627719', '627720', '627721',
    '627722', '627723', '627724', '627731', '627740', '627745', '627748', '627749', '627755', '627756',
    '627757', '627758', '627759', '627760', '627761', '627762', '627763', '627764', '627765', '627766',
    '627767', '627768', '627769', '627770', '627771', '627772', '627773', '627799', '627801', '627802',
    '627803', '627805', '627806', '627808', '627811', '627812', '627815', '627816', '627818', '627819',
    '627821', '627822', '627823', '627825', '627827', '627829', '627830', '627831', '627832', '627833',
    '627834', '627835', '627837', '627838', '627839', '627840', '627841', '627843', '627855', '627857',
    '627858', '627859', '627860', '627861', '627862', '627863', '627865', '627867', '627868', '627871',
    '627872', '627875', '627876', '627877', '627878', '627879', '627880', '627881', '627882', '627883',
    '627884', '627887', '627888', '627889', '627890', '627891', '627892'
  ])
  
  // Sentosa allowlist (all 098* plus specific 099 codes)
  const sentosa099Codes = new Set([
    '099000', '099001', '099002', '099003', '099004', '099005', '099006', '099007', '099008',
    '099010', '099011', '099012', '099013', // Siloso Beach Walk cluster
    '099048', '099049', '099050', '099051', '099052',
    '099053', '099054', '099055', '099056', '099057', // On-island venues near Siloso/Imbiah
    '099081', // Listed under Sentosa codes
    '099536', '099537', '099538' // Imbiah Walk (Siloso Beach Resort etc.)
  ])
  
  // Check Jurong Island allowlist first (highest priority)
  if (jurongIslandCodes.has(normalizedPostalCode)) {
    const jurongZone = zones.find(zone => zone.id === 'jurong-island')
    if (jurongZone) {
      return {
        fee: jurongZone.fee,
        zoneName: jurongZone.name
      }
    }
  }
  
  // Check Sentosa allowlist (098* + specific 099 codes)
  if (normalizedPostalCode.startsWith('098') || sentosa099Codes.has(normalizedPostalCode)) {
    const sentosaZone = zones.find(zone => zone.id === 'sentosa')
    if (sentosaZone) {
      return {
        fee: sentosaZone.fee,
        zoneName: sentosaZone.name
      }
    }
  }
  
  // Fall back to regional prefix matching for other zones
  let bestMatch: { zone: DeliveryZone; prefixLength: number } | null = null
  
  for (const zone of zones) {
    // Skip Jurong Island and Sentosa as they're handled above
    if (zone.id === 'jurong-island' || zone.id === 'sentosa') continue
    
    for (const zoneCode of zone.postalCodes) {
      const normalizedZoneCode = String(zoneCode).padStart(6, '0')
      
      // Check if the postal code starts with this zone code
      if (normalizedPostalCode.startsWith(normalizedZoneCode.substring(0, zoneCode.length))) {
        const prefixLength = zoneCode.length
        
        // Keep the match with the longest prefix (most specific)
        if (!bestMatch || prefixLength > bestMatch.prefixLength) {
          bestMatch = { zone, prefixLength }
        }
      }
    }
  }
  
  if (!bestMatch) {
    return {
      fee: 0,
      error: `Delivery not available for postal code ${postalCode}`
    }
  }
  
  return {
    fee: bestMatch.zone.fee,
    zoneName: bestMatch.zone.name
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