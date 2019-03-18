import VATRatesLib from 'vatrates';
import jsvat from 'jsvat';
import { isMemberOfTheEuropeanUnion } from './european-countries';

const VATRates = new VATRatesLib();

export const isTierTypeSubjectToVAT = tierType => {
  return ['SUPPORT', 'SERVICE', 'PRODUCT', 'TICKET'].includes(tierType);
};

/**
 * Returns true if VAT may apply.
 *
 * @param {string} tierType - the tier type (eg. SUPPORT, TICKET...)
 * @param {string} hostCountry - two letters country code of the host
 */
export const vatMayApply = (tierType, hostCountry, collectiveCountry) => {
  if (!isTierTypeSubjectToVAT(tierType)) {
    return false;
  }

  const originCountry = tierType === 'EVENT' && collectiveCountry ? collectiveCountry : hostCountry;
  if (!isMemberOfTheEuropeanUnion(originCountry)) {
    return false;
  }

  return true;
};

/**
 * Get the base vat percentage for this host/collective/tier
 */
export const getStandardVatRate = (tierType, hostCountry, collectiveCountry) => {
  if (!vatMayApply(tierType, hostCountry, collectiveCountry)) {
    return 0;
  }

  const originCountry = tierType === 'TICKET' && collectiveCountry ? collectiveCountry : hostCountry;
  return VATRates.getStandardRate(originCountry);
};

/**
 * Calculates the vat rate.
 *
 * @param {string} tierType - the tier type (eg. SUPPORT, TICKET...)
 * @param {string} hostCountry - two letters country code of the host
 * @param {string} collectiveCountry - two letters country code of the collective
 * @param {string} userCountry - two letters country code of the payer
 * @param {string} hasValidVatNumber - (optional) payer VAT identification number
 *
 * @returns {Number} `0` if no VAT applies or the percentage as a number between 0 and 100
 */
export const getVatPercentage = (tierType, hostCountry, collectiveCountry, userCountry, hasValidVatNumber) => {
  // No VAT if the customer is outside EU
  if (!isMemberOfTheEuropeanUnion(userCountry)) {
    return 0;
  }

  // Europe VAT specifies that VAT depends on the country where the event takes place
  const originCountry = tierType === 'EVENT' && collectiveCountry ? collectiveCountry : hostCountry;

  // If it's another European country that provides a VAT number, don't apply VAT
  if (originCountry !== userCountry && hasValidVatNumber) {
    return 0;
  }

  return getStandardVatRate(tierType, hostCountry, collectiveCountry);
};

/**
 * Check the formatof a VAT ID number.
 *
 * @returns {object}
 *    - value: Standardized number
 *    - isValid
 *    - country: { isoCode: { short } }
 */
export const checkVATNumberFormat = number => {
  return jsvat.checkVAT(number);
};
