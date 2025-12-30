
import React, { useState } from 'react';
import { 
  QrCode, 
  UserCheck, 
  Clock, 
  Search, 
  CheckCircle2, 
  X, 
  Camera,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { Booking } from '../types';

interface CheckInTerminalProps {
  bookings: Booking[];
  onUpdateStatus: (id: string, status: Booking['status']) => void;
}

const CheckInTerminal: React.FC<CheckInTerminalProps> = ({ bookings, onUpdateStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccess, setShowSuccess] = useState<string | null>(null);

  const pendingBookings = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING');
  
  const filtered = pendingBookings.filter(b => 
    b.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckIn = (id: string, name: string) => {
    onUpdateStatus(id, 'CONFIRMED'); // No contexto deste app, CONFIRMED pode significar "cliente no local" ou "check-in feito"
    setShowSuccess(name);
    setTimeout(() => setShowSuccess(null), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-black text-white uppercase tracking-tight">Terminal de Check-in</h1>
        <p className="text-zinc-500 font-medium">Confirme a chegada dos clientes para iniciar o atendimento.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* QR Scanner Simulation */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-[48px] p-8 flex flex-col items-center justify-center space-y-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none"></div>
          
          <div className="relative">
            <div className="w-64 h-64 border-2 border-dashed border-zinc-700 rounded-3xl flex items-center justify-center group-hover:border-amber-500/50 transition-all">
              <QrCode size={120} className="text-zinc-700 group-hover:text-amber-500 transition-all" />
            </div>
            {/* Scanner line simulation */}
            <div className="absolute top-0 left-0 w-full h-1 bg-amber-500 shadow-lg shadow-amber-500/50 animate-[scan_3s_ease-in-out_infinite] opacity-0 group-hover:opacity-100"></div>
          </div>

          <div className="text-center space-y-2">
            <button className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-8 py-3 rounded-2xl flex items-center gap-3 transition-all">
              <Camera size={20} /> Ativar Câmera
            </button>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Aponte o QR Code do cliente para a câmera</p>
          </div>
        </div>

        {/* Manual List */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-[48px] p-8 space-y-6 shadow-2xl flex flex-col">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Search className="text-amber-500" size={20} /> Busca Manual
            </h2>
            <button className="text-zinc-500 hover:text-white transition-colors">
              <RefreshCw size={18} />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="Nome do cliente..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-white"
            />
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar max-h-[350px]">
            {filtered.map((booking) => (
              <div key={booking.id} className="bg-zinc-800/30 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between group hover:border-amber-500/30 transition-all">
                <div className="flex items-center gap-4">
                  <img src={booking.clientAvatar} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <div className="text-sm font-bold text-zinc-100">{booking.clientName}</div>
                    <div className="text-[10px] text-zinc-500 font-bold uppercase">{booking.time} • {booking.serviceName}</div>
                  </div>
                </div>
                <button 
                  onClick={() => handleCheckIn(booking.id, booking.clientName)}
                  className="p-2.5 bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 rounded-xl transition-all shadow-lg"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-zinc-600 text-sm italic">Nenhum agendamento pendente.</div>
            )}
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-emerald-500 text-zinc-950 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4">
          <CheckCircle2 size={20} />
          Check-in realizado: {showSuccess}
        </div>
      )}

      <style>{`
        @keyframes scan {
          0%, 100% { top: 0%; }
          50% { top: 100%; }
        }
      `}</style>
    </div>
  );
};

export default CheckInTerminal;
