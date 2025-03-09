import { fakerPT_BR as faker } from '@faker-js/faker';

import { GymsRepository } from '@/repositories/gyms-repository';
import { InMemoryGymsInsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';

import { FetchNearbyUseCase } from './fetch-nearby-gyms';

interface CreateGymMockedDataType {
  title: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  description: string | null;
}

interface LocationParamType {
  latitude: number;
  longitude: number;
}

let sut: FetchNearbyUseCase;
let gymsRepository: GymsRepository;

async function makeGyms(
  quantity: number,
  { latitude, longitude }: LocationParamType = {} as LocationParamType,
) {
  const stubGyms = await Promise.all(
    Array(quantity)
      .fill(null)
      .map(() => {
        const data: CreateGymMockedDataType = {
          title: faker.company.name(),
          description: faker.lorem.words(10),
          phone: faker.phone.number(),
          latitude: latitude ?? faker.location.latitude(),
          longitude: longitude ?? faker.location.longitude(),
        };

        return gymsRepository.create(data);
      }),
  );

  return { stubGyms };
}

describe('Fetch Nearby Gyms use case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsInsRepository();
    sut = new FetchNearbyUseCase(gymsRepository);
  });

  it('should be able to fetch nearby gyms', async () => {
    const mockedLocation = {
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
    };

    // Create gyms far from the user
    await makeGyms(faker.number.int({ min: 1, max: 10 }), {
      latitude: mockedLocation.latitude + 2,
      longitude: mockedLocation.longitude + 2,
    });

    // Create gyms near the user
    const { stubGyms } = await makeGyms(
      faker.number.int({ min: 1, max: 10 }),
      mockedLocation,
    );

    const { data } = await sut.execute({
      userLatitude: mockedLocation.latitude + 0.01,
      userLongitude: mockedLocation.longitude + 0.01,
    });

    expect(data).toHaveLength(stubGyms.length);
  });
});
