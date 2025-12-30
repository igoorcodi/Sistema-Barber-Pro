
import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle, 
  Camera, 
  FileText,
  TrendingUp,
  XCircle,
  MoreVertical,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { Booking } from '../types';

interface BarberDashboardProps {
  bookings: Booking[];
  onUpdateStatus: (id: string, status: Booking['status']) => void;
}

const BarberDashboard: React.FC<BarberDashboardProps> = ({ bookings, onUpdateStatus }) => {
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const activeBooking = bookings.find(b => b.id === activeServiceId);

  const handleFinalize = async () => {
    if (!activeServiceId) return;
    setIsFinishing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onUpdateStatus(activeServiceId, 'COMPLETED');
    setIsFinishing(false);
    setActiveServiceId(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Olá, Profissional! 👋</h1>
          <p className="text-zinc-500">Você tem {bookings.length} agendamentos na lista.</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-xl">
          <div className="text-right">
            <div className="text-xs text-zinc-500 uppercase font-black">Produção Hoje</div>
            <div className="text-lg font-bold text-amber-500">R$ {bookings.filter(b => b.status === 'COMPLETED').reduce((acc, curr) => acc + curr.price, 0).toFixed(2)}</div>
          </div>
          <TrendingUp className="text-emerald-500" />
        </div>
      </div>

      {showSuccess && (
        <div className="bg-emerald-500 text-zinc-950 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in zoom-in slide-in-from-top-4 duration-300 shadow-lg">
          <CheckCircle2 size={24} />
          <span className="font-bold text-sm uppercase tracking-tighter">Atendimento finalizado e enviado ao caixa!</span>
        </div>
      )}

      {activeBooking && (
        <div className="bg-amber-500 text-zinc-950 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-amber-500/20 animate-bounce-subtle">
          <div className="flex items-center gap-6">
            <div className="bg-zinc-950/20 p-3 rounded-2xl">
              <Clock className="animate-pulse" size={32} />
            </div>
            <div>
              <div className="text-sm font-black uppercase opacity-70">Atendimento em Andamento</div>
              <div className="text-2xl font-black">{activeBooking.clientName} - {activeBooking.time}</div>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={handleFinalize}
              disabled={isFinishing}
              className="flex-1 md:flex-none bg-zinc-950 px-8 py-3 rounded-2xl text-amber-500 font-black hover:bg-zinc-900 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isFinishing ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
              {isFinishing ? 'Processando...' : 'Finalizar'}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Calendar size={20} className="text-amber-500" /> Próximos Atendimentos
          </h2>

          <div className="space-y-4">
            {bookings.filter(b => b.status !== 'COMPLETED' && b.status !== 'CANCELLED').map((apt) => (
              <div key={apt.id} className={`bg-zinc-900 border border-zinc-800 p-6 rounded-3xl flex items-center justify-between group transition-all ${apt.status === 'PENDING' ? 'ring-2 ring-amber-500/20 border-amber-500/30 shadow-lg' : ''}`}>
                <div className="flex items-center gap-6">
                  <div className="text-center bg-zinc-800 w-16 h-16 rounded-2xl flex flex-col justify-center border border-zinc-700">
                    <span className="text-zinc-500 text-[10px] font-black uppercase">Hora</span>
                    <span className="text-lg font-black text-zinc-100">{apt.time}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">{apt.clientName}</h3>
                      {apt.status === 'PENDING' && (
                        <span className="bg-amber-500/10 text-amber-500 text-[10px] font-black px-2 py-0.5 rounded uppercase">Aguardando</span>
                      )}
                    </div>
                    <p className="text-zinc-500 text-sm">{apt.serviceName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={() => setActiveServiceId(apt.id)} className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black px-4 py-2 rounded-xl transition-all opacity-0 group-hover:opacity-100 uppercase text-xs tracking-widest">
                    INICIAR
                  </button>
                </div>
              </div>
            ))}
            {bookings.length === 0 && (
              <div className="text-center py-10 bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-800 text-zinc-600">
                Nenhum agendamento para hoje.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
            <h2 className="text-xl font-bold mb-6">Métricas do Dia</h2>
            <div className="space-y-6">
              {[
                { label: 'Serviços Realizados', value: bookings.filter(b => b.status === 'COMPLETED').length, progress: 50 },
                { label: 'Avaliação Média', value: '4.95', progress: 95 },
              ].map((stat, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-zinc-500 uppercase text-[10px] tracking-widest">{stat.label}</span>
                    <span className="text-amber-500">{stat.value}</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${stat.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarberDashboard;
