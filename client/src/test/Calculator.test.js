import { describe, it, expect } from 'vitest';
import {
  calcFootprint,
  EMISSION_FACTORS,
  HOME_BASE,
  HOME_MULTI,
  DIET_VAL,
  SHOP_VAL,
} from '../utils/calculator';

const base = {
  kmPerWeek: 100, flights: 2,
  homeSize: 'medium', energyType: 'mixed',
  diet: 'sometimes', shopping: 'medium',
};

describe('calcFootprint', () => {
  it('returns a total greater than zero for a typical profile', () => {
    const result = calcFootprint(base);
    expect(result.total).toBeGreaterThan(0);
  });

  it('calculates transport correctly from weekly km', () => {
    const result = calcFootprint(base);
    const expected = parseFloat((100 * 52 * EMISSION_FACTORS.transport).toFixed(1));
    expect(result.transport).toBe(expected);
  });

  it('calculates aviation as flights × 0.9t per return flight', () => {
    const result = calcFootprint(base);
    expect(result.aviation).toBe(parseFloat((2 * EMISSION_FACTORS.aviationPerFlight).toFixed(1)));
  });

  it('calculates home energy based on size and energy type', () => {
    const result = calcFootprint(base);
    const expected = parseFloat((HOME_BASE.medium * HOME_MULTI.mixed).toFixed(1));
    expect(result.home).toBe(expected);
  });

  it('returns zero transport when kmPerWeek is 0', () => {
    const result = calcFootprint({ ...base, kmPerWeek: 0 });
    expect(result.transport).toBe(0);
  });

  it('returns zero aviation when flights is 0', () => {
    const result = calcFootprint({ ...base, flights: 0 });
    expect(result.aviation).toBe(0);
  });

  it('vegan diet produces less CO₂ than daily meat diet', () => {
    const vegan    = calcFootprint({ ...base, diet: 'vegan' });
    const meatEvery = calcFootprint({ ...base, diet: 'daily' });
    expect(vegan.diet).toBeLessThan(meatEvery.diet);
  });

  it('electric home produces less CO₂ than gas home', () => {
    const electric = calcFootprint({ ...base, energyType: 'electric' });
    const gas      = calcFootprint({ ...base, energyType: 'gas' });
    expect(electric.home).toBeLessThan(gas.home);
  });

  it('high-impact profile produces more than low-impact profile', () => {
    const high = calcFootprint({
      kmPerWeek: 500, flights: 10,
      homeSize: 'large', energyType: 'gas',
      diet: 'daily', shopping: 'high',
    });
    const low = calcFootprint({
      kmPerWeek: 0, flights: 0,
      homeSize: 'small', energyType: 'electric',
      diet: 'vegan', shopping: 'low',
    });
    expect(high.total).toBeGreaterThan(low.total);
  });

  it('all returned values are numbers', () => {
    const result = calcFootprint(base);
    Object.values(result).forEach(val => expect(typeof val).toBe('number'));
  });

  it('breakdown fields sum to approximately the total', () => {
    const { total, transport, aviation, home, diet, shopping } = calcFootprint(base);
    const sum = transport + aviation + home + diet + shopping;
    expect(total).toBeCloseTo(sum, 0);
  });

  it('returns different totals for different shopping habits', () => {
    const low  = calcFootprint({ ...base, shopping: 'low' });
    const high = calcFootprint({ ...base, shopping: 'high' });
    expect(high.total).toBeGreaterThan(low.total);
  });
});

describe('emission factor constants', () => {
  it('EMISSION_FACTORS.transport is a positive number', () => {
    expect(EMISSION_FACTORS.transport).toBeGreaterThan(0);
  });

  it('HOME_BASE values increase with home size', () => {
    expect(HOME_BASE.small).toBeLessThan(HOME_BASE.medium);
    expect(HOME_BASE.medium).toBeLessThan(HOME_BASE.large);
  });

  it('HOME_MULTI electric is less than gas', () => {
    expect(HOME_MULTI.electric).toBeLessThan(HOME_MULTI.gas);
  });

  it('DIET_VAL vegan is less than daily', () => {
    expect(DIET_VAL.vegan).toBeLessThan(DIET_VAL.daily);
  });

  it('SHOP_VAL low is less than high', () => {
    expect(SHOP_VAL.low).toBeLessThan(SHOP_VAL.high);
  });
});
