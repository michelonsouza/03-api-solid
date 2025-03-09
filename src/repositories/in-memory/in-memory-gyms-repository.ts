import { randomUUID } from 'node:crypto';

import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';

import {
  Gym,
  GymCreateInput,
  GymsRepository,
  FindManyNearbyParams,
} from '../gyms-repository';

const ITEMS_PER_PAGE = 20;

export class InMemoryGymsInsRepository implements GymsRepository {
  #gyms: Gym[] = [];

  create({
    latitude,
    longitude,
    title,
    description,
    phone,
  }: GymCreateInput): Promise<Gym> {
    const gym: Gym = {
      id: randomUUID(),
      title,
      latitude,
      longitude,
      /* v8 ignore next 2 */
      phone: phone ?? null,
      description: description ?? null,
    };

    this.#gyms.push(gym);

    return Promise.resolve(gym);
  }

  findById(id: string): Promise<Gym | null> {
    /* v8 ignore next 1 */
    const gym = this.#gyms.find(gym => gym.id === id) ?? null;

    return Promise.resolve(gym);
  }

  searchMany(query: string, page: number = 1): Promise<Gym[]> {
    const gyms = this.#gyms
      .filter(gym => gym.title.toLowerCase().includes(query.toLowerCase()))
      .slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return Promise.resolve(gyms);
  }

  findManyNearby({
    latitude,
    longitude,
  }: FindManyNearbyParams): Promise<Gym[]> {
    const gyms = this.#gyms.filter(gym => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude,
          longitude,
        },
        {
          latitude: gym.latitude,
          longitude: gym.longitude,
        },
      );

      return distance <= 10; // 10 km
    });

    return Promise.resolve(gyms);
  }
}
