import { fakerPT_BR as faker } from '@faker-js/faker';
import supertest from 'supertest';

import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user';

describe('E2E: Nearby Gyms', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app);
    const latitude = faker.location.latitude({ min: -88, max: 78 });
    const longitude = faker.location.longitude({ min: -178, max: 178 });
    const data = Array(2)
      .fill(null)
      .map((_, index) => ({
        title: faker.company.name(),
        phone: faker.phone.number(),
        description: faker.lorem.paragraph(),
        latitude: latitude < 0 ? latitude - index * 2 : latitude + index * 2,
        longitude:
          longitude < 0 ? longitude - index * 2 : longitude + index * 2,
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
      .get('/gyms/nearby')
      .query({
        latitude,
        longitude,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.data).toEqual([expect.objectContaining(data1)]);
  });
});
