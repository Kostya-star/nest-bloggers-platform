import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserContext } from '../dto/user-context';

export const ExtractUserFromRequestIfExist = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserContext | null => {
    const request = context.switchToHttp().getRequest();

    const user = request.user;

    return user || null;
  },
);
