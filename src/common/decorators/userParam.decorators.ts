import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUserId } from '../interfaces/Interfaces';

export const UserId = createParamDecorator((_, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<RequestWithUserId>();
  return request.userId;
});
