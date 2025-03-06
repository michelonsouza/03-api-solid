import { fakerPT_BR as faker } from '@faker-js/faker';
import { compare } from 'bcryptjs';

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UsersRepository } from '@/repositories/users-repository';

import { UserAlreadyExistsError } from './errors/user-already-exists';
import { RegisterUseCase } from './register';

let usersRepository: UsersRepository;
let sut: RegisterUseCase;

describe('Register use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });

  it('should be able to register', async () => {
    const userInput = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({
        length: 8,
      }),
    };

    await sut.execute(userInput);
    const user = await usersRepository.findByEmail(userInput.email);

    expect(user).toEqual(
      expect.objectContaining({
        name: userInput.name,
        email: userInput.email,
      }),
    );
    expect(user?.id).toEqual(expect.any(String));
  });

  it('should hash user password upon registration', async () => {
    const userInput = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({
        length: 8,
      }),
    };

    const { data } = await sut.execute(userInput);

    const isPasswordCorrectlyHashed = await compare(
      userInput.password,
      data.password_hash,
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('should not be able to register with same email twice', async () => {
    const userInput = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({
        length: 8,
      }),
    };

    await sut.execute(userInput);

    await expect(sut.execute(userInput)).rejects.toBeInstanceOf(
      UserAlreadyExistsError,
    );
  });
});
