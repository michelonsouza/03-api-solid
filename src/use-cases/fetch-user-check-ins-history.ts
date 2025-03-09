import {
  CheckIn,
  CheckInsRepository,
} from '@/repositories/check-ins-repository';

interface FetchUserCheckInsHystoryUseCaseParams {
  userId: string;
  page?: number;
}

interface FetchUserCheckInsHystoryUseCaseResponse {
  data: CheckIn[];
}

export class FetchUserCheckInsHystoryUseCase {
  #checkInsRepository: CheckInsRepository;

  constructor(checkInsRepository: CheckInsRepository) {
    this.#checkInsRepository = checkInsRepository;
  }

  async execute({
    userId,
    page = 1,
  }: FetchUserCheckInsHystoryUseCaseParams): Promise<FetchUserCheckInsHystoryUseCaseResponse> {
    const checkIns = await this.#checkInsRepository.findManyByUserId(
      userId,
      page,
    );

    return { data: checkIns };
  }
}
