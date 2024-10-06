import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
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
  async create(
    userId: string,
    createLinkDto: CreateLinkDto,
  ): Promise<CreateLinkResponseDto> {
    let user = null;

    user = await this.userService.findOne(userId);
    if (!user) throw new BadRequestException('User doest not exist');

    const alias = createLinkDto.alias
      ? createLinkDto.alias
      : this.generateAlias(+process.env.ALIAS_LENGTH);

    const linkWithSameAliasOrLongLink = await this.linkRepository.findOne({
      where: [
        { userId, longLink: createLinkDto.longLink },
        {
          userId,
          alias,
        },
      ],
    });

    if (linkWithSameAliasOrLongLink) {
      return linkWithSameAliasOrLongLink;
    }

    const newLink = this.linkRepository.create({
      ...createLinkDto,
      alias,
      userId,
    });

    return await this.linkRepository.save(newLink);
  }

  async findAll(userId: string) {
    try {
      const result = await this.linkRepository.find({
        where: {
          userId,
        },
      });

      return result;
    } catch (error) {
      Logger.error(error);
    }
  }

  async findOneById(id: number, userId: string) {
    return await this.linkRepository.findOne({
      where: {
        id,
        userId,
      },
    });
  }

  async findOneByAlias(alias: string, userId: string) {
    const link = await this.linkRepository.findOneBy({ userId, alias });
    return link;
  }

  async updateLink(id: number, updateLinkDto: UpdateLinkDto, userId: string) {
    const toBeUpdatedLink = await this.findOneById(+id, userId);
    const result = await this.linkRepository.update(id, updateLinkDto);

    if (result.affected === 0) {
      throw new NotFoundException();
    }

    this.cacheService.del(`${userId}:${toBeUpdatedLink.alias}`);
    return await this.findOneById(id, userId);
  }

  async remove(id: number, userId: string) {
    const result = await this.linkRepository.delete({ id, userId });
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

  async getLinkFromCacheOrDatabase(
    alias: string,
    userId: string,
  ): Promise<Link | null> {
    const cachedLink = await this.cacheService.get<Link>(`${userId}:${alias}`);

    if (cachedLink) {
      this.incrementLinkView(cachedLink);
      return cachedLink;
    }

    const link = await this.findOneByAlias(alias, userId);
    if (!link) {
      throw new NotFoundException('Link not found.');
    }
    this.incrementLinkView(link);

    await this.cacheService.set(`${userId}:${alias}`, link);

    return link;
  }

  incrementLinkView(link: Link): void {
    link.views++;
    this.linkRepository.save(link);
  }

  getAllLinks() {
    return this.linkRepository.find({});
  }
}
