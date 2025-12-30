
import React, { useState } from 'react';
import { UserRole } from '../types';
import { TAKEN_COMPANY_CODES } from '../constants';
import { 
  Scissors, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Smartphone,
  Hash,
  ChevronLeft,
  CheckCircle2,
  Zap,
  Star,
  Crown,
  AlertCircle,
  Loader2,
  Check,
  UserPlus,
  Timer,
  Calendar
} from 'lucide-react';

interface AuthPageProps {
  onAuthSuccess: (role: UserRole, userData: any) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [step, setStep] = useState(1);
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [codeStatus, setCodeStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    companyCode: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    companyCode: ''
  });

  const formatCompanyCode = (val: string) => {
    return val
      .toUpperCase()
      .replace(/\s+/g, '-') 
      .replace(/[^A-Z0-9-]/g, '') 
      .replace(/-+/g, '-'); 
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleCompanyCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCompanyCode(e.target.value);
    setFormData({ ...formData, companyCode: formattedValue });
    setErrors({ ...errors, companyCode: '' });
    
    if (formattedValue.length > 3) {
      setIsValidatingCode(true);
      setTimeout(() => {
        const isTaken = TAKEN_COMPANY_CODES.includes(formattedValue);
        setCodeStatus(isTaken ? 'invalid' : 'valid');
        setIsValidatingCode(false);
      }, 600);
    } else {
      setCodeStatus('idle');
    }
  };

  const handleSelectPlan = (plan: any) => {
    if (plan.isTrial) {
      setSelectedPlan(plan);
      setStep(4);
    } else {
      onAuthSuccess(UserRole.ADMIN, { ...formData, plan: plan.name });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin) {
      if (selectedRole === UserRole.ADMIN) {
        let hasError = false;
        const newErrors = { email: '', password: '', companyCode: '' };

        if (!validateEmail(formData.email)) {
          newErrors.email = 'E-mail inválido';
          hasError = true;
        }

        if (formData.password.length < 6) {
          newErrors.password = 'Mínimo 6 caracteres';
          hasError = true;
        }

        if (!formData.companyCode) {
          newErrors.companyCode = 'Obrigatório';
          hasError = true;
        } else if (codeStatus === 'invalid') {
          newErrors.companyCode = 'Já em uso';
          hasError = true;
        }

        if (hasError) {
          setErrors(newErrors);
          return;
        }

        setStep(3);
      } else if (selectedRole === UserRole.CLIENT) {
        onAuthSuccess(UserRole.CLIENT, { 
          name: formData.name || 'Cliente', 
          email: formData.email,
          plan: 'Gratuito'
        });
      }
    } else {
      onAuthSuccess(selectedRole!, { 
        name: formData.name || (selectedRole === UserRole.CLIENT ? 'Cliente' : 'Usuário'), 
        email: formData.email,
        companyCode: formData.companyCode
      });
    }
  };

  const roles = [
    { id: UserRole.CLIENT, label: 'Cliente', icon: User, desc: 'Agende cortes e veja seu histórico.', canRegister: true },
    { id: UserRole.BARBER, label: 'Barbeiro', icon: Scissors, desc: 'Acesse sua agenda pessoal.', canRegister: false },
    { id: UserRole.RECEPTIONIST, label: 'Recepcionista', icon: Smartphone, desc: 'Controle o fluxo da unidade.', canRegister: false },
    { id: UserRole.ADMIN, label: 'Dono / Admin', icon: ShieldCheck, desc: 'Gestão completa do negócio.', canRegister: true },
  ];

  const handleRoleSelection = (roleId: UserRole) => {
    setSelectedRole(roleId);
    setStep(2);
    setIsLogin(true); 
  };

  const currentRoleConfig = roles.find(r => r.id === selectedRole);

  // Tela de Expiração de Teste (Step 4)
  if (step === 4 && selectedPlan) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);
    const formattedDate = expirationDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-zinc-900 border border-zinc-800 rounded-[48px] p-12 text-center relative overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-500">
          <div className="absolute top-0 right-0 p-12 opacity-5">
            <Timer size={200} />
          </div>

          <div className="relative z-10 space-y-8">
            <div className="bg-amber-500/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-amber-500 border border-amber-500/20 animate-pulse">
              <Zap size={40} className="fill-amber-500" />
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Teste Grátis Ativado!</h2>
              <p className="text-zinc-400 font-medium leading-relaxed">
                Bem-vindo ao <span className="text-white font-bold">BarberMaster Pro</span>. 
                Sua jornada épica de gestão começa agora com acesso total.
              </p>
            </div>

            <div className="bg-zinc-950/50 border border-zinc-800 p-8 rounded-[32px] space-y-6">
              <div className="flex items-center justify-center gap-4 text-rose-500">
                <Timer size={24} />
                <span className="text-2xl font-black uppercase tracking-widest">7 DIAS</span>
              </div>
              
              <div className="h-[1px] bg-zinc-800 w-full"></div>
              
              <div className="space-y-2">
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Seu período expira em</p>
                <div className="text-white font-black text-lg flex items-center justify-center gap-2">
                  <Calendar size={18} className="text-amber-500" />
                  {formattedDate}
                </div>
              </div>
            </div>

            <button 
              onClick={() => onAuthSuccess(UserRole.ADMIN, { ...formData, plan: selectedPlan.name, trialExpires: expirationDate.toISOString() })}
              className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black py-5 rounded-[24px] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-amber-500/20 uppercase tracking-[0.2em] text-xs"
            >
              Acessar Painel <ArrowRight size={20} />
            </button>

            <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">
              Você pode fazer upgrade para o plano Pro a qualquer momento.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 3 && selectedRole === UserRole.ADMIN) {
    const plans = [
      { id: 'free', name: 'Rookie (Free Trial)', price: 'R$ 0', icon: Zap, features: ['Acesso Total por 7 Dias', 'Ideal para testar tudo', 'Suporte Básico'], isTrial: true },
      { id: 'pro', name: 'Barber Pro', price: 'R$ 89', icon: Star, features: ['Até 5 Barbeiros', 'Financeiro', 'Fidelidade', 'Estoque'], popular: true },
      { id: 'legend', name: 'Legend Shop', price: 'R$ 197', icon: Crown, features: ['Ilimitado', 'Marketing IA', 'Multi-unidades'] }
    ];

    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="max-w-5xl w-full space-y-12 animate-in fade-in zoom-in-95 duration-500">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-white tracking-tight">Escolha seu Plano</h2>
            <p className="text-zinc-500 font-medium">Selecione o plano ideal para gerir seu negócio</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan.id} className={`bg-zinc-900 border ${plan.popular ? 'border-amber-500 shadow-xl shadow-amber-500/5' : 'border-zinc-800'} p-8 rounded-3xl flex flex-col justify-between transition-all hover:border-zinc-700 relative`}>
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-zinc-950 text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-wider">Mais Escolhido</div>
                )}
                <div>
                  <plan.icon className={`${plan.popular ? 'text-amber-500' : 'text-zinc-600'} mb-6`} size={32} />
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-zinc-500 text-xs font-semibold uppercase">/mês</span>
                  </div>
                  <ul className="space-y-4 mb-10">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-zinc-400">
                        <CheckCircle2 size={16} className="text-emerald-500" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <button 
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-4 rounded-xl font-bold uppercase text-xs tracking-wider transition-all ${plan.popular ? 'bg-amber-500 text-zinc-950 hover:bg-amber-600' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
                >
                  Selecionar Plano
                </button>
              </div>
            ))}
          </div>
          <button onClick={() => setStep(2)} className="block mx-auto text-zinc-500 hover:text-white transition-colors font-semibold text-xs uppercase tracking-widest">Revisar Cadastro</button>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full space-y-12 animate-in fade-in zoom-in-95 duration-500 text-center">
          <div className="space-y-4">
            <div className="bg-amber-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-amber-500/10">
              <Scissors className="text-zinc-950" size={32} />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white uppercase">BARBER MASTER PRO</h1>
            <p className="text-zinc-500 font-medium uppercase text-[10px] tracking-[0.3em]">Selecione seu perfil de acesso</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => handleRoleSelection(role.id)}
                className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl text-left hover:border-zinc-700 transition-all group flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="bg-zinc-800 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-500/10 transition-colors">
                    <role.icon className="text-zinc-400 group-hover:text-amber-500 transition-colors" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{role.label}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{role.desc}</p>
                </div>
                <div className="mt-8 flex items-center gap-2 text-[10px] font-bold uppercase text-zinc-600 group-hover:text-amber-500 tracking-wider transition-colors">
                  Acessar Painel <ArrowRight size={14} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full animate-in slide-in-from-bottom-4 duration-500">
        <button onClick={() => setStep(1)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-6 font-bold text-[10px] uppercase tracking-widest">
          <ChevronLeft size={16} /> Voltar ao Início
        </button>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-8 -translate-y-1/2 bg-amber-500 px-4 py-1.5 rounded-full text-[9px] font-bold text-zinc-950 uppercase tracking-wider">
            {selectedRole}
          </div>

          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-white">
              {isLogin ? (currentRoleConfig?.canRegister ? 'Login' : 'Acesso Profissional') : 'Criar Conta'}
            </h2>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1 tracking-wider">Nome</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input required type="text" placeholder="Nome completo" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-white transition-all" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1 tracking-wider">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input 
                  required 
                  type="email" 
                  placeholder="seu@email.com" 
                  className={`w-full bg-zinc-800 border ${errors.email ? 'border-rose-500' : 'border-zinc-700'} rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-white transition-all`} 
                  value={formData.email} 
                  onChange={(e) => {
                    setFormData({...formData, email: e.target.value});
                    if (errors.email) setErrors({...errors, email: ''});
                  }} 
                />
              </div>
              {errors.email && <p className="text-[9px] font-bold text-rose-500 uppercase ml-1">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1 tracking-wider">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input 
                  required 
                  type="password" 
                  placeholder="••••••••" 
                  className={`w-full bg-zinc-800 border ${errors.password ? 'border-rose-500' : 'border-zinc-700'} rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-white transition-all`} 
                  value={formData.password} 
                  onChange={(e) => {
                    setFormData({...formData, password: e.target.value});
                    if (errors.password) setErrors({...errors, password: ''});
                  }} 
                />
              </div>
              {errors.password && <p className="text-[9px] font-bold text-rose-500 uppercase ml-1">{errors.password}</p>}
            </div>

            {isLogin && (selectedRole === UserRole.BARBER || selectedRole === UserRole.RECEPTIONIST) && (
              <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl flex items-start gap-3">
                <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-zinc-500 font-medium leading-relaxed uppercase tracking-tight">
                  Acessos profissionais são geridos pelo administrador da unidade.
                </p>
              </div>
            )}

            {!isLogin && selectedRole === UserRole.ADMIN && (
              <div className="space-y-1.5 animate-in fade-in">
                <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1 tracking-wider">Identificador da Barbearia</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input 
                    required 
                    type="text" 
                    placeholder="EX: BARBER-SHOP" 
                    className={`w-full bg-zinc-800 border ${codeStatus === 'invalid' || errors.companyCode ? 'border-rose-500' : codeStatus === 'valid' ? 'border-emerald-500' : 'border-zinc-700'} rounded-xl py-4 pl-12 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-white transition-all`} 
                    value={formData.companyCode} 
                    onChange={handleCompanyCodeChange} 
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {isValidatingCode ? <Loader2 className="animate-spin text-zinc-500" size={18} /> : 
                     codeStatus === 'valid' ? <Check className="text-emerald-500" size={18} /> :
                     codeStatus === 'invalid' || errors.companyCode ? <AlertCircle className="text-rose-500" size={18} /> : null}
                  </div>
                </div>
                {errors.companyCode && <p className="text-[9px] font-bold text-rose-500 uppercase ml-1 mt-1">{errors.companyCode}</p>}
              </div>
            )}

            <button 
              type="submit" 
              className={`w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 mt-4 uppercase text-xs tracking-wider ${(!isLogin && selectedRole === UserRole.ADMIN && codeStatus !== 'valid' && formData.companyCode) ? 'opacity-50' : ''}`}
            >
              {isLogin ? (
                <>Entrar <ArrowRight size={16} /></>
              ) : (
                <>
                  {selectedRole === UserRole.ADMIN ? 'Ver Planos' : 'Cadastrar Usuário'} 
                  {selectedRole === UserRole.ADMIN ? <ArrowRight size={16} /> : <UserPlus size={16} />}
                </>
              )}
            </button>
          </form>

          {currentRoleConfig?.canRegister && (
            <div className="mt-8 text-center">
              <button onClick={() => setIsLogin(!isLogin)} className="text-zinc-500 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-all">
                {isLogin ? 'Não possui conta? Registrar' : 'Já é cadastrado? Entrar'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
