
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Clock, 
  AlertTriangle,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
  Zap
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area 
} from 'recharts';
import { geminiService } from '../services/geminiService';

const MOCK_DATA = [
  { name: 'Seg', revenue: 1200, bookings: 24 },
  { name: 'Ter', revenue: 1500, bookings: 30 },
  { name: 'Qua', revenue: 1100, bookings: 22 },
  { name: 'Qui', revenue: 1800, bookings: 36 },
  { name: 'Sex', revenue: 2500, bookings: 50 },
  { name: 'Sáb', revenue: 3200, bookings: 65 },
  { name: 'Dom', revenue: 2100, bookings: 40 },
];

interface AdminDashboardProps {
  user: any;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [insights, setInsights] = useState<string[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const fetchInsights = async () => {
    setLoadingInsights(true);
    const result = await geminiService.analyzePerformance({
      weeklyRevenue: 13400,
      averageTicket: 65,
      newClients: 12,
      noShows: 4
    });
    setInsights(result.insights);
    setLoadingInsights(false);
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const isRookie = user?.plan?.includes('Rookie');
  const trialExpires = user?.trialExpires ? new Date(user.trialExpires) : null;
  const daysLeft = trialExpires ? Math.ceil((trialExpires.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Rookie Trial Banner */}
      {isRookie && (
        <div className="bg-gradient-to-r from-amber-500/10 to-rose-500/10 border border-amber-500/30 rounded-[32px] p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-amber-500/5">
          <div className="flex items-center gap-5">
            <div className="bg-amber-500 text-zinc-950 p-3 rounded-2xl">
              <Zap size={24} className="fill-zinc-950" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Período de Experiência (Rookie)</h3>
              <p className="text-zinc-400 text-sm font-medium">
                Você tem <span className="text-amber-500 font-bold">{daysLeft} dias restantes</span>. 
                Sua conta está limitada a <span className="text-amber-500 font-bold">1 barbeiro ativo</span>.
              </p>
            </div>
          </div>
          <button className="bg-white text-zinc-950 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all active:scale-95 whitespace-nowrap">
            Fazer Upgrade Agora
          </button>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Executivo</h1>
          <p className="text-zinc-500">Visão geral do desempenho da sua barbearia.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-xl transition-all font-medium">Relatórios Completos</button>
          <button onClick={fetchInsights} className="bg-amber-500 hover:bg-amber-600 text-zinc-950 px-4 py-2 rounded-xl transition-all font-bold flex items-center gap-2">
            <Lightbulb size={18} />
            Atualizar Insights
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Faturamento Mensal', value: 'R$ 42.500', icon: DollarSign, trend: '+12%', color: 'text-emerald-500' },
          { label: 'Total de Clientes', value: '842', icon: Users, trend: '+5%', color: 'text-emerald-500' },
          { label: 'Ticket Médio', value: 'R$ 58', icon: TrendingUp, trend: '-2%', color: 'text-rose-500' },
          { label: 'Taxa de No-Show', value: '4.2%', icon: AlertTriangle, trend: '-1.5%', color: 'text-emerald-500' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl hover:border-amber-500/30 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-zinc-800 p-3 rounded-2xl group-hover:bg-amber-500/10 transition-colors">
                <kpi.icon className="text-zinc-400 group-hover:text-amber-500" size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-bold ${kpi.color}`}>
                {kpi.trend.startsWith('+') ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {kpi.trend}
              </div>
            </div>
            <div className="text-zinc-500 text-sm font-medium mb-1">{kpi.label}</div>
            <div className="text-2xl font-bold">{kpi.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold">Faturamento Semanal</h2>
            <select className="bg-zinc-800 border-none rounded-lg text-sm px-3 py-1 focus:outline-none">
              <option>Últimos 7 dias</option>
              <option>Últimos 30 dias</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_DATA}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }}
                  itemStyle={{ color: '#f59e0b' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#f59e0b" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights Panel */}
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-amber-500/10 p-2 rounded-lg text-amber-500">
              <Lightbulb size={24} />
            </div>
            <h2 className="text-xl font-bold">Insights IA</h2>
          </div>
          
          <div className="flex-1 space-y-4">
            {loadingInsights ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-zinc-800 animate-pulse rounded-2xl"></div>
                ))}
              </div>
            ) : (
              insights.map((insight, idx) => (
                <div key={idx} className="bg-zinc-800/50 border border-zinc-800 p-4 rounded-2xl flex gap-3 group hover:border-amber-500/30 transition-all cursor-default">
                  <div className="mt-1 h-2 w-2 rounded-full bg-amber-500 shrink-0"></div>
                  <p className="text-zinc-300 text-sm leading-relaxed">{insight}</p>
                </div>
              ))
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-800">
            <p className="text-xs text-zinc-500 text-center italic">
              Powered by Gemini AI Engine
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
