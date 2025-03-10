import { fakerPT_BR as faker } from '@faker-js/faker';
import supertest from 'supertest';

import { app } from '@/app';

describe('E2E: Authenticate', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to authenticate', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();
    const name = faker.person.fullName();

    await supertest(app.server).post('/users').send({
      email,
      password,
      name,
    });

    const response = await supertest(app.server).post('/sessions').send({
      email,
      password,
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
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
