
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
  MoreVertical
} from 'lucide-react';

const BarberDashboard: React.FC = () => {
  const [activeService, setActiveService] = useState(false);

  const appointments = [
    { id: 1, time: '14:00', client: 'Gabriel Almeida', service: 'Corte + Barba', status: 'WAITING', history: 'Corte degrade, navalhado dos lados.' },
    { id: 2, time: '15:00', client: 'João Pedro', service: 'Corte Social', status: 'SCHEDULED', history: 'Prefere tesoura no topo.' },
    { id: 3, time: '16:30', client: 'Marcus V.', service: 'Barba', status: 'SCHEDULED', history: 'Linhas bem marcadas.' },
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Olá, Henrique! 👋</h1>
          <p className="text-zinc-500">Você tem 8 agendamentos para hoje.</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 px-6 py-3 rounded-2xl flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-zinc-500 uppercase font-black">Hoje</div>
            <div className="text-lg font-bold text-amber-500">R$ 540,00</div>
          </div>
          <TrendingUp className="text-emerald-500" />
        </div>
      </div>

      {/* Active Service Notification / Floating Bar */}
      {activeService && (
        <div className="bg-amber-500 text-zinc-950 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-amber-500/20 animate-bounce-subtle">
          <div className="flex items-center gap-6">
            <div className="bg-zinc-950/20 p-3 rounded-2xl">
              <Clock className="animate-pulse" size={32} />
            </div>
            <div>
              <div className="text-sm font-black uppercase opacity-70">Atendimento em Andamento</div>
              <div className="text-2xl font-black">Gabriel Almeida - 22:15</div>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none bg-zinc-950/10 hover:bg-zinc-950/20 px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2">
              <Camera size={20} /> Foto
            </button>
            <button 
              onClick={() => setActiveService(false)}
              className="flex-1 md:flex-none bg-zinc-950 px-8 py-3 rounded-2xl text-amber-500 font-bold hover:bg-zinc-900 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle size={20} /> Finalizar
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Agenda Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Calendar size={20} className="text-amber-500" /> Próximos Atendimentos
            </h2>
            <button className="text-zinc-500 hover:text-zinc-300 text-sm font-bold">Ver Tudo</button>
          </div>

          <div className="space-y-4">
            {appointments.map((apt) => (
              <div key={apt.id} className={`bg-zinc-900 border border-zinc-800 p-6 rounded-3xl flex items-center justify-between group transition-all ${apt.status === 'WAITING' ? 'ring-2 ring-amber-500/20 border-amber-500/30' : ''}`}>
                <div className="flex items-center gap-6">
                  <div className="text-center bg-zinc-800 w-16 h-16 rounded-2xl flex flex-col justify-center border border-zinc-700">
                    <span className="text-zinc-500 text-[10px] font-black uppercase">Hora</span>
                    <span className="text-lg font-black text-zinc-100">{apt.time}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">{apt.client}</h3>
                      {apt.status === 'WAITING' && (
                        <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black px-2 py-0.5 rounded uppercase">Já chegou</span>
                      )}
                    </div>
                    <p className="text-zinc-500 text-sm">{apt.service}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <button className="text-[10px] font-bold text-zinc-400 hover:text-amber-500 flex items-center gap-1 uppercase">
                        <FileText size={12} /> Ver Histórico
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={() => setActiveService(true)} className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black px-4 py-2 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                    INICIAR
                  </button>
                  <button className="text-zinc-500 hover:text-zinc-300 p-2">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats & Quick Actions */}
        <div className="space-y-8">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
            <h2 className="text-xl font-bold mb-6">Métricas do Mês</h2>
            <div className="space-y-6">
              {[
                { label: 'Serviços Realizados', value: '142', progress: 75 },
                { label: 'Avaliação Média', value: '4.95', progress: 95 },
                { label: 'Comissão Acumulada', value: 'R$ 2.850', progress: 60 },
              ].map((stat, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-zinc-500 uppercase text-[10px]">{stat.label}</span>
                    <span className="text-amber-500">{stat.value}</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${stat.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
            <h2 className="text-xl font-bold mb-6">Bloquear Horário</h2>
            <p className="text-sm text-zinc-500 mb-4">Indique períodos em que você não estará disponível hoje.</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button className="bg-zinc-800 hover:bg-zinc-700 p-3 rounded-xl text-xs font-bold uppercase transition-all">Pausa Almoço</button>
              <button className="bg-zinc-800 hover:bg-zinc-700 p-3 rounded-xl text-xs font-bold uppercase transition-all">Médico/Emergência</button>
            </div>
            <button className="w-full bg-transparent border border-zinc-800 hover:border-amber-500/50 text-zinc-400 py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2">
              <XCircle size={18} /> Bloqueio Personalizado
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarberDashboard;
