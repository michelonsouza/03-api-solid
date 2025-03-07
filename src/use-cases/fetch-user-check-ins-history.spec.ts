import { fakerPT_BR as faker } from '@faker-js/faker';
import { addDays, subYears } from 'date-fns';

import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { GymsRepository } from '@/repositories/gyms-repository';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { InMemoryGymsInsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';

import { FetchmemberCheckInsHystoryUseCase } from './fetch-user-check-ins-history';

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
let sut: FetchmemberCheckInsHystoryUseCase;
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

describe('Fetch User Check-Ins use case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsInsRepository();
    sut = new FetchmemberCheckInsHystoryUseCase(checkInsRepository);

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

  it('should be able to fetch check-in history', async () => {
    const { userCheckIns } = await makeCheckIns(
      faker.number.int({ min: 1, max: 5 }),
    );
    await makeCheckIns(5, faker.string.uuid());

    const { data } = await sut.execute({ userId: mockedData.userId });

    expect(data.length).toEqual(userCheckIns.length);
    expect(data).toEqual(userCheckIns);
  });

  it('should be able to  fetch paginated user check-in history', async () => {
    const { userCheckIns } = await makeCheckIns(22);
    const expectedData = userCheckIns.filter(
      (_, index) => index > userCheckIns.length - 3,
    );

    const { data } = await sut.execute({ userId: mockedData.userId, page: 2 });

    expect(data.length).toEqual(expectedData.length);
    expect(data).toEqual(expectedData);
  });
});
