
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Calendar as CalendarIcon, 
  User, 
  Scissors, 
  Clock, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Check,
  X,
  Trash2,
  Play
} from 'lucide-react';
import { MOCK_BARBERS, MOCK_SERVICES } from '../constants';

interface BookingRecord {
  id: string;
  clientName: string;
  clientAvatar: string;
  barberName: string;
  barberAvatar: string;
  serviceName: string;
  price: number;
  date: string;
  time: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
}

const MOCK_ADMIN_BOOKINGS: BookingRecord[] = [
  { 
    id: 'bk1', 
    clientName: 'Gabriel Almeida', 
    clientAvatar: 'https://picsum.photos/seed/c1/100',
    barberName: 'Henrique Silva', 
    barberAvatar: 'https://picsum.photos/seed/h1/100',
    serviceName: 'Corte de Cabelo',
    price: 50,
    date: '2024-10-25',
    time: '09:00',
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
    time: '10:00',
    status: 'PENDING'
  },
  { 
    id: 'bk3', 
    clientName: 'João Pedro', 
    clientAvatar: 'https://picsum.photos/seed/jp/100',
    barberName: 'Carlos Santos', 
    barberAvatar: 'https://picsum.photos/seed/cs/100',
    serviceName: 'Combo VIP',
    price: 90,
    date: '2024-10-25',
    time: '14:30',
    status: 'COMPLETED'
  },
  { 
    id: 'bk4', 
    clientName: 'Ricardo Oliveira', 
    clientAvatar: 'https://picsum.photos/seed/ro/100',
    barberName: 'Carlos Santos', 
    barberAvatar: 'https://picsum.photos/seed/cs/100',
    serviceName: 'Corte Degradê',
    price: 55,
    date: '2024-10-25',
    time: '16:00',
    status: 'CANCELLED'
  }
];

const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<BookingRecord[]>(MOCK_ADMIN_BOOKINGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleUpdateStatus = (id: string, newStatus: BookingRecord['status']) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    setOpenMenuId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Deseja realmente excluir este registro de agendamento?")) {
      setBookings(prev => prev.filter(b => b.id !== id));
      setOpenMenuId(null);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.barberName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-black uppercase">Confirmado</span>;
      case 'PENDING': return <span className="bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-[10px] font-black uppercase">Pendente</span>;
      case 'COMPLETED': return <span className="bg-zinc-800 text-zinc-400 px-3 py-1 rounded-full text-[10px] font-black uppercase">Concluído</span>;
      case 'CANCELLED': return <span className="bg-rose-500/10 text-rose-500 px-3 py-1 rounded-full text-[10px] font-black uppercase">Cancelado</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Todos os Agendamentos</h1>
          <p className="text-zinc-500">Visualize e gerencie a agenda global da barbearia.</p>
        </div>
        <div className="flex gap-2">
           <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-2xl flex items-center gap-4">
              <div className="text-right">
                <div className="text-[10px] text-zinc-500 uppercase font-black">Total Visível</div>
                <div className="text-lg font-bold text-amber-500">{filteredBookings.length}</div>
              </div>
              <CalendarIcon className="text-amber-500" size={24} />
           </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-zinc-800 flex flex-col lg:flex-row justify-between items-center gap-6 bg-zinc-900/50">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar cliente ou barbeiro..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-4 w-full lg:w-auto overflow-x-auto no-scrollbar pb-2 lg:pb-0">
            <Filter size={18} className="text-zinc-500 shrink-0" />
            <div className="flex gap-2">
              {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(status => (
                <button 
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${
                    statusFilter === status 
                    ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20' 
                    : 'bg-zinc-800 text-zinc-500 hover:text-white'
                  }`}
                >
                  {status === 'ALL' ? 'Todos' : status}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-zinc-500 font-black uppercase tracking-widest border-b border-zinc-800">
                <th className="px-8 py-6">Cliente</th>
                <th className="px-8 py-6">Barbeiro</th>
                <th className="px-8 py-6">Serviço / Valor</th>
                <th className="px-8 py-6">Data / Hora</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-zinc-800/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <img src={booking.clientAvatar} className="w-10 h-10 rounded-xl object-cover border border-zinc-700" alt={booking.clientName} />
                      <div>
                        <div className="font-bold text-zinc-100">{booking.clientName}</div>
                        <div className="text-[10px] text-zinc-500 font-medium">Cliente</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <img src={booking.barberAvatar} className="w-10 h-10 rounded-xl object-cover border border-zinc-700" alt={booking.barberName} />
                      <div>
                        <div className="font-bold text-zinc-100">{booking.barberName}</div>
                        <div className="text-[10px] text-amber-500/70 font-black uppercase tracking-widest">Barbeiro</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div>
                      <div className="text-sm font-bold text-zinc-100">{booking.serviceName}</div>
                      <div className="text-sm font-black text-amber-500">R$ {booking.price.toFixed(2)}</div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 mb-1">
                      <CalendarIcon size={14} className="text-zinc-500" />
                      <span className="text-xs font-bold text-zinc-300">{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-zinc-500" />
                      <span className="text-sm font-black text-zinc-100">{booking.time}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {getStatusBadge(booking.status)}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === booking.id ? null : booking.id);
                        }}
                        className="text-zinc-500 hover:text-white p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-all"
                      >
                        <MoreVertical size={20} />
                      </button>

                      {openMenuId === booking.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded-2xl shadow-2xl z-30 py-2 animate-in fade-in zoom-in-95 duration-200">
                          {booking.status === 'PENDING' && (
                            <button 
                              onClick={() => handleUpdateStatus(booking.id, 'CONFIRMED')}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-zinc-300 hover:bg-emerald-500/10 hover:text-emerald-500 transition-all"
                            >
                              <CheckCircle2 size={18} /> Confirmar
                            </button>
                          )}
                          {(booking.status === 'CONFIRMED' || booking.status === 'PENDING') && (
                            <button 
                              onClick={() => handleUpdateStatus(booking.id, 'COMPLETED')}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all"
                            >
                              <Check size={18} className="text-amber-500" /> Marcar Concluído
                            </button>
                          )}
                          {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                            <button 
                              onClick={() => handleUpdateStatus(booking.id, 'CANCELLED')}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-500/10 transition-all"
                            >
                              <XCircle size={18} /> Cancelar Agendam.
                            </button>
                          )}
                          <div className="h-[1px] bg-zinc-700 my-2 mx-4" />
                          <button 
                            onClick={() => handleDelete(booking.id)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-zinc-500 hover:bg-rose-500 hover:text-white transition-all"
                          >
                            <Trash2 size={18} /> Excluir Registro
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                      <AlertCircle size={48} />
                      <p className="text-zinc-500 font-medium">Nenhum agendamento encontrado com esses filtros.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 bg-zinc-900/80 border-t border-zinc-800 flex justify-between items-center">
          <p className="text-xs text-zinc-500 font-medium">Mostrando {filteredBookings.length} de {bookings.length} agendamentos</p>
          <div className="flex gap-2">
            <button className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 disabled:opacity-30" disabled>
              <ChevronLeft size={18} />
            </button>
            <button className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 disabled:opacity-30" disabled>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;
