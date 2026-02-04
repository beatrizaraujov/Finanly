import React, { useMemo } from "react";

const categoryMap = {
  clientes: {
    label: "Cliente",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    ),
    color: "text-purple-400",
  },
  reserva: {
    label: "Reserva",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
    ),
    color: "text-indigo-400",
  },
  saude: {
    label: "Saúde",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hospital"><path d="M12 7v4" /><path d="M14 21v-3a2 2 0 0 0-4 0v3" /><path d="M14 9h-4" /><path d="M18 11h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2" /><path d="M18 21V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16" /></svg>
    ),
    color: "text-red-500",
  },
  // AJUSTE MILIMÉTRICO: Alterado de 'salario' para 'pro-labore' para bater com o banco [cite: 2026-01-13]
  "pro-labore": {
    label: "Pró-labore",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
    ),
    color: "text-green-500",
  },
  // Mantido para compatibilidade com registros antigos
  salario: {
    label: "Salário",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
    ),
    color: "text-green-500",
  },
  lazer: {
    label: "Lazer",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-bag"><path d="M16 10a4 4 0 0 1-8 0" /><path d="M3.103 6.034h17.794" /><path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z" /></svg>
    ),
    color: "text-yellow-500",
  },
  mercado: {
    label: "Mercado",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-store"><path d="M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5" /><path d="M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244" /><path d="M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05" /></svg>
    ),
    color: "text-blue-500",
  },
  outros: {
    label: "Outros",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-ellipsis"><circle cx="12" cy="12" r="10" /><path d="M17 12h.01" /><path d="M12 12h.01" /><path d="M7 12h.01" /></svg>
    ),
    color: "text-zinc-400",
  },
};

function TransactionList({ transacoes }) {
  const transacoesOrdenadas = useMemo(() => {
    if (!transacoes || !Array.isArray(transacoes)) return [];
    
    return [...transacoes].sort((a, b) => {
      const dataA = a.date || (a.created_at ? a.created_at.split("T")[0] : "");
      const dataB = b.date || (b.created_at ? b.created_at.split("T")[0] : "");
      
      if (dataA === dataB) {
        const tempoA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const tempoB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return tempoB - tempoA;
      }
      
      return dataB.localeCompare(dataA);
    });
  }, [transacoes]);

  if (transacoesOrdenadas.length === 0) {
    return (
      <div className="flex flex-col items-center pt-40 pb-2 text-center animate-in fade-in duration-700">
        <p className="text-zinc-500 text-sm font-medium tracking-tight max-w-[200px] leading-relaxed">
          Sua jornada começa aqui. <br />
          Que tal registrar algo?
        </p>
        <div className="mt-6 animate-bounce text-orange-500/30">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M19 12l-7 7-7-7"/>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto text-white font-sans">
      <div className="flex flex-col gap-6">
        {transacoesOrdenadas.map((item, index) => {
          // Lógica: if (item.type === "entrada") >>> se o tipo de item for igual a entrada... [cite: 2026-01-13]
          const ehEntrada = item.type === "income" || item.type === "entrada";
          const config = categoryMap[item.category] || categoryMap.outros;
          const ehPendente = item.status === "pendente";
          
          const labelDinamica = (item.category === "clientes" && ehPendente) ? "ENCOMENDA" : config.label;

          return (
            <div 
              key={item.id || index} 
              className="flex items-center px-2 animate-in fade-in slide-in-from-top-4 duration-500"
            >
              <div className={`p-3.5 rounded-[20px] bg-zinc-900/80 border border-white/[0.03] ${config.color}`}>
                {config.icon}
              </div>

              <div className="flex-1 ml-4 text-left">
                <p className={`text-[10px] font-black uppercase tracking-[0.15em] mb-0.5 ${
                  ehPendente ? "text-orange-500" : "text-zinc-500"
                }`}>
                  {labelDinamica}
                </p>
                <p className="font-bold text-[15px] text-zinc-100 tracking-tight leading-tight">
                  {item.description || "Sem descrição"}
                </p>
              </div>

              <div className={`text-right font-black text-[15px] tracking-tight ${ehEntrada ? "text-green-500" : "text-white"}`}>
                <span className="text-[12px] opacity-40 mr-1 font-medium">
                  {ehEntrada ? "+" : "-"}
                </span>
                R${" "}
                {(Number(item.amount) || 0).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TransactionList;