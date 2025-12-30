
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
import CashierTerminal from './components/CashierTerminal';
import CheckInTerminal from './components/CheckInTerminal';
import { UserRole, Booking } from './types';

const INITIAL_BOOKINGS: Booking[] = [
  { 
    id: 'bk1', 
    clientName: 'Gabriel Almeida', 
    clientAvatar: 'https://picsum.photos/seed/c1/100',
    barberName: 'Henrique Silva', 
    barberAvatar: 'https://picsum.photos/seed/h1/100',
    serviceName: 'Corte de Cabelo',
    price: 50,
    date: '2024-10-25',
    time: '14:00',
    status: 'CONFIRMED'
  },
  { 
    id: 'bk2', 
    clientName: 'Marcus Vinicius', 
    clientAvatar: 'https://picsum.photos/seed/c2/100',
    barberName: 'Henrique Silva', 
    barberAvatar: 'https://picsum.photos/seed/h1/100',
    serviceName: 'Barba Completa',
    price: 35,
    date: '2024-10-25',
    time: '15:00',
    status: 'PENDING'
  }
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.CLIENT);
  const [activeView, setActiveView] = useState<string>('book');
  const [initialSettingsTab, setInitialSettingsTab] = useState<string>('general');
  const [user, setUser] = useState<any>({ id: 'u1', name: 'Henrique Silva', email: 'henrique@barber.pro', companyCode: 'BARBER-MASTER-01' });
  
  // Estado centralizado de agendamentos
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

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
    setUser({ ...user, ...userData, role });
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser({ id: '', name: 'Usuário', email: '', companyCode: '' });
    setCurrentRole(UserRole.CLIENT);
    setActiveView('book');
  };

  const handleNewBooking = (newBooking: Booking) => {
    setBookings(prev => [newBooking, ...prev]);
  };

  const handleUpdateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const handleDeleteBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  const navigateToUpgrade = () => {
    setInitialSettingsTab('plans');
    setActiveView('settings');
  };

  const renderContent = () => {
    if (currentRole === UserRole.CLIENT) return <ClientPortal activeView={activeView} onNewBooking={handleNewBooking} />;
    
    if (currentRole === UserRole.RECEPTIONIST) {
      switch(activeView) {
        case 'bookings': return <ReceptionDashboard bookings={bookings} onUpdateStatus={handleUpdateBookingStatus} />;
        case 'checkin': return <CheckInTerminal bookings={bookings} onUpdateStatus={handleUpdateBookingStatus} />;
        case 'cashier': return <CashierTerminal />;
        case 'clients': return <ClientManagement />;
        case 'settings': return <SettingsPage user={user} initialTab={initialSettingsTab} />;
        default: return <ReceptionDashboard bookings={bookings} onUpdateStatus={handleUpdateBookingStatus} />;
      }
    }

    if (currentRole === UserRole.BARBER) {
      switch(activeView) {
        case 'dash': return <BarberDashboard bookings={bookings.filter(b => b.barberName === user.name)} onUpdateStatus={handleUpdateBookingStatus} />;
        case 'agenda': return <BarberAgenda bookings={bookings.filter(b => b.barberName === user.name)} />;
        case 'stats': return <BarberStats />;
        case 'settings': return <SettingsPage user={user} initialTab={initialSettingsTab} />;
        default: return <BarberDashboard bookings={bookings.filter(b => b.barberName === user.name)} onUpdateStatus={handleUpdateBookingStatus} />;
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
        case 'bookings_admin': return <AdminBookings bookings={bookings} setBookings={setBookings} onUpdateStatus={handleUpdateBookingStatus} onDeleteBooking={handleDeleteBooking} />;
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
      companyCode={user.companyCode}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
