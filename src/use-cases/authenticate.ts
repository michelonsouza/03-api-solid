import { compare } from 'bcryptjs';

import { User, UsersRepository } from '@/repositories/users-repository';

import { InvalidCredentialsError } from './errors/invalid-credentials-error';

interface AuthenticateUseCaseParams {
  email: string;
  password: string;
}

interface AuthenticateUseCaseResponse {
  data: User;
}

export class AuthenticateUseCase {
  #usersRepository: UsersRepository;

  constructor(usersRepository: UsersRepository) {
    this.#usersRepository = usersRepository;
  }

  async execute({
    email,
    password,
  }: AuthenticateUseCaseParams): Promise<AuthenticateUseCaseResponse> {
    const user = await this.#usersRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const doesPasswordMatches = await compare(password, user.password_hash);

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError();
    }

    return { data: user };
  }
}
