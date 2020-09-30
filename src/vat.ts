import VATRatesLib from 'vatrates';
import { checkVAT, countries } from 'jsvat';
import { get } from 'lodash';

import { isMemberOfTheEuropeanUnion } from './european-countries';
import { TierType } from './types/TierType';

const VATRates = new VATRatesLib();

/**
 * Returns true if the given tier type can be subject to VAT
 */
export const isTierTypeSubjectToVAT = (tierType: TierType): boolean => {
  const taxedTiersTypes: string[] = [TierType.SUPPORT, TierType.SERVICE, TierType.PRODUCT, TierType.TICKET];
  return taxedTiersTypes.includes(tierType);
};

/**
 * For a given tier type, this function returns the country that should be used
 * for calculating the percentage.
 */
export const getVatOriginCountry = (
  tierType: TierType,
  hostCountry: string | null,
  collectiveCountry: string | null,
): string | null => {
  if (!isTierTypeSubjectToVAT(tierType)) {
    return null;
  }

  const isEvent = tierType === TierType.TICKET;
  const originCountry = isEvent && collectiveCountry ? collectiveCountry : hostCountry;
  return isMemberOfTheEuropeanUnion(originCountry) ? originCountry : null;
};

/**
 * Returns true if VAT is enabled for this account
 */
export const accountHasVAT = (account: Record<string, unknown> | null): boolean => {
  return Boolean(getAccountVATType(account));
};

export const getAccountVATType = (account: Record<string, unknown> | null): string => {
  return <string>(
    (get(account, 'settings.VAT.type') ||
      get(account, 'parent.settings.VAT.type') ||
      get(account, 'parentCollective.settings.VAT.type'))
  );
};

/**
 * Returns true if VAT may apply.
 *
 * @param tierType - the tier type (eg. SUPPORT, TICKET...)
 * @param originCOuntry - two letters country where VAT is applied
 */
export const vatMayApply = (tierType: TierType, originCountry: string | null): boolean => {
  return Boolean(originCountry) && isTierTypeSubjectToVAT(tierType) && isMemberOfTheEuropeanUnion(originCountry);
};

/**
 * Get the base vat percentage for this host/collective/tier
 */
export const getStandardVatRate = (tierType: TierType, originCountry: string | null): number => {
  if (!vatMayApply(tierType, originCountry)) {
    return 0;
  }

  return VATRates.getStandardRate(originCountry);
};

/**
 * Calculates the vat rate.
 *
 * @param tierType - the tier type (eg. SUPPORT, TICKET...)
 * @param originCountry - two letters country where VAT is applied
 * @param userCountry - two letters country code of the payer
 * @param hasValidVatNumber - (optional) payer VAT identification number
 *
 * @returns {Number} `0` if no VAT applies or the percentage as a number between 0 and 100
 */
export const getVatPercentage = (
  tierType: TierType,
  originCountry: string | null,
  userCountry: string,
  hasValidVatNumber: boolean,
): number => {
  // No VAT if the customer is outside EU
  if (!isMemberOfTheEuropeanUnion(userCountry)) {
    return 0;
  }

  // If it's another European country that provides a VAT number, don't apply VAT
  if (originCountry !== userCountry && hasValidVatNumber) {
    return 0;
  }

  return getStandardVatRate(tierType, originCountry);
};

/**
 * Check the formatof a VAT ID number.
 *
 * @param number: The VAT number to check
 * @param countryCode: Provide a country code if you want to check against a single country code
 * @returns {object}
 *    - value: Standardized number
 *    - isValid
 *    - country: { isoCode: { short } }
 */
export const checkVATNumberFormat = (number: string, countryCode?: string) => {
  const filteredCountries = !countryCode
    ? countries
    : countries.filter((country) => country.codes.includes(countryCode));

  return checkVAT(number, filteredCountries);
};
