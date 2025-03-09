import { Gym, GymsRepository } from '@/repositories/gyms-repository';

interface FetchNearbyGymsUseCaseParams {
  userLatitude: number;
  userLongitude: number;
}

interface FetchNearbyGymsUseCaseResponse {
  data: Gym[];
}

export class FetchNearbyGymsUseCase {
  #gymsRepository: GymsRepository;

  constructor(gymsRepository: GymsRepository) {
    this.#gymsRepository = gymsRepository;
  }

  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearbyGymsUseCaseParams): Promise<FetchNearbyGymsUseCaseResponse> {
    const gyms = await this.#gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    });

    return { data: gyms };
  }
}
