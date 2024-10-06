import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RequestWithUserId } from 'src/common/interfaces/Interfaces';
import { extractUserIdFromToken } from 'src/utils/token.utils';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUserId>();
    const authorizationHeader = request.headers.authorization;

    request.userId = extractUserIdFromToken(
      this.jwtService,
      authorizationHeader,
    );

    return true;
  }
}
