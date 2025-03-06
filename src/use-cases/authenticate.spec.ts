import { fakerPT_BR as faker } from '@faker-js/faker';
import { hash } from 'bcryptjs';

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';

import { AuthenticateUseCase } from './authenticate';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe('Authenticate use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it('should be able to authenticate a user', async () => {
    const password = faker.internet.password();

    const userInput = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password_hash: await hash(password, 6),
    };

    await usersRepository.create(userInput);

    const response = await sut.execute({
      email: userInput.email,
      password,
    });

    expect(response.data).toEqual(expect.objectContaining(userInput));
  });

  it('should not be able to authenticate with wrong email', async () => {
    const authenticateInput = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    await expect(sut.execute(authenticateInput)).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
  });

  it('should not be able to authenticate with wrong password', async () => {
    const userInput = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password_hash: await hash(faker.internet.password(), 6),
    };

    await usersRepository.create(userInput);

    const authenticateInput = {
      email: userInput.email,
      password: faker.internet.password(),
    };

    await expect(sut.execute(authenticateInput)).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
  });
});
