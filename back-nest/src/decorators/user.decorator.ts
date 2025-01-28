import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserDto } from '../dto/user.dto';

export const User = createParamDecorator(
  (data: UserDto, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
