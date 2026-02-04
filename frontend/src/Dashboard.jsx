import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "./supabaseClient";
import ChartCard from "./ChartCard";
import TransactionList from "./TransactionList";
import NavBar from "./NavBar";
import FluxoNovaTransacao from "./FluxoNovaTransacao";
import Onboarding from "./Onboarding"; 
import BudgetCircle from "./BudgetCircle"; 
import Calendario from "./Calendario";

function Dashboard() {
  const [abaAtiva, setAbaAtiva] = useState("home");
  const [saldo, setSaldo] = useState(0); 
  const [entradas, setEntradas] = useState(0); 
  const [saidas, setSaidas] = useState(0); 
  const [nome, setNome] = useState("");
  const [listaTransacoes, setListaTransacoes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [metas, setMetas] = useState(null);
  const [mostrarOnboarding, setMostrarOnboarding] = useState(false);
  const [carregandoMetas, setCarregandoMetas] = useState(true);
  const [dadosProcessados, setDadosProcessados] = useState({ 
    reservaAcumulada: 0, 
    salarioAcumulado: 0 
  });

  // Transações para o gráfico e lista
  const transacoesConcluidas = useMemo(() => 
    listaTransacoes.filter(t => t.status === "concluido"), [listaTransacoes]
  );

  const buscarMetas = useCallback(async (userId) => {
    try {
      const { data } = await supabase.from('user_goals').select('*').eq('id', userId).single();
      if (data) {
        setMetas(data);
        setMostrarOnboarding(data.onboarding_completed !== true);
      } else {
        setMostrarOnboarding(true);
      }
    } finally {
      setCarregandoMetas(false);
    }
  }, []);

  const buscarDados = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const nomeBruto = user.user_metadata?.full_name || user.email.split("@")[0];
      setNome(nomeBruto.charAt(0).toUpperCase() + nomeBruto.slice(1));
      buscarMetas(user.id);

      const { data: transacoes, error } = await supabase
        .from("transactions") 
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }); 

      if (error) throw error;
      if (!transacoes) return;

      const agora = new Date();
      const mesAtual = agora.getMonth();
      const anoAtual = agora.getFullYear();

      let [sSaldo, sEntMes, sSaiMes, acRes, acSal] = [0, 0, 0, 0, 0];

      transacoes.forEach((item) => {
        const valor = Number(item.amount) || 0;
        const status = item.status;
        const cat = item.category?.toLowerCase().trim() || "";
        const ehEntrada = item.type === "income" || item.type === "entrada";
        
        const dtStr = item.date || item.created_at?.split('T')[0];
        const dt = new Date(dtStr + 'T12:00:00');
        const ehDesteMes = dt.getMonth() === mesAtual && dt.getFullYear() === anoAtual;

        // Lógica de Saldo (if (item.status !== "pendente")...)
        if (status !== "pendente") {
          // Saldo Geral (Exceto categoria reserva)
          if (cat !== "reserva") {
            sSaldo += ehEntrada ? valor : -valor;
          }

          // Lógica do Mês Atual
          if (ehDesteMes) {
            if (ehEntrada) {
              sEntMes += valor;
              if (cat === "reserva") acRes += valor;
              if (cat === "salario" || cat === "pro-labore" || cat === "prolabore") acSal += valor;
            } else {
              sSaiMes += valor;
              // No mobile, você soma as saídas nas metas para abater do progresso
              if (cat === "reserva") acRes += valor;
              if (cat === "salario" || cat === "pro-labore" || cat === "prolabore") acSal += valor;
            }
          }
        }
      });

      setSaldo(sSaldo);
      setEntradas(sEntMes);
      setSaidas(sSaiMes);
      setListaTransacoes(transacoes);
      setDadosProcessados({ reservaAcumulada: acRes, salarioAcumulado: acSal });
    } catch (err) { console.error("Erro busca:", err); }
  }, [buscarMetas]);

  useEffect(() => { buscarDados(); }, [buscarDados]);

  const salvarNome = async () => {
    if (novoNome.trim() === "") { setIsEditing(false); return; }
    const { error } = await supabase.auth.updateUser({ data: { full_name: novoNome } });
    if (!error) setNome(novoNome);
    setIsEditing(false);
  };

  const porcentagemLucro = entradas > 0 ? ((entradas - saidas) / entradas) * 100 : 0;

  if (carregandoMetas) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center flex-col gap-4 text-gray-500 text-xs">
      <div className="w-10 h-10 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
      Sincronizando...
    </div>
  );

  return (
    <div className="pt-6 px-6 text-white min-h-screen bg-[#020617] relative overflow-hidden font-sans">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-500/15 blur-[120px] rounded-full pointer-events-none" />
      
      {/* HEADER MOBILE */}
      <div className="flex items-start gap-3 mb-10 relative z-10">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shrink-0">
          <span className="text-lg font-bold uppercase">{nome?.charAt(0)}</span>
        </div>
        <div className="text-white font-medium pt-0.5">
          {isEditing ? (
            <input autoFocus value={novoNome} onChange={(e) => setNovoNome(e.target.value)} onBlur={salvarNome} onKeyDown={(e) => e.key === "Enter" && salvarNome()} className="bg-transparent border-b border-orange-500 outline-none text-lg font-semibold w-full max-w-[150px] text-white" />
          ) : (
            <p className="text-lg font-semibold cursor-pointer" onClick={() => { setIsEditing(true); setNovoNome(nome); }}>Olá, {nome}</p>
          )}
          <p className="text-[13px] text-gray-500 mt-1">Profile {">"}</p>
        </div>
      </div>

      {abaAtiva === "home" && (
        <div className="animate-in fade-in duration-500">
          <div className="text-center mt-6">
            <p className="text-xs text-gray-400 tracking-widest uppercase font-bold">SALDO DISPONÍVEL</p>
            <h1 className="text-4xl font-bold mt-1 tracking-tight">R$ {saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</h1>
            <div className={`text-[10px] rounded-full w-fit mx-auto px-3 py-1 mb-6 mt-2 font-bold ${saldo >= 0 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
              {porcentagemLucro.toFixed(2)}% de margem no mês
            </div>
          </div>
          
          {/* CARDS ENTRELAÇADOS (MOBILE STYLE) */}
          <div className="flex justify-center items-center w-full max-w-sm mx-auto mb-8 relative">
            <div className="bg-white/5 backdrop-blur-md rounded-full h-[63px] pl-6 pr-10 flex-1 border border-white/5 flex flex-col justify-center items-center relative z-0 -mr-8">
              <div className="flex items-center gap-1">
                <span className="text-green-500 text-[10px] font-black">↑</span>
                <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest">Entrada</p>
              </div>
              <span className="text-lg font-bold">R$ {entradas.toLocaleString("pt-BR")}</span>
            </div>
            <div className="bg-[#1e1e1e] w-14 h-14 rounded-full z-10 border-[4px] border-[#020617] shrink-0 flex items-center justify-center shadow-2xl">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-full h-[63px] pr-6 pl-10 flex-1 border border-white/5 flex flex-col justify-center items-center relative z-0 -ml-8">
              <div className="flex items-center gap-1">
                <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest">Saídas</p>
                <span className="text-orange-500 text-[10px] font-black">↓</span>
              </div>
              <span className="text-lg font-bold">R$ {saidas.toLocaleString("pt-BR")}</span>
            </div>
          </div>

          <ChartCard transacoes={transacoesConcluidas} />
          
          <div className="pb-32 mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Histórico Recente</h2>
              <button onClick={() => setAbaAtiva("transacoes")} className="text-orange-500 text-xs font-black uppercase">Ver Tudo</button>
            </div>
            <TransactionList transacoes={transacoesConcluidas.slice(0, 3)} />
          </div>
        </div>
      )}

      {abaAtiva === "transacoes" && (
        <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
          {mostrarOnboarding ? (
            <Onboarding metasAtuais={metas} fechar={() => { setMostrarOnboarding(false); buscarDados(); }} />
          ) : (
            <div className="space-y-10">
              <div className="flex justify-center">
                <BudgetCircle 
                  saldo={entradas} piso={metas?.piso_operacional || 0} proLabore={metas?.pro_labore || 0} reserva={metas?.reserva_emergencia || 0}
                  acumuladoReserva={dadosProcessados.reservaAcumulada} acumuladoSalario={dadosProcessados.salarioAcumulado}
                  aoEditar={() => setMostrarOnboarding(true)}
                />
              </div>
              <TransactionList transacoes={transacoesConcluidas} />
            </div>
          )}
        </div>
      )}

      {abaAtiva === "calendario" && (
        <div className="mt-10 animate-in fade-in duration-500 pb-32">
          <Calendario transacoes={listaTransacoes} aoAtualizar={buscarDados} />
        </div>
      )}

      <NavBar 
        abaAtiva={abaAtiva} 
        setAbaAtiva={(aba) => { setAbaAtiva(aba); setMostrarOnboarding(aba === "transacoes" && metas?.onboarding_completed !== true); }} 
        abrirModalAdicionar={() => setIsModalOpen(true)} 
        abrirAjustes={() => { setAbaAtiva("transacoes"); setMostrarOnboarding(true); }} 
      />

      {isModalOpen && <FluxoNovaTransacao fechar={() => { setIsModalOpen(false); buscarDados(); }} />}
    </div>
  );
}

export default Dashboard;