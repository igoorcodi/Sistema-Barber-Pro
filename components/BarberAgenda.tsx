
import React, { useState } from 'react';
import { Clock, User, Calendar as CalendarIcon, Filter, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Booking } from '../types';

interface BarberAgendaProps {
  bookings: Booking[];
}

// Fixed: Added BarberAgendaProps to fix "Property 'bookings' does not exist on type 'IntrinsicAttributes'" error in App.tsx
const BarberAgenda: React.FC<BarberAgendaProps> = ({ bookings }) => {
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  
  const timeSlots = [
    { time: '09:00', client: 'Ricardo M.', service: 'Corte Degradê', status: 'CONFIRMED' },
    { time: '10:00', client: null, service: null, status: 'FREE' },
    { time: '11:00', client: 'Felipe S.', service: 'Barba Completa', status: 'CONFIRMED' },
    { time: '12:00', client: null, service: null, status: 'BREAK' },
    { time: '14:00', client: 'Gabriel A.', service: 'Combo VIP', status: 'WAITING' },
    { time: '15:00', client: 'João Pedro', service: 'Corte Social', status: 'CONFIRMED' },
    { time: '16:00', client: null, service: null, status: 'FREE' },
    { time: '17:00', client: 'Marcos V.', service: 'Pigmentação', status: 'CONFIRMED' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Minha Agenda</h1>
          <p className="text-zinc-500">Gerencie seus horários e atendimentos do dia.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl flex p-1">
            <button className="px-4 py-2 bg-amber-500 text-zinc-950 rounded-xl font-bold text-sm">Dia</button>
            <button className="px-4 py-2 text-zinc-400 hover:text-white rounded-xl font-bold text-sm">Semana</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Calendário Lateral / Mini */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
             <div className="flex items-center justify-between mb-6">
                <span className="font-bold">Outubro 2024</span>
                <div className="flex gap-2">
                  <button className="p-1 hover:bg-zinc-800 rounded-lg text-zinc-500"><ChevronLeft size={18} /></button>
                  <button className="p-1 hover:bg-zinc-800 rounded-lg text-zinc-500"><ChevronRight size={18} /></button>
                </div>
             </div>
             <div className="grid grid-cols-7 gap-1 mb-2">
                {['D','S','T','Q','Q','S','S'].map(d => <div key={d} className="text-[10px] text-center font-black text-zinc-600">{d}</div>)}
             </div>
             <div className="grid grid-cols-7 gap-1">
                {Array.from({length: 31}).map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedDay(i+1)}
                    className={`h-8 rounded-lg text-xs font-bold transition-all ${selectedDay === i+1 ? 'bg-amber-500 text-zinc-950' : 'hover:bg-zinc-800 text-zinc-400'}`}
                  >
                    {i+1}
                  </button>
                ))}
             </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-3xl">
             <h3 className="text-amber-500 font-bold text-sm mb-2 flex items-center gap-2">
               <Clock size={16} /> Resumo do Dia
             </h3>
             <div className="space-y-3">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-zinc-500">Agendados</span>
                  <span className="text-zinc-200">12 cortes</span>
                </div>
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-zinc-500">Disponíveis</span>
                  <span className="text-zinc-200">4 horários</span>
                </div>
                <div className="h-1 bg-zinc-800 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-amber-500 w-[75%] rounded-full"></div>
                </div>
             </div>
          </div>
        </div>

        {/* Timeline da Agenda */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-4 bg-zinc-800 px-4 py-2 rounded-xl w-64 border border-zinc-700/50">
              <Search size={16} className="text-zinc-500" />
              <input type="text" placeholder="Buscar na agenda..." className="bg-transparent border-none text-xs focus:outline-none w-full" />
            </div>
            <button className="flex items-center gap-2 text-zinc-400 hover:text-white text-xs font-bold px-4">
              <Filter size={16} /> Filtros
            </button>
          </div>

          <div className="space-y-3">
            {timeSlots.map((slot, i) => (
              <div 
                key={i} 
                className={`group flex items-center gap-6 p-4 rounded-3xl border transition-all ${
                  slot.status === 'FREE' 
                  ? 'bg-zinc-900/30 border-dashed border-zinc-800 hover:border-amber-500/30' 
                  : slot.status === 'BREAK' 
                  ? 'bg-zinc-800/20 border-transparent opacity-50'
                  : 'bg-zinc-900 border-zinc-800 hover:border-amber-500/30'
                }`}
              >
                <div className="w-16 text-center shrink-0">
                  <span className="text-lg font-black text-zinc-400 group-hover:text-amber-500 transition-colors">{slot.time}</span>
                </div>

                <div className="flex-1 flex items-center justify-between">
                  {slot.status === 'FREE' ? (
                    <div className="flex items-center justify-between w-full">
                       <span className="text-zinc-600 font-bold italic text-sm">Horário Disponível</span>
                       <button className="text-[10px] font-black uppercase text-amber-500 border border-amber-500/20 px-3 py-1.5 rounded-lg hover:bg-amber-500 hover:text-zinc-950 transition-all">Reservar Manual</button>
                    </div>
                  ) : slot.status === 'BREAK' ? (
                    <span className="text-zinc-600 font-bold uppercase text-xs tracking-widest">Intervalo / Almoço</span>
                  ) : (
                    <>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center border border-zinc-700">
                          <User size={18} className="text-zinc-500" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                             <h4 className="font-bold text-zinc-100">{slot.client}</h4>
                             {slot.status === 'WAITING' && <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>}
                          </div>
                          <p className="text-xs text-zinc-500 font-medium">{slot.service}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${
                           slot.status === 'WAITING' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                         }`}>
                           {slot.status === 'WAITING' ? 'CLIENTE NO LOCAL' : 'CONFIRMADO'}
                         </span>
                         <button className="p-2 text-zinc-600 hover:text-white"><ChevronRight size={20} /></button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarberAgenda;
