import { useState } from 'react';
import { ViewTab } from './types';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './views/Dashboard';
import Stundenplan from './views/Stundenplan';
import Jahresuebersicht from './views/Jahresuebersicht';
import Wochenuebersicht from './views/Wochenuebersicht';
import Tagesuebersicht from './views/Tagesuebersicht';
import Aufgaben from './views/Aufgaben';
import Einstellungen from './views/Einstellungen';
import { PlannerProvider } from './context/PlannerContext';

export default function App() {
  const [activeTab, setActiveTab] = useState<ViewTab>('tagesuebersicht');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'stundenplan': return <Stundenplan />;
      case 'jahresuebersicht': return <Jahresuebersicht />;
      case 'wochenuebersicht': return <Wochenuebersicht />;
      case 'tagesuebersicht': return <Tagesuebersicht />;
      case 'aufgaben': return <Aufgaben />;
      case 'einstellungen': return <Einstellungen />;
      default: return <Dashboard />;
    }
  };

  return (
    <PlannerProvider>
      <div className="flex bg-background min-h-screen">
        <Topbar toggleMobileMenu={toggleMobileMenu} setActiveTab={setActiveTab} />
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isMobileMenuOpen={isMobileMenuOpen} 
          setIsMobileMenuOpen={setIsMobileMenuOpen} 
        />
        <div className="flex-1 lg:ml-64 pt-16 flex flex-col min-h-screen">
          {renderView()}
        </div>
      </div>
    </PlannerProvider>
  );
}
