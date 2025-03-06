import { fakerPT_BR as faker } from '@faker-js/faker';

import { GymsRepository } from '@/repositories/gyms-repository';
import { InMemoryGymsInsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';

import { CreateGymUseCase } from './create-gym';

interface CreateGymMockedDataType {
  title: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  description: string | null;
}

let sut: CreateGymUseCase;
let gymsRepository: GymsRepository;
let mockedData: CreateGymMockedDataType;

describe('Create Gym use case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsInsRepository();
    sut = new CreateGymUseCase(gymsRepository);

    mockedData = {
      title: faker.company.name(),
      phone: faker.phone.number(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      description: faker.lorem.sentence(),
    };
  });

  it('should be able to gym', async () => {
    const { data: gym } = await sut.execute(mockedData);

    expect(gym.id).toEqual(expect.any(String));
  });
});
