import { useState } from "react";
import ModalEscolhaTipo from "./ModalEscolhaTipo";
import ModalFormularioTransacao from "./ModalFormularioTransacao";

export default function FluxoNovaTransacao({ fechar }) {
  // Começa como null para forçar a escolha na primeira tela
  const [tipo, setTipo] = useState(null);

  const lidarComSelecao = (tipoEscolhido) => {
    // Garante que o tipo seja passado exatamente como o formulário espera
    setTipo(tipoEscolhido);
  };

  return (
    <>
      {/* 1. Tela de Escolha: O usuário decide entre Entrada ou Saída */}
      {!tipo && (
        <ModalEscolhaTipo
          fechar={fechar}
          onSelecionar={lidarComSelecao}
        />
      )}

      {/* 2. Formulário: Onde o salvamento acontece de fato */}
      {tipo && (
        <ModalFormularioTransacao
          tipo={tipo} // Aqui a lógica: tipo === "entrada" -> Verde | "saida" -> Laranja
          voltar={() => setTipo(null)}
          fechar={fechar}
        />
      )}
    </>
  );
}