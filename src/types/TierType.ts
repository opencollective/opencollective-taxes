export enum ETierType {
  SUPPORT = 'SUPPORT',
  SERVICE = 'SERVICE',
  PRODUCT = 'PRODUCT',
  TICKET = 'TICKET',
  TIER = 'TIER',
  MEMBERSHIP = 'MEMBERSHIP',
  DONATION = 'DONATION',
}

type TierType = keyof typeof ETierType;

export default TierType;
