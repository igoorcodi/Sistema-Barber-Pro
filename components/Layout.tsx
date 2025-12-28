
import React, { useState } from 'react';
import { UserRole } from '../types';
import { 
  Scissors, 
  Calendar, 
  Users, 
  TrendingUp, 
  Package, 
  Settings, 
  CreditCard,
  LogOut,
  Bell,
  Search,
  LayoutDashboard,
  UserCheck,
  Menu,
  X,
  Award,
  Clock
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
  activeView: string;
  onViewChange: (viewId: string) => void;
  onRoleChange: (role: UserRole) => void;
  onLogout: () => void;
  userName: string;
}

const Layout: React.FC<LayoutProps> = ({ children, role, activeView, onViewChange, onLogout, userName }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = {
    [UserRole.CLIENT]: [
      { id: 'book', label: 'Novo Agendamento', icon: Calendar },
      { id: 'history', label: 'Meus Cortes', icon: Scissors },
      { id: 'loyalty', label: 'Fidelidade', icon: TrendingUp },
    ],
    [UserRole.BARBER]: [
      { id: 'dash', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'agenda', label: 'Minha Agenda', icon: Calendar },
      { id: 'stats', label: 'Desempenho', icon: TrendingUp },
    ],
    [UserRole.RECEPTIONIST]: [
      { id: 'bookings', label: 'Agendamentos', icon: Calendar },
      { id: 'checkin', label: 'Check-in', icon: UserCheck },
      { id: 'cashier', label: 'Caixa', icon: CreditCard },
      { id: 'clients', label: 'Clientes', icon: Users },
    ],
    [UserRole.ADMIN]: [
      { id: 'exec', label: 'Executivo', icon: TrendingUp },
      { id: 'bookings_admin', label: 'Agendamentos', icon: Clock },
      { id: 'staff', label: 'Barbeiros', icon: Scissors },
      { id: 'finance', label: 'Financeiro', icon: CreditCard },
      { id: 'stock', label: 'Estoque', icon: Package },
      { id: 'clients', label: 'Clientes', icon: Users },
      { id: 'loyalty_admin', label: 'Fidelidade', icon: Award },
      { id: 'settings', label: 'Configurações', icon: Settings },
    ],
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 flex items-center gap-3">
        <div className="bg-amber-500 p-2 rounded-lg shadow-lg shadow-amber-500/20">
          <Scissors className="text-zinc-950" size={24} />
        </div>
        <span className="text-xl font-black tracking-tighter text-amber-500">BARBER PRO</span>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-6">
        {navItems[role].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onViewChange(item.id);
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group ${
              activeView === item.id 
              ? 'bg-amber-500/10 text-amber-500 border border-amber-500/10' 
              : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <item.icon size={20} className={activeView === item.id ? 'scale-110' : 'group-hover:scale-110 transition-transform'} />
            <span className="font-bold text-sm uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-4 text-zinc-500 hover:text-rose-500 rounded-2xl transition-all font-bold text-sm uppercase group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Sair do Sistema</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col hidden lg:flex shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Menu Drawer Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar (Drawer) */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-zinc-900 border-r border-zinc-800 flex flex-col z-[101] transition-transform duration-300 lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="absolute top-6 right-4 lg:hidden">
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-zinc-500 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <SidebarContent />
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 bg-zinc-900 border-b border-zinc-800 px-4 md:px-8 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white bg-zinc-800/50 rounded-xl"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-4 bg-zinc-800/50 px-4 py-2.5 rounded-2xl w-full max-w-[150px] sm:max-w-xs md:w-96 border border-zinc-700/30">
              <Search size={18} className="text-zinc-500 shrink-0" />
              <input 
                type="text" 
                placeholder="Pesquisar..." 
                className="bg-transparent border-none focus:outline-none text-xs w-full text-zinc-200 font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <button className="relative text-zinc-500 hover:text-zinc-100 transition-colors bg-zinc-800/50 p-2.5 rounded-xl border border-zinc-700/30 hidden sm:block">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full border-2 border-zinc-900"></span>
            </button>
            <div className="h-10 w-[1px] bg-zinc-800 hidden sm:block"></div>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="text-right hidden xs:block">
                <div className="text-sm font-black text-white line-clamp-1">{userName}</div>
                <div className="text-[10px] text-amber-500 font-black uppercase tracking-widest">{role}</div>
              </div>
              <img 
                src={`https://picsum.photos/seed/${userName}/100`} 
                alt="Avatar" 
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl border border-zinc-700 shadow-xl" 
              />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar bg-zinc-950">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
