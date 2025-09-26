'use client';

import Link from 'next/link';
import NavbarContent from './NavbarContent';

export default function PersistentNavbar() {

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0042A6]/20 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4 md:p-6">
        <div className="flex items-center">
          <Link href="/" className="cursor-pointer">
            <img
              src="/icono-arkha-blanco.png" 
              alt="ARKHA Logo" 
              className="w-16 h-16 object-contain hover:opacity-80 transition-opacity"
            />
          </Link>
        </div>
        
        <nav className="flex items-center space-x-3 md:space-x-4">
          <NavbarContent />
        </nav>
      </div>
    </header>
  );
}
