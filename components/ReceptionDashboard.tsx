
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  QrCode, 
  UserPlus, 
  CreditCard, 
  Banknote, 
  Wallet,
  CheckCircle2,
  Clock,
  ArrowRight,
  X,
  Plus,
  Trash2,
  Loader2
} from 'lucide-react';
import { MOCK_SERVICES, MOCK_PRODUCTS } from '../constants';

const ReceptionDashboard: React.FC = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'pix' | null>(null);

  // Filtra produtos e serviços com base na busca
  const filteredItems = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const products = MOCK_PRODUCTS.map(p => ({ ...p, type: 'PRODUCT' }));
    const services = MOCK_SERVICES.map(s => ({ ...s, type: 'SERVICE' }));
    
    return [...products, ...services].filter(item => 
      item.name.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const addToCart = (item: any) => {
    const existingIndex = cart.findIndex(i => i.id === item.id && i.type === item.type);
    if (existingIndex > -1) {
      const newCart = [...cart];
      newCart[existingIndex].quantity = (newCart[existingIndex].quantity || 1) + 1;
      setCart(newCart);
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    if (newCart[index].quantity > 1) {
      newCart[index].quantity -= 1;
    } else {
      newCart.splice(index, 1);
    }
    setCart(newCart);
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  const handleFinalizeSale = async () => {
    if (cart.length === 0 || !paymentMethod) return;
    
    setIsProcessing(true);
    // Simula processamento de API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsProcessing(false);
    setShowSuccess(true);
    clearCart();
    setPaymentMethod(null);

    // Esconde mensagem de sucesso após 3 segundos
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Terminal de Recepção</h1>
          <p className="text-zinc-500">Gestão de fluxo e fechamento de vendas.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button className="flex-1 md:flex-none bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold px-6 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95">
            <QrCode size={20} /> Check-in QR
          </button>
          <button className="flex-1 md:flex-none bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold px-6 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all">
            <UserPlus size={20} /> Novo Cliente
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Waiting & Queue List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Clock className="text-amber-500" size={20} /> Fila de Hoje
              </h2>
              <div className="flex gap-2">
                {['Todos', 'Em Espera', 'Concluídos'].map(tab => (
                  <button key={tab} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all ${tab === 'Em Espera' ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'}`}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="divide-y divide-zinc-800">
              {[
                { id: 'w1', name: 'Ricardo Oliveira', service: 'Corte Degradê', barber: 'Henrique', time: '15:30', status: 'WAITING', price: 50 },
                { id: 'w2', name: 'Matheus Mendes', service: 'Combo Cabelo + Barba', barber: 'Carlos', time: '16:00', status: 'CONFIRMED', price: 85 },
                { id: 'w3', name: 'Fabio Junqueira', service: 'Sobrancelha', barber: 'Henrique', time: '16:15', status: 'CONFIRMED', price: 25 },
              ].map((booking, idx) => (
                <div key={idx} className="p-6 flex items-center justify-between group hover:bg-zinc-800/30 transition-colors">
                  <div className="flex items-center gap-6">
                    <div className={`w-3 h-3 rounded-full ${booking.status === 'WAITING' ? 'bg-amber-500 animate-pulse shadow-sm shadow-amber-500/50' : 'bg-zinc-700'}`}></div>
                    <div>
                      <h3 className="font-bold text-lg">{booking.name}</h3>
                      <p className="text-zinc-500 text-sm">{booking.service} com <span className="text-zinc-300 font-medium">{booking.barber}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-zinc-500 text-[10px] font-black uppercase">Agendado</div>
                      <div className="text-lg font-bold">{booking.time}</div>
                    </div>
                    <button 
                      onClick={() => addToCart({ id: booking.id, name: booking.service, price: booking.price, type: 'SERVICE' })}
                      className="bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 p-3 rounded-2xl transition-all shadow-lg"
                      title="Adicionar ao Checkout"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mensagem de Sucesso */}
          {showSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-3xl flex items-center gap-4 animate-in zoom-in-95 duration-300 shadow-lg">
              <div className="bg-emerald-500 p-2 rounded-full text-zinc-950">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h4 className="font-black text-emerald-500 uppercase tracking-tight">Venda Concluída!</h4>
                <p className="text-zinc-400 text-xs font-medium">O comprovante foi enviado ao e-mail do cliente.</p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Sale / Product Area */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] shadow-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
               <Plus className="text-amber-500" size={20} /> Venda Rápida
            </h2>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Produtos ou Serviços" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-zinc-600"
                />
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2 no-scrollbar">
                {filteredItems.map(item => (
                  <button 
                    key={`${item.type}-${item.id}`}
                    onClick={() => addToCart(item)}
                    className="w-full bg-zinc-800/30 hover:bg-zinc-800 border border-zinc-800/50 p-4 rounded-2xl flex items-center justify-between group transition-all text-left"
                  >
                    <div>
                      <div className="text-sm font-bold group-hover:text-amber-500 transition-colors">{item.name}</div>
                      <div className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">
                        {item.type === 'PRODUCT' ? `Estoque: ${(item as any).stock}` : 'Serviço'}
                      </div>
                    </div>
                    <div className="text-sm font-black text-zinc-200">R$ {item.price.toFixed(2)}</div>
                  </button>
                ))}
                {filteredItems.length === 0 && (
                  <div className="text-center py-8 text-zinc-600 text-xs font-medium italic">
                    Nenhum item encontrado.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cart Sidebar / Modal Overlay */}
          <div className={`transition-all duration-500 ${cart.length > 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
            <div className="bg-amber-500 text-zinc-950 p-8 rounded-[40px] shadow-2xl shadow-amber-500/20 relative overflow-hidden">
              {/* Background Decoration */}
              <div className="absolute -top-10 -right-10 opacity-10 rotate-12">
                 <CreditCard size={150} />
              </div>

              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-black uppercase tracking-tighter">Resumo Checkout</h2>
                  <button 
                    onClick={clearCart} 
                    className="bg-zinc-950/10 hover:bg-zinc-950/20 p-2 rounded-xl transition-all"
                    title="Esvaziar Carrinho"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="space-y-3 mb-8 max-h-48 overflow-y-auto no-scrollbar">
                  {cart.map((item, i) => (
                    <div key={i} className="flex justify-between items-center animate-in slide-in-from-right-2 duration-300">
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="text-sm font-black truncate">{item.name}</div>
                        <div className="text-[10px] font-bold opacity-70">Qtd: {item.quantity}x</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black">R$ {(item.price * item.quantity).toFixed(2)}</span>
                        <button 
                          onClick={() => removeFromCart(i)}
                          className="bg-zinc-950/10 hover:bg-zinc-950/30 p-1.5 rounded-lg"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t border-zinc-950/20 mt-4 flex justify-between items-center">
                    <span className="text-sm font-black uppercase opacity-70">Total a Pagar</span>
                    <span className="text-3xl font-black tracking-tighter">R$ {total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-[10px] font-black uppercase tracking-widest text-zinc-950/60 mb-2">Forma de Pagamento</div>
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => setPaymentMethod('card')}
                      className={`py-3 rounded-2xl font-bold flex flex-col items-center justify-center gap-1 transition-all border-2 ${paymentMethod === 'card' ? 'bg-zinc-950 text-amber-500 border-zinc-950' : 'bg-zinc-950/10 border-transparent text-zinc-950 hover:bg-zinc-950/20'}`}
                    >
                      <CreditCard size={20} /> <span className="text-[8px] uppercase font-black">Cartão</span>
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('cash')}
                      className={`py-3 rounded-2xl font-bold flex flex-col items-center justify-center gap-1 transition-all border-2 ${paymentMethod === 'cash' ? 'bg-zinc-950 text-amber-500 border-zinc-950' : 'bg-zinc-950/10 border-transparent text-zinc-950 hover:bg-zinc-950/20'}`}
                    >
                      <Banknote size={20} /> <span className="text-[8px] uppercase font-black">Dinheiro</span>
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('pix')}
                      className={`py-3 rounded-2xl font-bold flex flex-col items-center justify-center gap-1 transition-all border-2 ${paymentMethod === 'pix' ? 'bg-zinc-950 text-amber-500 border-zinc-950' : 'bg-zinc-950/10 border-transparent text-zinc-950 hover:bg-zinc-950/20'}`}
                    >
                      <Wallet size={20} /> <span className="text-[8px] uppercase font-black">Pix</span>
                    </button>
                  </div>

                  <button 
                    onClick={handleFinalizeSale}
                    disabled={isProcessing || !paymentMethod}
                    className={`w-full bg-zinc-950 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-4 group`}
                  >
                    {isProcessing ? (
                      <Loader2 className="animate-spin" size={24} />
                    ) : (
                      <>
                        <CheckCircle2 size={24} className="group-hover:scale-110 transition-transform" /> 
                        <span className="tracking-widest uppercase text-sm">FINALIZAR VENDA</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceptionDashboard;
