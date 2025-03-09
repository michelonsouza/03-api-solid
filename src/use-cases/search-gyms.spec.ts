import { fakerPT_BR as faker } from '@faker-js/faker';

import { GymsRepository } from '@/repositories/gyms-repository';
import { InMemoryGymsInsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';

import { SearchGymsUseCase } from './search-gyms';

interface CreateGymMockedDataType {
  title: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  description: string | null;
}

let sut: SearchGymsUseCase;
let gymsRepository: GymsRepository;

async function makeGyms(quantity: number, gymTitle?: string) {
  const stubGyms = await Promise.all(
    Array(quantity)
      .fill(null)
      .map((_, index) => {
        const data: CreateGymMockedDataType = {
          title: gymTitle ? `${gymTitle} ${index}` : faker.company.name(),
          description: faker.lorem.words(10),
          phone: faker.phone.number(),
          latitude: faker.location.latitude(),
          longitude: faker.location.longitude(),
        };

        return gymsRepository.create(data);
      }),
  );

  return { stubGyms };
}

describe('Search Gyms use case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsInsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  it('should be able to search gym by title', async () => {
    const title = faker.company.name();
    await makeGyms(4);
    const { stubGyms } = await makeGyms(2, title);

    const { data } = await sut.execute({ query: title, page: 1 });

    expect(data).toEqual(stubGyms);
  });

  it('should be able to fetch paginated gyms search', async () => {
    const title = faker.company.name();
    await makeGyms(22, title);

    const { data } = await sut.execute({ query: title, page: 2 });

    expect(data.length).toEqual(2);
  });
});
