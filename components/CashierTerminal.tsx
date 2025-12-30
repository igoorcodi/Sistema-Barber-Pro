
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  CreditCard, 
  Banknote, 
  Wallet, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Loader2,
  Package,
  Scissors,
  ShoppingCart,
  X
} from 'lucide-react';
import { MOCK_SERVICES, MOCK_PRODUCTS } from '../constants';

const CashierTerminal: React.FC = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'pix' | null>(null);

  const filteredItems = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const products = MOCK_PRODUCTS.map(p => ({ ...p, type: 'PRODUCT' }));
    const services = MOCK_SERVICES.map(s => ({ ...s, type: 'SERVICE' }));
    return [...products, ...services].filter(item => item.name.toLowerCase().includes(term));
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

  const handleFinalizeSale = async () => {
    if (cart.length === 0 || !paymentMethod) return;
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsProcessing(false);
    setShowSuccess(true);
    setCart([]);
    setPaymentMethod(null);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Caixa / PDV</h1>
          <p className="text-zinc-500">Venda direta de produtos e serviços.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-6">
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
              <input 
                type="text" 
                placeholder="Pesquisar produto ou serviço..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredItems.map(item => (
                <button 
                  key={`${item.type}-${item.id}`} 
                  onClick={() => addToCart(item)}
                  className="bg-zinc-800/30 hover:bg-zinc-800 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between group transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-800 rounded-lg text-zinc-500 group-hover:text-amber-500 transition-colors">
                      {item.type === 'PRODUCT' ? <Package size={18} /> : <Scissors size={18} />}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-zinc-100">{item.name}</div>
                      <div className="text-[10px] font-black text-zinc-500 uppercase">{item.type}</div>
                    </div>
                  </div>
                  <div className="text-sm font-black text-amber-500">R$ {item.price.toFixed(2)}</div>
                </button>
              ))}
            </div>
          </div>

          {showSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-3xl flex items-center gap-4 animate-in zoom-in-95">
              <CheckCircle2 className="text-emerald-500" size={24} />
              <div>
                <h4 className="font-bold text-emerald-500 uppercase">Venda Realizada!</h4>
                <p className="text-zinc-400 text-xs">O estoque e financeiro foram atualizados.</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] shadow-2xl sticky top-8">
            <div className="flex items-center gap-3 mb-6">
              <ShoppingCart className="text-amber-500" size={24} />
              <h2 className="text-xl font-bold text-white">Carrinho</h2>
            </div>

            <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto no-scrollbar">
              {cart.map((item, i) => (
                <div key={i} className="flex justify-between items-center group">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-zinc-200 truncate">{item.name}</div>
                    <div className="text-[10px] text-zinc-500 font-bold">{item.quantity}x R$ {item.price.toFixed(2)}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="font-black text-zinc-100 text-sm">R$ {(item.price * item.quantity).toFixed(2)}</div>
                    <button onClick={() => removeFromCart(i)} className="text-zinc-600 hover:text-rose-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {cart.length === 0 && (
                <div className="text-center py-12 text-zinc-600 italic text-sm">Carrinho vazio.</div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="space-y-6 animate-in slide-in-from-bottom-2">
                <div className="pt-6 border-t border-zinc-800 flex justify-between items-center">
                  <span className="text-zinc-500 font-bold uppercase text-xs">Total</span>
                  <span className="text-2xl font-black text-white">R$ {total.toFixed(2)}</span>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-500 uppercase ml-1">Forma de Pagamento</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'pix', icon: Wallet, label: 'PIX' },
                      { id: 'card', icon: CreditCard, label: 'Cartão' },
                      { id: 'cash', icon: Banknote, label: 'Dinheiro' }
                    ].map(method => (
                      <button 
                        key={method.id} 
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={`p-3 rounded-2xl border flex flex-col items-center gap-1 transition-all ${
                          paymentMethod === method.id 
                          ? 'bg-amber-500 border-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20' 
                          : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <method.icon size={20} />
                        <span className="text-[8px] font-black uppercase">{method.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleFinalizeSale}
                  disabled={isProcessing || !paymentMethod}
                  className="w-full bg-white hover:bg-amber-500 text-zinc-950 font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 shadow-xl"
                >
                  {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                  FINALIZAR VENDA
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashierTerminal;
