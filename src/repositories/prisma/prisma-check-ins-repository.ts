import { endOfDay, startOfDay } from 'date-fns';

import { prisma } from '@/lib/prisma';

import {
  CheckIn,
  CheckInsRepository,
  CheckInCreateInput,
} from '../check-ins-repository';

const ITEMS_PER_PAGE = 20;

export class PrismaCheckInsRepository implements CheckInsRepository {
  async save(checkIn: CheckIn): Promise<CheckIn> {
    const updatedCheckIn = await prisma.checkIn.update({
      where: {
        id: checkIn.id,
      },
      data: checkIn,
    });

    return updatedCheckIn;
  }

  async findById(id: string): Promise<CheckIn | null> {
    const checkIn = await prisma.checkIn.findUnique({
      where: {
        id,
      },
    });

    return checkIn;
  }

  async create({
    gymId,
    userId,
    validatedAt,
  }: CheckInCreateInput): Promise<CheckIn> {
    const checkIn = await prisma.checkIn.create({
      data: {
        gym_id: gymId,
        user_id: userId,
        validated_at: validatedAt ? new Date() : null,
      },
    });

    return checkIn;
  }

  async countByUserId(userId: string): Promise<number> {
    const count = await prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    });

    return count;
  }

  async findManyByUserId(userId: string, page: number = 1): Promise<CheckIn[]> {
    const checkIns = await prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      take: ITEMS_PER_PAGE, // 20
      skip: (page - 1) * ITEMS_PER_PAGE, // 0 * 20 = 0, 1 * 20 = 20, 2 * 20 = 40
    });

    return checkIns;
  }

  async findByUserIdOnDate(
    userId: string,
    date: Date,
  ): Promise<CheckIn | null> {
    const startOfTheDay = startOfDay(date);
    const endOfTheDay = endOfDay(date);

    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay,
          lte: endOfTheDay,
        },
      },
    });

    return checkIn;
  }
}
