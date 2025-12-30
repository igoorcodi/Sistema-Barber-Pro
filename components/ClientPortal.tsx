
import React, { useState, useEffect } from 'react';
import { MOCK_SERVICES, MOCK_BARBERS, MOCK_SHOPS, MOCK_CLIENTS } from '../constants';
import { 
  Scissors, 
  Clock, 
  User, 
  CheckCircle2, 
  MapPin, 
  Star, 
  Search, 
  ChevronRight,
  Filter,
  ArrowLeft,
  Loader2,
  Navigation2,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Service, Barber, Barbershop, Booking } from '../types';
import { GoogleGenAI, Type } from "@google/genai";
import LoyaltyMenu from './LoyaltyMenu';

interface ClientPortalProps {
  activeView: string;
  onNewBooking?: (booking: Booking) => void;
}

const ClientPortal: React.FC<ClientPortalProps> = ({ activeView, onNewBooking }) => {
  const [step, setStep] = useState(1);
  const [selectedShop, setSelectedShop] = useState<Barbershop | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [userLocation, setUserLocation] = useState<{ city: string; state: string } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = () => {
    setLocationLoading(true);
    if (!navigator.geolocation) {
      setLocationLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Analise lat: ${latitude}, lng: ${longitude} e retorne JSON com city e state (UF).`,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  city: { type: Type.STRING },
                  state: { type: Type.STRING }
                },
                required: ["city", "state"]
              }
            }
          });
          setUserLocation(JSON.parse(response.text || '{}'));
        } catch (error) {
          setUserLocation({ city: "São Paulo", state: "SP" });
        } finally {
          setLocationLoading(false);
        }
      },
      () => setLocationLoading(false)
    );
  };

  const handleFinishBooking = () => {
    if (selectedService && selectedBarber && selectedDate && selectedTime) {
      const newBooking: Booking = {
        id: Math.random().toString(36).substr(2, 9),
        clientName: 'Gabriel Almeida', // Simulado para o usuário atual
        clientAvatar: 'https://picsum.photos/seed/c1/100',
        barberName: selectedBarber.name,
        barberAvatar: selectedBarber.avatar || '',
        serviceName: selectedService.name,
        price: selectedService.price,
        date: selectedDate,
        time: selectedTime,
        status: 'PENDING'
      };
      onNewBooking?.(newBooking);
      setStep(5);
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
  const reset = () => {
    setStep(1);
    setSelectedShop(null);
    setSelectedService(null);
    setSelectedBarber(null);
    setSelectedDate('');
    setSelectedTime('');
  };

  const filteredShops = MOCK_SHOPS.filter(shop => shop.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (activeView === 'loyalty') return <LoyaltyMenu />;
  if (activeView === 'history') {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <h1 className="text-3xl font-bold">Meus Cortes</h1>
        <div className="space-y-4">
          {MOCK_CLIENTS[0].history.map((h) => (
            <div key={h.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-amber-500">
                  <Scissors size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{h.service}</h3>
                  <p className="text-zinc-500 text-sm">{h.date} • com {h.barberName}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-black text-zinc-100">R$ {h.price.toFixed(2)}</div>
                <span className="text-[10px] font-black text-emerald-500 uppercase">Concluído</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="space-y-2">
              <h2 className="text-3xl font-black uppercase tracking-tighter">Onde quer agendar?</h2>
              {userLocation && <p className="text-amber-500 text-xs font-bold uppercase flex items-center gap-2"><Navigation2 size={12} /> {userLocation.city} - {userLocation.state}</p>}
            </div>
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
              <input type="text" placeholder="Buscar barbearia..." className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredShops.map(shop => (
                <button key={shop.id} onClick={() => { setSelectedShop(shop); nextStep(); }} className="bg-zinc-900 border border-zinc-800 rounded-[32px] overflow-hidden text-left hover:border-amber-500/50 transition-all">
                  <img src={shop.image} className="h-40 w-full object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-1">{shop.name}</h3>
                    <p className="text-zinc-500 text-sm mb-4">{shop.address}</p>
                    <div className="flex items-center gap-2 text-amber-500 text-[10px] font-black uppercase"><Star size={12} fill="currentColor" /> {shop.rating} • Ver Agenda <ChevronRight size={14} /></div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <button onClick={prevStep} className="flex items-center gap-2 text-zinc-500 font-bold uppercase text-[10px]"><ArrowLeft size={16} /> Voltar</button>
            <h2 className="text-2xl font-bold uppercase">Serviços</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_SERVICES.map(s => (
                <button key={s.id} onClick={() => { setSelectedService(s); nextStep(); }} className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl text-left hover:border-amber-500 flex justify-between items-center group">
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-amber-500">{s.name}</h3>
                    <div className="text-amber-500 font-black mt-2">R$ {s.price}</div>
                  </div>
                  <Scissors size={24} className="text-zinc-700" />
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <button onClick={prevStep} className="flex items-center gap-2 text-zinc-500 font-bold uppercase text-[10px]"><ArrowLeft size={16} /> Voltar</button>
            <h2 className="text-2xl font-bold uppercase">Barbeiros</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {MOCK_BARBERS.map(b => (
                <button key={b.id} onClick={() => { setSelectedBarber(b); nextStep(); }} className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl text-center hover:border-amber-500 group">
                  <img src={b.avatar} className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-transparent group-hover:border-amber-500" />
                  <h3 className="font-bold">{b.name}</h3>
                  <div className="text-[10px] text-zinc-500 uppercase mt-2">Master Barber</div>
                </button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <button onClick={prevStep} className="flex items-center gap-2 text-zinc-500 font-bold uppercase text-[10px]"><ArrowLeft size={16} /> Voltar</button>
            <h2 className="text-2xl font-bold uppercase">Data e Hora</h2>
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
              <input type="date" className="w-full bg-zinc-800 border-none rounded-xl p-4 text-white mb-6" onChange={(e) => setSelectedDate(e.target.value)} />
              <div className="grid grid-cols-4 gap-3">
                {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map(t => (
                  <button key={t} onClick={() => { setSelectedTime(t); handleFinishBooking(); }} className="bg-zinc-800 py-3 rounded-xl font-bold text-sm hover:bg-amber-500 hover:text-zinc-950 transition-all">{t}</button>
                ))}
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="text-center space-y-8 animate-in zoom-in-95">
            <CheckCircle2 size={80} className="text-emerald-500 mx-auto" />
            <h2 className="text-4xl font-black uppercase">Agendado!</h2>
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] max-w-sm mx-auto">
              <div className="text-zinc-500 text-xs font-black uppercase mb-1">{selectedService?.name}</div>
              <div className="text-2xl font-black text-amber-500">{selectedDate} às {selectedTime}</div>
              <div className="mt-4 text-zinc-300 font-bold">{selectedBarber?.name}</div>
            </div>
            <button onClick={reset} className="w-full max-w-sm bg-zinc-100 text-zinc-950 font-black py-4 rounded-2xl hover:bg-white transition-all uppercase tracking-widest text-xs">Novo Agendamento</button>
          </div>
        );
      default: return null;
    }
  };

  return <div className="max-w-4xl mx-auto py-8">{renderStep()}</div>;
};

export default ClientPortal;
