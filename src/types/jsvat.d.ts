declare module 'jsvat' {
  export function checkVAT(
    number: string,
  ): {
    value: string; // VAT without extra characters (like '-' and spaces)
    isValid: boolean;
    country: {
      // VAT's country (null if not found)
      name: string; //Name of the country
      isoCode: {
        //Country ISO codes
        short: string;
        long: string;
        numeric: string; //String, because of forwarding zero
      };
    };
  };
}
