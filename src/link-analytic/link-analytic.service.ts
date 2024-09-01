import { Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LinkAnalytic } from './entities/link-analytic.entity';
import { Repository } from 'typeorm';
import * as requestIp from 'request-ip';
import { UAParser } from 'ua-parser-js';
import { Link } from 'src/links/entities/link.entity';
import { GeolocationService } from 'src/geolocation/geolocation.service';

@Injectable()
export class LinkAnalyticService {
  constructor(
    @InjectRepository(LinkAnalytic)
    private linkAnalyticRepository: Repository<LinkAnalytic>,
    private geoLocationService: GeolocationService,
  ) {}
  async createAnalyticForLink(
    @Req() linkRequest: Request,
    link: Link,
  ): Promise<void> {
    const clientIp: string = requestIp.getClientIp(linkRequest);
    const data: UAParser.IResult = UAParser(linkRequest.headers['user-agent']);

    const geoLocationData =
      await this.geoLocationService.retrieveGeolocationDataOfIpAddress(
        clientIp,
      );

    const newLinkAnalytic = new LinkAnalytic();
    newLinkAnalytic.browser = data.browser.name;
    newLinkAnalytic.device = data.device.model;
    newLinkAnalytic.ipAddress = clientIp;
    newLinkAnalytic.link = link;

    newLinkAnalytic.city = geoLocationData.city;
    newLinkAnalytic.country = geoLocationData.countryName;

    await this.linkAnalyticRepository.save(newLinkAnalytic);
  }

  async findAll() {
    return this.linkAnalyticRepository.find();
  }

  async findOne(id: number): Promise<LinkAnalytic> {
    return await this.linkAnalyticRepository.findOneBy({ id });
  }

  remove(id: number) {
    return this.linkAnalyticRepository.delete(id);
  }
}
