export interface CheckInCreateInput {
  userId: string;
  gymId: string;
  validatedAt?: Date | string | null;
  createdAt?: Date | string;
}

export interface CheckIn {
  id: string;
  user_id: string;
  gym_id: string;
  created_at: Date | string;
  validated_at?: Date | string | null;
}

export interface CheckInsRepository {
  create(data: CheckInCreateInput): Promise<CheckIn>;
  countByUserId(userId: string): Promise<number>;
  findManyByUserId(userId: string, page?: number): Promise<CheckIn[]>;
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>;
}
