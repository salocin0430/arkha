'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { createMission } from '@/application/services/AppService';

export default function NewMission() {
  const [passengers, setPassengers] = useState(10);
  const [time, setTime] = useState(20);
  const [destination, setDestination] = useState('');

  const router = useRouter();

  const handleDesign = async () => {
    if(!destination) {
        alert("Please select a destination.");
        return;
    }

    try {
      // Get current user
      const userData = localStorage.getItem('user');
      if (!userData) {
        alert("Please log in first.");
        router.push('/login');
        return;
      }

      const user = JSON.parse(userData);

              // Create mission using Clean Architecture
              const mission = await createMission.execute({
                title: `${destination.charAt(0).toUpperCase() + destination.slice(1)} Mission`,
                description: `A ${time}-day mission to ${destination} for ${passengers} passengers`,
                destination: destination as 'moon' | 'mars',
                passengers,
                duration: time,
                isPublic: false,
                status: 'draft',
                userId: user.id,
              });

      // Navigate to the 3D design page
      router.push(`/mission-builder/design?missionId=${mission.id}`);
    } catch (error) {
      console.error('Error creating mission:', error);
      alert('Failed to create mission. Please try again.');
    }
  }

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
        <main className="flex flex-col items-center justify-center h-full p-6 relative z-10">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-3">WHERE ARE YOU GOING?</h1>
        </div>

        {/* Destination Selection */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setDestination('moon')}
            className={`p-4 rounded-lg border-2 transition-all ${
              destination === 'moon' 
                ? 'border-[#EAFE07] bg-[#EAFE07]/20' 
                : 'border-white/30 bg-white/10 hover:bg-white/20'
            }`}
          >
            {/* Replace with Moon image */}
            <div className="w-24 h-24 bg-gray-500 rounded-full mb-3"></div>
            <p className="text-white font-semibold text-base">Moon</p>
          </button>
          
          <button
            onClick={() => setDestination('mars')}
            className={`p-4 rounded-lg border-2 transition-all ${
              destination === 'mars' 
                ? 'border-[#EAFE07] bg-[#EAFE07]/20' 
                : 'border-white/30 bg-white/10 hover:bg-white/20'
            }`}
          >
            {/* Replace with Mars image */}
            <div className="w-24 h-24 bg-red-700 rounded-full mb-3"></div>
            <p className="text-white font-semibold text-base">Mars</p>
          </button>
        </div>

        {/* Mission Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 w-full max-w-2xl">
          {/* Passengers */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-center bg-[#EAFE07] text-[#07173F] px-3 py-1 rounded-full mb-3 font-semibold inline-block text-xs">
              PASSENGERS
            </div>
            <div className="flex items-center justify-center space-x-4">
              <button 
                onClick={() => setPassengers(Math.max(1, passengers - 1))}
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-2xl"
              >
                &lt;
              </button>
              <div className="bg-[#07173F]/50 text-white px-6 py-2 rounded-lg font-semibold text-2xl">
                {passengers}
              </div>
              <button 
                onClick={() => setPassengers(passengers + 1)}
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-2xl"
              >
                &gt;
              </button>
            </div>
          </div>

          {/* Time */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
             <div className="text-center bg-[#EAFE07] text-[#07173F] px-3 py-1 rounded-full mb-3 font-semibold inline-block text-xs">
              TIME
            </div>
            <div className="bg-blue-900/50 text-white px-6 py-2 rounded-lg font-semibold flex items-center justify-center text-2xl">
                <select 
                    value={time} 
                    onChange={(e) => setTime(Number(e.target.value))}
                    className="bg-transparent border-none text-white focus:outline-none appearance-none text-2xl"
                >
                    <option value={20}>20 DAYS</option>
                    <option value={30}>30 DAYS</option>
                    <option value={60}>60 DAYS</option>
                    <option value={90}>90 DAYS</option>
                </select>
            </div>
          </div>
        </div>

        {/* Design Button */}
        <button 
          onClick={handleDesign}
          className="text-[#EAFE07] border-b-2 border-[#EAFE07] font-semibold hover:text-[#EAFE07]/80 transition-colors text-base"
        >
          DESIGN THE ARKHA
        </button>
        </main>
      </div>
    </ProtectedRoute>
  );
}
