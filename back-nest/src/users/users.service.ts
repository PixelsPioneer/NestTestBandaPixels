import { Injectable } from '@nestjs/common';

import { User } from './model/users.model';

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      user_id: 1,
      login: 'admin',
      password: 'admin',
      role: 'admin',
    },
    {
      user_id: 2,
      login: 'user',
      password: 'user123',
      role: 'user',
    },
  ];

  async findOne(login: string): Promise<User | null> {
    const user = this.users.find((user) => user.login === login);

    return user || null;
  }
}
