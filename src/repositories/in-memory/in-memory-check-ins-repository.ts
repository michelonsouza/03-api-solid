import { randomUUID } from 'node:crypto';

import { startOfDay, endOfDay, isAfter, isBefore, parseISO } from 'date-fns';

import {
  CheckIn,
  CheckInCreateInput,
  CheckInsRepository,
} from '../check-ins-repository';

const ITEMS_PER_PAGE = 20;

export class InMemoryCheckInsRepository implements CheckInsRepository {
  #checkIns: CheckIn[] = [];

  async create({
    gymId,
    userId,
    validatedAt,
    createdAt,
  }: CheckInCreateInput): Promise<CheckIn> {
    const created_at = createdAt
      ? new Date(createdAt).toISOString()
      : new Date().toISOString();

    const checkIn: CheckIn = {
      id: randomUUID(),
      user_id: userId,
      gym_id: gymId,
      /* v8 ignore next 1 */
      validated_at: validatedAt ? new Date(validatedAt).toISOString() : null,
      created_at,
    };

    this.#checkIns.push(checkIn);

    return Promise.resolve(checkIn);
  }

  async findByUserIdOnDate(
    userId: string,
    date: Date,
  ): Promise<CheckIn | null> {
    const startOfDayDate = startOfDay(date);
    const endOfDayDate = endOfDay(date);
    const checkInOnSameDate =
      this.#checkIns.find(checkIn => {
        /* v8 ignore next 4 */
        const checkInDate =
          typeof checkIn.created_at === 'string'
            ? parseISO(checkIn.created_at)
            : checkIn.created_at;
        const isOnSameDate =
          isAfter(checkInDate, startOfDayDate) &&
          isBefore(checkInDate, endOfDayDate);

        return checkIn.user_id === userId && isOnSameDate;
      }) ?? null;

    return Promise.resolve(checkInOnSameDate);
  }

  async findManyByUserId(userId: string, page: number = 1): Promise<CheckIn[]> {
    const checkIns = this.#checkIns
      .filter(checkIn => checkIn.user_id === userId)
      .slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return Promise.resolve(checkIns);
  }

  async countByUserId(userId: string): Promise<number> {
    const checkInsCount = this.#checkIns.filter(
      checkIn => checkIn.user_id === userId,
    ).length;

    return Promise.resolve(checkInsCount);
  }

  async findById(id: string): Promise<CheckIn | null> {
    const checkIn = this.#checkIns.find(checkIn => checkIn.id === id) ?? null;

    return Promise.resolve(checkIn);
  }

  async save(checkIn: CheckIn): Promise<CheckIn> {
    const index = this.#checkIns.findIndex(check => check.id === checkIn.id);

    if (index !== -1) {
      this.#checkIns[index] = checkIn;
    }

    return Promise.resolve(checkIn);
  }
}
