'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Scene3D from '@/components/Scene3D';

function DesignContent() {
  const searchParams = useSearchParams();
  const missionId = searchParams.get('missionId');
  const mode = (searchParams.get('mode') as 'edit' | 'view') || 'edit';

  if (!missionId) {
    return (
      <div className="h-full flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Mission ID not found</h1>
          <p>Please go back and create a mission first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative">
      {/* 3D Scene */}
      <div className="absolute inset-0">
        <Suspense fallback={
          <div className="h-full flex items-center justify-center text-white">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EAFE07] mx-auto mb-4"></div>
              <p>Loading 3D Scene...</p>
            </div>
          </div>
        }>
          <Scene3D missionId={missionId} mode={mode} />
        </Suspense>
      </div>

      {/* UI Overlay */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white">
          <h2 className="text-lg font-bold mb-2">
            {mode === 'edit' ? '🎨 ARKHA Designer' : '👁️ ARKHA Viewer'}
          </h2>
          <p className="text-sm text-gray-300">Mission ID: {missionId}</p>
          <p className="text-xs text-[#EAFE07] mt-1">
            {mode === 'edit' ? 'Edit Mode - Click to modify' : 'View Mode - Read Only'}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white">
          <h3 className="text-sm font-bold mb-2">Controls</h3>
          <ul className="text-xs space-y-1">
            <li>• Left click + drag: Rotate</li>
            <li>• Right click + drag: Pan</li>
            <li>• Scroll: Zoom</li>
            {mode === 'edit' ? (
              <li>• Click objects to select & edit</li>
            ) : (
              <li>• Click objects to view details</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function DesignPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={
        <div className="h-full flex items-center justify-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EAFE07]"></div>
        </div>
      }>
        <DesignContent />
      </Suspense>
    </ProtectedRoute>
  );
}