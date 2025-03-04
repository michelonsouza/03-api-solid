export interface UserCreateInput {
  name: string;
  email: string;
  password_hash: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date | string;
}

export interface UsersRepository {
  create(data: UserCreateInput): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}
