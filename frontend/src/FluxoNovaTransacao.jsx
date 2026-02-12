import { useState } from "react";
import ModalEscolhaTipo from "./ModalEscolhaTipo";
import ModalFormularioTransacao from "./ModalFormularioTransacao";

export default function FluxoNovaTransacao({ fechar }) {
 
  const [tipo, setTipo] = useState(null);

  const lidarComSelecao = (tipoEscolhido) => {
   
    setTipo(tipoEscolhido);
  };

  return (
    <>
     
      {!tipo && (
        <ModalEscolhaTipo
          fechar={fechar}
          onSelecionar={lidarComSelecao}
        />
      )}

      
      {tipo && (
        <ModalFormularioTransacao
          tipo={tipo} 
          voltar={() => setTipo(null)}
          fechar={fechar}
        />
      )}
    </>
  );
}
