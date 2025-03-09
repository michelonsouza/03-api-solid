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

export interface FindManyNearbyParams {
  latitude: number;
  longitude: number;
}

export interface GymsRepository {
  findById(id: string): Promise<Gym | null>;
  create(data: GymCreateInput): Promise<Gym>;
  searchMany(query: string, page: number): Promise<Gym[]>;
  findManyNearby(params: FindManyNearbyParams): Promise<Gym[]>;
}
