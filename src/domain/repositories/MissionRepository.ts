import { Mission } from '../entities/Mission';

export interface MissionRepository {
  findById(id: string): Promise<Mission | null>;
  findByUserId(userId: string): Promise<Mission[]>;
  findPublic(): Promise<Mission[]>;
  save(mission: Mission): Promise<Mission>;
  delete(id: string): Promise<void>;
}
