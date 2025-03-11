import { fakerPT_BR as faker } from '@faker-js/faker';
import type { FastifyInstance } from 'fastify';
import supertest from 'supertest';

export async function createAndAuthenticateUser(app: FastifyInstance) {
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

  return { token, email, name, password };
}
