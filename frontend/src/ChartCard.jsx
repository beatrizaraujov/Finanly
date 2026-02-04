import React, { useMemo, useState } from "react";

/**
 * LÓGICA DE PROCESSAMENTO
 * Ajustada para lidar com o fuso horário e garantir que a data do banco 
 * seja lida corretamente no gráfico.
 */
const processarTransacoes = (transacoes) => {
  const base = [
    { dia: "DOM", entrada: 0, saida: 0 },
    { dia: "SEG", entrada: 0, saida: 0 },
    { dia: "TER", entrada: 0, saida: 0 },
    { dia: "QUA", entrada: 0, saida: 0 },
    { dia: "QUI", entrada: 0, saida: 0 },
    { dia: "SEX", entrada: 0, saida: 0 },
    { dia: "SAB", entrada: 0, saida: 0 },
  ];

  let max = 0;

  transacoes.forEach((item) => {
    const dataReferencia =
      item.date || (item.created_at ? item.created_at.split("T")[0] : null);
    if (!dataReferencia) return;

    const [ano, mes, dia] = dataReferencia.split("-").map(Number);
    const dataTransacao = new Date(ano, mes - 1, dia, 12, 0, 0);
    const diaSemana = dataTransacao.getDay();
    const valor = Number(item.amount);

    // Lógica: if (item.type === "entrada") >>> se o tipo de item for igual a entrada...
    if (item.type === "income" || item.type === "entrada") {
      base[diaSemana].entrada += valor;
    } else if (item.type === "expense" || item.type === "saida") {
      base[diaSemana].saida += valor;
    }

    const maiorDoDia = Math.max(
      base[diaSemana].entrada,
      base[diaSemana].saida
    );
    if (maiorDoDia > max) max = maiorDoDia;
  });

  return {
    diasDaSemana: base,
    // Ajuste de escala: teto menor (1.1) faz as barras parecerem mais altas e potentes
    tetoGrafico: (max || 1000) * 1.1,
  };
};

function ChartCard({ transacoes = [] }) {
  const [diaAtivo, setDiaAtivo] = useState(null);

  const { diasDaSemana, tetoGrafico } = useMemo(
    () => processarTransacoes(transacoes),
    [transacoes]
  );

  const hojeIndice = new Date().getDay();

  // ALTURA VISUAL COM MÍNIMO PERCEPTÍVEL
  const alturaVisual = (valor) => {
    if (valor <= 0) return 4;
    const percentual = (valor / tetoGrafico) * 100;
    return Math.max(percentual, 8);
  };

  return (
    // Fundo personalizado: bg-[#0f172a]/20 para maior harmonia com o tema escuro
    <div className="bg-[#0f172a]/20 backdrop-blur-xl rounded-[32px] border border-white/20 p-6 max-w-sm mx-auto shadow-2xl font-sans text-white relative overflow-visible">
      <div className="flex justify-between items-center mb-8 px-2">
        <p className="text-[17px] font-medium tracking-tight opacity-60">
          trends da semana
        </p>
        <div className="flex gap-2">
          {/* Cores das legendas conforme solicitado */}
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <div className="w-2 h-2 rounded-full bg-orange-500" />
        </div>
      </div>

      {/* h-64 restaurado para as linhas terem espaço de crescer */}
      <div className="h-64 flex relative mt-4 overflow-visible">
        <div className="flex-1 flex items-end justify-between h-full relative">
          {diasDaSemana.map((item, index) => {
            const isAtivo = diaAtivo?.dia === item.dia;
            const ehHoje = index === hojeIndice;

            const alturaEntrada = alturaVisual(item.entrada);
            const alturaSaida = alturaVisual(item.saida);
            const topoMaior = Math.max(alturaEntrada, alturaSaida);

            return (
              <div
                key={item.dia}
                onClick={() => setDiaAtivo(isAtivo ? null : item)}
                className="relative flex flex-col items-center flex-1 h-full cursor-pointer"
              >
                {isAtivo && (
                  <div
                    className="absolute z-[999]"
                    style={{ bottom: `calc(${topoMaior}% + 10px)` }}
                  >
                    {/* Tooltip com a cor de fundo que você gostou: #040b11de */}
                    <div className="bg-[#040b11de] border border-white/20 rounded-full px-3 py-1.5 shadow-2xl flex gap-3">
                      <span className="text-green-400 text-[11px] font-black">
                        +{item.entrada.toLocaleString("pt-BR")}
                      </span>
                      <span className="text-orange-400 text-[11px] font-black">
                        -{item.saida.toLocaleString("pt-BR")}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-end gap-[4px] h-full pb-10">
                  {/* Barra de Entrada (Income) */}
                  <div
                    style={{ height: `${alturaEntrada}%` }}
                    className={`w-[8px] rounded-t-full transition-all duration-500 ${
                      ehHoje
                        ? "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                        : "bg-green-500/30"
                    }`}
                  />
                  {/* Barra de Saída (Expense) */}
                  <div
                    style={{ height: `${alturaSaida}%` }}
                    className={`w-[8px] rounded-t-full transition-all duration-500 ${
                      ehHoje
                        ? "bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]"
                        : "bg-orange-500/30"
                    }`}
                  />
                </div>

                <div className="absolute bottom-0 w-full text-center py-2">
                  <span
                    className={`text-[11px] font-black ${
                      ehHoje ? "text-white" : "text-zinc-500"
                    }`}
                  >
                    {item.dia}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ChartCard;