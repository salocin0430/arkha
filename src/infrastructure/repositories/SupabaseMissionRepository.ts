import { Mission } from '../../domain/entities/Mission';
import { MissionRepository } from '../../domain/repositories/MissionRepository';
import { supabase } from '../external/SupabaseClient';

export class SupabaseMissionRepository implements MissionRepository {
  async findById(id: string): Promise<Mission | null> {
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;

    return Mission.create({
      id: data.id,
      title: data.title,
      description: data.description,
      destination: data.destination,
      passengers: data.passengers,
      duration: data.duration,
      isPublic: data.is_public,
      status: data.status,
      userId: data.user_id,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    });
  }

  async findByUserId(userId: string): Promise<Mission[]> {
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch missions: ${error.message}`);

    return data.map(mission => Mission.create({
      id: mission.id,
      title: mission.title,
      description: mission.description,
      destination: mission.destination,
      passengers: mission.passengers,
      duration: mission.duration,
      isPublic: mission.is_public,
      status: mission.status,
      userId: mission.user_id,
      createdAt: new Date(mission.created_at),
      updatedAt: new Date(mission.updated_at),
    }));
  }

  async findPublic(): Promise<Mission[]> {
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('is_public', true)
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch public missions: ${error.message}`);

    return data.map(mission => Mission.create({
      id: mission.id,
      title: mission.title,
      description: mission.description,
      destination: mission.destination,
      passengers: mission.passengers,
      duration: mission.duration,
      isPublic: mission.is_public,
      status: mission.status,
      userId: mission.user_id,
      createdAt: new Date(mission.created_at),
      updatedAt: new Date(mission.updated_at),
    }));
  }

  async save(mission: Mission): Promise<Mission> {
    const { data, error } = await supabase
      .from('missions')
      .upsert({
        id: mission.id,
        title: mission.title,
        description: mission.description,
        destination: mission.destination,
        passengers: mission.passengers,
        duration: mission.duration,
        is_public: mission.isPublic,
        status: mission.status,
        user_id: mission.userId,
        created_at: mission.createdAt.toISOString(),
        updated_at: mission.updatedAt.toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to save mission: ${error.message}`);

    return Mission.create({
      id: data.id,
      title: data.title,
      description: data.description,
      destination: data.destination,
      passengers: data.passengers,
      duration: data.duration,
      isPublic: data.is_public,
      status: data.status,
      userId: data.user_id,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    });
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('missions')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete mission: ${error.message}`);
  }
}
