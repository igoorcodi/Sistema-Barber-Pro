
import React, { useState } from 'react';
import { 
  Award, 
  Settings, 
  Plus, 
  Trophy, 
  Users, 
  Star, 
  ChevronRight, 
  Info, 
  ToggleLeft, 
  ToggleRight, 
  X, 
  Search, 
  Save, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Lock,
  MessageSquare,
  Zap,
  ArrowRight
} from 'lucide-react';
import { MOCK_LOYALTY_RULES, MOCK_LOYALTY_TIERS, MOCK_CLIENTS, MOCK_REWARDS } from '../constants';
import { LoyaltyRule, LoyaltyTier, ClientProfile, Reward } from '../types';

interface LoyaltyManagementAdminProps {
  user: any;
  onUpgrade: () => void;
}

const LoyaltyManagementAdmin: React.FC<LoyaltyManagementAdminProps> = ({ user, onUpgrade }) => {
  const [activeTab, setActiveTab] = useState<'rules' | 'tiers' | 'clients' | 'rewards'>('rules');
  const [rules, setRules] = useState<LoyaltyRule[]>(MOCK_LOYALTY_RULES);
  const [tiers, setTiers] = useState<LoyaltyTier[]>(MOCK_LOYALTY_TIERS);
  const [clients] = useState<ClientProfile[]>(MOCK_CLIENTS);
  const [rewards, setRewards] = useState<Reward[]>(MOCK_REWARDS);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<LoyaltyRule | null>(null);

  const isRookie = user?.plan?.includes('Rookie') || user?.plan?.includes('Free');

  const handleWhatsAppSupport = () => {
    const message = encodeURIComponent(`Olá! Sou o administrador da barbearia ${user.name} e gostaria de saber mais sobre o upgrade do plano para ativar o Módulo de Fidelidade.`);
    window.open(`https://wa.me/5511987654321?text=${message}`, '_blank');
  };

  const toggleRuleStatus = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
  };

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const newRule: LoyaltyRule = {
      id: editingRule?.id || Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      type: formData.get('type') as any,
      value: Number(formData.get('value')),
      isActive: editingRule ? editingRule.isActive : true,
      description: formData.get('description') as string,
    };

    if (editingRule) {
      setRules(rules.map(r => r.id === editingRule.id ? newRule : r));
    } else {
      setRules([...rules, newRule]);
    }
    setIsRuleModalOpen(false);
    setEditingRule(null);
  };

  if (isRookie) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center animate-in fade-in zoom-in-95 duration-500">
        <div className="max-w-2xl w-full bg-zinc-900 border border-zinc-800 rounded-[48px] p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-12 opacity-5">
            <Award size={200} />
          </div>
          
          <div className="relative z-10 space-y-8">
            <div className="bg-amber-500/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-amber-500 border border-amber-500/20">
              <Lock size={40} />
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Módulo de Fidelidade</h1>
              <p className="text-zinc-500 text-lg font-medium leading-relaxed">
                Este é um recurso <span className="text-amber-500 font-bold">Premium</span>. 
                Fidelize seus clientes com níveis, recompensas e bônus automatizados.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              {[
                "Criação de níveis (Bronze, Gold, Platinum)",
                "Regras de pontuação por serviço",
                "Vitrine de resgate de prêmios",
                "Histórico de pontos por cliente"
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800">
                  <CheckCircle2 size={18} className="text-amber-500 shrink-0" />
                  <span className="text-sm text-zinc-400 font-bold">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button 
                onClick={onUpgrade}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 uppercase tracking-wider text-xs shadow-lg shadow-amber-500/20"
              >
                <Zap size={18} /> Ver Planos e Upgrade
              </button>
              <button 
                onClick={handleWhatsAppSupport}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all border border-zinc-700 uppercase tracking-widest text-xs"
              >
                <MessageSquare size={18} /> Suporte WhatsApp
              </button>
            </div>
            
            <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">
              Planos a partir de R$ 89,00/mês
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Fidelidade</h1>
          <p className="text-zinc-500">Configure regras de pontuação, níveis e recompensas.</p>
        </div>
        <div className="flex gap-2">
           <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-2xl flex items-center gap-4">
              <div className="text-right">
                <div className="text-[10px] text-zinc-500 uppercase font-black">Resgates Hoje</div>
                <div className="text-lg font-bold text-amber-500">12</div>
              </div>
              <Award className="text-amber-500" size={24} />
           </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {[
          { id: 'rules', label: 'Regras', icon: Settings },
          { id: 'tiers', label: 'Níveis (Tiers)', icon: Trophy },
          { id: 'rewards', label: 'Vitrine de Prêmios', icon: Star },
          { id: 'clients', label: 'Pontos Clientes', icon: Users },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === tab.id 
              ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/10' 
              : 'bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white'
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        {activeTab === 'rules' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Regras de Pontuação</h2>
              <button 
                onClick={() => { setEditingRule(null); setIsRuleModalOpen(true); }}
                className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all"
              >
                <Plus size={16} /> Nova Regra
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rules.map((rule) => (
                <div key={rule.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4 hover:border-amber-500/30 transition-all group">
                  <div className="flex justify-between items-start">
                    <div className="bg-zinc-800 p-3 rounded-2xl group-hover:bg-amber-500/10 transition-colors">
                      <Settings className="text-zinc-500 group-hover:text-amber-500" size={20} />
                    </div>
                    <button onClick={() => toggleRuleStatus(rule.id)}>
                      {rule.isActive ? (
                        <ToggleRight className="text-emerald-500" size={32} />
                      ) : (
                        <ToggleLeft className="text-zinc-700" size={32} />
                      )}
                    </button>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-zinc-100">{rule.name}</h3>
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{rule.description}</p>
                  </div>
                  <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                    <div className="text-amber-500 font-black">
                      {rule.type === 'EARNING' ? `1 R$ = ${rule.value} pts` : `+ ${rule.value} pts`}
                    </div>
                    <button 
                      onClick={() => { setEditingRule(rule); setIsRuleModalOpen(true); }}
                      className="text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-colors"
                    >
                      Editar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tiers' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Hierarquia de Níveis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {tiers.map((tier) => (
                <div key={tier.id} className="bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Trophy size={80} />
                  </div>
                  <div className="relative z-10 space-y-6">
                    <div className="space-y-1">
                      <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest">A partir de {tier.minPoints} pts</div>
                      <h3 className="text-2xl font-black text-white">{tier.name}</h3>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="text-[10px] font-black text-zinc-500 uppercase">Benefícios</div>
                      <div className="space-y-2">
                        {tier.benefits.map((b, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                            <CheckCircle2 size={14} className="text-emerald-500" />
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 flex justify-between items-center">
                       <span className="text-xs font-bold text-zinc-500">Multip: {tier.multiplier}x</span>
                       <button className="text-zinc-500 hover:text-white"><Edit3 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Resgates Configuráveis</h2>
              <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                <Plus size={16} /> Novo Prêmio
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map(reward => (
                <div key={reward.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="font-bold text-zinc-100">{reward.name}</h3>
                    <p className="text-xs text-zinc-500">{reward.description}</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-amber-500 font-black text-sm">{reward.pointsRequired} pts</div>
                    <div className="flex gap-2">
                      <button className="p-2 text-zinc-500 hover:text-white"><Edit3 size={16} /></button>
                      <button className="p-2 text-zinc-500 hover:text-rose-500"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-zinc-800 flex flex-col md:flex-row gap-4 justify-between items-center">
                <h2 className="text-xl font-bold">Saldos dos Clientes</h2>
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input 
                    type="text" 
                    placeholder="Buscar cliente..." 
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-2 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] text-zinc-500 font-black uppercase border-b border-zinc-800">
                      <th className="px-8 py-4">Cliente</th>
                      <th className="px-8 py-4">Nível</th>
                      <th className="px-8 py-4">Saldo Atual</th>
                      <th className="px-8 py-4">Histórico Total</th>
                      <th className="px-8 py-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {clients.map(client => (
                      <tr key={client.id} className="hover:bg-zinc-800/20 transition-colors">
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-3">
                            <img src={client.avatar} className="w-8 h-8 rounded-lg" alt="" />
                            <span className="font-bold text-sm">{client.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-4">
                           <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
                             {client.lifetimePoints >= 2000 ? 'Platinum' : client.lifetimePoints >= 1000 ? 'Gold' : client.lifetimePoints >= 500 ? 'Silver' : 'Bronze'}
                           </span>
                        </td>
                        <td className="px-8 py-4 font-black text-zinc-200">{client.loyaltyPoints} pts</td>
                        <td className="px-8 py-4 text-xs text-zinc-500">{client.lifetimePoints} acumulados</td>
                        <td className="px-8 py-4 text-right">
                          <button className="text-amber-500 hover:text-white transition-colors"><Edit3 size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {isRuleModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <Settings className="text-amber-500" /> {editingRule ? 'Editar' : 'Nova'} Regra
              </h2>
              <button onClick={() => setIsRuleModalOpen(false)} className="text-zinc-500 hover:text-white p-2">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaveRule} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">Nome da Regra</label>
                  <input required name="name" defaultValue={editingRule?.name} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500" placeholder="Ex: Conversão Mensal" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">Tipo de Gatilho</label>
                    <select required name="type" defaultValue={editingRule?.type} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:outline-none">
                      <option value="EARNING">Gasto em Serviço</option>
                      <option value="BIRTHDAY">Aniversário</option>
                      <option value="REFERRAL">Indicação</option>
                      <option value="STREAK">Recorrência</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">Valor da Pontuação</label>
                    <input required name="value" type="number" step="0.5" defaultValue={editingRule?.value} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:outline-none" placeholder="1.0" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">Descrição da Regra</label>
                  <textarea name="description" defaultValue={editingRule?.description} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:outline-none h-24" placeholder="Detalhes de como o cliente ganha..." />
                </div>
              </div>

              <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-2xl flex items-start gap-3">
                <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">
                  Regras do tipo <span className="text-white font-bold">Gasto em Serviço</span> calculam pontos por real. Outras creditam valor fixo após o evento.
                </p>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black py-4 rounded-2xl transition-all shadow-lg active:scale-95 uppercase tracking-wider text-xs">
                  <div className="flex items-center justify-center gap-2">
                    <Save size={18} /> {editingRule ? 'Salvar Alterações' : 'Criar Regra'}
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoyaltyManagementAdmin;
