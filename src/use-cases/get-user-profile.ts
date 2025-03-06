import { User, UsersRepository } from '@/repositories/users-repository';

import { ResourceNotFoundError } from './errors/resource-not-found';

interface GetUserProfileUseCaseParams {
  userId: string;
}

interface GetUserProfileUseCaseResponse {
  data: Omit<User, 'password_hash'>;
}

export class GetUserProfileUseCase {
  #usersRepository: UsersRepository;

  constructor(usersRepository: UsersRepository) {
    this.#usersRepository = usersRepository;
  }

  async execute({
    userId,
  }: GetUserProfileUseCaseParams): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.#usersRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFoundError('User');
    }

    // @ts-ignore
    delete user.password_hash;

    return { data: user };
  }
}
