export enum TierType {
  SUPPORT = 'SUPPORT',
  SERVICE = 'SERVICE',
  PRODUCT = 'PRODUCT',
  MULTIPLE_TICKET = 'MULTIPLE_TICKET',
  SINGLE_TICKET = 'SINGLE_TICKET',
  TIER = 'TIER',
  MEMBERSHIP = 'MEMBERSHIP',
  DONATION = 'DONATION',
}

export type TierTypes = keyof typeof TierType;

export default TierType;
