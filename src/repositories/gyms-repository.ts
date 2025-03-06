export interface GymCreateInput {
  title: string;
  latitude: number;
  longitude: number;
  phone?: string | null;
  description?: string | null;
}

export interface Gym {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  phone?: string | null;
  description?: string | null;
}

export interface GymsRepository {
  create(data: GymCreateInput): Promise<Gym>;
  findById(id: string): Promise<Gym | null>;
}
