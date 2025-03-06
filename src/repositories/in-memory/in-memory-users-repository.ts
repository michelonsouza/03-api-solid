import { randomUUID } from 'node:crypto';

import { User, UserCreateInput, UsersRepository } from '../users-repository';

export class InMemoryUsersRepository implements UsersRepository {
  #users: User[] = [];

  async create({ email, name, password_hash }: UserCreateInput) {
    const user: User = {
      id: randomUUID(),
      name,
      email,
      password_hash,
      created_at: new Date().toISOString(),
    };

    this.#users.push(user);

    return Promise.resolve(user);
  }

  async findByEmail(email: string) {
    const user = this.#users.find(user => user.email === email) ?? null;

    return Promise.resolve(user);
  }

  async findById(id: string) {
    const user = this.#users.find(user => user.id === id) ?? null;

    return Promise.resolve(user);
  }
}
