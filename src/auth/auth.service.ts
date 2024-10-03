import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDataDTO } from './dto/signupData.dto';
import { UserService } from 'src/user/user.service';
import { SigninDataDTO } from './dto/signinData.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject() readonly userService: UserService,
    readonly jwtService: JwtService,
  ) {}

  async signup(signupData: SignupDataDTO) {
    const isEmailInUse = await this.userService.findOneByEmail(
      signupData.email,
    );
    if (isEmailInUse) throw new ConflictException('Email already used');

    const data = await this.userService.create(signupData);

    return data;
  }

  async signin(signinData: SigninDataDTO) {
    const user = await this.userService.findOneByEmail(signinData.email);
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isPasswordMatches = await bcrypt.compare(
      signinData.password,
      user.password,
    );
    if (!isPasswordMatches)
      throw new UnauthorizedException('Invalid email or password');

    const token = this.generateUserToken(user.id);

    return { token };
  }

  generateUserToken(userId: string) {
    return this.jwtService.sign({ userId }, { expiresIn: '2h' });
  }
}
