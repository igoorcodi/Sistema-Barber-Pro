
import React, { useState } from 'react';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../constants';
import { 
  Package, 
  Plus, 
  AlertTriangle, 
  RefreshCcw, 
  MoreVertical, 
  Search, 
  X, 
  Tag, 
  Edit3, 
  Eye, 
  ArrowUpRight, 
  ArrowDownRight,
  History,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { Product, Category, StockTransaction } from '../types';

const StockManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Modals
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // Selection
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [transactionType, setTransactionType] = useState<'IN' | 'OUT'>('IN');

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategoryId ? p.categoryId === selectedCategoryId : true;
    return matchesSearch && matchesCategory;
  });

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const productData: Product = {
      id: activeProduct?.id || Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      stock: activeProduct?.stock || Number(formData.get('stock')),
      minStock: Number(formData.get('minStock')),
      categoryId: formData.get('categoryId') as string,
      description: formData.get('description') as string,
      transactions: activeProduct?.transactions || []
    };

    if (activeProduct) {
      setProducts(products.map(p => p.id === activeProduct.id ? productData : p));
    } else {
      setProducts([...products, productData]);
    }
    setShowProductModal(false);
    setActiveProduct(null);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const name = formData.get('name') as string;
    
    if (activeCategory) {
      setCategories(categories.map(c => c.id === activeCategory.id ? { ...c, name } : c));
    } else {
      setCategories([...categories, { id: Math.random().toString(36).substr(2, 9), name }]);
    }
    setActiveCategory(null);
    (e.target as HTMLFormElement).reset();
  };

  const handleTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProduct) return;

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const qty = Number(formData.get('quantity'));
    const reason = formData.get('reason') as string;
    
    const newTransaction: StockTransaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: transactionType,
      quantity: qty,
      reason,
      date: new Date().toISOString()
    };

    const updatedStock = transactionType === 'IN' 
      ? activeProduct.stock + qty 
      : Math.max(0, activeProduct.stock - qty);

    setProducts(products.map(p => p.id === activeProduct.id ? {
      ...p,
      stock: updatedStock,
      transactions: [newTransaction, ...(p.transactions || [])]
    } : p));

    setShowTransactionModal(false);
    setActiveProduct(null);
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
    setProducts(products.map(p => p.categoryId === id ? { ...p, categoryId: undefined } : p));
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Estoque</h1>
          <p className="text-zinc-500 text-sm">Controle de insumos e revenda.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={() => setShowCategoryModal(true)}
            className="flex-1 md:flex-none bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-4 md:px-6 py-2.5 md:py-3 rounded-2xl flex items-center justify-center gap-2 transition-all border border-zinc-700 text-xs md:text-sm"
          >
            <Tag size={16} /> Categorias
          </button>
          <button 
            onClick={() => { setActiveProduct(null); setShowProductModal(true); }}
            className="flex-1 md:flex-none bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold px-4 md:px-6 py-2.5 md:py-3 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg text-xs md:text-sm"
          >
            <Plus size={16} /> Novo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Itens', value: products.reduce((acc, p) => acc + p.stock, 0).toString(), icon: Package },
          { label: 'Alertas', value: products.filter(p => p.stock <= p.minStock).length.toString(), icon: AlertTriangle, color: 'text-rose-500' },
          { label: 'Patrimônio', value: `R$ ${products.reduce((acc, p) => acc + (p.price * p.stock), 0).toFixed(0)}`, icon: Package },
          { label: 'Categorias', value: categories.length.toString(), icon: Tag },
        ].map((card, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 p-4 md:p-6 rounded-3xl">
            <div className="flex justify-between items-start mb-3 md:mb-4">
              <div className="bg-zinc-800 p-2 md:p-3 rounded-xl md:rounded-2xl">
                <card.icon className={card.color || 'text-zinc-400'} size={18} />
              </div>
            </div>
            <div className="text-zinc-500 text-[10px] font-bold uppercase mb-1">{card.label}</div>
            <div className="text-lg md:text-2xl font-black">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
        <div className="p-4 md:p-8 border-b border-zinc-800 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-1 md:pb-0">
            <button 
              onClick={() => setSelectedCategoryId(null)}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase whitespace-nowrap transition-all ${!selectedCategoryId ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'}`}
            >
              Todos
            </button>
            {categories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase whitespace-nowrap transition-all ${selectedCategoryId === cat.id ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 divide-y divide-zinc-800">
          {filteredProducts.map((product) => (
            <div key={product.id} className="p-4 md:p-6 flex items-center justify-between hover:bg-zinc-800/30 transition-all group">
              <div className="flex items-center gap-4 md:gap-6 min-w-0">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-zinc-800 rounded-xl md:rounded-2xl flex items-center justify-center text-zinc-500 group-hover:text-amber-500 shrink-0 border border-zinc-700/50">
                  <Package size={20} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm md:text-lg truncate">{product.name}</h3>
                  <div className="flex items-center gap-2 md:gap-4 mt-1">
                    <span className="text-[8px] md:text-[10px] font-black bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded uppercase border border-zinc-700/50 truncate">
                      {categories.find(c => c.id === product.categoryId)?.name || 'Sem Categoria'}
                    </span>
                    <span className="text-[10px] md:text-xs font-bold text-amber-500 shrink-0">R$ {product.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 md:gap-12 shrink-0 ml-4">
                <div className="text-center min-w-[50px] md:min-w-[80px]">
                  <div className="text-[8px] md:text-[10px] text-zinc-500 font-bold uppercase mb-1">Qtd</div>
                  <div className={`text-sm md:text-xl font-black ${product.stock <= product.minStock ? 'text-rose-500' : 'text-zinc-100'}`}>
                    {product.stock}<span className="text-[10px] md:text-xs text-zinc-500 font-normal ml-0.5">un</span>
                  </div>
                </div>
                
                <div className="relative group/menu">
                  <button className="p-2 md:p-2.5 bg-zinc-800/50 rounded-xl text-zinc-500 hover:text-white transition-all">
                    <MoreVertical size={18} />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover/menu:opacity-100 group-hover/menu:translate-y-0 group-hover/menu:pointer-events-auto transition-all z-20 overflow-hidden">
                    <div className="p-1.5 space-y-1">
                      <button onClick={() => { setActiveProduct(product); setShowDetailsModal(true); }} className="w-full flex items-center gap-3 px-3 py-2 text-[10px] font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-all"><Eye size={14} /> Detalhes</button>
                      <button onClick={() => { setActiveProduct(product); setShowProductModal(true); }} className="w-full flex items-center gap-3 px-3 py-2 text-[10px] font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-all"><Edit3 size={14} /> Editar</button>
                      <div className="h-[1px] bg-zinc-800 mx-2"></div>
                      <button onClick={() => { setActiveProduct(product); setTransactionType('IN'); setShowTransactionModal(true); }} className="w-full flex items-center gap-3 px-3 py-2 text-[10px] font-bold text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all"><ArrowUpRight size={14} /> Entrada</button>
                      <button onClick={() => { setActiveProduct(product); setTransactionType('OUT'); setShowTransactionModal(true); }} className="w-full flex items-center gap-3 px-3 py-2 text-[10px] font-bold text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"><ArrowDownRight size={14} /> Saída</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals are already quite responsive, just ensuring overflow and centering */}
      {showProductModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50 sticky top-0 z-10">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <Package className="text-amber-500" size={20} />
                {activeProduct ? 'Editar' : 'Novo'} Produto
              </h2>
              <button onClick={() => { setShowProductModal(false); setActiveProduct(null); }} className="text-zinc-500 hover:text-white p-2">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSaveProduct} className="p-6 md:p-8 space-y-4 md:space-y-5">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">Nome</label>
                  <input required name="name" defaultValue={activeProduct?.name} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">Categoria</label>
                    <select required name="categoryId" defaultValue={activeProduct?.categoryId} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:outline-none">
                      <option value="">Selecione...</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">Preço (R$)</label>
                    <input required name="price" type="number" step="0.01" defaultValue={activeProduct?.price} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">Inicial</label>
                    <input required name="stock" type="number" defaultValue={activeProduct?.stock} disabled={!!activeProduct} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:outline-none disabled:opacity-50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">Mínimo</label>
                    <input required name="minStock" type="number" defaultValue={activeProduct?.minStock} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:outline-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">Descrição</label>
                  <textarea name="description" defaultValue={activeProduct?.description} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:outline-none h-24" />
                </div>
              </div>
              <button type="submit" className="w-full bg-amber-500 text-zinc-950 font-black py-4 rounded-2xl text-xs uppercase tracking-wider">
                {activeProduct ? 'Atualizar' : 'Salvar'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Categories and Transaction modals also benefit from these tweaks */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <Tag className="text-amber-500" /> Categorias
              </h2>
              <button onClick={() => setShowCategoryModal(false)} className="text-zinc-500 hover:text-white p-2">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 md:p-8 border-b border-zinc-800 bg-zinc-800/20">
              <form onSubmit={handleSaveCategory} className="flex gap-2">
                <input required name="name" defaultValue={activeCategory?.name} placeholder="Nome..." className="flex-1 bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:outline-none" />
                <button type="submit" className="bg-amber-500 text-zinc-950 px-5 py-3 rounded-2xl font-black shrink-0">
                  {activeCategory ? <CheckCircle2 size={20} /> : <Plus size={20} />}
                </button>
              </form>
            </div>
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2 no-scrollbar">
              {categories.map(cat => (
                <div key={cat.id} className="flex items-center justify-between p-4 bg-zinc-800/30 border border-zinc-800 rounded-2xl group">
                  <span className="font-bold text-zinc-200 text-sm">{cat.name}</span>
                  <div className="flex gap-1">
                    <button onClick={() => setActiveCategory(cat)} className="p-2 text-zinc-500 hover:text-amber-500 transition-colors"><Edit3 size={16} /></button>
                    <button onClick={() => deleteCategory(cat.id)} className="p-2 text-zinc-500 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockManagement;
