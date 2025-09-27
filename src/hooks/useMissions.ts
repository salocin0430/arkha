'use client';

import { useState, useEffect, useCallback } from 'react';
import { Mission } from '@/domain/entities/Mission';
import { createMission } from '@/application/services/AppService';
import { useAuth } from './useAuth';

export function useMissions() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 6
  });
  const { user } = useAuth();

  console.log('useMissions: Hook called, user:', user?.id);

  const createNewMission = async (missionData: {
    title: string;
    description: string;
    destination: 'moon' | 'mars';
    passengers: number;
    duration: number;
    isPublic: boolean;
    status?: 'draft' | 'published' | 'archived';
  }) => {
    if (!user) {
      throw new Error('User must be authenticated to create missions');
    }

    setLoading(true);
    setError(null);

    try {
      const newMission = await createMission.execute({
        ...missionData,
        userId: user.id,
      });

      setMissions(prev => [newMission, ...prev]);
      return newMission;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create mission';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getUserMissions = useCallback(async (page: number = 1) => {
    if (!user) {
      console.log('No user found, skipping mission fetch');
      return;
    }

    console.log('Fetching missions for user:', user.id, 'page:', page);
    setLoading(true);
    setError(null);

    try {
      const { missionRepository } = await import('@/application/services/AppService');
      console.log('Mission repository imported successfully');
      const result = await missionRepository.findByUserIdPaginated(user.id, page, pagination.itemsPerPage);
      console.log('Fetched missions:', result);
      setMissions(result.missions);
      setPagination(prev => ({
        ...prev,
        currentPage: page,
        totalPages: result.totalPages,
        totalItems: result.totalItems
      }));
    } catch (err) {
      console.error('Error fetching missions:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch missions';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user, pagination.itemsPerPage]);

  const getPublicMissions = useCallback(async (page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const { missionRepository } = await import('@/application/services/AppService');
      const result = await missionRepository.findPublicPaginated(page, pagination.itemsPerPage);
      setMissions(result.missions);
      setPagination(prev => ({
        ...prev,
        currentPage: page,
        totalPages: result.totalPages,
        totalItems: result.totalItems
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch public missions';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [pagination.itemsPerPage]);

  const updateMissionStatus = async (missionId: string, newStatus: 'draft' | 'published' | 'archived') => {
    try {
      const { missionRepository } = await import('@/application/services/AppService');
      const updatedMission = await missionRepository.update(missionId, { status: newStatus });
      
      // Update the missions list
      setMissions(prevMissions => 
        prevMissions.map(mission => 
          mission.id === missionId ? updatedMission : mission
        )
      );
      
      return updatedMission;
    } catch (err) {
      console.error('Error updating mission status:', err);
      throw err;
    }
  };

  // Mantener compatibilidad con el método anterior
  const publishMission = async (missionId: string) => {
    return updateMissionStatus(missionId, 'published');
  };

  const deleteMission = async (missionId: string) => {
    try {
      const { missionRepository } = await import('@/application/services/AppService');
      await missionRepository.delete(missionId);
      
      // Remove from local state
      setMissions(prevMissions => 
        prevMissions.filter(mission => mission.id !== missionId)
      );
    } catch (err) {
      console.error('Error deleting mission:', err);
      throw err;
    }
  };

  const changePage = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    // The actual page change will be handled by the calling component
    return page;
  };

  return {
    missions,
    loading,
    error,
    pagination,
    createNewMission,
    getUserMissions,
    getPublicMissions,
    publishMission,
    updateMissionStatus,
    deleteMission,
    changePage,
  };
}
