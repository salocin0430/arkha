import { MissionRepository } from '../../domain/repositories/MissionRepository';
import { Mission } from '../../domain/entities/Mission';
import { supabase } from '../external/SupabaseClient';

export class SupabaseMissionRepository implements MissionRepository {
  async create(mission: Omit<Mission, 'id' | 'createdAt' | 'updatedAt'>): Promise<Mission> {
    // Sincronizar isPublic con el status automáticamente
    const isPublic = mission.status === 'published';

    const { data, error } = await supabase
      .from('missions')
      .insert({
        user_id: mission.userId,
        title: mission.title,
        description: mission.description,
        destination: mission.destination,
        passengers: mission.passengers,
        duration: mission.duration,
        is_public: isPublic,
        status: mission.status,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create mission: ${error.message}`);
    }

    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      description: data.description,
      destination: data.destination,
      passengers: data.passengers,
      duration: data.duration,
      isPublic: data.is_public,
      status: data.status,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  async findById(id: string): Promise<Mission | null> {
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to find mission: ${error.message}`);
    }

    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      description: data.description,
      destination: data.destination,
      passengers: data.passengers,
      duration: data.duration,
      isPublic: data.is_public,
      status: data.status,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  async findByUserId(userId: string): Promise<Mission[]> {
    console.log('SupabaseMissionRepository: Finding missions for user:', userId);
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    console.log('SupabaseMissionRepository: Query result:', { data, error });

    if (error) {
      console.error('SupabaseMissionRepository: Error fetching missions:', error);
      throw new Error(`Failed to find missions: ${error.message}`);
    }

    return data.map(mission => ({
      id: mission.id,
      userId: mission.user_id,
      title: mission.title,
      description: mission.description,
      destination: mission.destination,
      passengers: mission.passengers,
      duration: mission.duration,
      isPublic: mission.is_public,
      status: mission.status,
      createdAt: new Date(mission.created_at),
      updatedAt: new Date(mission.updated_at),
    }));
  }

  async findPublic(): Promise<Mission[]> {
    console.log('SupabaseMissionRepository: Finding published missions');
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    console.log('SupabaseMissionRepository: Published missions query result:', { data, error });

    if (error) {
      console.error('SupabaseMissionRepository: Error fetching published missions:', error);
      throw new Error(`Failed to find published missions: ${error.message}`);
    }

    return data.map(mission => ({
      id: mission.id,
      userId: mission.user_id,
      title: mission.title,
      description: mission.description,
      destination: mission.destination,
      passengers: mission.passengers,
      duration: mission.duration,
      isPublic: mission.is_public,
      status: mission.status,
      createdAt: new Date(mission.created_at),
      updatedAt: new Date(mission.updated_at),
    }));
  }

  async findByUserIdPaginated(userId: string, page: number, limit: number): Promise<{ missions: Mission[], totalPages: number, totalItems: number }> {
    console.log('SupabaseMissionRepository: Finding missions for user:', userId, 'page:', page, 'limit:', limit);
    
    // Get total count
    const { count, error: countError } = await supabase
      .from('missions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (countError) {
      throw new Error(`Failed to count missions: ${countError.message}`);
    }

    const totalItems = count || 0;
    const totalPages = Math.ceil(totalItems / limit);
    const offset = (page - 1) * limit;

    // Get paginated data
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to find missions: ${error.message}`);
    }

    const missions = data.map(mission => ({
      id: mission.id,
      userId: mission.user_id,
      title: mission.title,
      description: mission.description,
      destination: mission.destination,
      passengers: mission.passengers,
      duration: mission.duration,
      isPublic: mission.is_public,
      status: mission.status,
      createdAt: new Date(mission.created_at),
      updatedAt: new Date(mission.updated_at),
    }));

    return { missions, totalPages, totalItems };
  }

  async findPublicPaginated(page: number, limit: number): Promise<{ missions: Mission[], totalPages: number, totalItems: number }> {
    console.log('SupabaseMissionRepository: Finding published missions page:', page, 'limit:', limit);
    
    // Get total count
    const { count, error: countError } = await supabase
      .from('missions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published');

    if (countError) {
      throw new Error(`Failed to count published missions: ${countError.message}`);
    }

    const totalItems = count || 0;
    const totalPages = Math.ceil(totalItems / limit);
    const offset = (page - 1) * limit;

    // Get paginated data
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to find published missions: ${error.message}`);
    }

    const missions = data.map(mission => ({
      id: mission.id,
      userId: mission.user_id,
      title: mission.title,
      description: mission.description,
      destination: mission.destination,
      passengers: mission.passengers,
      duration: mission.duration,
      isPublic: mission.is_public,
      status: mission.status,
      createdAt: new Date(mission.created_at),
      updatedAt: new Date(mission.updated_at),
    }));

    return { missions, totalPages, totalItems };
  }

  async update(id: string, updates: Partial<Omit<Mission, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<Mission> {
    // Sincronizar isPublic con el status automáticamente
    let isPublic = updates.isPublic;
    if (updates.status) {
      isPublic = updates.status === 'published';
    }

    const { data, error } = await supabase
      .from('missions')
      .update({
        title: updates.title,
        description: updates.description,
        destination: updates.destination,
        passengers: updates.passengers,
        duration: updates.duration,
        is_public: isPublic,
        status: updates.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update mission: ${error.message}`);
    }

    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      description: data.description,
      destination: data.destination,
      passengers: data.passengers,
      duration: data.duration,
      isPublic: data.is_public,
      status: data.status,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('missions')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete mission: ${error.message}`);
    }
  }

  async publishMission(id: string): Promise<Mission> {
    console.log('SupabaseMissionRepository: Publishing mission:', id);
    const { data, error } = await supabase
      .from('missions')
      .update({ 
        status: 'published',
        is_public: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    console.log('SupabaseMissionRepository: Publish result:', { data, error });

    if (error) {
      console.error('SupabaseMissionRepository: Error publishing mission:', error);
      throw new Error(`Failed to publish mission: ${error.message}`);
    }

    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      description: data.description,
      destination: data.destination,
      passengers: data.passengers,
      duration: data.duration,
      isPublic: data.is_public,
      status: data.status,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }
}