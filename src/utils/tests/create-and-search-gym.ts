import { fakerPT_BR as faker } from '@faker-js/faker';
import type { FastifyInstance } from 'fastify';
import supertest from 'supertest';

import { Gym } from '@/repositories/gyms-repository';

export async function createAndSearchGym(app: FastifyInstance, token: string) {
  const latitude = faker.location.latitude({ max: 88 });
  const longitude = faker.location.longitude({ max: 178 });
  const mockedGymData = {
    latitude,
    longitude,
    title: faker.company.name(),
    phone: faker.phone.number(),
    description: faker.lorem.paragraph(),
  };

  await supertest(app.server)
    .post('/gyms')
    .set('Authorization', `Bearer ${token}`)
    .send(mockedGymData);

  const searchResponse = await supertest(app.server)
    .get('/gyms/search')
    .set('Authorization', `Bearer ${token}`)
    .query({
      q: mockedGymData.title,
    });

  const [gym] = searchResponse.body.data as Gym[];

  return {
    gym,
    latitude,
    longitude,
  };
}
