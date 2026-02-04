import { useState } from "react";
import { X, Calendar, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ModalAgendamento({ dia, fechar, aoSalvar }) {
  const [titulo, setTitulo] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("entrada");
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!valor || !titulo) return;
    
    setCarregando(true);

    // Ajuste milimétrico para o formato do banco (YYYY-MM-DD)
    const dataFormatada = format(dia, 'yyyy-MM-dd');

    // LÓGICA MILIMÉTRICA:
    // 1. Se o tipo for entrada, a categoria DEVE ser 'clientes' (para o extrato entender).
    // 2. Se o tipo for saída, mantemos uma categoria padrão que seu extrato reconheça (ex: 'outros' ou 'saude').
    const categoriaDefinida = tipo === "entrada" ? "clientes" : "outros";

    const novaEncomenda = {
      description: titulo,
      amount: parseFloat(valor),
      type: tipo === "entrada" ? "income" : "expense",
      date: dataFormatada,
      category: categoriaDefinida, // Agora salva como 'clientes' em vez de 'encomenda'
      status: "pendente" 
    };

    await aoSalvar(novaEncomenda);
    setCarregando(false);
    fechar();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-[#020617]/95 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-[#020617] rounded-t-[40px] sm:rounded-[40px] p-8 pb-12 sm:p-10 border-t sm:border border-white/5 shadow-2xl animate-in slide-in-from-bottom duration-300">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-12">
          <button 
            onClick={fechar} 
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group"
          >
            <div className="w-1 h-[2px] bg-zinc-500 group-hover:bg-white mr-1" /> 
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Voltar</span>
          </button>

          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${tipo === 'entrada' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]'}`} />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
              {tipo === 'entrada' ? 'Nova Encomenda' : 'Novo Gasto'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* TIPO DE REGISTRO */}
          <div className="space-y-4">
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Tipo de registro</p>
            <div className="flex gap-3">
              <button 
                type="button"
                onClick={() => setTipo("entrada")}
                className={`px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all border ${tipo === 'entrada' ? 'bg-white/10 border-white/20 text-white shadow-lg' : 'bg-transparent border-white/5 text-zinc-700'}`}
              >
                Encomenda
              </button>
              <button 
                type="button"
                onClick={() => setTipo("saida")}
                className={`px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all border ${tipo === 'saida' ? 'bg-white/10 border-white/20 text-white shadow-lg' : 'bg-transparent border-white/5 text-zinc-700'}`}
              >
                Gasto Futuro
              </button>
            </div>
          </div>

          {/* VALOR */}
          <div className="space-y-2">
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Quanto?</p>
            <div className="flex items-center gap-3 border-b border-white/5 pb-4 focus-within:border-white/20 transition-all">
              <span className="text-2xl font-bold text-zinc-700">R$</span>
              <input 
                required
                autoFocus
                type="number"
                step="0.01"
                placeholder="0,00"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="bg-transparent text-6xl font-bold outline-none text-white w-full placeholder:text-white/5 tracking-tighter"
              />
            </div>
          </div>

          {/* DESCRIÇÃO */}
          <div className="space-y-2">
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Descrição</p>
            <input 
              required
              placeholder="Ex: 50 Doces Finos"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full bg-transparent border-b border-white/5 pb-4 outline-none text-lg text-white placeholder:text-zinc-800 focus:border-white/20 transition-all"
            />
          </div>

          {/* DATA INFO */}
          <div className="flex items-center gap-3 text-zinc-600 py-2">
            <Calendar size={16} />
            <span className="text-[11px] font-bold uppercase tracking-widest">
              Para: {format(dia, "dd 'de' MMMM", { locale: ptBR })}
            </span>
          </div>

          {/* BOTÃO PRINCIPAL */}
          <button 
            type="submit"
            disabled={carregando}
            className={`w-full py-6 rounded-[28px] font-black uppercase tracking-[0.3em] text-[11px] transition-all active:scale-95 shadow-2xl ${tipo === 'entrada' ? 'bg-green-500 text-[#020617] shadow-green-500/20' : 'bg-orange-500 text-white shadow-orange-500/20'}`}
          >
            {carregando ? "Processando..." : tipo === 'entrada' ? "Agendar Encomenda" : "Agendar Gasto"}
          </button>

        </form>
      </div>
    </div>
  );
}