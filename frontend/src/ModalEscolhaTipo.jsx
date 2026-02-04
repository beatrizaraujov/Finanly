import React from "react";

function ModalEscolhaTipo({ fechar, onSelecionar }) {
  return (
    <div
      onClick={fechar}
      className="fixed inset-0 z-50 flex items-end bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full bg-[#020617] rounded-t-[40px] px-10 pt-4 pb-14 border-t border-white/5 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
      >
        <div className="w-10 h-1 bg-white/10 rounded-full mx-auto mb-10" />

        <div className="text-center">
          <h1 className="text-white text-2xl font-bold tracking-tight">
            Personalize seu Registro
          </h1>
          <p className="text-gray-500 text-sm mt-2 leading-relaxed max-w-[260px] mx-auto">
            Selecione o tipo de movimentação para organizar suas finanças.
          </p>
        </div>

        <div className="mt-16 flex flex-col items-center">
          
          <div className="flex gap-4 w-full">
            {/* CORREÇÃO: Enviamos apenas a string "entrada" */}
            <button
              onClick={() => onSelecionar("entrada")} 
              className="flex-1 py-5 rounded-2xl bg-white/[0.02] border border-green-500/15 text-white transition-all active:scale-95 hover:bg-green-500/5 group"
            >
              <div className="flex flex-col items-center">
                <span className="text-green-400 font-bold text-[18px] leading-tight tracking-wide group-hover:text-green-300">
                  Entrada
                </span>
                <span className="text-[9px] text-green-500/40 uppercase font-black tracking-[0.2em] mt-1">
                  Recebido agora
                </span>
              </div>
            </button>

            {/* CORREÇÃO: Enviamos apenas a string "saida" */}
            <button
              onClick={() => onSelecionar("saida")}
              className="flex-1 py-5 rounded-2xl bg-white/[0.02] border border-orange-500/15 text-white transition-all active:scale-95 hover:bg-orange-500/5 group"
            >
              <div className="flex flex-col items-center">
                <span className="text-orange-400 font-bold text-[18px] leading-tight tracking-wide group-hover:text-orange-300">
                  Saída
                </span>
                <span className="text-[9px] text-orange-500/40 uppercase font-black tracking-[0.2em] mt-1">
                  Gasto realizado
                </span>
              </div>
            </button>
          </div>

          <button 
            onClick={fechar}
            className="mt-12 text-gray-600 text-[11px] font-black uppercase tracking-[0.25em] hover:text-white transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalEscolhaTipo;