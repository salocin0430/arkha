'use client';

import { useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

// Mock data for missions
const missions = [
    {
      id: 1,
      title: "Lunar Base Alpha",
      author: "Dr. Sarah Chen",
      passengers: 12,
      duration: 30,
      destination: "Moon",
      image: "/placeholder-mission.jpg", // Placeholder image
      likes: 42,
    },
    {
      id: 2,
      title: "Mars Colony One",
      author: "Cmdr. Rodriguez",
      passengers: 24,
      duration: 180,
      destination: "Mars",
      image: "/placeholder-mission.jpg",
      likes: 89,
    },
    {
      id: 3,
      title: "Deep Space Station",
      author: "Prof. Johnson",
      passengers: 8,
      duration: 365,
      destination: "Deep Space",
      image: "/placeholder-mission.jpg",
      likes: 156,
    }
];


export default function Gallery() {
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
                    {mission.destination === 'Moon' && (
                      <div className="w-8 h-8 bg-white/60 rounded-full flex items-center justify-center">
                        <span className="text-[#07173F] text-lg">🌙</span>
                      </div>
                    )}
                    {mission.destination === 'Mars' && (
                      <div className="w-8 h-8 bg-red-500/60 rounded-full flex items-center justify-center">
                        <span className="text-white text-lg">🔴</span>
                      </div>
                    )}
                    {mission.destination === 'Deep Space' && (
                      <div className="w-8 h-8 bg-purple-500/60 rounded-full flex items-center justify-center">
                        <span className="text-white text-lg">⭐</span>
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
                <p className="text-blue-200 text-sm mb-3">by {mission.author}</p>
                
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
                    <div className="text-sm font-semibold text-white">{mission.destination}</div>
                  </div>
                </div>
                
                {/* Footer with likes and explore button */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center">
                      <span className="text-red-400 text-xs">❤️</span>
                    </div>
                    <span className="text-white text-sm font-medium">{mission.likes}</span>
                  </div>
                  
                  <Link 
                    href={`/gallery/${mission.id}`}
                    className="bg-[#EAFE07] text-[#07173F] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#EAFE07]/80 transition-all duration-200 hover:scale-105"
                  >
                    Explore
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      </div>
    </ProtectedRoute>
  );
}
