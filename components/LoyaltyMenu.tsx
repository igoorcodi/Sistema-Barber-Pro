
import React, { useState } from 'react';
import { 
  Award, 
  Trophy, 
  Gift, 
  History, 
  Info, 
  ChevronRight, 
  Scissors, 
  User, 
  Package, 
  Zap, 
  CheckCircle2,
  QrCode,
  X,
  Star
} from 'lucide-react';
import { MOCK_CLIENTS, MOCK_REWARDS } from '../constants';
import { Reward } from '../types';

const LoyaltyMenu: React.FC = () => {
  const [client] = useState(MOCK_CLIENTS[0]);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [showVoucher, setShowVoucher] = useState(false);

  const getTier = (points: number) => {
    if (points >= 1500) return { name: 'Platinum', color: 'text-zinc-300', icon: Crown };
    if (points >= 1000) return { name: 'Gold', color: 'text-amber-400', icon: Trophy };
    if (points >= 500) return { name: 'Silver', color: 'text-zinc-400', icon: Star };
    return { name: 'Bronze', color: 'text-amber-700', icon: Award };
  };

  const Crown = Trophy; // Alias
  const tier = getTier(client.lifetimePoints);
  const nextTierPoints = tier.name === 'Bronze' ? 500 : tier.name === 'Silver' ? 1000 : 1500;
  const progress = (client.lifetimePoints / nextTierPoints) * 100;

  const handleRedeem = (reward: Reward) => {
    if (client.loyaltyPoints >= reward.pointsRequired) {
      setSelectedReward(reward);
      setShowVoucher(true);
    } else {
      alert("Pontos insuficientes para este resgate!");
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Scissors': return <Scissors size={24} />;
      case 'User': return <User size={24} />;
      case 'Package': return <Package size={24} />;
      case 'Zap': return <Zap size={24} />;
      default: return <Gift size={24} />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header & Stats */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Award size={200} />
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-amber-500/20 flex items-center justify-center bg-zinc-800">
              <div className="text-center">
                <div className="text-3xl font-black text-amber-500">{client.loyaltyPoints}</div>
                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Saldo</div>
              </div>
            </div>
            <div className={`absolute -bottom-2 -right-2 bg-zinc-900 border border-zinc-800 p-2 rounded-xl ${tier.color}`}>
              <tier.icon size={20} className="fill-current" />
            </div>
          </div>

          <div className="flex-1 space-y-4 text-center md:text-left">
            <div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Membro {tier.name}</h1>
              <p className="text-zinc-500 text-sm font-medium">Você já acumulou {client.lifetimePoints} pontos desde que entrou!</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase text-zinc-500">
                <span>Progresso Nível {tier.name === 'Platinum' ? 'Máximo' : 'Seguinte'}</span>
                <span>{client.lifetimePoints} / {nextTierPoints}</span>
              </div>
              <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rewards Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Gift className="text-amber-500" size={20} /> Recompensas Disponíveis
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MOCK_REWARDS.map((reward) => (
              <div key={reward.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl flex flex-col justify-between group hover:border-amber-500/30 transition-all">
                <div className="space-y-4">
                  <div className="bg-zinc-800 w-12 h-12 rounded-xl flex items-center justify-center text-zinc-400 group-hover:text-amber-500 transition-colors">
                    {getIcon(reward.icon)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-zinc-100">{reward.name}</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">{reward.description}</p>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Star size={14} className="text-amber-500 fill-amber-500" />
                    <span className="text-sm font-black">{reward.pointsRequired} <span className="text-zinc-500 font-bold">PTS</span></span>
                  </div>
                  <button 
                    onClick={() => handleRedeem(reward)}
                    disabled={client.loyaltyPoints < reward.pointsRequired}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      client.loyaltyPoints >= reward.pointsRequired 
                      ? 'bg-amber-500 text-zinc-950 hover:scale-105' 
                      : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                    }`}
                  >
                    Resgatar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info & History */}
        <div className="space-y-8">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Info className="text-amber-500" size={18} /> Como funciona?
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="bg-zinc-800 p-2 h-fit rounded-lg text-amber-500 font-black text-xs">01</div>
                <p className="text-xs text-zinc-400 leading-relaxed"><span className="text-white font-bold">Agende e Corte:</span> Ganhe 1 ponto para cada real gasto em serviços.</p>
              </div>
              <div className="flex gap-4">
                <div className="bg-zinc-800 p-2 h-fit rounded-lg text-amber-500 font-black text-xs">02</div>
                <p className="text-xs text-zinc-400 leading-relaxed"><span className="text-white font-bold">Compre Produtos:</span> Itens de estoque também geram pontos.</p>
              </div>
              <div className="flex gap-4">
                <div className="bg-zinc-800 p-2 h-fit rounded-lg text-amber-500 font-black text-xs">03</div>
                <p className="text-xs text-zinc-400 leading-relaxed"><span className="text-white font-bold">Resgate Prêmios:</span> Use seu saldo para cortes ou brindes exclusivos.</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex items-center gap-2">
              <History className="text-amber-500" size={18} />
              <h3 className="text-lg font-bold">Últimas Atividades</h3>
            </div>
            <div className="divide-y divide-zinc-800">
              {client.loyaltyHistory.map((log) => (
                <div key={log.id} className="p-4 flex justify-between items-center group hover:bg-zinc-800/30 transition-colors">
                  <div>
                    <div className="text-xs font-bold text-zinc-200">{log.description}</div>
                    <div className="text-[10px] text-zinc-600 font-black uppercase">{log.date}</div>
                  </div>
                  <div className={`text-sm font-black ${log.points > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {log.points > 0 ? '+' : ''}{log.points}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Voucher Modal */}
      {showVoucher && selectedReward && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-sm rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 text-center space-y-6">
              <div className="flex justify-between items-center">
                <div className="w-8" /> {/* Spacer */}
                <div className="bg-amber-500/10 p-4 rounded-full text-amber-500 mx-auto">
                  <QrCode size={40} />
                </div>
                <button onClick={() => setShowVoucher(false)} className="text-zinc-500 hover:text-white p-2">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Resgate Gerado!</h3>
                <p className="text-zinc-500 text-sm font-medium">Apresente este código na recepção para validar sua recompensa.</p>
              </div>

              <div className="bg-white p-6 rounded-3xl mx-auto w-fit">
                {/* Simulando QR Code */}
                <div className="w-40 h-40 grid grid-cols-4 grid-rows-4 gap-1">
                  {Array.from({length: 16}).map((_, i) => (
                    <div key={i} className={`rounded-sm ${Math.random() > 0.5 ? 'bg-zinc-950' : 'bg-transparent'}`}></div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-zinc-800/50 rounded-2xl border border-zinc-800">
                <div className="text-[10px] text-zinc-500 font-black uppercase mb-1">Cód. Voucher</div>
                <div className="text-xl font-black text-amber-500 tracking-[0.2em]">BPR-2024-X9Z</div>
              </div>

              <div className="pt-4 space-y-3">
                <div className="text-xs font-bold text-zinc-500 flex items-center justify-center gap-2">
                   <CheckCircle2 size={14} className="text-emerald-500" /> Válido por 30 dias
                </div>
                <button 
                  onClick={() => setShowVoucher(false)}
                  className="w-full bg-zinc-100 text-zinc-950 font-black py-4 rounded-2xl hover:bg-white transition-all uppercase tracking-wider text-xs"
                >
                  Fechar e Voltar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoyaltyMenu;
