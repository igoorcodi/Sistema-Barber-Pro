
import React from 'react';
import { 
  TrendingUp, 
  Star, 
  DollarSign, 
  Scissors, 
  ArrowUpRight, 
  Trophy, 
  Users,
  Target
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const DATA = [
  { name: 'Seg', cuts: 8, rev: 420 },
  { name: 'Ter', cuts: 12, rev: 610 },
  { name: 'Qua', cuts: 10, rev: 540 },
  { name: 'Qui', cuts: 15, rev: 820 },
  { name: 'Sex', cuts: 18, rev: 1100 },
  { name: 'Sáb', cuts: 22, rev: 1450 },
  { name: 'Dom', cuts: 14, rev: 890 },
];

const BarberStats: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Meu Desempenho</h1>
          <p className="text-zinc-500">Acompanhe seu progresso e ganhos individuais.</p>
        </div>
        <div className="flex gap-3">
           <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-2xl flex items-center gap-2 text-emerald-500 text-sm font-bold">
              <Trophy size={16} /> Nível: Gold Member
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Comissão Acumulada', value: 'R$ 3.840', trend: '+18%', icon: DollarSign, color: 'text-amber-500' },
          { label: 'Avaliação Média', value: '4.98', trend: '+0.2', icon: Star, color: 'text-amber-500' },
          { label: 'Cortes Realizados', value: '154', trend: '+12', icon: Scissors, color: 'text-amber-500' },
          { label: 'Novos Clientes', value: '28', trend: '+5', icon: Users, color: 'text-amber-500' },
        ].map((kpi, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl hover:border-amber-500/20 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-zinc-800 p-3 rounded-2xl text-zinc-400">
                <kpi.icon size={20} />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500">
                <ArrowUpRight size={12} /> {kpi.trend}
              </div>
            </div>
            <div className="text-zinc-500 text-[10px] font-black uppercase mb-1">{kpi.label}</div>
            <div className="text-2xl font-black">{kpi.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="text-amber-500" size={20} /> Produtividade Semanal
            </h2>
            <select className="bg-zinc-800 border-none rounded-xl text-xs px-3 py-1.5 focus:outline-none">
              <option>Esta Semana</option>
              <option>Mês Passado</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA}>
                <defs>
                  <linearGradient id="colorCuts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '16px' }}
                  itemStyle={{ color: '#f59e0b', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="cuts" stroke="#f59e0b" fillOpacity={1} fill="url(#colorCuts)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Target size={18} className="text-amber-500" /> Metas de Outubro
              </h3>
              <div className="space-y-6">
                 {[
                   { label: 'Receita', target: 5000, current: 3840 },
                   { label: 'Novos Clientes', target: 40, current: 28 },
                   { label: 'Retenção', target: 90, current: 84 },
                 ].map((goal, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase text-zinc-500">
                        <span>{goal.label}</span>
                        <span className="text-amber-500">{Math.round((goal.current/goal.target)*100)}%</span>
                      </div>
                      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(goal.current/goal.target)*100}%` }}></div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-gradient-to-br from-amber-500 to-amber-700 p-8 rounded-3xl text-zinc-950 shadow-xl shadow-amber-500/10">
              <div className="bg-zinc-950/20 p-2 rounded-lg w-fit mb-4">
                 <Trophy size={20} />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight leading-tight">Você está no TOP 3 da barbearia este mês!</h3>
              <p className="text-zinc-950/70 text-sm mt-2 font-medium">Continue assim para garantir o bônus de performance no final do trimestre.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BarberStats;
