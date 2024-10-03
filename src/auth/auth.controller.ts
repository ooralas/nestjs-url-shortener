import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDataDTO } from './dto/signupData.dto';
import { SigninDataDTO } from './dto/signinData.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up a user using provided user data' })
  @ApiBody({ type: SignupDataDTO })
  async signup(@Body() signupData: SignupDataDTO) {
    return this.authService.signup(signupData);
  }

  @Post('signin')
  @ApiOperation({ summary: 'User Sign in using provided user data' })
  @ApiBody({ type: SigninDataDTO })
  async signin(@Body() signinData: SigninDataDTO) {
    return this.authService.signin(signinData);
  }
}
