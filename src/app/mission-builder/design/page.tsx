'use client';

import { Suspense } from 'react';
import ModuleViewer3D from '@/components/ModuleViewer3D';

export default function MissionDesignPage() {
  return (
    <div className="w-full h-screen">
      <Suspense fallback={
        <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-[#0042A6] to-[#07173F]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EAFE07] mx-auto mb-4"></div>
            <p className="text-white text-lg">Cargando visor de módulos...</p>
          </div>
        </div>
      }>
        <ModuleViewer3D />
      </Suspense>
    </div>
  );
}