import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function ModalFormularioTransacao({ tipo, voltar, fechar }) {
  const [valor, setValor] = useState(""); 
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [carregando, setCarregando] = useState(false);

  const formatarMoeda = (v) => {
    v = v.replace(/\D/g, ""); 
    v = (v / 100).toFixed(2) + ""; 
    v = v.replace(".", ","); 
    v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1."); 
    return v;
  };

  const handleChangeValor = (e) => {
    const valorDigitado = e.target.value;
    setValor(formatarMoeda(valorDigitado));
  };

  const categoriasEntrada = [
    { id: "clientes", label: "Cliente", icon: "👤" },
    { id: "reserva", label: "Reserva", icon: "🛡️" },
    { id: "outros", label: "Outros", icon: "✨" },
  ];

  const categoriasSaida = [
    { id: "pro-labore", label: "Pró-labore", icon: "💰" }, // Agora como SAÍDA
    { id: "saude", label: "Saúde", icon: "🏥" },
    { id: "lazer", label: "Lazer", icon: "👜" },
    { id: "mercado", label: "Mercado", icon: "🛒" },
    { id: "reserva", label: "Reserva", icon: "🛡️" },
    { id: "outros", label: "Outros", icon: "✨" },
  ];

  const listaCategorias = tipo === "entrada" ? categoriasEntrada : categoriasSaida;

  async function salvarTransacao() {
    if (!valor || valor === "0,00" || !descricao || !categoria) return;
    setCarregando(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const valorNumerico = parseFloat(
        valor.replace(/\./g, "").replace(",", ".")
      );

      const statusInicial = "concluido"; 

      const hoje = new Date();
      const dataLocal = hoje.getFullYear() + '-' + 
                        String(hoje.getMonth() + 1).padStart(2, '0') + '-' + 
                        String(hoje.getDate()).padStart(2, '0');

      const { error } = await supabase.from("transactions").insert([
        {
          description: descricao,
          amount: valorNumerico,
          type: tipo === "entrada" ? "income" : "expense",
          category: categoria,
          user_id: user.id,
          status: statusInicial,
          date: dataLocal,
        },
      ]);

      if (!error) {
        fechar();
      } else {
        console.error(error);
        setCarregando(false);
      }
    } catch (err) {
      console.error("Erro inesperado:", err);
      setCarregando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#020617] rounded-t-[40px] p-8 pb-10 animate-in slide-in-from-bottom duration-300 border-t border-zinc-900">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <button
            onClick={voltar}
            className="text-zinc-500 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
          >
            <span className="text-lg">−</span> VOLTAR
          </button>

          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full animate-pulse ${
                tipo === "entrada" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]"
              }`}
            ></span>
            <h2 className="text-white font-black text-[10px] uppercase tracking-[0.2em]">
              NOVA {tipo === "entrada" ? "ENTRADA" : "SAÍDA"}
            </h2>
          </div>
        </div>

        <div className="space-y-10">
          {/* Valor */}
          <div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">
              QUANTO?
            </p>
            <div className="flex items-baseline gap-2 border-b border-zinc-900 pb-4">
              <span className="text-zinc-500 font-bold text-xl">R$</span>
              <input
                autoFocus
                type="text"
                inputMode="numeric"
                placeholder="0,00"
                value={valor}
                onChange={handleChangeValor}
                className="bg-transparent w-full text-5xl font-bold text-white outline-none placeholder:text-zinc-900"
              />
            </div>
          </div>

          {/* Categorias */}
          <div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">
              CATEGORIA
            </p>
            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
              {listaCategorias.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoria(cat.id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-full whitespace-nowrap transition-all border ${
                    categoria === cat.id
                      ? "bg-white border-white text-black"
                      : "bg-[#0b0e1a] border-zinc-900 text-zinc-400"
                  }`}
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span className="font-bold text-[11px] uppercase tracking-widest">
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Descrição */}
          <div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">
              DESCRIÇÃO
            </p>
            <input
              type="text"
              placeholder={
                tipo === "entrada"
                  ? "O que você recebeu?"
                  : "No que você gastou?"
              }
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="bg-transparent w-full text-lg font-medium text-white border-b border-zinc-900 pb-4 outline-none placeholder:text-zinc-900"
            />
          </div>

          <button
            onClick={salvarTransacao}
            disabled={carregando}
            className={`w-full py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.4em] transition-all active:scale-95 ${
              tipo === "entrada"
                ? "bg-green-500 text-white shadow-[0_20px_40px_rgba(34,197,94,0.2)]"
                : "bg-orange-600 text-white shadow-[0_20px_40px_rgba(234,88,12,0.2)]"
            }`}
          >
            {carregando
              ? "PROCESSANDO..."
              : `ADICIONAR ${
                  tipo === "entrada" ? "RECEBIDO" : "GASTO"
                }`}
          </button>
        </div>
      </div>
    </div>
  );
}