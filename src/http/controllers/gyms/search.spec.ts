import { fakerPT_BR as faker } from '@faker-js/faker';
import supertest from 'supertest';

import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user';

describe('E2E: Search Gyms', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to search gyms by title', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN');
    const data = Array(2)
      .fill(null)
      .map(() => ({
        title: faker.company.name(),
        phone: faker.phone.number(),
        description: faker.lorem.paragraph(),
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
      }));

    await Promise.all(
      data.map(gymData =>
        supertest(app.server)
          .post('/gyms')
          .set('Authorization', `Bearer ${token}`)
          .send(gymData),
      ),
    );

    const [data1] = data;

    const response = await supertest(app.server)
      .get('/gyms/search')
      .query({
        q: data1.title,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.data).toEqual([expect.objectContaining(data1)]);
  });
});
