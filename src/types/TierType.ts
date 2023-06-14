export enum TierType {
  SUPPORT = 'SUPPORT',
  SERVICE = 'SERVICE',
  PRODUCT = 'PRODUCT',
  TICKET = 'TICKET',
  TIER = 'TIER',
  MEMBERSHIP = 'MEMBERSHIP',
  DONATION = 'DONATION',
}

export type TierTypes = keyof typeof TierType;
