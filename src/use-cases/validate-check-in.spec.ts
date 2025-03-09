import { fakerPT_BR as faker } from '@faker-js/faker';
import { vi } from 'vitest';

import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';

import { LateCheckInValidationErrorError } from './errors/late-check-in-validation-error';
import { ResourceNotFoundError } from './errors/resource-not-found';
import { ValidateCheckInsUseCase } from './validate-check-in';

interface CheckInMockedDataType {
  userId: string;
  gymId: string;
  validatedAt?: Date | string | null;
  userLatitude: number;
  userLongitude: number;
}

let checkInsRepository: CheckInsRepository;
let sut: ValidateCheckInsUseCase;
let mockedData: CheckInMockedDataType;

describe('Check In use case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInsUseCase(checkInsRepository);

    mockedData = {
      validatedAt: null,
      userId: faker.string.uuid(),
      gymId: faker.string.uuid(),
      userLatitude: faker.location.latitude(),
      userLongitude: faker.location.longitude(),
    };

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to validate the check-in', async () => {
    const mockedCheckIn = await checkInsRepository.create(mockedData);

    const { data } = await sut.execute({ checkInId: mockedCheckIn.id });

    expect(data.validated_at).toEqual(expect.any(Date));
  });

  it('should not be able to validate an inexistent check-in', async () => {
    await expect(
      sut.execute({ checkInId: faker.string.uuid() }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    const refDate = faker.date.past({ years: 1 });

    vi.setSystemTime(refDate);

    const mockedCheckIn = await checkInsRepository.create(mockedData);

    const twentyOneMinutesInMilliseconds = 21 * 60 * 1000;

    vi.advanceTimersByTime(twentyOneMinutesInMilliseconds);

    await expect(
      sut.execute({ checkInId: mockedCheckIn.id }),
    ).rejects.toBeInstanceOf(LateCheckInValidationErrorError);
  });
});
