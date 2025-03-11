import { fakerPT_BR as faker } from '@faker-js/faker';
import supertest from 'supertest';

import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user';

describe('E2E: Create Gym', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a gym', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN');
    const data = {
      title: faker.company.name(),
      phone: faker.phone.number(),
      description: faker.lorem.paragraph(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
    };

    const response = await supertest(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send(data);

    expect(response.statusCode).toEqual(201);
  });
});
