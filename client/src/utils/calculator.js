export const EMISSION_FACTORS = {
  transport:  0.00021, // tonnes CO2 per km (average car)
  aviationPerFlight: 0.9, // tonnes CO2 per return flight
};

export const HOME_BASE = { small: 1.5, medium: 2.5, large: 4.0 };
export const HOME_MULTI = { gas: 1.0, mixed: 0.7, electric: 0.4 };
export const DIET_VAL = { daily: 2.5, sometimes: 1.5, vegetarian: 0.8, vegan: 0.4 };
export const SHOP_VAL = { high: 0.8, medium: 0.4, low: 0.1 };

/**
 * Estimates annual CO₂ footprint from lifestyle inputs.
 * @param {{ kmPerWeek: number, flights: number, homeSize: string, energyType: string, diet: string, shopping: string }} params
 * @returns {{ total: number, transport: number, aviation: number, home: number, diet: number, shopping: number }}
 */
export function calcFootprint({ kmPerWeek, flights, homeSize, energyType, diet, shopping }) {
  const transport = kmPerWeek * 52 * EMISSION_FACTORS.transport;
  const aviation  = flights * EMISSION_FACTORS.aviationPerFlight;
  const home      = HOME_BASE[homeSize] * HOME_MULTI[energyType];
  const dietCO2   = DIET_VAL[diet];
  const shopCO2   = SHOP_VAL[shopping];
  const total     = transport + aviation + home + dietCO2 + shopCO2;
  return {
    total:     parseFloat(total.toFixed(1)),
    transport: parseFloat(transport.toFixed(1)),
    aviation:  parseFloat(aviation.toFixed(1)),
    home:      parseFloat(home.toFixed(1)),
    diet:      parseFloat(dietCO2.toFixed(1)),
    shopping:  parseFloat(shopCO2.toFixed(1)),
  };
}
