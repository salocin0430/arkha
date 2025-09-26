'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Scene from '@/components/3d/Scene';

const MissionDesigner = () => {
    const searchParams = useSearchParams();
    const destination = searchParams.get('destination');
    const passengers = searchParams.get('passengers');
    const time = searchParams.get('time');

    return (
                <div className="h-screen bg-gradient-to-br from-[#0042A6] to-[#07173F] text-white flex flex-col">
             {/* Header */}
            <header className="flex justify-between items-center p-4 bg-gray-900/80 backdrop-blur-sm z-10 border-b border-white/10">
                <div className="text-sm">
                    <div>Designing for: <span className="font-bold text-[#EAFE07] capitalize">{destination}</span></div>
                    <div className="text-xs text-blue-200">{passengers} Passengers, {time} Days</div>
                </div>
                <nav className="flex items-center space-x-4">
                <Link href="/mission-builder/new" className="text-sm text-white hover:text-blue-300 transition-colors">
                    Back to Config
                </Link>
                        <button className="bg-[#EAFE07] text-[#07173F] px-4 py-2 rounded-full hover:bg-[#EAFE07]/80 transition-colors font-semibold text-sm">
                            Save Mission
                        </button>
                </nav>
            </header>
            
            <main className="flex-grow relative">
                {/* 3D Scene */}
                <Scene />

                {/* UI Overlays */}
                <div className="absolute top-4 left-4 bg-white/10 p-4 rounded-lg">
                    <h2 className="font-bold">Modules</h2>
                    {/* Module list will go here */}
                </div>
            </main>
        </div>
    );
}


export default function DesignPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading Mission...</div>}>
            <MissionDesigner />
        </Suspense>
    )
}
