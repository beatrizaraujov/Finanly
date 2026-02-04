import React from 'react';
import { PieChart, Pie, ResponsiveContainer, Cell } from 'recharts';

const BudgetCircle = ({ 
  saldo = 0, // Agora interpretado como "Faturamento do Mês"
  piso = 0, 
  proLabore = 0, 
  reserva = 0, 
  acumuladoReserva = 0, 
  acumuladoSalario = 0, 
  aoEditar 
}) => {

  const faturamentoMensal = Math.max(saldo, 0);
  const atingiuPiso = faturamentoMensal >= piso;
  const faltamParaOPiso = Math.max(piso - faturamentoMensal, 0);

  const porcentagemExibida = piso > 0 
    ? Math.round((faturamentoMensal / piso) * 100) 
    : 0;

  const obterStatus = () => {
    if (!atingiuPiso) {
      return { 
        msg: `FALTAM R$ ${faltamParaOPiso.toLocaleString("pt-BR")} PARA O PISO`, 
        cor: "text-orange-400", 
        hex: '#3b82f6' // Mantém o azul Finanly enquanto progride
      };
    }
    return { msg: "VOCÊ ATINGIU O PISO MENSAL", cor: "text-green-500", hex: '#10b981' };
  };

  const status = obterStatus();

  const dados = [
    { 
      value: faturamentoMensal > 0 ? faturamentoMensal : 0.1, 
      color: status.hex 
    },
    { 
      value: atingiuPiso ? 0 : faltamParaOPiso, 
      color: 'rgba(255, 255, 255, 0.05)' 
    },
  ];

  const progressoProLabore = proLabore > 0 ? Math.min((acumuladoSalario / proLabore) * 100, 100) : 0;
  const progressoReserva = reserva > 0 ? Math.min((acumuladoReserva / reserva) * 100, 100) : 0;

  const proLaboreAtingido = acumuladoSalario >= proLabore;
  const reservaAtingida = acumuladoReserva >= reserva;

  return (
    <div className="bg-white/[0.03] backdrop-blur-xl p-6 rounded-[32px] w-full max-w-[380px] border border-white/10 shadow-2xl relative overflow-hidden">
      
      {/* CABEÇALHO */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-white font-medium text-lg tracking-tight">Orçamento mensal</h3>
        <button 
          onClick={aoEditar}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-blue-500/10 transition-all border border-white/10 active:scale-90"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
      </div>

      <p className={`text-[10px] font-black uppercase tracking-[0.1em] mb-6 ${status.cor}`}>
        {status.msg}
      </p>

      {/* GRÁFICO DE PERFORMANCE */}
      <div className="flex items-center gap-6 mb-2">
        <div className="w-40 h-40 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dados}
                innerRadius={58}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
                cornerRadius={12}
                startAngle={90}
                endAngle={450}
              >
                {dados.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-2">
            <span className="text-xl font-black text-white leading-none">
              R$ {faturamentoMensal.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
            </span>
            <span className="text-[8px] text-gray-400 font-bold uppercase mt-1 tracking-tighter">
              Recebido no mês
            </span>
          </div>
        </div>

        {/* INFO LATERAL */}
        <div className="flex flex-col gap-5">
          <div>
            <span className="text-white font-bold text-base">
              R$ {piso.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
            </span>
            <p className="text-gray-400 text-[10px] uppercase font-bold">Piso Mensal</p>
          </div>

          <div>
            <span className="text-white font-bold text-base">
              {porcentagemExibida}% {atingiuPiso ? 'concluído' : 'conquistado'}
            </span>
            <p className="text-gray-400 text-[10px] uppercase font-bold">
              Do objetivo
            </p>
          </div>
        </div>
      </div>

      {/* RODAPÉ - METAS ESPECÍFICAS */}
      <div className="mt-6 pt-5 border-t border-white/10 flex flex-col gap-5">
        {/* PRÓ-LABORE */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-gray-400 text-[10px] uppercase font-black tracking-widest">Meta Pró-labore</span>
              <p className={`text-[9px] font-bold ${proLaboreAtingido ? 'text-green-400' : 'text-orange-400'}`}>
                {proLaboreAtingido
                  ? "✓ OBJETIVO CONCLUÍDO NESTE MÊS"
                  : `FALTAM R$ ${(proLabore - acumuladoSalario).toLocaleString("pt-BR")}`}
              </p>
            </div>
            <span className={`text-sm font-bold ${proLaboreAtingido ? 'text-white/40' : 'text-white'}`}>
              R$ {proLabore.toLocaleString("pt-BR")}
            </span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ${proLaboreAtingido ? 'bg-green-500' : 'bg-blue-600'}`}
              style={{ width: `${progressoProLabore}%` }}
            />
          </div>
        </div>

        {/* RESERVA */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-gray-400 text-[10px] uppercase font-black tracking-widest">Reserva Emergência</span>
              <p className={`text-[9px] font-bold ${reservaAtingida ? 'text-green-400' : 'text-blue-400'}`}>
                {reservaAtingida
                  ? "✓ OBJETIVO CONCLUÍDO NESTE MÊS"
                  : `${Math.round(progressoReserva)}% DA META`}
              </p>
            </div>
            <span className={`text-sm font-bold ${reservaAtingida ? 'text-blue-400/40' : 'text-blue-400'}`}>
              R$ {reserva.toLocaleString("pt-BR")}
            </span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ${reservaAtingida ? 'bg-green-500' : 'bg-blue-600'}`}
              style={{ width: `${progressoReserva}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetCircle;