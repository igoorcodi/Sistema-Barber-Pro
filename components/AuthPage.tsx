
import React, { useState } from 'react';
import { UserRole } from '../types';
import { 
  Scissors, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Smartphone,
  Hash,
  Briefcase,
  ChevronLeft,
  CheckCircle2,
  Zap,
  Star,
  Crown,
  AlertCircle,
  X
} from 'lucide-react';

interface AuthPageProps {
  onAuthSuccess: (role: UserRole, userData: any) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [step, setStep] = useState(1); // 1: Role Selection, 2: Form, 3: Plans (Admin only)
  const [showFreeConfirmation, setShowFreeConfirmation] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    companyCode: '',
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin && selectedRole === UserRole.ADMIN) {
      if (!formData.companyCode) {
        alert("O Identificador da Barbearia é obrigatório para administradores.");
        return;
      }
      setStep(3); // Vai para seleção de planos
    } else {
      onAuthSuccess(selectedRole!, { 
        name: formData.name || 'Usuário', 
        email: formData.email 
      });
    }
  };

  const handlePlanSelect = (plan: any) => {
    if (plan.name.includes('Free') || plan.name.includes('Rookie')) {
      setShowFreeConfirmation(true);
    } else {
      onAuthSuccess(UserRole.ADMIN, { 
        name: formData.name, 
        email: formData.email,
        companyCode: formData.companyCode,
        plan: plan.name,
        trial: false
      });
    }
  };

  const confirmFreePlan = () => {
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 7);

    onAuthSuccess(UserRole.ADMIN, { 
      name: formData.name, 
      email: formData.email,
      companyCode: formData.companyCode,
      plan: 'Rookie (Free)',
      trial: true,
      trialExpires: trialEndDate.toISOString()
    });
  };

  const roles = [
    { id: UserRole.CLIENT, label: 'Cliente', icon: User, desc: 'Agende cortes e veja seu histórico.', canRegister: true },
    { id: UserRole.BARBER, label: 'Barbeiro', icon: Scissors, desc: 'Acesse sua agenda pessoal.', canRegister: false },
    { id: UserRole.RECEPTIONIST, label: 'Recepcionista', icon: Smartphone, desc: 'Controle o fluxo da unidade.', canRegister: false },
    { id: UserRole.ADMIN, label: 'Dono / Admin', icon: ShieldCheck, desc: 'Gestão completa do negócio.', canRegister: true },
  ];

  const plans = [
    {
      name: 'Rookie (Free)',
      price: 'R$ 0',
      duration: '7 dias de teste',
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
      features: ['Até 5 Barbeiros', 'Fluxo de Caixa & Financeiro', 'IA de Marketing Gemini', 'Controle de Estoque'],
      color: 'bg-amber-500',
      popular: true
    },
    {
      name: 'Legend Shop',
      price: 'R$ 197',
      duration: '/ mês',
      desc: 'Escalabilidade total e automação para barbearias de elite.',
      icon: Crown,
      features: ['Barbeiros Ilimitados', 'IA Preditiva de Vendas', 'Multi-unidades', 'Suporte Prioritário 24/7'],
      color: 'bg-zinc-100'
    }
  ];

  if (step === 1) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full space-y-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="text-center space-y-4">
            <div className="bg-amber-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-amber-500/20">
              <Scissors className="text-zinc-950" size={32} />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white uppercase">BARBER PRO</h1>
            <p className="text-zinc-500 font-medium">Escolha seu perfil para continuar</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => { setSelectedRole(role.id); setStep(2); setIsLogin(true); }}
                className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl text-left hover:border-amber-500/50 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="bg-zinc-800 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-500/10 transition-colors">
                    <role.icon className="text-zinc-400 group-hover:text-amber-500 transition-colors" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{role.label}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{role.desc}</p>
                </div>
                <div className="mt-8 flex items-center gap-2 text-xs font-black uppercase text-zinc-600 group-hover:text-amber-500 transition-colors">
                  Acessar <ArrowRight size={14} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 animate-in fade-in duration-500">
        <div className="text-center mb-12 max-w-2xl">
          <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">Escolha o plano do seu Império</h2>
          <p className="text-zinc-500 font-medium">Você está a um passo de transformar a gestão da sua barbearia com o Barber Pro.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl w-full">
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
                <p className="text-zinc-500 text-sm mt-4 font-medium leading-relaxed">{plan.desc}</p>
              </div>

              <div className="flex-1 space-y-4 mb-8">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-center gap-3 text-sm text-zinc-300">
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => handlePlanSelect(plan)}
                className={`w-full py-4 rounded-2xl font-black transition-all active:scale-95 uppercase tracking-wider ${
                  plan.popular 
                  ? 'bg-amber-500 text-zinc-950 hover:bg-amber-600' 
                  : 'bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700'
                }`}
              >
                Ativar Plano
              </button>
            </div>
          ))}
        </div>
        
        <button onClick={() => setStep(2)} className="mt-8 text-zinc-600 hover:text-white font-bold text-xs uppercase transition-all">
          Revisar Dados de Cadastro
        </button>

        {/* Modal de Confirmação Plano Free */}
        {showFreeConfirmation && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-zinc-900 border border-zinc-800 max-w-md w-full rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="p-8 text-center space-y-6">
                <div className="bg-amber-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-amber-500 mb-2">
                  <AlertCircle size={40} />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Atenção às Limitações</h3>
                  <p className="text-zinc-500 text-sm font-medium">
                    Ao ativar o plano <span className="text-white font-bold">Rookie</span>, você concorda com as seguintes condições de uso:
                  </p>
                </div>

                <div className="bg-zinc-950/50 rounded-2xl p-6 text-left space-y-4 border border-zinc-800">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-amber-500 mt-0.5" />
                    <span className="text-sm text-zinc-300"><span className="text-white font-bold">1 Barbeiro Ativo:</span> Você poderá cadastrar apenas um profissional.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-amber-500 mt-0.5" />
                    <span className="text-sm text-zinc-300"><span className="text-white font-bold">7 Dias de Teste:</span> Após este período, as funcionalidades premium serão bloqueadas.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-amber-500 mt-0.5" />
                    <span className="text-sm text-zinc-300"><span className="text-white font-bold">Sem Suporte Prioritário:</span> Atendimento disponível apenas via FAQ.</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  <button 
                    onClick={confirmFreePlan}
                    className="w-full bg-amber-500 text-zinc-950 font-black py-4 rounded-2xl hover:bg-amber-600 transition-all uppercase tracking-wider text-sm active:scale-95"
                  >
                    Estou de acordo, ativar trial
                  </button>
                  <button 
                    onClick={() => setShowFreeConfirmation(false)}
                    className="w-full bg-transparent text-zinc-500 font-bold py-3 rounded-2xl hover:text-white transition-all uppercase tracking-widest text-xs"
                  >
                    Escolher outro plano
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const currentRoleConfig = roles.find(r => r.id === selectedRole);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="max-w-md w-full animate-in slide-in-from-bottom-4 duration-500">
        <button onClick={() => setStep(1)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 font-bold text-sm uppercase">
          <ChevronLeft size={18} /> Voltar aos perfis
        </button>

        <div className="bg-zinc-900 border border-zinc-800 rounded-[40px] p-10 shadow-2xl relative">
          <div className="absolute top-0 right-10 -translate-y-1/2 bg-amber-500 px-4 py-1.5 rounded-full text-[10px] font-black text-zinc-950 uppercase tracking-widest">
            {selectedRole}
          </div>

          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">
              {isLogin ? 'Autenticação' : 'Cadastro'}
            </h2>
            <p className="text-zinc-500 text-sm mt-2 font-medium leading-relaxed">
              {isLogin 
                ? 'Insira seus dados de acesso profissional.' 
                : 'Crie sua conta para gerenciar sua unidade de negócio.'}
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input required type="text" placeholder="João Silva" className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input required type="email" placeholder="seu@email.com" className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input required type="password" placeholder="••••••••" className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
              </div>
            </div>

            {!isLogin && selectedRole === UserRole.ADMIN && (
              <div className="space-y-2 animate-in fade-in">
                <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">Identificador da Barbearia</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input required type="text" placeholder="EX: BARBER-MASTER-01" className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all" value={formData.companyCode} onChange={(e) => setFormData({...formData, companyCode: e.target.value})} />
                </div>
              </div>
            )}

            <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-amber-500/20 transition-all active:scale-95 mt-4 uppercase tracking-wider">
              {isLogin ? 'Entrar no Sistema' : 'Continuar para Planos'}
              <ArrowRight size={20} />
            </button>
          </form>

          {currentRoleConfig?.canRegister ? (
            <div className="mt-8 text-center">
              <button onClick={() => setIsLogin(!isLogin)} className="text-zinc-500 hover:text-amber-500 text-sm font-bold transition-all">
                {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já possui conta? Entre agora'}
              </button>
            </div>
          ) : (
            <div className="mt-8 p-4 bg-zinc-800/50 rounded-2xl border border-zinc-800/50 text-center">
              <p className="text-zinc-500 text-xs font-medium leading-relaxed italic">
                Aviso: Contas de <span className="text-amber-500 font-bold">Barbeiros e Recepcionistas</span> devem ser criadas pelo Administrador no painel de gestão.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
