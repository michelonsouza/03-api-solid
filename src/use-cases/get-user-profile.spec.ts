import { fakerPT_BR as faker } from '@faker-js/faker';
import { hash } from 'bcryptjs';

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';

import { ResourceNotFoundError } from './errors/resource-not-found';
import { GetUserProfileUseCase } from './get-user-profile';

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe('Get User Profile use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  it('should be able to get user profile', async () => {
    const password = faker.internet.password();

    const userInput = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password_hash: await hash(password, 6),
    };

    const user = await usersRepository.create(userInput);

    const response = await sut.execute({ userId: user.id });

    expect(response.data).toEqual(
      expect.objectContaining({
        name: userInput.name,
        email: userInput.email,
      }),
    );
  });

  it('should not be able to get user profile with wrong id', async () => {
    await expect(
      sut.execute({ userId: faker.string.uuid() }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
