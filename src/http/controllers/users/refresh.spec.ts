import { fakerPT_BR as faker } from '@faker-js/faker';
import supertest from 'supertest';

import { app } from '@/app';

describe('E2E: Refresh Token', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to get refresh token', async () => {
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

    const cookies = authResponse.get('Set-Cookie');

    const response = await supertest(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies as string[]);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refresh-token='),
    ]);
  });

  it('should not be able to authenticate when e-mail or password is incorrect', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();

    const response = await supertest(app.server).post('/sessions').send({
      email,
      password,
    });

    expect(response.statusCode).toEqual(401);
    expect(response.body).toEqual({
      message: 'E-mail or password is incorrect.',
    });
  });
});
