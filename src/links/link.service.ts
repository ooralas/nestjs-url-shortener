import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from './entities/link.entity';
import { randomBytes } from 'crypto';
import { CacheService } from 'src/cache/cache.service';
import { UserService } from 'src/user/user.service';
import { CreateLinkResponseDto } from './dto/create-link-response.dto';

@Injectable()
export class LinkService {
  constructor(
    @InjectRepository(Link) private linkRepository: Repository<Link>,
    @Inject(CacheService) private cacheService: CacheService,
    @Inject(UserService) private userService: UserService,
  ) {}
  async create(createLinkDto: CreateLinkDto): Promise<CreateLinkResponseDto> {
    let user = null;
    if (createLinkDto.userId) {
      user = await this.userService.findOne(createLinkDto.userId);
      if (!user) throw new NotFoundException();
    }

    const alias = createLinkDto.alias
      ? createLinkDto.alias
      : this.generateAlias(+process.env.ALIAS_LENGTH);

    const linkWithSameAlias = await this.linkRepository.findOne({
      where: [{ alias }, { longLink: createLinkDto.longLink }],
    });
    if (linkWithSameAlias) {
      return linkWithSameAlias;
    }

    const newLink = this.linkRepository.create({
      ...createLinkDto,
      alias,
    });

    return await this.linkRepository.save(newLink);
  }

  async findAll() {
    return await this.linkRepository.find();
  }

  async findOneById(id: number) {
    return await this.linkRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findOneByAlias(alias: string) {
    const link = await this.linkRepository.findOneBy({ alias });
    if (!link) {
      throw new NotFoundException();
    }
    return link;
  }

  async updateLink(id: number, updateLinkDto: UpdateLinkDto) {
    const result = await this.linkRepository.update(id, updateLinkDto);
    if (result.affected === 0) {
      throw new NotFoundException();
    }
    return await this.findOneById(id);
  }

  async remove(id: number) {
    const result = await this.linkRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }

  private generateAlias(length: number): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';

    const charPool =
      lowercase.repeat(4) + uppercase.repeat(2) + digits.repeat(2);
    const poolLength = charPool.length;

    let alias = '';
    const randomBuffer = randomBytes(length);

    for (let i = 0; i < length; i++) {
      const randomIndex = randomBuffer[i] % poolLength;
      alias += charPool[randomIndex];
    }

    return alias;
  }

  async getLinkFromCacheOrDatabase(alias: string): Promise<Link | null> {
    const cachedLink = await this.cacheService.get<Link>(alias);
    if (cachedLink) {
      this.incrementLinkView(cachedLink);
      return cachedLink;
    }

    const link = await this.findOneByAlias(alias);
    if (!link) {
      throw new NotFoundException('Link not found.');
    }
    this.incrementLinkView(link);

    await this.cacheService.set(alias, link);

    return link;
  }

  incrementLinkView(link: Link): void {
    link.views++;
    this.linkRepository.save(link);
  }
}
