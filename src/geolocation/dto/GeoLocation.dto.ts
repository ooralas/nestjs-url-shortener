import { Expose } from 'class-transformer';

export class GeoLocationDto {
  @Expose({ name: 'ip' })
  ip: string;

  @Expose({ name: 'network' })
  network: string;

  @Expose({ name: 'version' })
  version: string;

  @Expose({ name: 'city' })
  city: string;

  @Expose({ name: 'region' })
  region: string;

  @Expose({ name: 'region_code' })
  regionCode: string;

  @Expose({ name: 'country' })
  country: string;

  @Expose({ name: 'country_name' })
  countryName: string;

  @Expose({ name: 'country_code' })
  countryCode: string;

  @Expose({ name: 'country_code_iso3' })
  countryCodeIso3: string;

  @Expose({ name: 'country_capital' })
  countryCapital: string;

  @Expose({ name: 'country_tld' })
  countryTld: string;

  @Expose({ name: 'continent_code' })
  continentCode: string;

  @Expose({ name: 'in_eu' })
  inEu: boolean;

  @Expose({ name: 'postal' })
  postal: string;

  @Expose({ name: 'latitude' })
  latitude: number;

  @Expose({ name: 'longitude' })
  longitude: number;

  @Expose({ name: 'timezone' })
  timezone: string;

  @Expose({ name: 'utc_offset' })
  utcOffset: string;

  @Expose({ name: 'country_calling_code' })
  countryCallingCode: string;

  @Expose({ name: 'currency' })
  currency: string;

  @Expose({ name: 'currency_name' })
  currencyName: string;

  @Expose({ name: 'languages' })
  languages: string;

  @Expose({ name: 'country_area' })
  countryArea: number;

  @Expose({ name: 'country_population' })
  countryPopulation: number;

  @Expose({ name: 'asn' })
  asn: string;

  @Expose({ name: 'org' })
  org: string;
}
