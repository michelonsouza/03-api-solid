import { randomUUID } from 'node:crypto';

import { startOfDay, endOfDay, isAfter, isBefore, parseISO } from 'date-fns';

import {
  CheckIn,
  CheckInCreateInput,
  CheckInsRepository,
} from '../check-ins-repository';

export class InMemoryCheckInsRepository implements CheckInsRepository {
  #checkIns: CheckIn[] = [];

  async create({
    gymId,
    userId,
    validatedAt,
  }: CheckInCreateInput): Promise<CheckIn> {
    const checkIn: CheckIn = {
      id: randomUUID(),
      user_id: userId,
      gym_id: gymId,
      /* v8 ignore next 1 */
      validated_at: validatedAt ? new Date(validatedAt).toISOString() : null,
      created_at: new Date().toISOString(),
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
}
