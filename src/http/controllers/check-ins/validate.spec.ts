import supertest from 'supertest';

import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user';
import { createAndSearchGym } from '@/utils/tests/create-and-search-gym';

describe('E2E: Validate Check-in', () => {
  beforeAll(async () => {
    await app.ready();
  });

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to validate a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN');

    const { gym, latitude, longitude } = await createAndSearchGym(app, token);

    const data = {
      latitude,
      longitude,
    };

    await supertest(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send(data);

    const responseHistory = await supertest(app.server)
      .get('/check-ins/history')
      .set('Authorization', `Bearer ${token}`);

    const [checkIn] = responseHistory.body.data;

    const response = await supertest(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(204);
  });

  it('should not be able to validate a check-in after 21 minutes', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN');

    const { gym, latitude, longitude } = await createAndSearchGym(app, token);

    const data = {
      latitude,
      longitude,
    };

    await supertest(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send(data);

    const responseHistory = await supertest(app.server)
      .get('/check-ins/history')
      .set('Authorization', `Bearer ${token}`);

    const [checkIn] = responseHistory.body.data;

    const twentytwoMinutes = 22 * 60 * 1000; // 22 minutes in milliseconds

    vi.advanceTimersByTime(twentytwoMinutes);

    const response = await supertest(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(409);
  });

  it('should not be able to validate a check-in when user not is ADMIN', async () => {
    const [{ token }, { token: memberToken }] = await Promise.all([
      createAndAuthenticateUser(app, 'ADMIN'),
      createAndAuthenticateUser(app, 'MEMBER'),
    ]);

    const { gym, latitude, longitude } = await createAndSearchGym(app, token);

    const data = {
      latitude,
      longitude,
    };

    await supertest(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send(data);

    const responseHistory = await supertest(app.server)
      .get('/check-ins/history')
      .set('Authorization', `Bearer ${token}`);

    const [checkIn] = responseHistory.body.data;

    const twentytwoMinutes = 22 * 60 * 1000; // 22 minutes in milliseconds

    vi.advanceTimersByTime(twentytwoMinutes);

    const response = await supertest(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set('Authorization', `Bearer ${memberToken}`)
      .send();

    expect(response.statusCode).toEqual(401);
  });
});
