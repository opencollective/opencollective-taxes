import { isMemberOfTheEuropeanUnion } from '../src/european-countries';

it('returns true for European countries', () => {
  expect(isMemberOfTheEuropeanUnion('FR')).toBe(true);
  expect(isMemberOfTheEuropeanUnion('BE')).toBe(true);
  expect(isMemberOfTheEuropeanUnion('ES')).toBe(true);
  expect(isMemberOfTheEuropeanUnion('DE')).toBe(true);
});

it('returns false for non-European countries', () => {
  expect(isMemberOfTheEuropeanUnion('GB')).toBe(false);
  expect(isMemberOfTheEuropeanUnion('US')).toBe(false);
  expect(isMemberOfTheEuropeanUnion('JP')).toBe(false);
});
