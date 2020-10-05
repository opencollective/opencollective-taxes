import { get } from 'lodash';

export const getCountryFromAccount = (account: Record<string, any> | null): string | null => {
  if (!account) {
    return null;
  }

  return (
    ((get(account.location, 'country') ||
      get(account.parent, 'location.country') ||
      get(account.parentCollective, 'location.country')) as string) || null
  );
};
