import { randomUUID } from 'node:crypto';

import { Gym, GymCreateInput, GymsRepository } from '../gyms-repository';

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
      phone: phone ?? null,
      description: description ?? null,
    };

    this.#gyms.push(gym);

    return Promise.resolve(gym);
  }

  findById(id: string): Promise<Gym | null> {
    const gym = this.#gyms.find(gym => gym.id === id) ?? null;

    return Promise.resolve(gym);
  }
}
