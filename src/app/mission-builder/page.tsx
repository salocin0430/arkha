'use client';

import { useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';

// A simple card component for the main dashboard
const DashboardCard = ({ title, description, href }: { title: string; description: string; href: string }) => (
    <Link href={href}>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center h-full flex flex-col justify-center items-center hover:bg-white/20 transition-all cursor-pointer">
            <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
            <p className="text-blue-200 text-sm">{description}</p>
        </div>
    </Link>
);


export default function MissionDashboard() {
    const { user } = useAuth();

    return (
        <ProtectedRoute>
            <div className="h-full text-white">
                {/* Main Content */}
                <main className="flex flex-col items-center justify-center h-full p-6">
                            <div className="text-center mb-10">
                                <h1 className="text-4xl font-bold text-white mb-4">Hello {user?.user_metadata?.name || 'Explorer'}</h1>
                            </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full">
                    <DashboardCard 
                        title="Design Your Arkha" 
                        description="Create your own adaptive habitat. Set mission time and crew size, and watch your space home come to life in 3D." 
                        href="/mission-builder/new"
                    />
                    <DashboardCard 
                        title="My Missions" 
                        description="Revisit and refine the habitats you've already designed. Your personal journey through space architecture."
                        href="/profile"
                    />
                    <DashboardCard 
                        title="Explore the Fleet" 
                        description="Discover habitats designed by other explorers. Learn, compare, and get inspired by the community."
                        href="/gallery"
                    />
                    <DashboardCard 
                        title="NASA Archives" 
                        description="Dive into real NASA research on extraterrestrial habitats. Learn how science shapes the future of living in space."
                        href="/archives" // Assuming an archives page
                    />
                </div>
            </main>
        </div>
        </ProtectedRoute>
    );
}
