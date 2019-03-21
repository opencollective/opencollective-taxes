/** A list of all countries codes that are part of the European Union */
const europeanCountries: string[] = [
  'AT',
  'BE',
  'BG',
  'HR',
  'CY',
  'CZ',
  'DK',
  'EE',
  'FI',
  'FR',
  'DE',
  'GR',
  'HU',
  'IE',
  'IT',
  'LV',
  'LT',
  'LU',
  'MT',
  'NL',
  'PL',
  'PT',
  'RO',
  'SK',
  'SI',
  'ES',
  'SE',
  'GB',
];

/**
 * Return true if the country is a member of the European Union.
 */
export const isMemberOfTheEuropeanUnion = (countryCode: string | null): boolean => {
  return Boolean(countryCode) && europeanCountries.includes(<string>countryCode);
};

export default europeanCountries;
