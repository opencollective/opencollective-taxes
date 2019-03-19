import {
  isTierTypeSubjectToVAT,
  vatMayApply,
  getStandardVatRate,
  getVatPercentage,
  checkVATNumberFormat,
} from '../src/vat';

const FRENCH_VAT = 20;
const BELGIUM_VAT = 21;

it('taxes only certain tier types', () => {
  expect(isTierTypeSubjectToVAT('PRODUCT')).toBe(true);
  expect(isTierTypeSubjectToVAT('SERVICE')).toBe(true);
  expect(isTierTypeSubjectToVAT('SUPPORT')).toBe(true);
  expect(isTierTypeSubjectToVAT('TICKET')).toBe(true);

  expect(isTierTypeSubjectToVAT('DONATION')).toBe(false);
  expect(isTierTypeSubjectToVAT('MEMBERSHIP')).toBe(false);
});

describe('vatMayApply', () => {
  it('returns false for non european host', () => {
    expect(vatMayApply('PRODUCT', 'US', 'US')).toBe(false);
    expect(vatMayApply('PRODUCT', 'US', 'FR')).toBe(false);
  });
});

describe('getStandardVatRate', () => {
  it('uses the host country for product and services', () => {
    expect(getStandardVatRate('SERVICE', 'BE', 'FR')).toBe(BELGIUM_VAT);
    expect(getStandardVatRate('SUPPORT', 'BE', 'FR')).toBe(BELGIUM_VAT);
    expect(getStandardVatRate('PRODUCT', 'BE', 'FR')).toBe(BELGIUM_VAT);
  });

  it("if tier is an event, VAT depend on the event's country", () => {
    expect(getStandardVatRate('TICKET', 'BE', 'FR')).toBe(FRENCH_VAT);
    expect(getStandardVatRate('TICKET', 'FR', 'BE')).toBe(BELGIUM_VAT);
  });
});

describe('getVatPercentage', () => {
  describe('has VAT if', () => {
    it('individual is in the same country', () => {
      expect(getVatPercentage('PRODUCT', 'FR', 'FR', 'FR', false)).toBe(FRENCH_VAT);
    });

    it('it is an individual in a different european country', () => {
      expect(getVatPercentage('PRODUCT', 'FR', 'FR', 'BE', false)).toBe(FRENCH_VAT);
    });

    it('it is a company in the same country', () => {
      expect(getVatPercentage('PRODUCT', 'FR', 'FR', 'FR', true)).toBe(FRENCH_VAT);
    });
  });

  describe('has NO VAT if', () => {
    it('it is a company in a different european country', () => {
      expect(getVatPercentage('PRODUCT', 'BE', 'BE', 'FR', true)).toBe(0);
    });

    it('it is an individual in a different country outside EU', () => {
      expect(getVatPercentage('PRODUCT', 'BE', 'BE', 'US', false)).toBe(0);
    });

    it('it is a company in a different country outside EU', () => {
      expect(getVatPercentage('PRODUCT', 'BE', 'BE', 'US', true)).toBe(0);
    });
  });

  it('for events, the place where the event takes place determines the vat', () => {
    expect(getVatPercentage('TICKET', 'FR', 'BE', 'FR', false)).toBe(BELGIUM_VAT);
    expect(getVatPercentage('TICKET', 'FR', 'FR', 'FR', false)).toBe(FRENCH_VAT);
  });
});

describe('checkVATNumberFormat', () => {
  it('checks for invalid numbers', () => {
    expect(checkVATNumberFormat('xxx')).toEqual({
      isValid: false,
      value: 'XXX',
    });
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
      value: 'FRXX999999999',
    });
  });
});
