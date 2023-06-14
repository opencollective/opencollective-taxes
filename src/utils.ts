import { get } from 'lodash';

export const getCountryFromAccount = (account: Record<string, unknown> | null): string | null => {
  if (!account) {
    return null;
  }

  return (
    ((get(account, 'countryISO') ||
      get(account.location, 'country') ||
      get(account.parent, 'countryISO') ||
      get(account.parent, 'location.country') ||
      get(account.parentCollective, 'countryISO') ||
      get(account.parentCollective, 'location.country')) as string) || null
  );
};
