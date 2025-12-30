
import React, { useState, useEffect } from 'react';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../constants';
import { 
  Package, 
  Plus, 
  AlertTriangle, 
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
  DollarSign,
  Layers,
  Save,
  ArrowRight,
  Loader2,
  PlusCircle
} from 'lucide-react';
import { Product, Category, StockTransaction } from '../types';

const StockManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Modals
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // Selection
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [transactionType, setTransactionType] = useState<'IN' | 'OUT'>('IN');
  const [isProcessing, setIsProcessing] = useState(false);

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

  const getProductCountByCategory = (categoryId: string | null) => {
    if (!categoryId) return products.length;
    return products.filter(p => p.categoryId === categoryId).length;
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const productData: Product = {
      id: activeProduct?.id || Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      costPrice: Number(formData.get('costPrice')),
      price: Number(formData.get('price')),
      stock: activeProduct ? activeProduct.stock : Number(formData.get('stock')),
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
    if (!newCategoryName.trim()) return;

    const newCategory: Category = {
      id: Math.random().toString(36).substr(2, 9),
      name: newCategoryName.trim()
    };

    setCategories([...categories, newCategory]);
    setNewCategoryName('');
  };

  const handleDeleteCategory = (id: string) => {
    if (products.some(p => p.categoryId === id)) {
      alert("Não é possível excluir uma categoria que possui produtos vinculados.");
      return;
    }
    setCategories(categories.filter(c => c.id !== id));
    if (selectedCategoryId === id) setSelectedCategoryId(null);
  };

  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProduct) return;

    setIsProcessing(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const quantity = Number(formData.get('quantity'));
    const reason = formData.get('reason') as string;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const newTransaction: StockTransaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: transactionType,
      quantity: quantity,
      reason: reason,
      date: new Date().toISOString()
    };

    const newStock = transactionType === 'IN' 
      ? activeProduct.stock + quantity 
      : Math.max(0, activeProduct.stock - quantity);

    setProducts(products.map(p => 
      p.id === activeProduct.id 
        ? { 
            ...p, 
            stock: newStock, 
            transactions: [newTransaction, ...(p.transactions || [])] 
          } 
        : p
    ));

    setIsProcessing(false);
    setShowTransactionModal(false);
    setActiveProduct(null);
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
          <div key={i} className="bg-zinc-900 border border-zinc-800 p-4 md:p-6 rounded-3xl transition-all hover:border-zinc-700">
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Listagem de Categorias */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6 sticky top-8 hidden lg:block">
          <div className="flex items-center gap-2 text-zinc-200">
            <Layers className="text-amber-500" size={20} />
            <h2 className="text-sm font-black uppercase tracking-wider">Filtrar Categorias</h2>
          </div>
          <div className="space-y-1">
            <button 
              onClick={() => setSelectedCategoryId(null)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${!selectedCategoryId ? 'bg-amber-500/10 text-amber-500' : 'text-zinc-500 hover:bg-zinc-800'}`}
            >
              <span className="text-xs font-bold uppercase">Todas</span>
              <span className="text-[10px] font-black">{products.length}</span>
            </button>
            {categories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${selectedCategoryId === cat.id ? 'bg-amber-500/10 text-amber-500' : 'text-zinc-500 hover:bg-zinc-800'}`}
              >
                <span className="text-xs font-bold uppercase truncate pr-2">{cat.name}</span>
                <span className="text-[10px] font-black">{getProductCountByCategory(cat.id)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Produtos */}
        <div className="lg:col-span-3 bg-zinc-900 border border-zinc-800 rounded-3xl overflow-visible shadow-xl">
          <div className="p-4 md:p-8 border-b border-zinc-800 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                type="text" 
                placeholder="Pesquisar produto..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-white"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 divide-y divide-zinc-800">
            {filteredProducts.map((product) => (
              <div key={product.id} className="p-4 md:p-6 flex items-center justify-between hover:bg-zinc-800/20 transition-all group overflow-visible">
                <div className="flex items-center gap-4 md:gap-6 min-w-0">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-zinc-800 rounded-xl md:rounded-2xl flex items-center justify-center text-zinc-500 group-hover:text-amber-500 shrink-0 border border-zinc-700 transition-colors">
                    <Package size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm md:text-lg truncate text-white">{product.name}</h3>
                    <div className="flex items-center gap-2 md:gap-4 mt-1">
                      <span className="text-[8px] md:text-[10px] font-black bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded uppercase border border-zinc-700 truncate">
                        {categories.find(c => c.id === product.categoryId)?.name || 'Sem Categoria'}
                      </span>
                      <span className="text-[10px] md:text-xs font-bold text-amber-500 shrink-0">R$ {product.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 md:gap-12 shrink-0 ml-4 overflow-visible">
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
                      <div className="absolute right-0 top-full mt-2 w-56 bg-zinc-900/95 border border-zinc-600 rounded-2xl shadow-2xl z-[100] backdrop-blur-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-2 space-y-1">
                          <button 
                            onClick={() => { setActiveProduct(product); setShowDetailsModal(true); setOpenMenuId(null); }} 
                            className="w-full flex items-center gap-3 px-3 py-3 text-xs font-bold text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-xl transition-all"
                          >
                            <Eye size={16} className="text-amber-500" /> Detalhes
                          </button>
                          <button 
                            onClick={() => { setActiveProduct(product); setShowProductModal(true); setOpenMenuId(null); }} 
                            className="w-full flex items-center gap-3 px-3 py-3 text-xs font-bold text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-xl transition-all"
                          >
                            <Edit3 size={16} className="text-amber-500" /> Editar
                          </button>
                          <div className="h-[1px] bg-zinc-800 mx-2" />
                          <button 
                            onClick={() => { setActiveProduct(product); setTransactionType('IN'); setShowTransactionModal(true); setOpenMenuId(null); }} 
                            className="w-full flex items-center gap-3 px-3 py-3 text-xs font-black text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all"
                          >
                            <ArrowUpRight size={16} /> Entrada
                          </button>
                          <button 
                            onClick={() => { setActiveProduct(product); setTransactionType('OUT'); setShowTransactionModal(true); setOpenMenuId(null); }} 
                            className="w-full flex items-center gap-3 px-3 py-3 text-xs font-black text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                          >
                            <ArrowDownRight size={16} /> Saída
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
      </div>

      {/* Modal de Categorias */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50 sticky top-0 z-10">
              <h2 className="text-xl font-bold flex items-center gap-3 text-white">
                <Tag className="text-amber-500" size={20} />
                Gerenciar Categorias
              </h2>
              <button onClick={() => setShowCategoryModal(false)} className="text-zinc-500 hover:text-white p-2">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6 overflow-y-auto no-scrollbar flex-1">
              <form onSubmit={handleSaveCategory} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase ml-2 tracking-widest text-white">Nova Categoria</label>
                  <div className="flex gap-2">
                    <input 
                      required 
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="flex-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all text-white" 
                      placeholder="Ex: Equipamentos" 
                    />
                    <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-zinc-950 px-4 rounded-2xl transition-all shadow-lg">
                      <PlusCircle size={20} />
                    </button>
                  </div>
                </div>
              </form>

              <div className="space-y-2">
                <h3 className="text-[10px] font-black text-zinc-500 uppercase ml-2 tracking-widest text-white">Categorias Existentes</h3>
                <div className="grid grid-cols-1 gap-2">
                  {categories.map(cat => (
                    <div key={cat.id} className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-4 flex items-center justify-between group">
                      <span className="text-sm font-bold text-zinc-100">{cat.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-zinc-500 uppercase">{getProductCountByCategory(cat.id)} itens</span>
                        <button 
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="text-zinc-500 hover:text-rose-500 transition-colors p-1"
                          title="Excluir Categoria"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {categories.length === 0 && (
                    <p className="text-center py-8 text-zinc-600 text-xs italic">Nenhuma categoria cadastrada.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Produto (Novo/Editar) */}
      {showProductModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md animate-in fade-in duration-300">
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
            <form onSubmit={handleSaveProduct} className="p-6 md:p-8 space-y-5">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase ml-2 tracking-widest text-white">Nome do Produto</label>
                  <input required name="name" defaultValue={activeProduct?.name} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all text-white" placeholder="Ex: Pomada Modeladora" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase ml-2 tracking-widest text-white">Categoria</label>
                  <select required name="categoryId" defaultValue={activeProduct?.categoryId} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all text-white">
                    <option value="">Selecione...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase ml-2 tracking-widest text-white">Preço de Custo (R$)</label>
                    <input required name="costPrice" type="number" step="0.01" defaultValue={activeProduct?.costPrice} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase ml-2 tracking-widest text-white">Preço de Venda (R$)</label>
                    <input required name="price" type="number" step="0.01" defaultValue={activeProduct?.price} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all text-white" />
                  </div>
                </div>

                {!activeProduct && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase ml-2 tracking-widest text-white">Estoque Inicial</label>
                    <input required name="stock" type="number" className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:outline-none text-white" placeholder="0" />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase ml-2 tracking-widest text-white">Mínimo para Alerta</label>
                  <input required name="minStock" type="number" defaultValue={activeProduct?.minStock} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:outline-none text-white" placeholder="5" />
                </div>
              </div>
              <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black py-4 rounded-2xl text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg">
                {activeProduct ? 'Atualizar Dados' : 'Cadastrar Produto'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Transação (Entrada/Saída) */}
      {showTransactionModal && activeProduct && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-zinc-950/95 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden">
            <div className={`p-8 border-b border-zinc-800 flex justify-between items-center ${transactionType === 'IN' ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${transactionType === 'IN' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'}`}>
                  {transactionType === 'IN' ? <ArrowUpRight size={24} /> : <ArrowDownRight size={24} />}
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tighter text-white">{transactionType === 'IN' ? 'Entrada' : 'Saída'} de Estoque</h2>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase truncate max-w-[200px]">{activeProduct.name}</p>
                </div>
              </div>
              <button onClick={() => { setShowTransactionModal(false); setActiveProduct(null); }} className="text-zinc-500 hover:text-white p-2">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleTransaction} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase ml-2 tracking-widest text-white">Quantidade</label>
                  <input 
                    required 
                    name="quantity" 
                    type="number" 
                    min="1" 
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-4 px-6 text-2xl font-black focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all text-white text-center" 
                    placeholder="0" 
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase ml-2 tracking-widest text-white">Motivo / Observação</label>
                  <input 
                    required 
                    name="reason" 
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all text-white" 
                    placeholder={transactionType === 'IN' ? 'Ex: Compra com fornecedor X' : 'Ex: Venda balcão / Uso interno'} 
                  />
                </div>
              </div>

              <div className="bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800 flex items-center justify-between">
                <span className="text-xs text-zinc-500 font-bold uppercase">Estoque Atual</span>
                <span className="text-lg font-black text-white">{activeProduct.stock} un</span>
              </div>

              <button 
                type="submit" 
                disabled={isProcessing}
                className={`w-full py-5 rounded-[24px] font-black uppercase text-xs tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl ${
                  transactionType === 'IN' 
                    ? 'bg-emerald-500 text-zinc-950 hover:bg-emerald-600 shadow-emerald-500/10' 
                    : 'bg-rose-500 text-zinc-950 hover:bg-rose-600 shadow-rose-500/10'
                }`}
              >
                {isProcessing ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                {isProcessing ? 'Processando...' : `Confirmar ${transactionType === 'IN' ? 'Entrada' : 'Saída'}`}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Detalhes (Histórico) */}
      {showDetailsModal && activeProduct && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-zinc-950/95 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-3xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50 sticky top-0 z-10">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-zinc-800 rounded-3xl flex items-center justify-center text-amber-500 border border-zinc-700 shadow-xl">
                  <Package size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{activeProduct.name}</h2>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-[10px] font-black bg-zinc-800 text-zinc-400 px-3 py-1 rounded-full border border-zinc-700 uppercase tracking-widest">
                      {categories.find(c => c.id === activeProduct.categoryId)?.name}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${activeProduct.stock <= activeProduct.minStock ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {activeProduct.stock <= activeProduct.minStock ? 'Estoque Baixo' : 'Em Estoque'}
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={() => { setShowDetailsModal(false); setActiveProduct(null); }} className="text-zinc-500 hover:text-white p-2">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 no-scrollbar space-y-8">
              {/* Resumo Financeiro */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-zinc-800/30 p-5 rounded-3xl border border-zinc-800 text-center">
                  <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Preço de Venda</div>
                  <div className="text-xl font-black text-white">R$ {activeProduct.price.toFixed(2)}</div>
                </div>
                <div className="bg-zinc-800/30 p-5 rounded-3xl border border-zinc-800 text-center">
                  <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Margem Bruta</div>
                  <div className="text-xl font-black text-emerald-500">
                    {Math.round(((activeProduct.price - activeProduct.costPrice) / activeProduct.price) * 100)}%
                  </div>
                </div>
                <div className="bg-zinc-800/30 p-5 rounded-3xl border border-zinc-800 text-center">
                  <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Valor em Estoque</div>
                  <div className="text-xl font-black text-amber-500">R$ {(activeProduct.costPrice * activeProduct.stock).toFixed(2)}</div>
                </div>
              </div>

              {/* Histórico de Movimentações */}
              <div className="space-y-4">
                <h3 className="text-sm font-black text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <History size={16} className="text-amber-500" /> Histórico de Transações
                </h3>
                <div className="space-y-2">
                  {activeProduct.transactions && activeProduct.transactions.length > 0 ? (
                    activeProduct.transactions.map((t, idx) => (
                      <div key={idx} className="bg-zinc-800/20 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between group hover:bg-zinc-800/40 transition-all">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-xl ${t.type === 'IN' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                            {t.type === 'IN' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-zinc-200">{t.reason}</div>
                            <div className="text-[10px] text-zinc-600 font-black uppercase">{new Date(t.date).toLocaleString()}</div>
                          </div>
                        </div>
                        <div className={`text-lg font-black ${t.type === 'IN' ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {t.type === 'IN' ? '+' : '-'}{t.quantity} un
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 border border-dashed border-zinc-800 rounded-3xl text-zinc-600">
                      Nenhuma movimentação registrada para este item.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-zinc-800 bg-zinc-900/50 flex gap-4">
               <button 
                  onClick={() => { setShowDetailsModal(false); setTransactionType('IN'); setShowTransactionModal(true); }}
                  className="flex-1 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-zinc-950 font-black py-4 rounded-2xl transition-all uppercase text-[10px] tracking-widest border border-emerald-500/20"
               >
                 Entrada de Estoque
               </button>
               <button 
                  onClick={() => { setShowDetailsModal(false); setTransactionType('OUT'); setShowTransactionModal(true); }}
                  className="flex-1 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-zinc-950 font-black py-4 rounded-2xl transition-all uppercase text-[10px] tracking-widest border border-rose-500/20"
               >
                 Saída de Estoque
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockManagement;
