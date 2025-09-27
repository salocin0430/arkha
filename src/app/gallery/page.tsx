'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import Pagination from '@/components/Pagination';
import { useMissions } from '@/hooks/useMissions';

export default function Gallery() {
  const { missions, loading, pagination, getPublicMissions } = useMissions();

  useEffect(() => {
    getPublicMissions(1); // Start with page 1
  }, [getPublicMissions]);

  const handlePageChange = (page: number) => {
    getPublicMissions(page);
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Explore the Fleet</h1>
          <p className="text-xl text-blue-200">Discover habitats designed by other explorers</p>
        </div>

                {/* Mission Grid */}
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-2 border-[#EAFE07] border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-3 text-white">Loading missions...</span>
                  </div>
                ) : missions.length > 0 ? (
                  <div className="max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#EAFE07]/30 scrollbar-track-transparent hover:scrollbar-thumb-[#EAFE07]/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                      {missions.map((mission) => (
                      <div key={mission.id} className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden group hover:bg-white/15 transition-all duration-300 hover:scale-105">
                        {/* 3D Preview Section */}
                        <div className="h-40 bg-gradient-to-br from-[#0042A6]/30 to-[#07173F]/50 relative overflow-hidden">
                          {/* Animated background pattern */}
                          <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-4 left-4 w-8 h-8 border border-[#EAFE07]/30 rounded-full animate-pulse"></div>
                            <div className="absolute top-8 right-6 w-4 h-4 bg-[#EAFE07]/20 rounded-full animate-pulse delay-300"></div>
                            <div className="absolute bottom-6 left-8 w-6 h-6 border border-[#EAFE07]/20 rounded-full animate-pulse delay-700"></div>
                            <div className="absolute bottom-4 right-4 w-3 h-3 bg-[#EAFE07]/30 rounded-full animate-pulse delay-1000"></div>
                          </div>
                          
                          {/* Mission icon based on destination */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-[#EAFE07]/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                              {mission.destination === 'moon' && (
                                <div className="w-8 h-8 bg-white/60 rounded-full flex items-center justify-center">
                                  <span className="text-[#07173F] text-lg">🌙</span>
                                </div>
                              )}
                              {mission.destination === 'mars' && (
                                <div className="w-8 h-8 bg-red-500/60 rounded-full flex items-center justify-center">
                                  <span className="text-white text-lg">🔴</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Loading indicator */}
                          <div className="absolute bottom-2 right-2">
                            <div className="flex items-center space-x-1 text-xs text-white/60">
                              <div className="w-1 h-1 bg-[#EAFE07] rounded-full animate-pulse"></div>
                              <div className="w-1 h-1 bg-[#EAFE07] rounded-full animate-pulse delay-150"></div>
                              <div className="w-1 h-1 bg-[#EAFE07] rounded-full animate-pulse delay-300"></div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Content Section */}
                        <div className="p-5">
                          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#EAFE07] transition-colors">{mission.title}</h3>
                          <p className="text-blue-200 text-sm mb-3">{mission.description}</p>
                          
                          {/* Mission stats */}
                          <div className="grid grid-cols-3 gap-2 mb-4">
                            <div className="text-center bg-white/5 rounded-lg py-2">
                              <div className="text-xs text-blue-200">Passengers</div>
                              <div className="text-sm font-semibold text-white">{mission.passengers}</div>
                            </div>
                            <div className="text-center bg-white/5 rounded-lg py-2">
                              <div className="text-xs text-blue-200">Duration</div>
                              <div className="text-sm font-semibold text-white">{mission.duration}d</div>
                            </div>
                            <div className="text-center bg-white/5 rounded-lg py-2">
                              <div className="text-xs text-blue-200">Destination</div>
                              <div className="text-sm font-semibold text-white">{mission.destination.toUpperCase()}</div>
                            </div>
                          </div>
                          
                          {/* Footer with status and explore button */}
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                mission.status === 'published' ? 'bg-green-500/20 text-green-300' :
                                mission.status === 'draft' ? 'bg-yellow-500/20 text-yellow-300' :
                                'bg-gray-500/20 text-gray-300'
                              }`}>
                                {mission.status}
                              </span>
                            </div>
                            
                            <Link 
                              href={`/mission-builder/${mission.id}`}
                              className="bg-[#EAFE07] text-[#07173F] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#EAFE07]/80 transition-all duration-200 hover:scale-105"
                            >
                              Explore
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-blue-200 mb-4">No public missions available yet.</p>
                    <Link href="/mission-builder/new" className="bg-[#EAFE07] text-[#07173F] px-6 py-3 rounded-lg font-semibold hover:bg-[#EAFE07]/80 transition-colors">
                      Create First Mission
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
              </main>
              </div>
            </ProtectedRoute>
          );
        }
