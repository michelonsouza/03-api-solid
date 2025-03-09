import { fakerPT_BR as faker } from '@faker-js/faker';
import { addDays, subYears } from 'date-fns';

import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { GymsRepository } from '@/repositories/gyms-repository';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { InMemoryGymsInsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';

import { GetUserMetricsUseCase } from './get-user-metrics';

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
let sut: GetUserMetricsUseCase;
let mockedData: CheckInMockedDataType;
let gymMockedData: GymMockeddataType;

async function makeCheckIns(quantity: number, userId?: string) {
  const gym = await gymsRepository.create(gymMockedData);
  const userCheckIns = await Promise.all(
    Array(quantity)
      .fill(null)
      .map((_, index) =>
        checkInsRepository.create({
          ...mockedData,
          gymId: gym.id,
          userId: userId ?? mockedData?.userId,
          createdAt: addDays(subYears(new Date(), 1), index),
        }),
      ),
  );

  return { gym, userCheckIns };
}

describe('Get User Metrics use case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsInsRepository();
    sut = new GetUserMetricsUseCase(checkInsRepository);

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

  it('should be able get check-ins count from metrics', async () => {
    const { userCheckIns } = await makeCheckIns(
      faker.number.int({ min: 0, max: 20 }),
    );
    await makeCheckIns(5, faker.string.uuid());

    const { data } = await sut.execute({ userId: mockedData.userId });

    expect(data.checkInsCount).toEqual(userCheckIns.length);
  });
});
