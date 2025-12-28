
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
  Key
} from 'lucide-react';
import { Service } from '../types';
import { MOCK_SERVICES } from '../constants';

interface SettingsPageProps {
  user?: any;
  initialTab?: string;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ user, initialTab }) => {
  const [activeTab, setActiveTab] = useState(initialTab || 'general');
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);

  // Password state
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const menuItems = [
    { id: 'general', label: 'Geral', icon: Globe },
    { id: 'services', label: 'Serviços', icon: Scissors },
    { id: 'plans', label: 'Planos & Cobrança', icon: CreditCard },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'ai', label: 'IA Gemini', icon: Brain },
    { id: 'security', label: 'Segurança', icon: Shield },
  ];

  const plans = [
    {
      name: 'Rookie (Free)',
      price: 'R$ 0',
      duration: 'Gratuito',
      desc: 'Ideal para experimentar o poder da nossa plataforma.',
      icon: Zap,
      features: ['1 Barbeiro Ativo', 'Agendamentos Ilimitados', 'Link de Agendamento Online'],
      color: 'bg-zinc-800'
    },
    {
      name: 'Barber Pro',
      price: 'R$ 89',
      duration: '/ mês',
      desc: 'Para barbearias em crescimento que buscam organização.',
      icon: Star,
      features: ['Módulo de Fidelidade Completo', 'Até 5 Barbeiros', 'Fluxo de Caixa & Financeiro', 'IA de Marketing Gemini', 'Controle de Estoque'],
      color: 'bg-amber-500',
      popular: true
    },
    {
      name: 'Legend Shop',
      price: 'R$ 197',
      duration: '/ mês',
      desc: 'Escalabilidade total e automação para barbearias de elite.',
      icon: Crown,
      features: ['Tudo do Pro', 'Barbeiros Ilimitados', 'IA Preditiva de Vendas', 'Multi-unidades', 'Suporte Prioritário 24/7'],
      color: 'bg-zinc-100'
    }
  ];

  const [businessHours, setBusinessHours] = useState([
    { day: 'Segunda', open: '09:00', close: '19:00', active: true },
    { day: 'Terça', open: '09:00', close: '19:00', active: true },
    { day: 'Quarta', open: '09:00', close: '19:00', active: true },
    { day: 'Quinta', open: '09:00', close: '20:00', active: true },
    { day: 'Sexta', open: '09:00', close: '21:00', active: true },
    { day: 'Sábado', open: '08:00', close: '18:00', active: true },
    { day: 'Domingo', open: '09:00', close: '13:00', active: false },
  ]);

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Configurações salvas com sucesso!");
    }, 1000);
  };

  const handleOpenServiceModal = (service: Service | null = null) => {
    setEditingService(service);
    setShowServiceModal(true);
  };

  const handleDeleteService = (id: string) => {
    if (confirm("Deseja realmente excluir este serviço?")) {
      setServices(services.filter(s => s.id !== id));
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
      setServices(services.map(s => s.id === editingService.id ? serviceData : s));
    } else {
      setServices([...services, serviceData]);
    }
    setShowServiceModal(false);
    setEditingService(null);
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert("As novas senhas não coincidem.");
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setPasswords({ current: '', new: '', confirm: '' });
      alert("Senha redefinida com sucesso!");
    }, 1200);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-3xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Globe className="text-amber-500" size={20} /> Perfil Público
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase">Nome da Barbearia</label>
                  <input type="text" defaultValue="BarberMaster Pro Unidade Central" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase">WhatsApp de Contato</label>
                  <input type="text" defaultValue="(11) 98765-4321" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500" />
                </div>
              </div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-3xl">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Clock className="text-amber-500" size={20} /> Horário de Funcionamento
              </h2>
              <div className="space-y-4">
                {businessHours.map((bh, idx) => (
                  <div key={idx} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all ${bh.active ? 'bg-zinc-800/30 border-zinc-700' : 'bg-zinc-950/30 border-zinc-800 opacity-60'}`}>
                    <div className="flex items-center gap-4 mb-4 sm:mb-0">
                      <button 
                        onClick={() => {
                          const newHours = [...businessHours];
                          newHours[idx].active = !newHours[idx].active;
                          setBusinessHours(newHours);
                        }}
                        className={`w-10 h-5 rounded-full relative transition-colors ${bh.active ? 'bg-amber-500' : 'bg-zinc-700'}`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${bh.active ? 'left-5.5' : 'left-0.5'}`} />
                      </button>
                      <span className="font-bold text-sm w-24">{bh.day}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'services':
        return (
          <div className="bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-3xl animate-in fade-in duration-300">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Scissors className="text-amber-500" size={20} /> Catálogo de Serviços
                </h2>
                <button onClick={() => handleOpenServiceModal()} className="bg-amber-500 hover:bg-amber-600 text-zinc-950 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
                  <Plus size={16} /> Adicionar Serviço
                </button>
              </div>
              <div className="space-y-4">
                {services.map((s) => (
                  <div key={s.id} className="bg-zinc-800/50 border border-zinc-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-amber-500/30 transition-all">
                    <div className="flex-1">
                      <h3 className="font-bold text-zinc-100 group-hover:text-amber-500 transition-colors">{s.name}</h3>
                      <div className="flex gap-4 mt-1">
                        <p className="text-xs text-zinc-500 font-medium flex items-center gap-1">
                          <Clock size={12} /> {s.duration} min
                        </p>
                        <p className="text-xs text-amber-500 font-black">
                          R$ {s.price.toFixed(2)}
                        </p>
                      </div>
                      {s.description && <p className="text-[10px] text-zinc-600 mt-2 line-clamp-1 italic">{s.description}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleOpenServiceModal(s)}
                        className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-xl transition-all border border-zinc-700"
                        title="Editar"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteService(s.id)}
                        className="p-2.5 bg-zinc-800 hover:bg-rose-500/10 text-zinc-400 hover:text-rose-500 rounded-xl transition-all border border-zinc-700"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {services.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-zinc-800 rounded-3xl">
                    <Scissors size={48} className="mx-auto text-zinc-800 mb-4" />
                    <p className="text-zinc-500 font-medium">Nenhum serviço cadastrado.</p>
                  </div>
                )}
              </div>
          </div>
        );
      case 'plans':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-amber-500/10 p-3 rounded-2xl text-amber-500">
                  <CreditCard size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Seu Plano Atual</h2>
                  <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">{user?.plan || 'Rookie (Free)'}</p>
                </div>
              </div>
              <div className="bg-zinc-950/50 p-6 rounded-3xl border border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                  <p className="text-zinc-500 text-xs font-black uppercase mb-1">Próxima Cobrança</p>
                  <p className="text-lg font-bold text-white">Plano Gratuito - Sem expiração</p>
                </div>
                <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest border border-zinc-700 transition-all">
                  Ver Faturas
                </button>
              </div>
            </div>

            <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4 ml-2">Opções de Upgrade</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {plans.map((plan, i) => (
                <div 
                  key={i} 
                  className={`relative bg-zinc-900 border ${plan.popular ? 'border-amber-500 shadow-2xl shadow-amber-500/10' : 'border-zinc-800'} rounded-[40px] p-8 flex flex-col transition-all hover:scale-[1.02]`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-zinc-950 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                      Mais Escolhido
                    </div>
                  )}
                  <div className="mb-8">
                    <div className={`${plan.popular ? 'text-amber-500' : 'text-zinc-500'} mb-4`}>
                      <plan.icon size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-white">{plan.price}</span>
                      <span className="text-zinc-500 text-sm font-bold">{plan.duration}</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-4 mb-8">
                    {plan.features.map((feature, j) => (
                      <div key={j} className="flex items-center gap-3 text-sm text-zinc-300">
                        <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                        <span className="text-xs">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <button 
                    disabled={user?.plan === plan.name}
                    className={`w-full py-4 rounded-2xl font-black transition-all active:scale-95 uppercase tracking-wider text-xs ${
                      plan.popular 
                      ? 'bg-amber-500 text-zinc-950 hover:bg-amber-600' 
                      : 'bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {user?.plan === plan.name ? 'Plano Atual' : 'Selecionar'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-3xl animate-in fade-in duration-300">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Bell className="text-amber-500" size={20} /> Regras de Notificação
            </h2>
            <div className="space-y-6">
              {[
                { title: 'Lembrete de Agendamento', desc: 'Enviar WhatsApp 1h antes do serviço.', active: true },
                { title: 'Confirmação de Reserva', desc: 'Notificar cliente após agendamento.', active: true },
              ].map((n, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-2xl border border-zinc-800 gap-4">
                  <div>
                    <h3 className="font-bold text-sm">{n.title}</h3>
                    <p className="text-xs text-zinc-500">{n.desc}</p>
                  </div>
                  <button className={`shrink-0 w-10 h-5 rounded-full relative transition-colors ${n.active ? 'bg-amber-500' : 'bg-zinc-700'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${n.active ? 'left-5.5' : 'left-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'ai':
        return (
          <div className="bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-3xl animate-in fade-in duration-300">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Brain className="text-amber-500" size={20} /> Agente Gemini
            </h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase">Tom de Voz</label>
                <div className="grid grid-cols-1 xs:grid-cols-3 gap-3">
                  {['Profissional', 'Descontraído', 'Moderno'].map(tone => (
                    <button key={tone} className={`py-3 rounded-xl text-sm font-bold border transition-all ${tone === 'Moderno' ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>
                      {tone}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Identificador da Unidade Section */}
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[32px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 -mr-8 -mt-8 group-hover:opacity-10 transition-opacity pointer-events-none">
                <Hash size={120} />
              </div>
              
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="bg-amber-500/10 p-3 rounded-2xl text-amber-500">
                    <Hash size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-tight">Identificador da Unidade</h2>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Código de Conexão</p>
                  </div>
                </div>

                <div className="bg-zinc-950/50 border border-zinc-800 p-6 rounded-2xl space-y-4">
                  <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                    Este código é a <span className="text-amber-500 font-bold">chave de conexão</span> exclusiva da sua barbearia. 
                    Novos <span className="text-white font-bold">barbeiros e recepcionistas</span> devem informá-lo durante o cadastro para serem vinculados automaticamente à sua unidade e painel administrativo.
                  </p>
                  
                  <div className="flex items-center gap-2 pt-2">
                    <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 flex items-center justify-between group/code transition-all hover:border-amber-500/30">
                      <code className="text-lg font-black text-amber-500 tracking-[0.15em] uppercase">
                        {user?.companyCode || 'NÃO_DEFINIDO'}
                      </code>
                      <button 
                        onClick={() => copyToClipboard(user?.companyCode || '')} 
                        className={`flex items-center gap-2 transition-all font-black text-[10px] uppercase tracking-widest ${copied ? 'text-emerald-500' : 'text-zinc-500 hover:text-white'}`}
                      >
                        {copied ? (
                          <>COPIADO <Check size={14} /></>
                        ) : (
                          <>COPIAR <Copy size={14} /></>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 px-2">
                  <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-zinc-600 font-bold uppercase leading-tight">
                    Aviso: Nunca compartilhe este código com pessoas externas à sua equipe de confiança.
                  </p>
                </div>
              </div>
            </div>

            {/* Senha e Acesso Section */}
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[32px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 -mr-8 -mt-8 group-hover:opacity-10 transition-opacity pointer-events-none">
                <Lock size={120} />
              </div>

              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="bg-amber-500/10 p-3 rounded-2xl text-amber-500">
                    <Lock size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-tight">Segurança da Conta</h2>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Alterar Credenciais</p>
                  </div>
                </div>

                <form onSubmit={handlePasswordUpdate} className="space-y-6 max-w-lg">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">Senha Atual</label>
                      <div className="relative">
                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                        <input 
                          required
                          type="password"
                          placeholder="••••••••"
                          value={passwords.current}
                          onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">Nova Senha</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                          <input 
                            required
                            type="password"
                            placeholder="••••••••"
                            value={passwords.new}
                            onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">Confirmar Nova Senha</label>
                        <div className="relative">
                          <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                          <input 
                            required
                            type="password"
                            placeholder="••••••••"
                            value={passwords.confirm}
                            onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black px-8 py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 text-xs uppercase tracking-widest shadow-lg shadow-amber-500/10 disabled:opacity-50"
                  >
                    {isSaving ? <CheckCircle2 size={18} className="animate-pulse" /> : <Save size={18} />}
                    {isSaving ? 'Processando...' : 'Atualizar Minha Senha'}
                  </button>
                </form>

                <div className="pt-4 border-t border-zinc-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-zinc-800 p-2 rounded-lg text-zinc-400">
                      <RotateCcw size={16} />
                    </div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">Esqueceu a senha? Entre em contato com o suporte global.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-zinc-500">Personalize sua barbearia e os algoritmos de IA.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black px-8 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
        >
          {isSaving ? <CheckCircle2 size={20} className="animate-pulse" /> : <Save size={20} />}
          {isSaving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 no-scrollbar">
            {menuItems.map((item) => (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)}
                className={`flex-none lg:w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-bold text-xs uppercase tracking-wider whitespace-nowrap ${
                  activeTab === item.id 
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/10' 
                  : 'text-zinc-500 hover:text-white hover:bg-zinc-800/50'
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

      {/* Modal de Serviço */}
      {showServiceModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <Scissors className="text-amber-500" /> {editingService ? 'Editar' : 'Novo'} Serviço
              </h2>
              <button 
                onClick={() => { setShowServiceModal(false); setEditingService(null); }} 
                className="text-zinc-500 hover:text-white p-2"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaveService} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">Nome do Serviço</label>
                  <input 
                    required 
                    name="name" 
                    defaultValue={editingService?.name} 
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500" 
                    placeholder="Ex: Corte Degradê" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">Preço (R$)</label>
                    <input 
                      required 
                      type="number" 
                      step="0.01" 
                      name="price" 
                      defaultValue={editingService?.price} 
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:outline-none" 
                      placeholder="0.00" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">Duração (Min)</label>
                    <input 
                      required 
                      type="number" 
                      name="duration" 
                      defaultValue={editingService?.duration} 
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:outline-none" 
                      placeholder="30" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">Descrição (Opcional)</label>
                  <textarea 
                    name="description" 
                    defaultValue={editingService?.description} 
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:outline-none h-24" 
                    placeholder="Detalhes sobre o serviço..." 
                  />
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black py-4 rounded-2xl transition-all shadow-lg active:scale-95 uppercase tracking-wider text-xs">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 size={18} /> {editingService ? 'Salvar Alterações' : 'Adicionar Serviço'}
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

export default SettingsPage;
