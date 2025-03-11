import { fakerPT_BR as faker } from '@faker-js/faker';
import { addDays } from 'date-fns';
import supertest from 'supertest';
import { vi } from 'vitest';

import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user';
import { createAndSearchGym } from '@/utils/tests/create-and-search-gym';

describe('E2E: Check-in metrics', () => {
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

  it('should be able to get check-ins metrics', async () => {
    const { token } = await createAndAuthenticateUser(app);

    const { gym, latitude, longitude } = await createAndSearchGym(app, token);

    const data = {
      latitude,
      longitude,
    };

    const refDate = faker.date.past({ years: 1 });

    const checkInsLength = faker.number.int({ min: 1, max: 3 });
    await Promise.all(
      Array(checkInsLength)
        .fill(null)
        .map((_, index) => {
          vi.setSystemTime(addDays(refDate, index));

          return supertest(app.server)
            .post(`/gyms/${gym.id}/check-ins`)
            .set('Authorization', `Bearer ${token}`)
            .send(data);
        }),
    );

    const response = await supertest(app.server)
      .get('/check-ins/metrics')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.data.checkInsCount).toEqual(checkInsLength);
  });
});
