import { Gym as PrismaGym } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import {
  Gym,
  GymCreateInput,
  GymsRepository,
  FindManyNearbyParams,
} from '@/repositories/gyms-repository';

const ITEMS_PER_PAGE = 20;

export class PrismaGymsRepository implements GymsRepository {
  async findById(id: string): Promise<Gym | null> {
    const gym = await prisma.gym.findUnique({
      where: {
        id,
      },
    });

    return gym
      ? {
          ...gym,
          latitude: gym.latitude.toNumber(),
          longitude: gym.longitude.toNumber(),
        }
      : null;
  }

  async create(data: GymCreateInput): Promise<Gym> {
    const gym = await prisma.gym.create({
      data,
    });

    return {
      ...gym,
      latitude: gym.latitude.toNumber(),
      longitude: gym.longitude.toNumber(),
    };
  }

  async searchMany(query: string, page: number = 1): Promise<Gym[]> {
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: ITEMS_PER_PAGE,
      skip: (page - 1) * ITEMS_PER_PAGE,
    });

    return gyms.map(gym => ({
      ...gym,
      latitude: gym.latitude.toNumber(),
      longitude: gym.longitude.toNumber(),
    }));
  }

  async findManyNearby({
    latitude,
    longitude,
  }: FindManyNearbyParams): Promise<Gym[]> {
    const gyms = await prisma.$queryRaw<PrismaGym[]>`
      SELECT * FROM gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `;

    return gyms.map(gym => ({
      ...gym,
      latitude: gym.latitude.toNumber(),
      longitude: gym.longitude.toNumber(),
    })) as Gym[];
  }
}
