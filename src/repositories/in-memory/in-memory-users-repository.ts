import { randomUUID } from 'node:crypto';

import { User, UserCreateInput, UsersRepository } from '../users-repository';

export class InMemoryUsersRepository implements UsersRepository {
  #users: User[] = [];

  async create(data: UserCreateInput) {
    const user: User = {
      ...data,
      id: randomUUID(),
      created_at: new Date().toISOString(),
    };

    this.#users.push(user);

    return Promise.resolve(user);
  }

  async findByEmail(email: string) {
    const user = this.#users.find(user => user.email === email) ?? null;

    return Promise.resolve(user);
  }
}
