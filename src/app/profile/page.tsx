'use client';

import { useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

// Mock data
const user = {
    name: "Laura",
    email: "laura@example.com",
    missionsCreated: 2,
    totalLikes: 127,
    joinDate: "2024-01-15",
    avatar: "/avatar-placeholder.png"
};

const userMissions = [
    {
      id: 1,
      title: "My First Lunar Mission",
      passengers: 8,
      duration: 15,
      destination: "Moon",
      public: true,
      likes: 23
    },
    {
      id: 2,
      title: "Mars Exploration Base",
      passengers: 16,
      duration: 90,
      destination: "Mars",
      public: false,
      likes: 104
    }
];

export default function Profile() {
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
              {user.name[0]}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">{user.name}</h1>
              <p className="text-blue-200 mb-4">{user.email}</p>
              <div className="flex space-x-8 text-sm">
                <div className="text-center">
                          <div className="text-xl font-bold text-[#EAFE07]">{user.missionsCreated}</div>
                  <div className="text-blue-200">Missions</div>
                </div>
                <div className="text-center">
                          <div className="text-xl font-bold text-[#EAFE07]">{user.totalLikes}</div>
                  <div className="text-blue-200">Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-blue-200">Member since</div>
                  <div className="text-lg font-semibold text-white">{new Date(user.joinDate).getFullYear()}</div>
                </div>
              </div>
            </div>
          </div>

          {/* My Missions */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6">My Missions</h2>
            
            <div className="space-y-4">
              {userMissions.map((mission) => (
                <div key={mission.id} className="bg-white/5 rounded-lg p-4 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold text-white">{mission.title}</h3>
                        <div className="flex items-center space-x-4 text-xs text-blue-200 mt-1">
                            <span>{mission.passengers}p</span>
                            <span>{mission.duration}d</span>
                            <span>{mission.destination}</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        mission.public 
                            ? 'bg-green-500/20 text-green-300' 
                            : 'bg-gray-500/20 text-gray-300'
                        }`}>
                        {mission.public ? 'Public' : 'Private'}
                        </span>
                        <div className="flex items-center space-x-1">
                                <span className="text-[#EAFE07]">❤️</span>
                            <span className="text-white font-semibold">{mission.likes}</span>
                        </div>
                        <div className="flex space-x-2">
                                <Link 
                                    href={`/mission-builder/edit/${mission.id}`}
                                    className="bg-[#0042A6]/50 text-white px-3 py-1 rounded text-sm hover:bg-[#0042A6] transition-colors"
                                >
                            Edit
                        </Link>
                                <Link 
                                    href={`/gallery/${mission.id}`}
                                    className="bg-[#EAFE07]/80 text-[#07173F] font-bold px-3 py-1 rounded text-sm hover:bg-[#EAFE07] transition-colors"
                                >
                            View
                        </Link>
                        </div>
                    </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      </div>
    </ProtectedRoute>
  );
}
