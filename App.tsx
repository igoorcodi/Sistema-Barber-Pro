
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import AdminDashboard from './components/AdminDashboard';
import ClientPortal from './components/ClientPortal';
import BarberDashboard from './components/BarberDashboard';
import BarberAgenda from './components/BarberAgenda';
import BarberStats from './components/BarberStats';
import ReceptionDashboard from './components/ReceptionDashboard';
import StaffManagement from './components/StaffManagement';
import FinanceDashboard from './components/FinanceDashboard';
import StockManagement from './components/StockManagement';
import SettingsPage from './components/SettingsPage';
import AuthPage from './components/AuthPage';
import ClientManagement from './components/ClientManagement';
import LoyaltyManagementAdmin from './components/LoyaltyManagementAdmin';
import AdminBookings from './components/AdminBookings';
import { UserRole } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.CLIENT);
  const [activeView, setActiveView] = useState<string>('book');
  const [initialSettingsTab, setInitialSettingsTab] = useState<string>('general');
  const [user, setUser] = useState<any>({ id: 'u1', name: 'Usuário', email: '' });

  useEffect(() => {
    if (!isAuthenticated) return;
    
    switch(currentRole) {
      case UserRole.ADMIN: setActiveView('exec'); break;
      case UserRole.CLIENT: setActiveView('book'); break;
      case UserRole.BARBER: setActiveView('dash'); break;
      case UserRole.RECEPTIONIST: setActiveView('bookings'); break;
    }
  }, [currentRole, isAuthenticated]);

  const handleAuthSuccess = (role: UserRole, userData: any) => {
    setCurrentRole(role);
    setUser({ ...user, ...userData });
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser({ id: '', name: 'Usuário', email: '' });
    setCurrentRole(UserRole.CLIENT);
    setActiveView('book');
  };

  const navigateToUpgrade = () => {
    setInitialSettingsTab('plans');
    setActiveView('settings');
  };

  const renderContent = () => {
    if (currentRole === UserRole.CLIENT) return <ClientPortal activeView={activeView} />;
    
    if (currentRole === UserRole.RECEPTIONIST) {
      switch(activeView) {
        case 'bookings': return <ReceptionDashboard />;
        case 'clients': return <ClientManagement />;
        default: return <ReceptionDashboard />;
      }
    }

    if (currentRole === UserRole.BARBER) {
      switch(activeView) {
        case 'dash': return <BarberDashboard />;
        case 'agenda': return <BarberAgenda />;
        case 'stats': return <BarberStats />;
        default: return <BarberDashboard />;
      }
    }

    if (currentRole === UserRole.ADMIN) {
      switch(activeView) {
        case 'exec': return <AdminDashboard user={user} />;
        case 'staff': return <StaffManagement user={user} />;
        case 'finance': return <FinanceDashboard />;
        case 'stock': return <StockManagement />;
        case 'clients': return <ClientManagement />;
        case 'loyalty_admin': return <LoyaltyManagementAdmin user={user} onUpgrade={navigateToUpgrade} />;
        case 'settings': return <SettingsPage user={user} initialTab={initialSettingsTab} />;
        case 'bookings_admin': return <AdminBookings />;
        default: return <AdminDashboard user={user} />;
      }
    }

    return <div>View not found</div>;
  };

  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <Layout 
      role={currentRole} 
      activeView={activeView}
      onViewChange={(view) => {
        setActiveView(view);
        if (view !== 'settings') setInitialSettingsTab('general');
      }}
      onRoleChange={setCurrentRole} 
      onLogout={handleLogout}
      userName={user.name}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
