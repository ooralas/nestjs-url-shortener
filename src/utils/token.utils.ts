import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

export function extractUserIdFromToken(
  jwtService: JwtService,
  authorizationHeader: string | undefined,
): string {
  if (!authorizationHeader) {
    throw new UnauthorizedException('Authorization header is missing');
  }

  const token = authorizationHeader.split(' ')[1];
  if (!token) {
    throw new UnauthorizedException('Token is missing');
  }

  try {
    const payload = jwtService.verify(token);
    return payload.userId;
  } catch (error) {
    throw new UnauthorizedException('Invalid token');
  }
}
