
import React from 'react';
import { 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Calendar,
  UserCheck
} from 'lucide-react';
import { Booking } from '../types';

interface ReceptionDashboardProps {
  bookings: Booking[];
  onUpdateStatus: (id: string, status: Booking['status']) => void;
}

const ReceptionDashboard: React.FC<ReceptionDashboardProps> = ({ bookings, onUpdateStatus }) => {
  const activeBookings = bookings.filter(b => b.status !== 'COMPLETED' && b.status !== 'CANCELLED');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Fila de Atendimento</h1>
          <p className="text-zinc-500">Acompanhe os clientes agendados para hoje.</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] text-zinc-500 uppercase font-black">Na fila</div>
            <div className="text-lg font-bold text-amber-500">{activeBookings.length}</div>
          </div>
          <Clock className="text-amber-500" size={24} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] overflow-hidden shadow-xl">
          <div className="p-6 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2 text-white">
              <Calendar className="text-amber-500" size={20} /> Agendamentos do Dia
            </h2>
          </div>
          
          <div className="divide-y divide-zinc-800">
            {activeBookings.map((booking) => (
              <div key={booking.id} className="p-6 flex items-center justify-between group hover:bg-zinc-800/30 transition-colors">
                <div className="flex items-center gap-6">
                  <div className={`w-3 h-3 rounded-full ${booking.status === 'PENDING' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                  <div className="flex items-center gap-4">
                    <img src={booking.clientAvatar} alt="" className="w-12 h-12 rounded-xl object-cover border border-zinc-800" />
                    <div>
                      <h3 className="font-bold text-lg text-zinc-100">{booking.clientName}</h3>
                      <p className="text-zinc-500 text-sm">
                        {booking.serviceName} com <span className="text-amber-500 font-medium">{booking.barberName}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right hidden sm:block">
                    <div className="text-zinc-500 text-[10px] font-black uppercase">Horário</div>
                    <div className="text-lg font-black text-white">{booking.time}</div>
                  </div>
                  
                  <div className="flex gap-2">
                    {booking.status === 'PENDING' && (
                      <button 
                        onClick={() => onUpdateStatus(booking.id, 'CONFIRMED')}
                        className="bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-zinc-950 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 border border-emerald-500/20"
                      >
                        <UserCheck size={16} /> Check-in
                      </button>
                    )}
                    <button 
                      className="bg-zinc-800 hover:bg-zinc-700 text-white p-3 rounded-xl transition-all"
                      title="Detalhes"
                    >
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {activeBookings.length === 0 && (
              <div className="p-20 text-center text-zinc-600 italic">
                Nenhum agendamento pendente para hoje.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceptionDashboard;
