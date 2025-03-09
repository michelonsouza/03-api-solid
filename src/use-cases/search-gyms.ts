import { Gym, GymsRepository } from '@/repositories/gyms-repository';

interface SearchGymsUseCaseParams {
  query: string;
  page?: number;
}

interface SearchGymsUseCaseResponse {
  data: Gym[];
}

export class SearchGymsUseCase {
  #gymsRepository: GymsRepository;

  constructor(gymsRepository: GymsRepository) {
    this.#gymsRepository = gymsRepository;
  }

  async execute({
    query,
    page = 1,
  }: SearchGymsUseCaseParams): Promise<SearchGymsUseCaseResponse> {
    const gyms = await this.#gymsRepository.searchMany(query, page);

    return { data: gyms };
  }
}
