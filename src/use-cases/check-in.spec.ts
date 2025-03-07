import { fakerPT_BR as faker } from '@faker-js/faker';
import { vi } from 'vitest';

import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { GymsRepository } from '@/repositories/gyms-repository';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { InMemoryGymsInsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';

import { CheckInsUseCase } from './check-in';
import { MaxDistanceError } from './errors/max-distance-error';
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error';
import { ResourceNotFoundError } from './errors/resource-not-found';

interface CheckInMockedDataType {
  userId: string;
  gymId: string;
  validatedAt?: Date | string | null;
  userLatitude: number;
  userLongitude: number;
}

interface GymMockeddataType {
  title: string;
  phone?: string;
  latitude: number;
  longitude: number;
  description?: string;
}

let checkInsRepository: CheckInsRepository;
let gymsRepository: GymsRepository;
let sut: CheckInsUseCase;
let mockedData: CheckInMockedDataType;
let gymMockedData: GymMockeddataType;

describe('Check In use case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsInsRepository();
    sut = new CheckInsUseCase(checkInsRepository, gymsRepository);
    vi.useFakeTimers();

    gymMockedData = {
      title: faker.company.name(),
      phone: faker.phone.number(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      description: faker.lorem.sentence(),
    };

    mockedData = {
      validatedAt: null,
      userId: faker.string.uuid(),
      gymId: faker.string.uuid(),
      userLatitude: faker.location.latitude(),
      userLongitude: faker.location.longitude(),
    };
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check in', async () => {
    const gym = await gymsRepository.create(gymMockedData);

    const data = {
      ...mockedData,
      gymId: gym.id,
      userLatitude: gym.latitude,
      userLongitude: gym.longitude,
    };

    const { data: checkIn } = await sut.execute(data);

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in when gym not exists', async () => {
    const data = {
      ...mockedData,
      gymId: faker.string.uuid(),
      userLatitude: faker.location.latitude(),
      userLongitude: faker.location.longitude(),
    };

    await expect(sut.execute(data)).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    );
  });

  it('should not be able to check in twice in the same day', async () => {
    const fakeDate = faker.date.past({ years: 1 });
    vi.setSystemTime(fakeDate);

    const gym2MockedData = { ...gymMockedData, id: faker.string.uuid() };
    const gym1 = await gymsRepository.create(gymMockedData);
    const gym2 = await gymsRepository.create(gym2MockedData);

    await sut.execute({
      userId: mockedData.userId,
      gymId: gym1.id,
      userLatitude: gym2MockedData.latitude,
      userLongitude: gym2MockedData.longitude,
    });

    await expect(
      sut.execute({
        userId: mockedData.userId,
        gymId: gym2.id,
        userLatitude: gymMockedData.latitude,
        userLongitude: gymMockedData.longitude,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it('should be able to check in twice but in different days', async () => {
    const refDate = faker.date.past({ years: 1 });
    vi.setSystemTime(faker.date.past({ years: 1, refDate }));
    const gym = await gymsRepository.create(gymMockedData);

    const data = {
      ...mockedData,
      gymId: gym.id,
      userLatitude: gym.latitude,
      userLongitude: gym.longitude,
    };

    await sut.execute(data);

    vi.setSystemTime(faker.date.past({ years: 2, refDate }));

    const checkIn = await sut.execute(data);

    expect(checkIn).toBeTruthy();
  });

  it('should not be able to check in distant gym', async () => {
    const gym = await gymsRepository.create(gymMockedData);

    const data = {
      ...mockedData,
      gymId: gym.id,
      userLatitude: gym.latitude + 1,
      userLongitude: gym.longitude + 1,
    };

    await expect(sut.execute(data)).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
