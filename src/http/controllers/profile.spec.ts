import { fakerPT_BR as faker } from '@faker-js/faker';
import supertest from 'supertest';

import { app } from '@/app';

describe('E2E: Profile', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to get user profile', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();
    const name = faker.person.fullName();

    await supertest(app.server).post('/users').send({
      email,
      password,
      name,
    });

    const authResponse = await supertest(app.server).post('/sessions').send({
      email,
      password,
    });

    const { token } = authResponse.body;

    const profileResponse = await supertest(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`);

    expect(profileResponse.statusCode).toEqual(200);
    expect(profileResponse.body.data).toEqual(
      expect.objectContaining({ email, name }),
    );
  });
});
