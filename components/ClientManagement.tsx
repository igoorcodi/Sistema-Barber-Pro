
import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  Calendar, 
  TrendingUp, 
  Award, 
  Clock, 
  X, 
  ExternalLink,
  ChevronRight,
  MessageSquare,
  History,
  Tag,
  Star,
  DollarSign
} from 'lucide-react';
import { MOCK_CLIENTS } from '../constants';
import { ClientProfile } from '../types';

const ClientManagement: React.FC = () => {
  const [clients] = useState<ClientProfile[]>(MOCK_CLIENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Clientes</h1>
          <p className="text-zinc-500">Histórico detalhado e fidelização da sua base.</p>
        </div>
        <div className="grid grid-cols-3 gap-4 w-full md:w-auto">
          <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-2xl text-center">
            <div className="text-[10px] text-zinc-500 font-black uppercase">Total</div>
            <div className="text-lg font-bold">{clients.length}</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-2xl text-center">
            <div className="text-[10px] text-zinc-500 font-black uppercase">Novos</div>
            <div className="text-lg font-bold text-emerald-500">+4</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-2xl text-center">
            <div className="text-[10px] text-zinc-500 font-black uppercase">Retenção</div>
            <div className="text-lg font-bold text-amber-500">82%</div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] overflow-hidden">
        <div className="p-6 md:p-8 border-b border-zinc-800 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="Nome, e-mail ou telefone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 p-3 rounded-xl transition-all border border-zinc-700">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-zinc-500 font-black uppercase tracking-widest border-b border-zinc-800">
                <th className="px-8 py-4">Cliente</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 hidden md:table-cell">Última Visita</th>
                <th className="px-8 py-4 hidden sm:table-cell">Fidelidade</th>
                <th className="px-8 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-zinc-800/30 transition-colors group">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <img src={client.avatar} className="w-10 h-10 rounded-xl object-cover" alt={client.name} />
                      <div>
                        <div className="font-bold text-zinc-100">{client.name}</div>
                        <div className="text-[10px] text-zinc-500 font-medium">{client.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${
                      client.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-zinc-500'
                    }`}>
                      {client.status === 'ACTIVE' ? 'ATIVO' : 'INATIVO'}
                    </span>
                  </td>
                  <td className="px-8 py-4 hidden md:table-cell">
                    <div className="text-xs font-medium text-zinc-400">{client.lastVisit}</div>
                    <div className="text-[10px] text-zinc-600 font-black uppercase">Total: {client.totalVisits}</div>
                  </td>
                  <td className="px-8 py-4 hidden sm:table-cell">
                    <div className="flex items-center gap-1.5 text-amber-500">
                      <Award size={14} />
                      <span className="text-sm font-bold">{client.loyaltyPoints} pts</span>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button 
                      onClick={() => setSelectedClient(client)}
                      className="bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 p-2.5 rounded-xl transition-all"
                    >
                      <ExternalLink size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Client Detail Drawer */}
      {selectedClient && (
        <div className="fixed inset-0 z-[100] flex justify-end animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" onClick={() => setSelectedClient(null)} />
          <div className="relative w-full max-w-2xl bg-zinc-900 h-screen shadow-2xl overflow-y-auto no-scrollbar animate-in slide-in-from-right duration-500 flex flex-col border-l border-zinc-800">
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-4">
                <img src={selectedClient.avatar} className="w-16 h-16 rounded-2xl object-cover border border-zinc-800 shadow-xl" alt={selectedClient.name} />
                <div>
                  <h2 className="text-2xl font-black text-white">{selectedClient.name}</h2>
                  <div className="flex items-center gap-3">
                    <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                      <Star size={12} className="fill-amber-500" /> Cliente VIP
                    </span>
                    <span className="text-zinc-500 text-[10px] font-bold">DESDE {selectedClient.memberSince}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedClient(null)} className="text-zinc-500 hover:text-white p-2 bg-zinc-800 rounded-xl transition-all">
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 md:p-8 space-y-8">
              {/* Quick Contact & Action */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-800/30 border border-zinc-800 rounded-2xl flex items-center gap-4">
                  <div className="bg-amber-500/10 p-2.5 rounded-xl text-amber-500">
                    <Phone size={20} />
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-500 font-black uppercase">Telefone</div>
                    <div className="text-sm font-bold text-zinc-100">{selectedClient.phone}</div>
                  </div>
                </div>
                <div className="p-4 bg-zinc-800/30 border border-zinc-800 rounded-2xl flex items-center gap-4">
                  <div className="bg-amber-500/10 p-2.5 rounded-xl text-amber-500">
                    <Mail size={20} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-zinc-500 font-black uppercase">E-mail</div>
                    <div className="text-sm font-bold text-zinc-100 truncate">{selectedClient.email}</div>
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Visitas', value: selectedClient.totalVisits, icon: History },
                  { label: 'Total Gasto', value: `R$ ${selectedClient.totalSpent}`, icon: DollarSign },
                  { label: 'Pontos', value: selectedClient.loyaltyPoints, icon: Award },
                  { label: 'Ticket Médio', value: `R$ ${(selectedClient.totalSpent / selectedClient.totalVisits).toFixed(0)}`, icon: TrendingUp },
                ].map((stat, i) => (
                  <div key={i} className="bg-zinc-800/20 border border-zinc-800 p-4 rounded-2xl text-center">
                    <stat.icon className="mx-auto text-amber-500 mb-2" size={20} />
                    <div className="text-[10px] text-zinc-500 font-black uppercase mb-1">{stat.label}</div>
                    <div className="text-lg font-black">{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Preferences / Tags */}
              <div className="space-y-4">
                <h3 className="text-sm font-black text-zinc-300 uppercase tracking-widest flex items-center gap-2">
                  <Tag size={16} className="text-amber-500" /> Preferências do Cliente
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedClient.preferences.map((pref, i) => (
                    <span key={i} className="bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-xl text-xs font-bold border border-zinc-700">
                      {pref}
                    </span>
                  ))}
                  <button className="bg-zinc-800/50 text-zinc-500 px-3 py-1.5 rounded-xl text-xs font-black border border-dashed border-zinc-700 hover:text-white transition-colors">
                    + ADICIONAR NOTA
                  </button>
                </div>
              </div>

              {/* Appointment History */}
              <div className="space-y-4">
                <h3 className="text-sm font-black text-zinc-300 uppercase tracking-widest flex items-center gap-2">
                  <Clock size={16} className="text-amber-500" /> Histórico de Serviços
                </h3>
                <div className="space-y-3">
                  {selectedClient.history.map((h) => (
                    <div key={h.id} className="bg-zinc-800/30 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-amber-500 border border-zinc-700 shadow-sm">
                          <Calendar size={18} />
                        </div>
                        <div>
                          <h4 className="font-bold text-zinc-100">{h.service}</h4>
                          <div className="text-[10px] text-zinc-500 font-black uppercase">
                            {h.date} • COM <span className="text-zinc-300">{h.barberName}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black text-white">R$ {h.price.toFixed(2)}</div>
                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">CONCLUÍDO</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 md:p-8 border-t border-zinc-800 bg-zinc-900/80 sticky bottom-0 flex gap-3">
              <button className="flex-1 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 text-xs uppercase tracking-wider">
                <MessageSquare size={18} /> Enviar WhatsApp
              </button>
              <button className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-6 py-4 rounded-2xl border border-zinc-700 transition-all">
                EDITAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientManagement;
