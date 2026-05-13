Finanly — Gestão Financeira & Controle de Encomendas
O Finanly é uma aplicação focada em reduzir a carga cognitiva do usuário através de uma interface minimalista e uma arquitetura robusta. O projeto une o controle financeiro pessoal à gestão logística de pedidos, tratando cada interação como parte de um fluxo real de produto.

🎬 Demonstração
Devido às políticas de inatividade do banco de dados (Supabase Free Tier), a demonstração em vídeo preserva a visualização das interações de UX e lógica de transações:
Assistir vídeo de demonstração no LinkedIn
https://www.linkedin.com/posts/beatriz-ara%C3%BAjo-386976270_desenvolvimentoweb-reactjs-frontend-ugcPost-7425147961191522304-JPD1/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEJZzZYB8twA2R3AMQ9s4OvG_k8JyJTKxQY

🏗️ Engenharia e Arquitetura
O diferencial deste projeto é a aplicação de princípios de Engenharia de Software para garantir um sistema previsível e escalável.

1. Arquitetura Orientada a Domínio (DDD Simplificado)
Estruturado com uma clara separação de responsabilidades para facilitar a manutenção:

Camada de Domínio: Modelagem tipada das entidades financeiras (Receitas, Despesas, Pedidos).

Camada de Apresentação: Componentização modular focada em lógica de interface desacoplada da lógica de negócio.

2. Lógica de Interface Milimétrica
Feedback Visual: if (item.type === "entrada") >>> O sistema aplica automaticamente indicadores em verde, utilizando a psicologia das cores para feedback imediato ao usuário.

Segurança de Dados: Uso de TypeScript para garantir contratos rígidos e evitar erros em tempo de execução.

🛠️ Stack Técnica
React: Biblioteca base para a construção da UI.

TypeScript: Tipagem estrita para maior robustez.

Tailwind CSS: Design sistêmico e responsividade mobile-first.

🚀 Objetivo e Evolução
O foco foi aplicar princípios de organização e legibilidade que permitem a expansão para funcionalidades futuras, como Score Financeiro e Classificação Inteligente.
