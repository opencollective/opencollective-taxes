import { get } from 'lodash';
import TierType from './types/TierType';

export const GST_RATE_PERCENT = 15;

/**
 * Returns true if GST is enabled for this account
 */
export const accountHasGST = (account: Record<string, unknown> | null): boolean => {
  return Boolean(
    get(account, 'settings.GST') ||
      get(account, 'parent.settings.GST') ||
      get(account, 'parentCollective.settings.GST'),
  );
};

/**
 * Returns true if the given tier type can be subject to VAT
 */
export const isTierTypeSubjectToGST = (tierType: TierType): boolean => {
  const taxedTiersTypes: string[] = [TierType.SUPPORT, TierType.SERVICE, TierType.PRODUCT, TierType.TICKET];
  return taxedTiersTypes.includes(tierType);
};

/**
 * Returns true if GST may apply.
 *
 * @param tierType - the tier type (eg. SUPPORT, TICKET...)
 * @param originCOuntry - two letters country where GST is applied
 */
export const gstMayApply = (tierType: TierType): boolean => {
  return isTierTypeSubjectToGST(tierType);
};
