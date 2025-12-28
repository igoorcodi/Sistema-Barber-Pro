
import React from 'react';
import { DollarSign, ArrowUpRight, ArrowDownRight, CreditCard, Banknote, Wallet, FileText, Download } from 'lucide-react';

const FinanceDashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Fluxo de Caixa</h1>
          <p className="text-zinc-500">Acompanhe receitas, despesas e lucros em tempo real.</p>
        </div>
        <button className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 transition-all border border-zinc-700">
          <Download size={20} /> Exportar Relatório
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[
          { label: 'Saldo Disponível', value: 'R$ 15.240,00', color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Entradas (Mês)', value: '+ R$ 42.500,00', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Saídas (Mês)', value: '- R$ 12.840,00', color: 'text-rose-500', bg: 'bg-rose-500/10' },
        ].map((card, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
            <div className="text-zinc-500 text-xs font-bold uppercase mb-2">{card.label}</div>
            <div className={`text-3xl font-black ${card.color}`}>{card.value}</div>
            <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
              <span className="bg-zinc-800 px-2 py-1 rounded">vs. mês anterior</span>
              <span className={card.color === 'text-rose-500' ? 'text-rose-500' : 'text-emerald-500'}>+12.5%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
        <div className="p-8 border-b border-zinc-800 flex justify-between items-center">
          <h2 className="text-xl font-bold">Últimas Transações</h2>
          <div className="flex gap-4">
            <button className="text-zinc-400 hover:text-white text-sm font-bold">Ver Tudo</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-zinc-500 font-black uppercase tracking-wider border-b border-zinc-800">
                <th className="px-8 py-4">Data</th>
                <th className="px-8 py-4">Descrição</th>
                <th className="px-8 py-4">Método</th>
                <th className="px-8 py-4">Categoria</th>
                <th className="px-8 py-4 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {[
                { date: 'Hoje, 14:20', desc: 'Corte Degradê + Barba (Cliente: Marcus)', method: 'Pix', cat: 'Serviço', val: 85.00, type: 'IN' },
                { date: 'Hoje, 11:30', desc: 'Reposição Pomada Matte', method: 'Crédito', cat: 'Estoque', val: -350.00, type: 'OUT' },
                { date: 'Ontem, 18:45', desc: 'Combo VIP (Cliente: André)', method: 'Débito', cat: 'Serviço', val: 120.00, type: 'IN' },
                { date: 'Ontem, 09:00', desc: 'Aluguel Unidade Central', method: 'Boleto', cat: 'Fixo', val: -2500.00, type: 'OUT' },
              ].map((t, idx) => (
                <tr key={idx} className="hover:bg-zinc-800/30 transition-colors group">
                  <td className="px-8 py-5 text-sm text-zinc-400">{t.date}</td>
                  <td className="px-8 py-5 font-bold text-zinc-200">{t.desc}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      {t.method === 'Pix' && <Wallet size={14} className="text-emerald-500" />}
                      {t.method === 'Crédito' && <CreditCard size={14} className="text-blue-500" />}
                      {t.method === 'Boleto' && <FileText size={14} className="text-amber-500" />}
                      {t.method}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="bg-zinc-800 px-3 py-1 rounded-full text-[10px] font-bold text-zinc-500 uppercase">{t.cat}</span>
                  </td>
                  <td className={`px-8 py-5 text-right font-black ${t.type === 'IN' ? 'text-emerald-500' : 'text-zinc-200'}`}>
                    {t.type === 'IN' ? '+' : '-'} R$ {Math.abs(t.val).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
