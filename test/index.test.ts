import { getApplicableTaxes, getApplicableTaxesForCountry } from '../src';
import { TierType } from '../src/types/TierType';
import { TaxType } from '../src/types/TaxType';

describe('getApplicableTaxes', () => {
  it('Detects VAT from collective', () => {
    expect(getApplicableTaxes({}, {}, TierType.PRODUCT)).toEqual([]);
    expect(
      getApplicableTaxes(
        {
          settings: { VAT: { type: 'OWN' } },
          countryISO: 'FR',
        },
        null,
        TierType.PRODUCT,
      ),
    ).toEqual([{ type: TaxType.VAT, percentage: 20 }]);
  });

  it('Detects VAT from host', () => {
    expect(getApplicableTaxes({}, {}, TierType.PRODUCT)).toEqual([]);
    expect(
      getApplicableTaxes(
        {
          settings: { VAT: { type: 'HOST' } },
        },
        {
          settings: { VAT: { type: 'OWN' } },
          countryISO: 'FR',
        },
        TierType.PRODUCT,
      ),
    ).toEqual([{ type: TaxType.VAT, percentage: 20 }]);
  });

  it('Detects GST from host', () => {
    expect(
      getApplicableTaxes(
        {},
        {
          settings: { GST: {} },
          countryISO: 'NZ',
        },
        TierType.PRODUCT,
      ),
    ).toEqual([{ type: TaxType.GST, percentage: 15 }]);
  });
});

describe('getApplicableTaxesForCountry', () => {
  it('Returns empty array when no available', () => {
    expect(getApplicableTaxesForCountry('US')).toEqual([]);
  });

  it('Detects VAT', () => {
    expect(getApplicableTaxesForCountry('FR')).toEqual([TaxType.VAT]);
    expect(getApplicableTaxesForCountry('BE')).toEqual([TaxType.VAT]);
  });

  it('Detects GST', () => {
    expect(getApplicableTaxesForCountry('NZ')).toEqual([TaxType.GST]);
  });
});
