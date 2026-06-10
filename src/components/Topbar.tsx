import React from 'react';

interface TopbarProps {
  toggleMobileMenu: () => void;
}

export default function Topbar({ toggleMobileMenu }: TopbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-outline-variant">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-16 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-md">
          <button 
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-full hover:bg-surface-container-low transition-colors material-symbols-outlined text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Menü öffnen"
          >
            menu
          </button>
          <span className="font-headline-lg text-headline-lg font-semibold text-primary">LehrerPlaner</span>
        </div>
        
        <div className="flex items-center gap-md">
          <div className="relative hidden md:block">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">search</span>
            <input 
              className="pl-10 pr-4 py-2 bg-surface-container-low rounded-full border-none font-label-md text-label-md focus:ring-2 focus:ring-primary w-[200px] transition-all focus:w-[260px] outline-none" 
              placeholder="Suchen..." 
              type="text" 
            />
          </div>
          
          <div className="flex items-center gap-sm">
            <button className="p-2 rounded-full hover:bg-surface-container-low transition-colors material-symbols-outlined text-on-surface-variant focus:outline-none">
              notifications
            </button>
            <button className="hidden sm:block p-2 rounded-full hover:bg-surface-container-low transition-colors material-symbols-outlined text-on-surface-variant focus:outline-none">
              settings
            </button>
            <img 
              alt="Lehrer Profilbild" 
              className="w-8 h-8 rounded-full ml-2 border border-outline-variant object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQM4QDiz3empSecWSlfIhGNNawogOhk_OgrqTBw6QVycgbnASsH_Fb3l2O1z_Fz0RYPZ-H8OxvzWHOUEplN3Lq66uiUzqcq4VfHD4T9DBAB7x7IqdpX4NOSNo-x-l6h3zhiTyZX-_cV9wtzeHBantKdGOkq2uY7gpXxrGaRGy2TMQuLFJYdXe9do1-JHMpuMyAgEkPTeGlvE4i-9jdJqFqWyJy-bj5eNvGSSIGPsab1ja8VxrmBUc0gGTPKm3I_8VvsEFKeoSXhg"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
