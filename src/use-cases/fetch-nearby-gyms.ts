import { Gym, GymsRepository } from '@/repositories/gyms-repository';

interface FetchNearbyUseCaseParams {
  userLatitude: number;
  userLongitude: number;
}

interface FetchNearbyUseCaseResponse {
  data: Gym[];
}

export class FetchNearbyUseCase {
  #gymsRepository: GymsRepository;

  constructor(gymsRepository: GymsRepository) {
    this.#gymsRepository = gymsRepository;
  }

  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearbyUseCaseParams): Promise<FetchNearbyUseCaseResponse> {
    const gyms = await this.#gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    });

    return { data: gyms };
  }
}
