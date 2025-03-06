import { Gym, GymsRepository } from '@/repositories/gyms-repository';

interface CreateGymUseCaseParams {
  title: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  description: string | null;
}

interface CreateGymUseCaseResponse {
  data: Gym;
}

export class CreateGymUseCase {
  #gymsRepository: GymsRepository;

  constructor(gymsRepository: GymsRepository) {
    this.#gymsRepository = gymsRepository;
  }

  async execute({
    latitude,
    longitude,
    title,
    description,
    phone,
  }: CreateGymUseCaseParams): Promise<CreateGymUseCaseResponse> {
    const gym = await this.#gymsRepository.create({
      latitude,
      longitude,
      title,
      description,
      phone,
    });

    return { data: gym };
  }
}
