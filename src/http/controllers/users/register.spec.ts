import { fakerPT_BR as faker } from '@faker-js/faker';
import supertest from 'supertest';

import { app } from '@/app';

describe('E2E: Register', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to register a new user', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();
    const name = faker.person.fullName();

    const response = await supertest(app.server).post('/users').send({
      email,
      password,
      name,
    });

    expect(response.statusCode).toEqual(201);
  });

  it('should not be able to register a new user when existent e-mail', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();
    const name = faker.person.fullName();

    await supertest(app.server).post('/users').send({
      email,
      password,
      name,
    });

    const response = await supertest(app.server).post('/users').send({
      email,
      password,
      name,
    });

    expect(response.statusCode).toEqual(409);
    expect(response.body).toEqual({
      message: 'User already exists.',
    });
  });
});
