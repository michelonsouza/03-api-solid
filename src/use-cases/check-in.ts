import {
  CheckIn,
  CheckInsRepository,
} from '@/repositories/check-ins-repository';
import { GymsRepository } from '@/repositories/gyms-repository';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';

import { MaxDistanceError } from './errors/max-distance-error';
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error';
import { ResourceNotFoundError } from './errors/resource-not-found';

interface CheckInsUseCaseParams {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInsUseCaseResponse {
  data: CheckIn;
}

export class CheckInsUseCase {
  #checkInsRepository: CheckInsRepository;
  #gymsRepository: GymsRepository;

  constructor(
    checkInsRepository: CheckInsRepository,
    gymsRepository: GymsRepository,
  ) {
    this.#checkInsRepository = checkInsRepository;
    this.#gymsRepository = gymsRepository;
  }

  async execute({
    gymId,
    userId,
    userLatitude,
    userLongitude,
  }: CheckInsUseCaseParams): Promise<CheckInsUseCaseResponse> {
    const gym = await this.#gymsRepository.findById(gymId);

    if (!gym) {
      throw new ResourceNotFoundError('Gym');
    }

    const from = {
      latitude: gym.latitude,
      longitude: gym.longitude,
    };

    const to = {
      latitude: userLatitude,
      longitude: userLongitude,
    };

    const distance = getDistanceBetweenCoordinates(from, to);

    const MAX_DISTANCE = 0.1; // 100 meters

    if (distance > MAX_DISTANCE) {
      throw new MaxDistanceError();
    }

    const checkInOnSameDay = await this.#checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    );

    if (checkInOnSameDay) {
      throw new MaxNumberOfCheckInsError();
    }

    const checkIn = await this.#checkInsRepository.create({ gymId, userId });

    return { data: checkIn };
  }
}
