/**
 * Utils to calculate taxes.
 */

import type { TierType } from './types/TierType';
import { TaxType } from './types/TaxType';
import { getCountryFromAccount } from './utils';
import { getAccountVATType, getStandardVatRate, getVatOriginCountry, vatMayApply } from './vat';
import { accountHasGST, gstMayApply, GST_RATE_PERCENT } from './gst';
import { isMemberOfTheEuropeanUnion } from './european-countries';

export * from './european-countries';
export * from './vat';
export * from './gst';
export * from './types/TaxType';

type Tax = {
  type: TaxType;
  percentage: number;
};

/**
 * Returns a list of taxes that may apply for this countribution type
 */
export const getApplicableTaxes = (
  account: Record<string, unknown> | null,
  host: Record<string, unknown> | null,
  tierType: TierType,
): Tax[] => {
  const taxes = [];
  const accountCountry = getCountryFromAccount(account);
  const hostCountry = getCountryFromAccount(host);

  const vatType = getAccountVATType(account);
  if (vatType) {
    let vatOriginCountry;
    if (vatType === 'OWN') {
      vatOriginCountry = getVatOriginCountry(tierType, accountCountry, accountCountry);
    } else {
      vatOriginCountry = getVatOriginCountry(tierType, hostCountry, accountCountry);
    }

    if (vatMayApply(tierType, vatOriginCountry)) {
      const vatRate = getStandardVatRate(tierType, vatOriginCountry);
      taxes.push({ type: TaxType.VAT, percentage: vatRate });
    }
  }

  if (accountHasGST(host) && gstMayApply(tierType)) {
    taxes.push({ type: TaxType.GST, percentage: GST_RATE_PERCENT });
  }

  return taxes;
};

/**
 * Returns a list of taxes that may apply for this account
 */
export const getApplicableTaxesForCountry = (country: string): TaxType[] => {
  const taxes = [];

  if (!country) {
    return [];
  } else if (isMemberOfTheEuropeanUnion(country)) {
    taxes.push(TaxType.VAT);
  } else if (country === 'NZ') {
    taxes.push(TaxType.GST);
  }

  return taxes;
};
