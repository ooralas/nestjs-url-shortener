import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { GeoLocationDto } from './dto/GeoLocation.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class GeolocationService {
  private readonly geolocationServiceAPIURL: string =
    process.env.GEO_LOCATION_SERVICE_API_URL;

  constructor(private readonly httpService: HttpService) {}

  private createRequestURL(ipAddress: string): string {
    return `${this.geolocationServiceAPIURL}/${ipAddress}/json`;
  }

  async retrieveGeolocationDataOfIpAddress(
    ipAddress: string,
  ): Promise<GeoLocationDto> {
    const requestUrl: string = this.createRequestURL(ipAddress);

    const data = await this.httpService.axiosRef
      .get(requestUrl)
      .then((res) => res.data)
      .catch((err) => console.error(err));

    return plainToClass(GeoLocationDto, data);
  }
}
