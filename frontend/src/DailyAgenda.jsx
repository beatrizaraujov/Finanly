import { CheckCircle2, Circle, Package, TrendingDown } from "lucide-react";
import { supabase } from "./supabaseClient";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function DailyAgenda({ tarefas, dia, aoAtualizar }) {
  
  // FUNÇÃO PROFISSIONAL PARA CONCLUIR
  const concluirTransacao = async (id) => {
    const { error } = await supabase
      .from("transactions")
      .update({ status: "concluido" })
      .eq("id", id);

    if (error) {
      console.error("Erro ao concluir:", error.message);
    } else {
      // Gatilho para o Dashboard recalcular o saldo real instantaneamente
      if (aoAtualizar) aoAtualizar();
    }
  };

  return (
    <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
      
      {/* HEADER COM USO DA VARIÁVEL 'dia' */}
      <div className="flex items-end justify-between border-b border-white/5 pb-6">
        <div className="space-y-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
            Programação do Dia
          </h3>
          <p className="text-xl font-bold text-white capitalize">
            {format(dia, "EEEE, dd 'de' MMMM", { locale: ptBR })}
          </p>
        </div>
        
        <span className="text-[10px] font-black text-white bg-white/5 px-3 py-1 rounded-full border border-white/5 mb-1">
          {tarefas.length} {tarefas.length === 1 ? 'REGISTRO' : 'REGISTROS'}
        </span>
      </div>

      {tarefas.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-white/[0.02] rounded-[32px]">
          <p className="text-sm text-zinc-700 font-medium">Nenhum agendamento para hoje.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tarefas.map((item) => {
            const ehEntrada = item.type === "income" || item.type === "entrada";
            const isConcluido = item.status === "concluido";

            return (
              <div 
                key={item.id}
                className={`flex items-center justify-between p-5 rounded-[28px] border transition-all duration-300 ${
                  isConcluido 
                    ? 'bg-white/[0.01] border-white/[0.02] opacity-40' 
                    : 'bg-white/5 border-white/10 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* ÍCONE DINÂMICO */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    ehEntrada ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'
                  }`}>
                    {ehEntrada ? <Package size={20} /> : <TrendingDown size={20} />}
                  </div>

                  {/* INFO DA TRANSAÇÃO */}
                  <div>
                    <p className={`text-[15px] font-bold tracking-tight ${isConcluido ? 'line-through text-zinc-500' : 'text-white'}`}>
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${ehEntrada ? 'text-green-500/70' : 'text-orange-500/70'}`}>
                        {item.category}
                      </span>
                      <span className="text-[10px] text-zinc-800">•</span>
                      <span className="text-[11px] font-bold text-zinc-400">
                        R$ {Number(item.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* BOTÃO DE CHECK */}
                <button
                  onClick={() => concluirTransacao(item.id)}
                  disabled={isConcluido}
                  className={`p-2 transition-all ${
                    isConcluido 
                      ? 'text-green-500/50 cursor-default' 
                      : 'text-zinc-800 hover:text-white active:scale-90 hover:bg-white/5 rounded-full'
                  }`}
                >
                  {isConcluido ? (
                    <CheckCircle2 size={28} />
                  ) : (
                    <Circle size={28} strokeWidth={1.5} />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}