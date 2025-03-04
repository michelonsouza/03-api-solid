import { prisma } from '@/lib/prisma';

import type {
  UsersRepository,
  UserCreateInput,
  User,
} from '../users-repository';

export class PrismaUsersRepository implements UsersRepository {
  async create(data: UserCreateInput): Promise<User> {
    const user = await prisma.user.create({
      data,
    });

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }
}
