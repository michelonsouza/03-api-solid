import {
  CheckIn,
  CheckInsRepository,
} from '@/repositories/check-ins-repository';

interface FetchmemberCheckInsHystoryUseCaseParams {
  userId: string;
  page?: number;
}

interface FetchmemberCheckInsHystoryUseCaseResponse {
  data: CheckIn[];
}

export class FetchmemberCheckInsHystoryUseCase {
  #checkInsRepository: CheckInsRepository;

  constructor(checkInsRepository: CheckInsRepository) {
    this.#checkInsRepository = checkInsRepository;
  }

  async execute({
    userId,
    page = 1,
  }: FetchmemberCheckInsHystoryUseCaseParams): Promise<FetchmemberCheckInsHystoryUseCaseResponse> {
    const checkIns = await this.#checkInsRepository.findManyByUserId(
      userId,
      page,
    );

    return { data: checkIns };
  }
}
