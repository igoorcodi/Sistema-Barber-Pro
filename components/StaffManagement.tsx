
import React, { useState, useRef, useEffect } from 'react';
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
  Scissors,
  Edit3,
  Trash2,
  Save,
  Check
} from 'lucide-react';
import { Barber, UserRole } from '../types';

interface Goal {
  label: string;
  target: number;
  current: number;
  unit: string;
  completed?: boolean;
}

interface StaffManagementProps {
  user: any;
}

const StaffManagement: React.FC<StaffManagementProps> = ({ user }) => {
  const [barbers, setBarbers] = useState<Barber[]>(MOCK_BARBERS);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  
  // Estado temporário para edição de escala no modal
  const [tempSchedule, setTempSchedule] = useState<string[]>([]);

  // Horários disponíveis para a escala
  const allTimeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'
  ];

  // Estado das metas (simulado)
  const [barberGoals, setBarberGoals] = useState<Record<string, Goal[]>>({
    'b1': [
      { label: 'Receita Mensal', target: 5000, current: 3200, unit: 'R$' },
      { label: 'Novos Clientes', target: 20, current: 14, unit: '' },
      { label: 'Venda de Produtos', target: 15, current: 18, unit: '', completed: true },
    ]
  });

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialties: '',
    companyCode: user?.companyCode || '',
  });

  const isRookie = user?.plan?.includes('Rookie');
  const limitReached = isRookie && barbers.length >= 1 && !isEditing;

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setSelectedBarber(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      specialties: '',
      companyCode: user?.companyCode || '',
    });
    setShowFormModal(true);
  };

  const handleOpenEdit = (barber: Barber) => {
    setIsEditing(true);
    setSelectedBarber(barber);
    setFormData({
      name: barber.name,
      email: barber.email || '',
      password: '', 
      specialties: barber.specialties.join(', '),
      companyCode: user?.companyCode || '',
    });
    setShowFormModal(true);
    setOpenMenuId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && selectedBarber) {
      const updatedBarbers = barbers.map(b => 
        b.id === selectedBarber.id 
          ? { 
              ...b, 
              name: formData.name, 
              specialties: formData.specialties.split(',').map(s => s.trim()) 
            } 
          : b
      );
      setBarbers(updatedBarbers);
    } else {
      if (limitReached) {
        alert("Seu plano (Rookie) permite apenas 1 barbeiro ativo.");
        return;
      }
      const newBarber: Barber = {
        id: `b${barbers.length + 1}`,
        name: formData.name,
        role: UserRole.BARBER,
        specialties: formData.specialties.split(',').map(s => s.trim()),
        rating: 5.0,
        avatar: `https://picsum.photos/seed/${formData.name}/200`,
        availability: ['09:00', '10:00', '11:00', '14:00', '15:00']
      };
      setBarbers([...barbers, newBarber]);
      setBarberGoals(prev => ({
        ...prev,
        [newBarber.id]: [
          { label: 'Receita Mensal', target: 3000, current: 0, unit: 'R$' },
          { label: 'Novos Clientes', target: 10, current: 0, unit: '' },
          { label: 'Venda de Produtos', target: 5, current: 0, unit: '' },
        ]
      }));
    }
    
    setShowFormModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Deseja realmente remover este profissional da equipe?")) {
      setBarbers(barbers.filter(b => b.id !== id));
      setOpenMenuId(null);
    }
  };

  const openGoals = (barber: Barber) => {
    setSelectedBarber(barber);
    setIsEditingGoals(false);
    setShowGoalsModal(true);
    setOpenMenuId(null);
  };

  const openSchedule = (barber: Barber) => {
    setSelectedBarber(barber);
    setTempSchedule([...barber.availability]);
    setShowScheduleModal(true);
    setOpenMenuId(null);
  };

  const toggleTimeSlot = (time: string) => {
    setTempSchedule(prev => 
      prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time].sort()
    );
  };

  const handleSaveSchedule = () => {
    if (!selectedBarber) return;
    const updatedBarbers = barbers.map(b => 
      b.id === selectedBarber.id ? { ...b, availability: tempSchedule } : b
    );
    setBarbers(updatedBarbers);
    setShowScheduleModal(false);
  };

  const handleUpdateGoals = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBarber) return;

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const updatedGoals = barberGoals[selectedBarber.id]?.map((goal, index) => {
      const newTarget = Number(formData.get(`target-${index}`));
      const newCurrent = Number(formData.get(`current-${index}`));
      return {
        ...goal,
        target: newTarget,
        current: newCurrent,
        completed: newCurrent >= newTarget
      };
    }) || [];

    setBarberGoals(prev => ({
      ...prev,
      [selectedBarber.id]: updatedGoals
    }));
    setIsEditingGoals(false);
  };

  const currentBarberGoals = selectedBarber ? barberGoals[selectedBarber.id] || [
    { label: 'Receita Mensal', target: 3000, current: 0, unit: 'R$' },
    { label: 'Novos Clientes', target: 10, current: 0, unit: '' },
    { label: 'Venda de Produtos', target: 5, current: 0, unit: '' },
  ] : [];

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
            onClick={handleOpenAdd}
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
              
              <div className="relative">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === barber.id ? null : barber.id);
                  }}
                  className="text-zinc-500 hover:text-amber-500 transition-colors p-2 bg-zinc-800/50 rounded-lg"
                >
                  <MoreHorizontal size={24} />
                </button>

                {openMenuId === barber.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded-2xl shadow-2xl z-20 py-2 animate-in fade-in zoom-in-95 duration-200">
                    <button 
                      onClick={() => handleOpenEdit(barber)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all"
                    >
                      <Edit3 size={18} className="text-amber-500" /> Editar Perfil
                    </button>
                    <button 
                      onClick={() => openGoals(barber)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all"
                    >
                      <Target size={18} className="text-amber-500" /> Definir Metas
                    </button>
                    <button 
                      onClick={() => openSchedule(barber)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all"
                    >
                      <Calendar size={18} className="text-amber-500" /> Ajustar Escala
                    </button>
                    <div className="h-[1px] bg-zinc-700 my-2 mx-4" />
                    <button 
                      onClick={() => handleDelete(barber.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-500/10 transition-all"
                    >
                      <Trash2 size={18} /> Remover
                    </button>
                  </div>
                )}
              </div>
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

      {/* Modal Adicionar/Editar Barbeiro */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <div className="bg-amber-500/10 p-2 rounded-lg text-amber-500">
                  {isEditing ? <Edit3 size={20} /> : <UserPlus size={20} />}
                </div>
                {isEditing ? 'Editar Profissional' : 'Contratar Barbeiro'}
              </h2>
              <button onClick={() => setShowFormModal(false)} className="text-zinc-500 hover:text-white p-2">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">Identificador da Barbearia</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                    <input disabled value={formData.companyCode} className="w-full bg-zinc-800/50 border border-zinc-700 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none opacity-50 cursor-not-allowed" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">Dados Pessoais</label>
                  <input 
                    required 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500" 
                    placeholder="Nome Completo" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">E-mail de Acesso</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                      <input 
                        required 
                        type="email" 
                        value={formData.email} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500" 
                        placeholder="ex: pedro@barber.com" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">Senha {isEditing ? '(Deixe em branco p/ manter)' : 'Provisória'}</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                      <input 
                        required={!isEditing}
                        type="password" 
                        value={formData.password} 
                        onChange={(e) => setFormData({...formData, password: e.target.value})} 
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500" 
                        placeholder="••••••" 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">Especialidades</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                    <input 
                      required 
                      value={formData.specialties} 
                      onChange={(e) => setFormData({...formData, specialties: e.target.value})} 
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500" 
                      placeholder="ex: Degradê, Barba, Pigmentação" 
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black py-4 rounded-2xl transition-all shadow-lg shadow-amber-500/20 active:scale-95 uppercase tracking-wider">
                  {isEditing ? 'Salvar Alterações' : 'Criar Conta de Barbeiro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Metas */}
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
              <button onClick={() => { setShowGoalsModal(false); setIsEditingGoals(false); }} className="text-zinc-500 hover:text-white p-2">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateGoals}>
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
                      <span className="text-[10px] font-black uppercase">Próximo Nível</span>
                    </div>
                    <div className="text-lg font-black">Gold Partner</div>
                  </div>
                </div>

                <div className="space-y-6">
                  {currentBarberGoals.map((meta, i) => (
                    <div key={i} className="space-y-3">
                      <div className="flex justify-between items-end">
                        <div className="flex-1">
                          <div className="text-xs font-black text-zinc-500 uppercase mb-1">{meta.label}</div>
                          
                          {isEditingGoals ? (
                            <div className="flex items-center gap-4">
                              <div className="flex-1 space-y-1">
                                <label className="text-[8px] text-zinc-500 uppercase font-bold">Atual</label>
                                <input 
                                  type="number" 
                                  name={`current-${i}`}
                                  defaultValue={meta.current}
                                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500" 
                                />
                              </div>
                              <div className="flex-1 space-y-1">
                                <label className="text-[8px] text-zinc-500 uppercase font-bold">Meta</label>
                                <input 
                                  type="number" 
                                  name={`target-${i}`}
                                  defaultValue={meta.target}
                                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500" 
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="text-lg font-bold">
                              {meta.unit} {meta.current} <span className="text-zinc-500 text-sm font-normal">/ {meta.target}</span>
                            </div>
                          )}
                        </div>
                        {!isEditingGoals && (
                          meta.completed ? (
                            <div className="bg-emerald-500/10 text-emerald-500 p-1 rounded-full">
                              <CheckCircle2 size={20} />
                            </div>
                          ) : (
                            <div className="text-amber-500 font-black text-xs">{(meta.current / meta.target * 100).toFixed(0)}%</div>
                          )
                        )}
                      </div>
                      
                      {!isEditingGoals && (
                        <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${meta.completed ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                            style={{ width: `${Math.min(100, (meta.current / meta.target * 100))}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-6 bg-zinc-800/30 border-t border-zinc-800">
                {isEditingGoals ? (
                  <div className="flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setIsEditingGoals(false)}
                      className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-xl transition-all border border-zinc-700"
                    >
                      CANCELAR
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      <Save size={18} /> SALVAR METAS
                    </button>
                  </div>
                ) : (
                  <button 
                    type="button"
                    onClick={() => setIsEditingGoals(true)}
                    className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-xl transition-all border border-zinc-700 flex items-center justify-center gap-2"
                  >
                    <Edit3 size={18} /> EDITAR METAS
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Escala */}
      {showScheduleModal && selectedBarber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
              <div className="flex items-center gap-4">
                <div className="bg-amber-500/10 p-3 rounded-xl text-amber-500">
                  <Calendar size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Definir Escala de Trabalho</h2>
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{selectedBarber.name}</p>
                </div>
              </div>
              <button onClick={() => setShowScheduleModal(false)} className="text-zinc-500 hover:text-white p-2">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Clock size={16} />
                  <span className="text-sm font-bold">Horários Disponíveis</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setTempSchedule(allTimeSlots)}
                    className="text-[10px] font-black uppercase text-amber-500 hover:text-amber-400 transition-colors"
                  >
                    Selecionar Tudo
                  </button>
                  <span className="text-zinc-700">|</span>
                  <button 
                    onClick={() => setTempSchedule([])}
                    className="text-[10px] font-black uppercase text-rose-500 hover:text-rose-400 transition-colors"
                  >
                    Limpar Tudo
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3 max-h-96 overflow-y-auto pr-2 no-scrollbar">
                {allTimeSlots.map((time) => {
                  const isActive = tempSchedule.includes(time);
                  return (
                    <button
                      key={time}
                      onClick={() => toggleTimeSlot(time)}
                      className={`py-3 rounded-xl text-sm font-bold transition-all border flex flex-col items-center justify-center gap-1 group relative overflow-hidden ${
                        isActive 
                        ? 'bg-amber-500 border-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20' 
                        : 'bg-zinc-800 border-zinc-700 text-zinc-500 hover:border-amber-500/50'
                      }`}
                    >
                      {isActive && <Check size={10} className="absolute top-1 right-1" />}
                      {time}
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 bg-zinc-950/50 rounded-2xl p-4 border border-zinc-800 flex items-center gap-3">
                <AlertCircle size={18} className="text-amber-500 shrink-0" />
                <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
                  Os horários selecionados estarão disponíveis para agendamento online imediato após salvar. Certifique-se de considerar os intervalos de descanso.
                </p>
              </div>
            </div>

            <div className="p-6 bg-zinc-800/30 border-t border-zinc-800 flex gap-3">
              <button 
                onClick={() => setShowScheduleModal(false)}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-2xl transition-all border border-zinc-700 uppercase text-xs tracking-widest"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveSchedule}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black py-4 rounded-2xl transition-all shadow-lg shadow-amber-500/20 active:scale-95 uppercase text-xs tracking-widest flex items-center justify-center gap-2"
              >
                <Save size={18} /> Salvar Escala
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
