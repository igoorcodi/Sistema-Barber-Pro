
import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Bell, 
  Shield, 
  Scissors, 
  Globe, 
  Brain, 
  Save, 
  Hash, 
  Copy, 
  Clock, 
  Plus, 
  Trash2, 
  ChevronRight,
  CheckCircle2,
  X,
  History,
  Lock,
  RotateCcw,
  AlertTriangle,
  CreditCard,
  Zap,
  Star,
  Crown,
  Edit3,
  Check,
  Key,
  ArrowRight,
  Loader2,
  Timer
} from 'lucide-react';
import { Service, UserRole } from '../types';
import { MOCK_SERVICES } from '../constants';

interface DeletedService extends Service {
  deletedAt: number;
}

interface SettingsPageProps {
  user?: any;
  initialTab?: string;
}

const plans = [
  { id: 'free', name: 'Rookie (Free Trial)', price: 'R$ 0', icon: Zap, features: ['Acesso Total por 7 Dias', 'Ideal para testar tudo', 'Suporte Básico'], isTrial: true },
  { id: 'pro', name: 'Barber Pro', price: 'R$ 89', icon: Star, features: ['Até 5 Barbeiros', 'Financeiro', 'Fidelidade', 'Estoque'], popular: true },
  { id: 'legend', name: 'Legend Shop', price: 'R$ 197', icon: Crown, features: ['Ilimitado', 'Marketing IA', 'Multi-unidades'] }
];

const SettingsPage: React.FC<SettingsPageProps> = ({ user, initialTab }) => {
  const [activeTab, setActiveTab] = useState(initialTab || 'general');
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Estado para informações gerais
  const [barberName, setBarberName] = useState("BarberMaster Pro Unidade Central");
  const [barberWhatsapp, setBarberWhatsapp] = useState("(11) 98765-4321");

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);
  const [deletedServices, setDeletedServices] = useState<DeletedService[]>([]);

  const isAdmin = user?.role === UserRole.ADMIN;

  const [businessHours, setBusinessHours] = useState([
    { day: 'Segunda', open: '09:00', close: '19:00', active: true },
    { day: 'Terça', open: '09:00', close: '19:00', active: true },
    { day: 'Quarta', open: '09:00', close: '19:00', active: true },
    { day: 'Quinta', open: '09:00', close: '20:00', active: true },
    { day: 'Sexta', open: '09:00', close: '21:00', active: true },
    { day: 'Sábado', open: '08:00', close: '18:00', active: true },
    { day: 'Domingo', open: '09:00', close: '13:00', active: false },
  ]);

  const menuItems = [
    { id: 'general', label: 'Geral', icon: Globe },
    { id: 'services', label: 'Serviços', icon: Scissors },
    { id: 'plans', label: 'Planos & Cobrança', icon: CreditCard },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'ai', label: 'IA Gemini', icon: Brain },
    { id: 'security', label: 'Segurança', icon: Shield },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;
      setDeletedServices(prev => prev.filter(s => (now - s.deletedAt) < twentyFourHours));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveGlobal = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Configurações atualizadas com sucesso!");
    }, 1200);
  };

  const handleOpenServiceModal = (service: Service | null = null) => {
    if (!isAdmin) return;
    setEditingService(service);
    setShowServiceModal(true);
  };

  const handleSoftDeleteService = (id: string) => {
    const serviceToDelete = services.find(s => s.id === id);
    if (serviceToDelete) {
      setDeletedServices(prev => [...prev, { ...serviceToDelete, deletedAt: Date.now() }]);
      setServices(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleRestoreService = (id: string) => {
    const serviceToRestore = deletedServices.find(s => s.id === id);
    if (serviceToRestore) {
      const { deletedAt, ...restoredService } = serviceToRestore;
      setServices(prev => [...prev, restoredService]);
      setDeletedServices(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const serviceData: Service = {
      id: editingService?.id || Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      duration: Number(formData.get('duration')),
      description: formData.get('description') as string,
    };

    if (editingService) {
      setServices(prev => prev.map(s => s.id === editingService.id ? serviceData : s));
    } else {
      setServices(prev => [...prev, serviceData]);
    }
    setShowServiceModal(false);
    setEditingService(null);
  };

  const handleToggleDay = (idx: number) => {
    if (!isAdmin) return;
    const newHours = [...businessHours];
    newHours[idx].active = !newHours[idx].active;
    setBusinessHours(newHours);
  };

  const handleUpdateTime = (idx: number, field: 'open' | 'close', value: string) => {
    if (!isAdmin) return;
    const newHours = [...businessHours];
    newHours[idx][field] = value;
    setBusinessHours(newHours);
  };

  const getTimeRemaining = (deletedAt: number) => {
    const now = Date.now();
    const expiresAt = deletedAt + (24 * 60 * 60 * 1000);
    const diff = expiresAt - now;
    if (diff <= 0) return "Expirado";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-[32px]">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                <Globe className="text-amber-500" size={20} /> Perfil Público
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Nome da Barbearia</label>
                  <input 
                    type="text" 
                    value={barberName} 
                    onChange={(e) => setBarberName(e.target.value)} 
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all text-white placeholder:text-zinc-600" 
                    placeholder="Ex: Minha Barbearia Pro"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">WhatsApp de Contato</label>
                  <input 
                    type="text" 
                    value={barberWhatsapp} 
                    onChange={(e) => setBarberWhatsapp(e.target.value)} 
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all text-white placeholder:text-zinc-600" 
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-[32px]">
              <div className="mb-8">
                <h2 className="text-xl font-bold flex items-center gap-2 text-white uppercase tracking-tight">
                  <Clock className="text-amber-500" size={20} /> Horário de Funcionamento
                </h2>
                <p className="text-xs text-zinc-500 font-medium mt-1">Defina quando sua unidade está aberta para agendamentos online.</p>
              </div>
              
              <div className="space-y-4">
                {businessHours.map((bh, idx) => (
                  <div key={idx} className={`p-6 rounded-[24px] border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 ${bh.active ? 'bg-zinc-800/40 border-zinc-700 shadow-xl' : 'bg-zinc-950/30 border-zinc-800 opacity-50'}`}>
                    <div className="flex items-center gap-6 min-w-[180px]">
                      <button 
                        type="button"
                        onClick={() => handleToggleDay(idx)}
                        className={`w-12 h-6 rounded-full relative transition-all duration-300 flex items-center ${bh.active ? 'bg-amber-500' : 'bg-zinc-700'} cursor-pointer`}
                      >
                        <div className={`absolute w-4.5 h-4.5 rounded-full bg-white shadow-lg transition-all duration-300 ${bh.active ? 'left-6.5' : 'left-1'}`} />
                      </button>
                      <span className="font-black text-sm uppercase tracking-widest text-zinc-200">{bh.day}</span>
                    </div>

                    <div className="flex items-center gap-4 flex-1 md:justify-end">
                      <div className="flex flex-col gap-1.5 flex-1 md:flex-none">
                        <label className="text-[9px] font-black text-zinc-500 uppercase ml-1">Abertura</label>
                        <input 
                          type="time" 
                          disabled={!bh.active}
                          value={bh.open}
                          onChange={(e) => handleUpdateTime(idx, 'open', e.target.value)}
                          className="bg-zinc-900 border border-zinc-700 rounded-xl px-5 py-3 text-xs font-black focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all text-white w-full md:w-36 disabled:opacity-20" 
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 flex-1 md:flex-none">
                        <label className="text-[9px] font-black text-zinc-500 uppercase ml-1">Fechamento</label>
                        <input 
                          type="time" 
                          disabled={!bh.active}
                          value={bh.close}
                          onChange={(e) => handleUpdateTime(idx, 'close', e.target.value)}
                          className="bg-zinc-900 border border-zinc-700 rounded-xl px-5 py-3 text-xs font-black focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all text-white w-full md:w-36 disabled:opacity-20" 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'services':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-[32px]">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2 text-white uppercase tracking-tight">
                    <Scissors className="text-amber-500" size={20} /> Catálogo de Serviços
                  </h2>
                  <p className="text-xs text-zinc-500 font-medium mt-1">Gerencie os serviços oferecidos e seus valores.</p>
                </div>
                {isAdmin && (
                  <button onClick={() => handleOpenServiceModal()} className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-zinc-950 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-amber-500/10">
                    <Plus size={18} /> Novo Serviço
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4">
                {services.map((s) => (
                  <div key={s.id} className="bg-zinc-800/40 border border-zinc-800 p-6 rounded-[24px] flex flex-col sm:flex-row sm:items-center justify-between gap-6 group hover:border-amber-500/30 transition-all">
                    <div className="flex-1 space-y-1">
                      <h3 className="font-black text-zinc-100 group-hover:text-amber-500 transition-colors uppercase tracking-tight">{s.name}</h3>
                      <div className="flex gap-4">
                        <p className="text-[10px] text-zinc-500 font-black uppercase flex items-center gap-1.5">
                          <Clock size={12} className="text-amber-500" /> {s.duration} MINUTOS
                        </p>
                        <p className="text-xs text-white font-black">
                          R$ {s.price.toFixed(2)}
                        </p>
                      </div>
                      {s.description && <p className="text-xs text-zinc-500 mt-2 italic leading-relaxed">{s.description}</p>}
                    </div>
                    {isAdmin && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleOpenServiceModal(s)}
                          className="p-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-xl transition-all border border-zinc-700"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => handleSoftDeleteService(s.id)}
                          className="p-3 bg-zinc-800 hover:bg-rose-500/10 text-zinc-400 hover:text-rose-500 rounded-xl transition-all border border-zinc-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {deletedServices.length > 0 && (
              <div className="bg-zinc-900 border border-rose-500/20 p-6 md:p-8 rounded-[32px] animate-in slide-in-from-bottom-4 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold flex items-center gap-3 text-rose-500 uppercase tracking-tight">
                    <Trash2 size={24} /> Lixeira de Serviços
                  </h2>
                  <span className="text-[10px] font-black bg-rose-500/10 text-rose-500 px-3 py-1 rounded-full uppercase tracking-widest">24 HORAS PARA RESTAURAR</span>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {deletedServices.map((s) => (
                    <div key={s.id} className="bg-zinc-950/50 border border-zinc-800 p-5 rounded-[20px] flex items-center justify-between gap-4 opacity-80 hover:opacity-100 transition-opacity">
                      <div className="flex-1">
                        <h4 className="font-black text-zinc-300 uppercase tracking-tight">{s.name}</h4>
                        <p className="text-[10px] font-black uppercase text-rose-500 flex items-center gap-1.5 mt-1">
                          <Timer size={12} /> EXPIRA EM: {getTimeRemaining(s.deletedAt)}
                        </p>
                      </div>
                      <button 
                        onClick={() => handleRestoreService(s.id)}
                        className="flex items-center gap-2 px-6 py-3 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-zinc-950 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-emerald-500/20 shadow-lg shadow-emerald-500/5"
                      >
                        <RotateCcw size={16} /> Restaurar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'plans':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] mb-8 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                  <Zap size={200} />
               </div>
              <div className="flex items-center gap-6 relative z-10">
                <div className="bg-amber-500/10 p-5 rounded-3xl text-amber-500 border border-amber-500/20">
                  <CreditCard size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Seu Plano Atual</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-amber-500 text-sm font-black uppercase tracking-[0.2em]">{user?.plan || 'Rookie (Free Trial)'}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span className="text-zinc-500 text-[10px] font-black uppercase">Ativo</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {plans.map((plan, i) => (
                <div key={i} className={`relative bg-zinc-900 border ${plan.popular ? 'border-amber-500 shadow-2xl shadow-amber-500/10 scale-[1.03]' : 'border-zinc-800'} rounded-[40px] p-8 flex flex-col transition-all hover:scale-[1.05]`}>
                  <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-black text-white">{plan.price}</span>
                    <span className="text-zinc-500 text-xs font-black uppercase">/MÊS</span>
                  </div>
                  <ul className="space-y-4 mb-10 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-3 text-xs text-zinc-400 font-bold uppercase tracking-tight">
                        <Check size={16} className="text-emerald-500 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <button 
                    disabled={user?.plan === plan.name}
                    className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${user?.plan === plan.name ? 'bg-zinc-800 text-zinc-500 cursor-default' : 'bg-white text-zinc-950 hover:bg-amber-500 active:scale-95'}`}
                  >
                    {user?.plan === plan.name ? 'Plano Atual' : 'Migrar Plano'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-zinc-900 border border-zinc-800 p-10 rounded-[48px] relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 p-12 opacity-5 -mr-12 -mt-12 group-hover:opacity-10 transition-opacity pointer-events-none">
                <Hash size={180} />
              </div>
              
              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-5">
                  <div className="bg-amber-500/10 p-4 rounded-3xl text-amber-500 border border-amber-500/20 shadow-inner">
                    <Hash size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Identificador da Unidade</h2>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mt-1">Chave Mestra do Sistema</p>
                  </div>
                </div>

                <div className="bg-zinc-950/50 border border-zinc-800 p-8 rounded-[32px] space-y-6">
                  <p className="text-sm text-zinc-400 leading-relaxed font-medium max-w-lg">
                    {isAdmin 
                      ? "Esta é a sua chave exclusiva. Use-a para vincular novos barbeiros e recepcionistas à sua unidade." 
                      : "Este é o código da sua unidade. Apenas administradores podem gerenciar novos acessos através deste ID."}
                  </p>
                  
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-8 py-5 flex items-center justify-between shadow-2xl">
                    <code className="text-xl md:text-2xl font-black text-amber-500 tracking-[0.25em] uppercase">
                      {user?.companyCode || 'BARBER-MASTER-01'}
                    </code>
                    {isAdmin && (
                      <button 
                        onClick={() => copyToClipboard(user?.companyCode || 'BARBER-MASTER-01')} 
                        className={`flex items-center gap-2 transition-all font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 ${copied ? 'text-emerald-500' : 'text-zinc-500 hover:text-white'}`}
                      >
                        {copied ? <>COPIADO <Check size={14} /></> : <>COPIAR <Copy size={14} /></>}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-20 text-center bg-zinc-900 border border-zinc-800 rounded-[32px]">
            <Loader2 className="animate-spin text-amber-500 mx-auto mb-4" size={32} />
            <p className="text-zinc-500 font-black uppercase text-xs tracking-widest">Carregando Módulo...</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white italic">Configurações Gerais</h1>
          <p className="text-zinc-500 font-medium">Controle administrativo e operacional da unidade.</p>
        </div>
        {isAdmin && (
          <button onClick={handleSaveGlobal} disabled={isSaving} className="w-full sm:w-auto bg-white hover:bg-amber-500 text-zinc-950 font-black px-10 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-95 disabled:opacity-50 uppercase text-xs tracking-widest">
            {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {isSaving ? 'Sincronizando...' : 'Salvar Alterações'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-1">
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 no-scrollbar sticky lg:top-8">
            {menuItems.map((item) => (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)}
                className={`flex-none lg:w-full flex items-center gap-4 px-6 py-4 rounded-[20px] transition-all font-black text-[10px] uppercase tracking-[0.15em] whitespace-nowrap border ${
                  activeTab === item.id 
                  ? 'bg-amber-500 text-zinc-950 border-amber-500 shadow-xl shadow-amber-500/10' 
                  : 'text-zinc-500 hover:text-white border-transparent hover:bg-zinc-900 shadow-sm'
                }`}
              >
                <item.icon size={18} /> {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="lg:col-span-3">
          {renderContent()}
        </div>
      </div>

      {showServiceModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-zinc-950/95 backdrop-blur-lg animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
              <div className="flex items-center gap-4">
                <div className="bg-amber-500/10 p-3 rounded-2xl text-amber-500 border border-amber-500/20">
                  <Scissors size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                    {editingService ? 'Ajustar' : 'Cadastrar'} Serviço
                  </h2>
                </div>
              </div>
              <button onClick={() => setShowServiceModal(false)} className="text-zinc-500 hover:text-white p-3 bg-zinc-800 rounded-xl transition-all">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaveService} className="p-10 space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase ml-2 tracking-widest">Nome do Serviço</label>
                  <input required name="name" defaultValue={editingService?.name} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all text-white" placeholder="Ex: Corte Degradê Navalhado" />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase ml-2 tracking-widest">Preço de Venda (R$)</label>
                    <input required name="price" type="number" step="0.01" defaultValue={editingService?.price} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none text-white" placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase ml-2 tracking-widest">Duração Est. (Min)</label>
                    <input required name="duration" type="number" defaultValue={editingService?.duration} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none text-white" placeholder="30" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase ml-2 tracking-widest">Descrição para o Cliente</label>
                  <textarea name="description" defaultValue={editingService?.description} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none h-32 resize-none leading-relaxed text-white" placeholder="Explique o que o cliente recebe com este serviço..." />
                </div>
              </div>

              <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black py-5 rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl shadow-amber-500/20">
                {editingService ? 'Sincronizar Alterações' : 'Confirmar Novo Serviço'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
