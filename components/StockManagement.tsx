
import React, { useState, useEffect } from 'react';
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
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { Product, Category, StockTransaction } from '../types';

const StockManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Modals
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // Selection
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [transactionType, setTransactionType] = useState<'IN' | 'OUT'>('IN');

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

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
      costPrice: Number(formData.get('costPrice')),
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
    if (confirm("Deseja realmente excluir esta categoria? Os produtos vinculados ficarão sem categoria.")) {
      setCategories(categories.filter(c => c.id !== id));
      setProducts(products.map(p => p.categoryId === id ? { ...p, categoryId: undefined } : p));
    }
  };

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Estoque</h1>
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
            <Plus size={16} /> Novo Produto
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Itens em Estoque', value: products.reduce((acc, p) => acc + p.stock, 0).toString(), icon: Package },
          { label: 'Alertas de Reposição', value: products.filter(p => p.stock <= p.minStock).length.toString(), icon: AlertTriangle, color: 'text-rose-500' },
          { label: 'Patrimônio (Custo)', value: `R$ ${products.reduce((acc, p) => acc + (p.costPrice * p.stock), 0).toFixed(2)}`, icon: DollarSign, color: 'text-emerald-500' },
          { label: 'Categorias Ativas', value: categories.length.toString(), icon: Tag },
        ].map((card, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 p-4 md:p-6 rounded-3xl">
            <div className="flex justify-between items-start mb-3 md:mb-4">
              <div className="bg-zinc-800 p-2 md:p-3 rounded-xl md:rounded-2xl">
                <card.icon className={card.color || 'text-zinc-400'} size={18} />
              </div>
            </div>
            <div className="text-zinc-500 text-[10px] font-bold uppercase mb-1">{card.label}</div>
            <div className="text-lg md:text-2xl font-black text-white">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl">
        <div className="p-4 md:p-8 border-b border-zinc-800 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-white"
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
            <div key={product.id} className="p-4 md:p-6 flex items-center justify-between hover:bg-zinc-800/20 transition-all group">
              <div className="flex items-center gap-4 md:gap-6 min-w-0">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-zinc-800 rounded-xl md:rounded-2xl flex items-center justify-center text-zinc-500 group-hover:text-amber-500 shrink-0 border border-zinc-700/50 transition-colors">
                  <Package size={20} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm md:text-lg truncate text-white">{product.name}</h3>
                  <div className="flex items-center gap-2 md:gap-4 mt-1">
                    <span className="text-[8px] md:text-[10px] font-black bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded uppercase border border-zinc-700/50 truncate">
                      {categories.find(c => c.id === product.categoryId)?.name || 'Sem Categoria'}
                    </span>
                    <span className="text-[10px] md:text-xs font-bold text-amber-500 shrink-0">Venda: R$ {product.price.toFixed(2)}</span>
                    <span className="text-[10px] md:text-xs font-bold text-zinc-500 shrink-0">Custo: R$ {product.costPrice.toFixed(2)}</span>
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
                
                <div className="relative">
                  <button 
                    onClick={(e) => toggleMenu(e, product.id)}
                    className={`p-2 md:p-2.5 rounded-xl transition-all relative z-10 ${openMenuId === product.id ? 'bg-amber-500 text-zinc-950 shadow-lg' : 'bg-zinc-800/50 text-zinc-500 hover:text-white'}`}
                  >
                    <MoreVertical size={18} />
                  </button>

                  {openMenuId === product.id && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-zinc-900/95 border border-zinc-600 rounded-2xl shadow-2xl z-[70] backdrop-blur-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <div className="p-2 space-y-1">
                        <button 
                          onClick={() => { setActiveProduct(product); setShowDetailsModal(true); setOpenMenuId(null); }} 
                          className="w-full flex items-center gap-3 px-3 py-3 text-xs font-bold text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-xl transition-all"
                        >
                          <Eye size={16} className="text-amber-500" /> Detalhes do Item
                        </button>
                        <button 
                          onClick={() => { setActiveProduct(product); setShowProductModal(true); setOpenMenuId(null); }} 
                          className="w-full flex items-center gap-3 px-3 py-3 text-xs font-bold text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-xl transition-all"
                        >
                          <Edit3 size={16} className="text-amber-500" /> Editar Produto
                        </button>
                        <div className="h-[1px] bg-zinc-800 mx-2" />
                        <button 
                          onClick={() => { setActiveProduct(product); setTransactionType('IN'); setShowTransactionModal(true); setOpenMenuId(null); }} 
                          className="w-full flex items-center gap-3 px-3 py-3 text-xs font-black text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all"
                        >
                          <ArrowUpRight size={16} /> Registrar Entrada
                        </button>
                        <button 
                          onClick={() => { setActiveProduct(product); setTransactionType('OUT'); setShowTransactionModal(true); setOpenMenuId(null); }} 
                          className="w-full flex items-center gap-3 px-3 py-3 text-xs font-black text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                        >
                          <ArrowDownRight size={16} /> Registrar Saída
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {showProductModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50 sticky top-0 z-10">
              <h2 className="text-xl font-bold flex items-center gap-3 text-white">
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
                  <label className="text-[10px] font-black text-zinc-500 uppercase ml-2 tracking-widest">Nome do Produto</label>
                  <input required name="name" defaultValue={activeProduct?.name} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all text-white placeholder:text-zinc-600" placeholder="Ex: Pomada Modeladora" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase ml-2 tracking-widest">Categoria</label>
                  <select required name="categoryId" defaultValue={activeProduct?.categoryId} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all text-white">
                    <option value="">Selecione uma categoria...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase ml-2 tracking-widest">Preço de Custo (R$)</label>
                    <input required name="costPrice" type="number" step="0.01" defaultValue={activeProduct?.costPrice} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all text-white placeholder:text-zinc-600" placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase ml-2 tracking-widest">Preço de Venda (R$)</label>
                    <input required name="price" type="number" step="0.01" defaultValue={activeProduct?.price} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all text-white placeholder:text-zinc-600" placeholder="0.00" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase ml-2 tracking-widest">Estoque Inicial</label>
                    <input required name="stock" type="number" defaultValue={activeProduct?.stock} disabled={!!activeProduct} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:outline-none disabled:opacity-50 text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase ml-2 tracking-widest">Aviso de Estoque Baixo</label>
                    <input required name="minStock" type="number" defaultValue={activeProduct?.minStock} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all text-white placeholder:text-zinc-600" placeholder="5" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase ml-2 tracking-widest">Descrição</label>
                  <textarea name="description" defaultValue={activeProduct?.description} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:outline-none h-24 resize-none focus:ring-1 focus:ring-amber-500 transition-all text-white placeholder:text-zinc-600" placeholder="Detalhes técnicos ou de aplicação..." />
                </div>
              </div>
              <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black py-4 rounded-2xl text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-amber-500/20">
                {activeProduct ? 'Atualizar Dados' : 'Cadastrar no Inventário'}
              </button>
            </form>
          </div>
        </div>
      )}

      {showCategoryModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
              <h2 className="text-xl font-bold flex items-center gap-3 text-white">
                <Tag className="text-amber-500" /> Gestão de Categorias
              </h2>
              <button onClick={() => setShowCategoryModal(false)} className="text-zinc-500 hover:text-white p-2">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 md:p-8 border-b border-zinc-800 bg-zinc-800/10">
              <form onSubmit={handleSaveCategory} className="flex gap-2">
                <input required name="name" defaultValue={activeCategory?.name} placeholder="Nome da categoria..." className="flex-1 bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all text-white" />
                <button type="submit" className="bg-amber-500 text-zinc-950 px-5 py-3 rounded-2xl font-black shrink-0 hover:bg-amber-600 transition-all active:scale-95">
                  {activeCategory ? <CheckCircle2 size={20} /> : <Plus size={20} />}
                </button>
              </form>
            </div>
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2 no-scrollbar">
              {categories.map(cat => (
                <div key={cat.id} className="flex items-center justify-between p-4 bg-zinc-800/20 border border-zinc-800 rounded-2xl group hover:border-zinc-700 transition-all">
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

      {showTransactionModal && activeProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                <h2 className="text-xl font-bold flex items-center gap-3 uppercase tracking-tighter text-white">
                  {transactionType === 'IN' ? <ArrowUpRight className="text-emerald-500" /> : <ArrowDownRight className="text-rose-500" />}
                  Lançar {transactionType === 'IN' ? 'Entrada' : 'Saída'}
                </h2>
                <button onClick={() => setShowTransactionModal(false)} className="text-zinc-500 hover:text-white p-2">
                  <X size={24} />
                </button>
             </div>
             
             <div className="p-8 space-y-6">
                <div className="text-center">
                  <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Produto Selecionado</div>
                  <div className="text-lg font-bold text-white">{activeProduct.name}</div>
                  <div className="text-xs text-amber-500 font-bold mt-1">Estoque Atual: {activeProduct.stock} un</div>
                </div>

                <form onSubmit={handleTransaction} className="space-y-5">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase ml-2 tracking-widest">Quantidade</label>
                      <input required name="quantity" type="number" min="1" className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 text-xl font-black text-center focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all text-white" placeholder="0" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase ml-2 tracking-widest text-white">Motivo / Observação</label>
                      <input required name="reason" className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all text-white" placeholder="Ex: Reposição mensal ou Venda balcão" />
                   </div>
                   
                   <button 
                    type="submit" 
                    className={`w-full py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all active:scale-95 shadow-lg ${
                      transactionType === 'IN' 
                      ? 'bg-emerald-500 text-zinc-950 hover:bg-emerald-600 shadow-emerald-500/20' 
                      : 'bg-rose-500 text-white hover:bg-rose-600 shadow-rose-500/20'
                    }`}
                   >
                     Confirmar Movimentação
                   </button>
                </form>
             </div>
          </div>
        </div>
      )}

      {showDetailsModal && activeProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
               <h2 className="text-xl font-bold flex items-center gap-3 text-white">
                 <Package className="text-amber-500" /> Histórico do Produto
               </h2>
               <button onClick={() => setShowDetailsModal(false)} className="text-zinc-500 hover:text-white p-2">
                 <X size={24} />
               </button>
            </div>
            
            <div className="p-8 flex-1 overflow-y-auto no-scrollbar">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-zinc-800/40 p-4 rounded-2xl border border-zinc-800">
                    <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Status</div>
                    <div className={`text-xs font-black uppercase ${activeProduct.stock <= activeProduct.minStock ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {activeProduct.stock <= activeProduct.minStock ? 'Estoque Crítico' : 'Estoque Saudável'}
                    </div>
                  </div>
                  <div className="bg-zinc-800/40 p-4 rounded-2xl border border-zinc-800">
                    <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Atual</div>
                    <div className="text-lg font-black text-white">{activeProduct.stock} un</div>
                  </div>
                  <div className="bg-zinc-800/40 p-4 rounded-2xl border border-zinc-800">
                    <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Mínimo</div>
                    <div className="text-lg font-black text-white">{activeProduct.minStock} un</div>
                  </div>
                  <div className="bg-zinc-800/40 p-4 rounded-2xl border border-zinc-800">
                    <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Vlr. Total Custo</div>
                    <div className="text-lg font-black text-amber-500">R$ {(activeProduct.costPrice * activeProduct.stock).toFixed(2)}</div>
                  </div>
               </div>

               <div className="space-y-4">
                  <h3 className="text-sm font-black text-zinc-300 uppercase tracking-widest flex items-center gap-2">
                    <History size={16} className="text-amber-500" /> Últimas Movimentações
                  </h3>
                  
                  <div className="space-y-2">
                    {activeProduct.transactions && activeProduct.transactions.length > 0 ? (
                      activeProduct.transactions.map((t) => (
                        <div key={t.id} className="bg-zinc-800/20 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between group">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border border-zinc-700 ${t.type === 'IN' ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'}`}>
                              {t.type === 'IN' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-zinc-100">{t.reason}</div>
                              <div className="text-[10px] text-zinc-500 font-black uppercase">{new Date(t.date).toLocaleString('pt-BR')}</div>
                            </div>
                          </div>
                          <div className={`text-sm font-black ${t.type === 'IN' ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {t.type === 'IN' ? '+' : '-'}{t.quantity} un
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 bg-zinc-800/10 border border-dashed border-zinc-800 rounded-[24px]">
                        <Package size={32} className="mx-auto text-zinc-800 mb-2" />
                        <p className="text-zinc-600 text-xs font-medium italic text-white">Nenhuma movimentação registrada para este item.</p>
                      </div>
                    )}
                  </div>
               </div>
            </div>
            
            <div className="p-6 bg-zinc-900/50 border-t border-zinc-800">
               <button 
                onClick={() => setShowDetailsModal(false)}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-2xl transition-all uppercase tracking-widest text-xs"
               >
                 Fechar Detalhes
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockManagement;
