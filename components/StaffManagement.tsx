
import React, { useState } from 'react';
import { MOCK_BARBERS } from '../constants';
import { 
  UserPlus, 
  Star, 
  Calendar, 
  MessageSquare, 
  MoreHorizontal, 
  TrendingUp, 
  X, 
  Plus, 
  Target,
  CheckCircle2,
  Trophy,
  Phone,
  Mail,
  ShieldCheck,
  Clock,
  Briefcase,
  FileText,
  User as UserIcon,
  ChevronRight,
  Lock,
  AlertCircle,
  Hash,
  Scissors
} from 'lucide-react';
import { Barber, UserRole } from '../types';

interface StaffManagementProps {
  user: any;
}

const StaffManagement: React.FC<StaffManagementProps> = ({ user }) => {
  const [barbers, setBarbers] = useState<Barber[]>(MOCK_BARBERS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);

  // Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newSpecialties, setNewSpecialties] = useState('');
  const [newCompanyCode, setNewCompanyCode] = useState(user?.companyCode || '');

  const isRookie = user?.plan?.includes('Rookie');
  const limitReached = isRookie && barbers.length >= 1;

  const handleAddBarber = (e: React.FormEvent) => {
    e.preventDefault();
    if (limitReached) {
      alert("Seu plano (Rookie) permite apenas 1 barbeiro ativo. Faça o upgrade para adicionar mais.");
      return;
    }

    if (!newCompanyCode) {
      alert("O identificador da barbearia é obrigatório para vincular o profissional.");
      return;
    }

    const newBarber: Barber = {
      id: `b${barbers.length + 1}`,
      name: newName,
      role: UserRole.BARBER,
      specialties: newSpecialties.split(',').map(s => s.trim()),
      rating: 5.0,
      avatar: `https://picsum.photos/seed/${newName}/200`,
      availability: ['09:00', '10:00', '11:00', '14:00', '15:00']
    };
    setBarbers([...barbers, newBarber]);
    setNewName('');
    setNewEmail('');
    setNewPassword('');
    setNewSpecialties('');
    setShowAddModal(false);
  };

  const openGoals = (barber: Barber) => {
    setSelectedBarber(barber);
    setShowGoalsModal(true);
  };

  const openSchedule = (barber: Barber) => {
    setSelectedBarber(barber);
    setShowScheduleModal(true);
  };

  const openDetails = (barber: Barber) => {
    setSelectedBarber(barber);
    setShowDetailsModal(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Equipe</h1>
          <p className="text-zinc-500">Crie contas e gerencie barbeiros e comissões.</p>
        </div>
        <div className="flex flex-col items-end gap-2 w-full md:w-auto">
          <button 
            disabled={limitReached}
            onClick={() => setShowAddModal(true)}
            className={`w-full md:w-auto px-6 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 font-black uppercase tracking-wider ${
              limitReached 
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700' 
              : 'bg-amber-500 hover:bg-amber-600 text-zinc-950 shadow-amber-500/10'
            }`}
          >
            <UserPlus size={20} /> Adicionar Barbeiro
          </button>
          {limitReached && (
            <span className="text-[10px] font-black text-rose-500 uppercase flex items-center gap-1">
              <AlertCircle size={12} /> Limite do plano Rookie atingido (1/1)
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {barbers.map((barber) => (
          <div key={barber.id} className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl hover:border-amber-500/30 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 -mr-10 -mt-10 group-hover:opacity-10 transition-opacity pointer-events-none">
              <Scissors size={120} />
            </div>

            <div className="flex items-start justify-between mb-6 relative z-10">
              <div className="flex gap-6">
                <div className="relative">
                  <img src={barber.avatar} className="w-20 h-20 rounded-2xl border-2 border-zinc-800 object-cover" alt={barber.name} />
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-5 h-5 rounded-full border-4 border-zinc-900"></div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">{barber.name}</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-zinc-800 text-zinc-400 text-[10px] font-black uppercase px-2 py-1 rounded tracking-widest">MASTER</span>
                    <div className="flex items-center gap-1 text-amber-500 text-sm font-bold">
                      <Star size={14} fill="currentColor" /> {barber.rating}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {barber.specialties.map(s => (
                      <span key={s} className="text-[10px] font-bold text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded-lg uppercase bg-zinc-800/20">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => openDetails(barber)}
                className="text-zinc-500 hover:text-amber-500 transition-colors p-2 bg-zinc-800/50 rounded-lg"
              >
                <MoreHorizontal size={24} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 p-4 bg-zinc-800/30 rounded-2xl mb-6 border border-zinc-800/50">
              <div className="text-center">
                <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Cortes/Mês</div>
                <div className="text-lg font-bold">142</div>
              </div>
              <div className="text-center border-x border-zinc-800/50">
                <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Comissão</div>
                <div className="text-lg font-bold text-amber-500">35%</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Fidelidade</div>
                <div className="text-lg font-bold">88%</div>
              </div>
            </div>

            <div className="flex gap-3 relative z-10">
              <button 
                onClick={() => openSchedule(barber)}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 border border-zinc-700/50"
              >
                <Calendar size={18} /> Escala
              </button>
              <button 
                onClick={() => openGoals(barber)}
                className="flex-1 bg-amber-500/5 hover:bg-amber-500/10 text-amber-500 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 border border-amber-500/20"
              >
                <TrendingUp size={18} /> Metas
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Adicionar Barbeiro */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <div className="bg-amber-500/10 p-2 rounded-lg text-amber-500"><UserPlus size={20} /></div>
                Contratar Barbeiro
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-500 hover:text-white p-2">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddBarber} className="p-8 space-y-5">
              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">Identificador da Barbearia</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                    <input required value={newCompanyCode} onChange={(e) => setNewCompanyCode(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500" placeholder="Código da Unidade" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">Dados Pessoais</label>
                  <input required value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500" placeholder="Nome Completo" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">E-mail de Acesso</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                      <input required type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500" placeholder="ex: pedro@barber.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">Senha Provisória</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                      <input required type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500" placeholder="••••••" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">Especialidades</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                    <input required value={newSpecialties} onChange={(e) => setNewSpecialties(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500" placeholder="ex: Degradê, Barba, Pigmentação" />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black py-4 rounded-2xl transition-all shadow-lg shadow-amber-500/20 active:scale-95 uppercase tracking-wider">
                  Criar Conta de Barbeiro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modais de detalhes e metas */}
      {showGoalsModal && selectedBarber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
              <div className="flex items-center gap-4">
                <img src={selectedBarber.avatar} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <h2 className="text-xl font-bold">Metas de Desempenho</h2>
                  <p className="text-xs text-zinc-500 font-bold uppercase">{selectedBarber.name}</p>
                </div>
              </div>
              <button onClick={() => setShowGoalsModal(false)} className="text-zinc-500 hover:text-white p-2">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-800/50 p-4 rounded-2xl border border-zinc-800">
                  <div className="flex items-center gap-2 text-zinc-500 mb-2">
                    <Trophy size={14} className="text-amber-500" />
                    <span className="text-[10px] font-black uppercase">Nível Atual</span>
                  </div>
                  <div className="text-lg font-black">Elite Silver</div>
                </div>
                <div className="bg-zinc-800/50 p-4 rounded-2xl border border-zinc-800">
                  <div className="flex items-center gap-2 text-zinc-500 mb-2">
                    <Target size={14} className="text-amber-500" />
                    <span className="text-[10px] font-black uppercase">Faltam</span>
                  </div>
                  <div className="text-lg font-black">12 cortes para Gold</div>
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { label: 'Receita Mensal', target: 5000, current: 3200, unit: 'R$' },
                  { label: 'Novos Clientes', target: 20, current: 14, unit: '' },
                  { label: 'Venda de Produtos', target: 15, current: 18, unit: '', completed: true },
                ].map((meta, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-xs font-black text-zinc-500 uppercase mb-1">{meta.label}</div>
                        <div className="text-lg font-bold">
                          {meta.unit} {meta.current} <span className="text-zinc-500 text-sm font-normal">/ {meta.target}</span>
                        </div>
                      </div>
                      {meta.completed ? (
                        <div className="bg-emerald-500/10 text-emerald-500 p-1 rounded-full">
                          <CheckCircle2 size={20} />
                        </div>
                      ) : (
                        <div className="text-amber-500 font-black text-xs">{(meta.current / meta.target * 100).toFixed(0)}%</div>
                      )}
                    </div>
                    <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${meta.completed ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                        style={{ width: `${Math.min(100, (meta.current / meta.target * 100))}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 bg-zinc-800/30 border-t border-zinc-800">
              <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-xl transition-all border border-zinc-700">
                EDITAR METAS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
