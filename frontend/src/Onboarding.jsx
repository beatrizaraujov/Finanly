import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

function formatarMoeda(valor) {
  if (valor === undefined || valor === null || valor === "") return "";
  const stringValor = typeof valor === "number" 
    ? Math.round(valor * 100).toString() 
    : valor.replace(/\D/g, "");
    
  const numero = Number(stringValor) / 100;
  return numero.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function removerFormatacao(valor) {
  return valor.replace(/\D/g, "").replace(/^0+/, "");
}

function Onboarding({ fechar, metasAtuais }) {
  const [passo, setPasso] = useState(1);
  const [valorInput, setValorInput] = useState("");
  const [carregando, setCarregando] = useState(false); 
  
  const [configuracaoFinal, setConfiguracaoFinal] = useState({
    piso: metasAtuais?.piso_operacional || 0,
    proLabore: metasAtuais?.pro_labore || 0,
    reserva: metasAtuais?.reserva_emergencia || 0
  });

  useEffect(() => {
    const ids = { 1: "piso", 2: "proLabore", 3: "reserva" };
    const valorExistente = configuracaoFinal[ids[passo]];
    if (valorExistente > 0) {
      setValorInput(formatarMoeda(valorExistente));
    } else {
      setValorInput("");
    }
  }, [passo]);

  const conteudos = {
    1: { 
      id: "piso", 
      titulo: "Qual seu Piso Operacional?", 
      descricao: "Este é o primeiro marco do seu gráfico. É o valor necessário para cobrir todos os custos do seu negócio.", 
      ajuda: "Sem bater esse valor, seu círculo central permanece em fase de conquista.", 
      microcopy: "Defina sua base de segurança mensal." 
    },
    2: { 
      id: "proLabore", 
      titulo: "Sua Meta de Pró-labore", 
      descricao: "Quanto você quer retirar para você? Esse valor será carimbado e protegido pelo sistema.", 
      ajuda: "O Pró-labore é separado do seu 'Livre para Gastar' para proteger seu bolso pessoal.", 
      microcopy: "Referência para retiradas mensais." 
    },
    3: { 
      id: "reserva", 
      titulo: "Reserva de Emergência", 
      descricao: "Qual sua meta de proteção mensal? Uma reserva para imprevistos e meses de baixo movimento.", 
      ajuda: "O progresso desta meta aparecerá na barra inferior do seu painel de controle.", 
      microcopy: "Sua liberdade financeira começa aqui." 
    }
  };

  // AJUSTE: Validação para impedir R$ 0,00 nos passos essenciais
  const valorNumericoAtual = valorInput ? Number(removerFormatacao(valorInput)) / 100 : 0;
  const podeProsseguir = passo === 3 ? true : valorNumericoAtual > 0;

  const proximoPasso = async () => {
    if (!podeProsseguir) return;

    const campoAtual = conteudos[passo].id;
    const novosDados = { ...configuracaoFinal, [campoAtual]: valorNumericoAtual };
    
    setConfiguracaoFinal(novosDados);

    if (passo < 3) {
      setPasso(passo + 1);
    } else {
      setCarregando(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { error } = await supabase
            .from('user_goals')
            .upsert({ 
              id: user.id, 
              piso_operacional: novosDados.piso,
              pro_labore: novosDados.proLabore,
              reserva_emergencia: novosDados.reserva,
              onboarding_completed: true,
              updated_at: new Date()
            });

          if (error) throw error;
          fechar(); 
        }
      } catch (error) {
        console.error("Erro ao salvar metas:", error.message);
        fechar(); 
      } finally {
        setCarregando(false);
      }
    }
  };

  const handleChange = (e) => {
    const valorDigitado = removerFormatacao(e.target.value);
    setValorInput(formatarMoeda(valorDigitado));
  };

  const voltarPasso = () => {
    if (passo > 1) {
      setPasso(passo - 1);
    } else {
      fechar();
    }
  };

  return (
    <div className="fixed inset-0 bg-[#020617] flex flex-col justify-between p-8 z-[60] animate-in fade-in duration-500">
      
      {/* Barra de progresso */}
      <div className="w-full h-1 bg-white/10 rounded-full mt-4">
        <div
          className="h-full bg-orange-500 rounded-full shadow-[0_0_12px_rgba(249,115,22,0.5)] transition-all duration-500"
          style={{ width: `${(passo / 3) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col justify-center gap-10">
        <div className="animate-in slide-in-from-left-4 duration-500">
          <h1 className="text-2xl font-bold text-white mb-3 tracking-tight">
            {conteudos[passo].titulo}
          </h1>
          <p className="text-gray-400 text-base leading-relaxed">
            {conteudos[passo].descricao}
          </p>
        </div>

        {/* Input - Borda LARANJA ao focar */}
        <div className={`flex items-end gap-3 border-b-2 transition-all duration-300 pb-3 ${
          valorNumericoAtual === 0 && passo < 3 ? "border-white/5" : "border-white/10 focus-within:border-orange-500"
        }`}>
          <span className={`text-xl font-medium transition-colors ${valorInput ? "text-white" : "text-gray-500"}`}>
            R$
          </span>
          <input
            type="text"
            inputMode="numeric"
            autoFocus
            key={`input-passo-${passo}`}
            value={valorInput}
            onChange={handleChange}
            placeholder="0,00"
            className="bg-transparent outline-none w-full text-4xl font-bold text-white placeholder-gray-700"
          />
        </div>

        <p className="text-sm text-gray-500 italic">
          {conteudos[passo].microcopy}
        </p>

        <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
          <p className="text-sm text-gray-400 leading-snug">
            <span className="mr-2">💡</span>
            {conteudos[passo].ajuda}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <button
          onClick={proximoPasso}
          disabled={carregando || !podeProsseguir}
          className={`w-full py-4 rounded-xl font-bold text-lg active:scale-95 transition-all disabled:opacity-30 disabled:grayscale-[0.5] ${
            passo === 3 ? "bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)]" : "bg-white text-[#020617]"
          }`}
        >
          {carregando ? "Salvando..." : (passo === 3 ? "Começar minha jornada" : "Próximo")}
        </button>

        <button
          onClick={voltarPasso}
          className="text-gray-500 text-sm hover:text-white transition-colors py-2"
        >
          {passo === 1 ? "Configurar depois" : "Voltar"}
        </button>
      </div>
    </div>
  );
}

export default Onboarding;