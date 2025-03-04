import { hash } from 'bcryptjs';

import { User, UsersRepository } from '@/repositories/users-repository';

import { UserAlreadyExistsError } from './errors/user-already-exists';

interface RegisterUseCaseParams {
  name: string;
  email: string;
  password: string;
}

interface RegisterUseCaseResponse {
  data: User;
}

export class RegisterUseCase {
  #usersRepository: UsersRepository;

  constructor(usersRepository: UsersRepository) {
    this.#usersRepository = usersRepository;
  }

  async execute({
    email,
    name,
    password,
  }: RegisterUseCaseParams): Promise<RegisterUseCaseResponse> {
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await this.#usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const user = await this.#usersRepository.create({
      email,
      name,
      password_hash,
    });

    return { data: user };
  }
}
