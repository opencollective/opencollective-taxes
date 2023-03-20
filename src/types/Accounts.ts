export type Account = {
  settings?: Record<string, unknown>;
  countryISO?: string;
  location?: {
    country: string;
  };
};
