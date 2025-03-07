import { CheckInsRepository } from '@/repositories/check-ins-repository';

interface GetUserMetricsUseCaseParams {
  userId: string;
}

interface GetUserMetricsUseCaseResponse {
  data: {
    checkInsCount: number;
  };
}

export class GetUserMetricsUseCase {
  #checkInsRepository: CheckInsRepository;

  constructor(checkInsRepository: CheckInsRepository) {
    this.#checkInsRepository = checkInsRepository;
  }

  async execute({
    userId,
  }: GetUserMetricsUseCaseParams): Promise<GetUserMetricsUseCaseResponse> {
    const checkInsCount = await this.#checkInsRepository.countByUserId(userId);

    return { data: { checkInsCount } };
  }
}
