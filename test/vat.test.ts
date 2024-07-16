import {
  isTierTypeSubjectToVAT,
  vatMayApply,
  getStandardVatRate,
  getVatPercentage,
  checkVATNumberFormat,
  getVatOriginCountry,
} from '../src/eu-vat';
import { TierType } from '../src/types/TierType';

const FRENCH_VAT = 20;
const BELGIUM_VAT = 21;

it('taxes only certain tier types', () => {
  expect(isTierTypeSubjectToVAT(TierType.PRODUCT)).toBe(true);
  expect(isTierTypeSubjectToVAT(TierType.SERVICE)).toBe(true);
  expect(isTierTypeSubjectToVAT(TierType.SUPPORT)).toBe(true);
  expect(isTierTypeSubjectToVAT(TierType.TICKET)).toBe(true);

  expect(isTierTypeSubjectToVAT(TierType.DONATION)).toBe(false);
  expect(isTierTypeSubjectToVAT(TierType.MEMBERSHIP)).toBe(false);
});

describe('getVatOriginCountry', () => {
  test('returns the country where VAT applies based on tier type', () => {
    expect(getVatOriginCountry(TierType.PRODUCT, 'FR', 'BE')).toBe('FR');
    expect(getVatOriginCountry(TierType.SUPPORT, 'FR', 'BE')).toBe('FR');
    expect(getVatOriginCountry(TierType.SERVICE, 'FR', 'BE')).toBe('FR');
    expect(getVatOriginCountry(TierType.TICKET, 'FR', 'BE')).toBe('BE');
  });

  test("returns null when VAT doesn't apply", () => {
    expect(getVatOriginCountry(TierType.DONATION, 'FR', 'BE')).toBe(null);
    expect(getVatOriginCountry(TierType.PRODUCT, 'US', 'US')).toBe(null);
  });
});

describe('vatMayApply', () => {
  it('returns false for non european countries', () => {
    expect(vatMayApply(TierType.PRODUCT, 'US')).toBe(false);
    expect(vatMayApply(TierType.PRODUCT, 'US')).toBe(false);
  });

  it('returns true for european countries', () => {
    expect(vatMayApply(TierType.PRODUCT, 'FR')).toBe(true);
    expect(vatMayApply(TierType.PRODUCT, 'BE')).toBe(true);
  });

  it('returns false when tier type is not a taxed type', () => {
    expect(vatMayApply(TierType.DONATION, 'FR')).toBe(false);
  });
});

describe('getStandardVatRate', () => {
  it('returns the valud based on the country', () => {
    expect(getStandardVatRate(TierType.SERVICE, 'BE')).toBe(BELGIUM_VAT);
    expect(getStandardVatRate(TierType.SERVICE, 'FR')).toBe(FRENCH_VAT);
    expect(getStandardVatRate(TierType.SUPPORT, 'BE')).toBe(BELGIUM_VAT);
    expect(getStandardVatRate(TierType.PRODUCT, 'BE')).toBe(BELGIUM_VAT);
    expect(getStandardVatRate(TierType.TICKET, 'BE')).toBe(BELGIUM_VAT);
    expect(getStandardVatRate(TierType.DONATION, 'BE')).toBe(0);
  });
});

describe('getVatPercentage', () => {
  describe('has VAT if', () => {
    it('individual is in the same country', () => {
      expect(getVatPercentage(TierType.PRODUCT, 'FR', 'FR', false)).toBe(FRENCH_VAT);
    });

    it('it is an individual in a different european country', () => {
      expect(getVatPercentage(TierType.PRODUCT, 'FR', 'BE', false)).toBe(FRENCH_VAT);
    });

    it('it is a company in the same country', () => {
      expect(getVatPercentage(TierType.PRODUCT, 'FR', 'FR', true)).toBe(FRENCH_VAT);
    });
  });

  describe('has NO VAT if', () => {
    it('it is a company in a different european country', () => {
      expect(getVatPercentage(TierType.PRODUCT, 'BE', 'FR', true)).toBe(0);
    });

    it('it is an individual in a different country outside EU', () => {
      expect(getVatPercentage(TierType.PRODUCT, 'BE', 'US', false)).toBe(0);
    });

    it('it is a company in a different country outside EU', () => {
      expect(getVatPercentage(TierType.PRODUCT, 'BE', 'US', true)).toBe(0);
    });
  });

  it('for events, the place where the event takes place determines the vat', () => {
    expect(getVatPercentage(TierType.TICKET, 'BE', 'FR', false)).toBe(BELGIUM_VAT);
    expect(getVatPercentage(TierType.TICKET, 'FR', 'FR', false)).toBe(FRENCH_VAT);
  });
});

describe('checkVATNumberFormat', () => {
  it('checks for invalid numbers', () => {
    expect(checkVATNumberFormat('xxx')).toEqual({
      isValid: false,
      value: 'XXX',
      country: undefined,
      isSupportedCountry: false,
      isValidFormat: false,
    });
  });

  it('can check against a single country', () => {
    expect(checkVATNumberFormat('FR XX-999999999').isValid).toBe(true);
    expect(checkVATNumberFormat('FR XX-999999999', 'BE').isValid).toBe(false);
  });

  it('returns rich information', () => {
    expect(checkVATNumberFormat('FRXX999999999')).toEqual({
      country: {
        isoCode: {
          long: 'FRA',
          numeric: '250',
          short: 'FR',
        },
        name: 'France',
      },
      isSupportedCountry: true,
      isValidFormat: true,
      isValid: true,
      value: 'FRXX999999999',
    });
  });

  it('formats number', () => {
    expect(checkVATNumberFormat(' FR XX-999999999 ')).toEqual({
      country: {
        isoCode: {
          long: 'FRA',
          numeric: '250',
          short: 'FR',
        },
        name: 'France',
      },
      isValid: true,
      isSupportedCountry: true,
      isValidFormat: true,
      value: 'FRXX999999999',
    });
  });
});
