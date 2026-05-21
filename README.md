
Markdown
# 💻 OdontoTrak - Frontend Web

Este repositório contém a aplicação web do **OdontoTrak**, um ecossistema de gestão odontológica moderno. A interface foi projetada para ser intuitiva, rápida e responsiva, atendendo às necessidades de administradores, recepcionistas e cirurgiões-dentistas.

A aplicação se conecta à API REST do OdontoTrak e gerencia fluxos complexos como controle de acesso por cargo (Roles), prontuário eletrônico em etapas e manipulação visual de um odontograma digital.

---

## 🚀 Tecnologias Utilizadas

* **React 18+ & Vite:** Ferramenta de build e runtime moderna para máxima performance no desenvolvimento.
* **Tailwind CSS:** Framework utilitário para construção de uma interface limpa, elegante e aderente à identidade visual clínica.
* **React Router Dom:** Gerenciamento de rotas dinâmicas, histórico de navegação e proteção de fluxos.
* **Lucide React:** Pacote de ícones minimalistas e modernos integrados ao longo de todo o sistema.
* **Context API:** Gerenciamento de estado global para a sessão e autenticação de usuários.

---

## 🔐 Fluxo de Autenticação e Gestão de Usuários

Diferente de plataformas convencionais, o **OdontoTrak não possui um fluxo de autocadastro público (Sign-up)** para garantir a segurança e a integridade dos dados da clínica.

### 🔑 Acesso Inicial (Administrador Nativo)
O sistema conta com um usuário Administrador padrão criado automaticamente via banco de dados  pelos desenvolvedores para o primeiro acesso:
* **Login:** `admin@odontotrack.com`
* **Senha:** `123456`

### 🏗️ Criação de Contas e Níveis de Acesso (Roles)
Uma vez logado, o Administrador é o único perfil com permissão para acessar a tela **`NovoProfissional.jsx`** e cadastrar novos usuários no sistema. Durante o cadastro, ele define o cargo correspondente, liberando acessos específicos via rotas protegidas (`guards`):

* **Administrador (`ROLE_ADMIN`):** Acesso irrestrito a configurações globais, relatórios financeiros (`RelatorioFinancas`), relatórios de consultas (`RelatorioConsultas`) e gestão de profissionais.
* **Dentista (`ROLE_DENTISTA`):** Acesso direcionado ao `DashboardDentista`, histórico clínico (`FichaPaciente`), prontuários e o fluxo completo de atendimento clínico com odontograma interativo na `FichaConsulta`.
* **Recepcionista (`ROLE_RECEPCIONISTA`):** Foco na triagem, agendamento de novas consultas (`NovaConsulta`), controle de fluxo na `Agenda` geral e cadastro básico de pacientes na tela `NovoPaciente`.

---

## 📋 Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina:
* [Node.js](https://nodejs.org/) (versão 18 ou superior recomendada).
* Gerenciador de pacotes `npm` (já vem com o Node).
* O backend da API **OdontoTrak** rodando localmente.

---

## 🛠️ Como Rodar o Projeto

1. **Clonar o repositório:**
   ```bash
   git clone [https://github.com/David-gab-01/OdontoTrak-frontend.git](https://github.com/David-gab-01/OdontoTrak-frontend.git)
   cd OdontoTrak-frontend
Instalar as dependências:

Bash
npm install
Configurar as Variáveis de Ambiente:
Crie um arquivo .env na raiz do projeto e configure a URL base da sua API backend:

Snippet de código
VITE_API_URL=http://localhost:8080
Executar a aplicação em modo de desenvolvimento:

Bash
npm run dev
A aplicação estará disponível no seu navegador através do endereço indicado no terminal (geralmente http://localhost:5173).

📁 Estrutura do Projeto (src/)
A arquitetura do projeto foi desenhada para manter a separação clara de responsabilidades:

Components/: Componentes de UI modulares e reutilizáveis (Inputs, Modais, Botões), além do Odontograma.jsx e pastas dedicadas a fluxos como o FichaConsulta/StepperConsulta.jsx.

guards/: Middlewares de rotas (PrivateRoute, PublicRoute, RoleRedirect) que utilizam o token armazenado no AuthContext para validar e barrar acessos ilegítimos.

contexts/: Contexto global de autenticação (AuthContext.jsx) que gerencia o estado da sessão de forma centralizada.

hooks/: Camada de abstração de lógica usando React Hooks (ex: useAgendamentos, useOdontograma, usePacientes), desacoplando as telas da lógica de negócio.

layouts/: Estruturas de grid comuns, como o MainLayout.jsx que engloba a Sidebar.

pages/: As telas completas mapeadas pelas rotas do sistema (Dashboard, Ficha de Consulta, Agenda, Relatórios).

services/: Módulos de comunicação direta com a API HTTP (ex: agendamentoService.js, authService.js), utilizando instâncias do Axios configuradas com interceptores de Token JWT.

utils/: Funções utilitárias globais para validações e formatações de dados em tela.

📡 Integração Chave: Fluxo de Atendimento Clínico
Um dos maiores destaques do frontend é a tela de FichaConsulta.jsx, que consome os serviços de prontuário, agendamento e odontograma para guiar o profissional em 4 etapas reativas:

Recepção: Identificação e abertura do atendimento 

Avaliação: Edição e mapeamento visual de dentes com o componente Odontograma e preenchimento da Anamnese.

Procedimento: Descrição e listagem de insumos.

Conclusão: Validação de segurança dos dados, orientações pós-operatórias e envio estruturado do payload final para persistência no banco de dados através do serviço de prontuários.