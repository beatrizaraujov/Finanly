import { House, ArrowRightLeft, CalendarCheck, Plus } from "lucide-react";

function NavBar({ abaAtiva, setAbaAtiva, abrirModalAdicionar }) {
  return (
    <div className="fixed left-1/2 -translate-x-1/2 rounded-full bg-[#020617]/70 backdrop-blur-lg py-3 px-2 bottom-6 w-[95%] max-w-md z-50 border border-white/5 shadow-2xl">
      <div className="flex items-center justify-around w-full">
        
        {/* HOME */}
        <button 
          onClick={() => setAbaAtiva('home')}
          className={abaAtiva === 'home' ? "bg-white px-5 py-2 rounded-full flex items-center gap-2 text-black transition-all duration-300" : "p-2 text-white/50"}
        >
          <House size={20} />
          {abaAtiva === 'home' && <span className="font-bold text-sm">Home</span>}
        </button>

        {/* BOTÃO ADICIONAR */}
        <button 
          onClick={abrirModalAdicionar}
          className="bg-slate-900 border-2 border-indigo-500/50 p-3 rounded-full text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:scale-110 active:scale-95 transition-all duration-300"
        >
          <Plus size={24} strokeWidth={3} />
        </button>

        {/* TRANSAÇÕES - CORRIGIDO */}
        <button 
          onClick={() => setAbaAtiva('transacoes')}
          className={abaAtiva === 'transacoes' ? "bg-white px-5 py-2 rounded-full flex items-center gap-2 text-black transition-all duration-300" : "p-2 text-white/50"}
        >
          <ArrowRightLeft size={20} />
          {abaAtiva === 'transacoes' && <span className="font-bold text-sm">Extrato</span>} 
        </button>

        {/* CALENDÁRIO */}
        <button 
          onClick={() => setAbaAtiva('calendario')}
          className={abaAtiva === 'calendario' ? "bg-white px-5 py-2 rounded-full flex items-center gap-2 text-black transition-all duration-300" : "p-2 text-white/50"}
        >
          <CalendarCheck size={20} />
          {abaAtiva === 'calendario' && <span className="font-bold text-sm">Agenda</span>}
        </button>
        
      </div>
    </div>
  );
};

export default NavBar;