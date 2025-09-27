export interface Mission {
  id: string;
  userId: string; // Referencia a auth.users(id)
  title: string;
  description: string;
  destination: 'moon' | 'mars';
  passengers: number;
  duration: number; // días
  isPublic: boolean;
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMissionRequest {
  title: string;
  description: string;
  destination: 'moon' | 'mars';
  passengers: number;
  duration: number;
  isPublic: boolean;
  status?: 'draft' | 'published' | 'archived';
  userId: string;
}

export interface UpdateMissionRequest {
  title?: string;
  description?: string;
  destination?: 'moon' | 'mars';
  passengers?: number;
  duration?: number;
  isPublic?: boolean;
  status?: 'draft' | 'published' | 'archived';
}