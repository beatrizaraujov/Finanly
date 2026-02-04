import { useState, useMemo } from "react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  getDay, 
  isSameDay, 
  addMonths, 
  subMonths 
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "./supabaseClient";
import DailyAgenda from "./DailyAgenda";
import ModalAgendamento from "./ModalAgendamento";

export default function Calendario({ transacoes = [], aoAtualizar }) {
  const [mesReferencia, setMesReferencia] = useState(new Date());
  const [diaSelecionado, setDiaSelecionado] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- LÓGICA DO CALENDÁRIO ---
  const diasDoMes = useMemo(() => {
    const inicio = startOfMonth(mesReferencia);
    const fim = endOfMonth(mesReferencia);
    return eachDayOfInterval({ start: inicio, end: fim });
  }, [mesReferencia]);

  const diaSemanaInicio = getDay(startOfMonth(mesReferencia));
  const espacosVazios = Array.from({ length: diaSemanaInicio });

  // --- FILTRO INTELIGENTE MILIMÉTRICO ---
  const obterEventosDoDia = (dia) => {
    if (!Array.isArray(transacoes)) return [];
    
    // Transformamos o dia da grade em string "2026-02-04"
    const stringDiaCalendario = format(dia, 'yyyy-MM-dd');

    return transacoes.filter(t => {
      // 1. Extração da data (prioriza coluna 'date', se não houver, limpa o 'created_at')
      const dataBruta = t.date || (t.created_at ? t.created_at.split('T')[0] : "");
      
      const mesmaData = dataBruta === stringDiaCalendario;
      
      // 2. Filtro de Categorias (Lógica atualizada para a categoria 'clientes')
      const cat = t.category ? t.category.toLowerCase() : "";
      
      // O evento aparece na agenda se estiver pendente OU for da categoria clientes
      const ehTrabalho = 
        t.status === 'pendente' || 
        cat === 'clientes' ||
        cat === 'encomenda' || 
        cat === 'entrega';

      return mesmaData && ehTrabalho;
    });
  };

  // --- FUNÇÃO PARA SALVAR (SUPABASE) ---
  const salvarAgendamento = async (novoItem) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Inserimos com status pendente para garantir que apareça na agenda
      const { error } = await supabase
        .from("transactions")
        .insert([{ ...novoItem, user_id: user.id, status: 'pendente' }]);

      if (error) {
        console.error("Erro ao agendar:", error.message);
      } else {
        if (aoAtualizar) await aoAtualizar();
        setIsModalOpen(false);
      }
    }
  };

  const manipularCliqueNoDia = (dia) => {
    if (isSameDay(dia, diaSelecionado)) {
      setIsModalOpen(true);
    } else {
      setDiaSelecionado(dia);
    }
  };

  const diasSemana = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Controles do Mês */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => setMesReferencia(subMonths(mesReferencia, 1))} 
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-zinc-500 hover:text-white transition-colors"
        > 
          ← 
        </button>
        <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-white text-center flex-1"> 
          {format(mesReferencia, "MMMM yyyy", { locale: ptBR })} 
        </h2>
        <button 
          onClick={() => setMesReferencia(addMonths(mesReferencia, 1))} 
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-zinc-500 hover:text-white transition-colors"
        > 
          → 
        </button>
      </div>

      {/* Cabeçalho Dias da Semana */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {diasSemana.map(d => (
          <div key={d} className="text-[10px] font-black text-zinc-600 text-center tracking-widest">
            {d}
          </div>
        ))}
      </div>

      {/* Grade de Dias */}
      <div className="grid grid-cols-7 gap-3 mb-8">
        {espacosVazios.map((_, i) => <div key={`empty-${i}`} className="h-10" />)}

        {diasDoMes.map(dia => {
          const eventos = obterEventosDoDia(dia);
          const selecionado = isSameDay(dia, diaSelecionado);
          const hoje = isSameDay(dia, new Date());
          
          const temEntrada = eventos.some(e => e.type === 'income' || e.type === 'entrada');
          const temSaida = eventos.some(e => e.type === 'expense' || e.type === 'saida');

          return (
            <div 
              key={dia.toString()} 
              onClick={() => manipularCliqueNoDia(dia)}
              className="relative flex flex-col items-center cursor-pointer group"
            >
              <div className={`
                w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-300
                ${selecionado ? 'ring-2 ring-orange-500 ring-offset-2 ring-offset-[#020617] scale-110 z-10' : ''}
                ${hoje ? 'bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]' : 'bg-white/5 text-zinc-400 hover:bg-white/10'}
                ${eventos.length > 0 && !hoje && !selecionado ? 'border border-zinc-700 text-white bg-white/10' : ''}
              `}>
                {format(dia, "d")}
              </div>
              
              {/* Pontinhos de indicação de fluxo */}
              <div className="flex gap-1 mt-1.5 h-1">
                {temEntrada && <div className="w-1 h-1 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />}
                {temSaida && <div className="w-1 h-1 rounded-full bg-orange-500 shadow-[0_0_5px_rgba(249,115,22,0.5)]" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* DailyAgenda - Agora com tarefas filtradas pelo filtro acima */}
      <DailyAgenda 
        dia={diaSelecionado} 
        tarefas={obterEventosDoDia(diaSelecionado)} 
        aoAtualizar={aoAtualizar} 
      />

      {/* Modal de Agendamento */}
      {isModalOpen && (
        <ModalAgendamento 
          dia={diaSelecionado} 
          fechar={() => setIsModalOpen(false)} 
          aoSalvar={salvarAgendamento}
        />
      )}
    </div>
  );
}