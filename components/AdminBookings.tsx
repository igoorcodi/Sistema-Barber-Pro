
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Calendar as CalendarIcon, 
  Clock, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Check,
  Trash2
} from 'lucide-react';
import { Booking } from '../types';

interface AdminBookingsProps {
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  onUpdateStatus: (id: string, status: Booking['status']) => void;
  onDeleteBooking: (id: string) => void;
}

const AdminBookings: React.FC<AdminBookingsProps> = ({ bookings, onUpdateStatus, onDeleteBooking }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.barberName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Confirmado</span>;
      case 'PENDING': return <span className="bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Pendente</span>;
      case 'COMPLETED': return <span className="bg-zinc-800 text-zinc-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Concluído</span>;
      case 'CANCELLED': return <span className="bg-rose-500/10 text-rose-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Cancelado</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Agenda Global</h1>
          <p className="text-zinc-500">Visualização consolidada de todos os profissionais.</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-xl">
          <div className="text-right">
            <div className="text-[10px] text-zinc-500 uppercase font-black">Registros na Lista</div>
            <div className="text-lg font-bold text-amber-500">{filteredBookings.length}</div>
          </div>
          <CalendarIcon className="text-amber-500" size={24} />
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-zinc-800 flex flex-col lg:flex-row justify-between items-center gap-6 bg-zinc-900/50">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input type="text" placeholder="Cliente ou Barbeiro..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all text-white" />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(status => (
              <button key={status} onClick={() => setStatusFilter(status)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${statusFilter === status ? 'bg-amber-500 text-zinc-950 shadow-lg' : 'bg-zinc-800 text-zinc-500 hover:text-white'}`}>
                {status === 'ALL' ? 'Todos' : status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-zinc-500 font-black uppercase tracking-widest border-b border-zinc-800">
                <th className="px-8 py-6">Cliente</th>
                <th className="px-8 py-6">Barbeiro</th>
                <th className="px-8 py-6">Serviço</th>
                <th className="px-8 py-6">Data / Hora</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-zinc-800/30 transition-colors group animate-in fade-in duration-300">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <img src={booking.clientAvatar} className="w-10 h-10 rounded-xl object-cover border border-zinc-700" alt="" />
                      <div className="font-bold text-zinc-100">{booking.clientName}</div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <img src={booking.barberAvatar} className="w-10 h-10 rounded-xl object-cover border border-zinc-700" alt="" />
                      <div className="font-bold text-zinc-100">{booking.barberName}</div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-bold text-zinc-100">{booking.serviceName}</div>
                    <div className="text-xs font-black text-amber-500">R$ {booking.price.toFixed(2)}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-xs font-bold text-zinc-300">{booking.date}</div>
                    <div className="text-sm font-black text-white">{booking.time}</div>
                  </td>
                  <td className="px-8 py-6">{getStatusBadge(booking.status)}</td>
                  <td className="px-8 py-6 text-right relative">
                    <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === booking.id ? null : booking.id); }} className="text-zinc-500 hover:text-white p-2 rounded-lg bg-zinc-800/50">
                      <MoreVertical size={20} />
                    </button>
                    {openMenuId === booking.id && (
                      <div className="absolute right-8 top-16 w-48 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-50 py-2 animate-in fade-in zoom-in-95">
                        <button onClick={() => onUpdateStatus(booking.id, 'CONFIRMED')} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-emerald-500 hover:bg-emerald-500/10 transition-all"><CheckCircle2 size={16} /> Confirmar</button>
                        <button onClick={() => onUpdateStatus(booking.id, 'CANCELLED')} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition-all"><XCircle size={16} /> Cancelar</button>
                        <button onClick={() => onDeleteBooking(booking.id)} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"><Trash2 size={16} /> Excluir</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center opacity-30 italic">Nenhum agendamento encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;
