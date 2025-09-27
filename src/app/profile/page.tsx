'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import MissionStatusSelector from '@/components/MissionStatusSelector';
import DeleteMissionModal from '@/components/DeleteMissionModal';
import Pagination from '@/components/Pagination';
import { useAuth } from '@/hooks/useAuth';
import { useMissions } from '@/hooks/useMissions';

export default function Profile() {
  const { user } = useAuth();
  const { missions, loading, pagination, getUserMissions, updateMissionStatus, deleteMission } = useMissions();
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; mission: any }>({ 
    isOpen: false, 
    mission: null 
  });

  console.log('Profile: Component rendered, user:', user?.id, 'missions:', missions.length);

  useEffect(() => {
    if (user?.id) {
      console.log('Profile: Loading missions for user:', user.id);
      getUserMissions(1); // Start with page 1
    }
  }, [user?.id, getUserMissions]); // Incluir getUserMissions en las dependencias

  const publicMissions = missions.filter(mission => mission.isPublic);
  const totalLikes = publicMissions.length * 42; // Mock calculation

  const handleDeleteMission = (mission: any) => {
    setDeleteModal({ isOpen: true, mission });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.mission) return;
    
    try {
      await deleteMission(deleteModal.mission.id);
      setDeleteModal({ isOpen: false, mission: null });
    } catch (error) {
      console.error('Error deleting mission:', error);
      alert('Failed to delete mission. Please try again.');
    }
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal({ isOpen: false, mission: null });
  };

  const handlePageChange = (page: number) => {
    getUserMissions(page);
  };
  return (
    <ProtectedRoute>
      <div className="h-full text-white">
        {/* Background Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-[600px] h-[600px] bg-[#0042A6]/30 rounded-full blur-[150px]" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[200px] w-[800px] h-[50px] bg-[#0042A6]/40 rounded-full blur-[50px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[200px] w-[800px] h-[50px] bg-[#0042A6]/40 rounded-full blur-[50px]"></div>

        {/* Main Content */}
        <main className="pt-32 p-6 relative z-10">
        <div className="max-w-5xl mx-auto">
                  {/* Profile Header */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-8 flex items-center space-x-6">
                    <div className="w-24 h-24 bg-[#EAFE07] rounded-full flex items-center justify-center text-4xl font-bold text-[#07173F]">
                      {user?.user_metadata?.name?.[0] || user?.email?.[0] || 'U'}
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-white mb-1">{user?.user_metadata?.name || 'Explorer'}</h1>
                      <p className="text-blue-200 mb-4">{user?.email}</p>
                      <div className="flex space-x-8 text-sm">
                        <div className="text-center">
                          <div className="text-xl font-bold text-[#EAFE07]">{missions.length}</div>
                          <div className="text-blue-200">Missions</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-[#EAFE07]">{totalLikes}</div>
                          <div className="text-blue-200">Likes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-blue-200">Member since</div>
                          <div className="text-lg font-semibold text-white">{new Date(user?.created_at || Date.now()).getFullYear()}</div>
                        </div>
                      </div>
                    </div>
                  </div>

          {/* My Missions */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6">My Missions</h2>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-2 border-[#EAFE07] border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-white">Loading missions...</span>
              </div>
                    ) : missions.length > 0 ? (
                      <div className="max-h-64 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-[#EAFE07]/30 scrollbar-track-transparent hover:scrollbar-thumb-[#EAFE07]/50">
                        {missions.map((mission) => (
                          <div key={mission.id} className="bg-white/5 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-white mb-2">{mission.title}</h3>
                                <p className="text-blue-200 text-sm mb-3">{mission.description}</p>
                                <div className="flex items-center space-x-4 text-xs text-blue-200">
                                  <span>{mission.passengers} passengers</span>
                                  <span>{mission.duration} days</span>
                                  <span>{mission.destination.toUpperCase()}</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  mission.isPublic 
                                    ? 'bg-green-500/20 text-green-300' 
                                    : 'bg-gray-500/20 text-gray-300'
                                }`}>
                                  {mission.isPublic ? 'Public' : 'Private'}
                                </span>
                              </div>
                            </div>
                            
                            {/* Status Selector */}
                            <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-3">
                                <span className="text-sm text-blue-200">Status:</span>
                                <MissionStatusSelector
                                  currentStatus={mission.status}
                                  missionId={mission.id}
                                  onStatusChange={updateMissionStatus}
                                />
                              </div>
                              
                              <div className="flex space-x-2">
                                <Link 
                                  href={`/mission-builder/${mission.id}`}
                                  className="bg-[#0042A6]/50 text-white px-3 py-1 rounded text-sm hover:bg-[#0042A6] transition-colors"
                                >
                                  View
                                </Link>
                                <Link 
                                  href={`/mission-builder/${mission.id}/edit`}
                                  className="bg-[#EAFE07]/80 text-[#07173F] font-bold px-3 py-1 rounded text-sm hover:bg-[#EAFE07] transition-colors"
                                >
                                  Edit
                                </Link>
                                <button
                                  onClick={() => handleDeleteMission(mission)}
                                  className="bg-red-500/80 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-blue-200 mb-4">No missions yet. Create your first space habitat!</p>
                <Link href="/mission-builder/new" className="bg-[#EAFE07] text-[#07173F] px-6 py-3 rounded-lg font-semibold hover:bg-[#EAFE07]/80 transition-colors">
                  Create Mission
                </Link>
              </div>
            )}
            
            {/* Pagination */}
            <div className="mt-8">
              <div className="text-white text-center mb-4">
                Debug: {missions.length} missions, Page {pagination.currentPage} of {pagination.totalPages}
              </div>
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                loading={loading}
              />
            </div>
          </div>
                </div>
              </main>
              
              {/* Delete Confirmation Modal */}
              <DeleteMissionModal
                isOpen={deleteModal.isOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                missionTitle={deleteModal.mission?.title || ''}
              />
              </div>
            </ProtectedRoute>
          );
        }
