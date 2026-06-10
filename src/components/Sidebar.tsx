import React from 'react';
import { ViewTab } from '../types';
import { usePlanner } from '../context/PlannerContext';

interface SidebarProps {
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const navItems: { id: Exclude<ViewTab, 'einstellungen'>; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'stundenplan', label: 'Stundenplan', icon: 'calendar_view_week' },
  { id: 'jahresuebersicht', label: 'Jahresübersicht', icon: 'calendar_month' },
  { id: 'wochenuebersicht', label: 'Wochenübersicht', icon: 'view_week' },
  { id: 'tagesuebersicht', label: 'Tagesübersicht', icon: 'event_note' },
  { id: 'aufgaben', label: 'Aufgaben', icon: 'check_circle' },
];

export default function Sidebar({ activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) {
  const { schoolInfo } = usePlanner();

  const handleNavClick = (id: ViewTab) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-on-background/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed left-0 top-0 h-full w-64 bg-surface-container-lowest border-r border-outline-variant pt-20 flex flex-col py-md z-40
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="px-md pb-lg border-b border-outline-variant mb-md hidden lg:block h-[72px] invisible">
          {/* Spacer to align with topbar visually if needed, but topbar is fixed */}
        </div>

        <div className="px-md mb-md">
          <h2 className="font-headline-lg text-headline-lg text-primary">LehrerPlaner</h2>
          <p className="font-body-md text-xs text-on-surface-variant font-bold mt-1">
            Klasse {schoolInfo.class} • Schuljahr {schoolInfo.year}
          </p>
        </div>

        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`
                  flex items-center gap-sm px-4 py-3 mx-2 my-1 rounded-2xl transition-all text-left group
                  ${isActive 
                    ? 'bg-primary/10 text-primary font-bold opacity-100 scale-100' 
                    : 'text-on-surface-variant hover:bg-surface-container'
                  }
                `}
              >
                <span 
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span className="font-label-md text-label-md">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="px-4 mb-md pt-4">
          <button 
            onClick={() => handleNavClick('aufgaben')}
            className="w-full bg-primary text-on-primary py-3 rounded-full font-label-md flex items-center justify-center gap-xs hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined">add</span>
            Neue Aufgabe
          </button>
        </div>

        <div className="border-t border-outline-variant pt-2">
          <button 
            onClick={() => handleNavClick('einstellungen')}
            className={`
              w-full text-left px-4 py-3 mx-2 my-1 rounded-full flex items-center gap-sm transition-all
              ${activeTab === 'einstellungen' 
                ? 'bg-primary/10 text-primary font-bold' 
                : 'text-on-surface-variant hover:bg-surface-container-high'
              }
            `}
          >
            <span 
              className="material-symbols-outlined"
              style={{ fontVariationSettings: activeTab === 'einstellungen' ? "'FILL' 1" : "'FILL' 0" }}
            >
              settings
            </span>
            <span className="font-label-md text-label-md">Einstellungen</span>
          </button>
        </div>
      </aside>
    </>
  );
}
