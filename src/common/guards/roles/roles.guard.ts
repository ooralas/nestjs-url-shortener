import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from 'src/user/user.service';
import { Role } from 'src/common/enums/role.enum';
import { ROLES_KEY } from 'src/common/decorators/roles.decorators';
import { RequestWithUserId } from 'src/common/interfaces/Interfaces';
import { JwtService } from '@nestjs/jwt';
import { extractUserIdFromToken } from 'src/utils/token.utils';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUserId>();
    const authorizationHeader = request.headers.authorization;

    request.userId = extractUserIdFromToken(
      this.jwtService,
      authorizationHeader,
    );

    const user = await this.userService.findOne(request.userId, false, true);
    return requiredRoles.includes(user?.role);
  }
}
