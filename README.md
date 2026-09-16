# 📊 CRM Demandas NEXXO - Painel Kanban & Portal do Franqueado

Sistema moderno de gestão ágil de demandas operacionais e marketing entre franqueados e equipe interna de produção (Conteúdo, Design, Tráfego, Aprovação e Entrega).

---

## 🚀 Principais Funcionalidades

### 1. 📋 Quadro Kanban Operacional (6 Colunas)
- **Fluxo estruturado:** `Demandas` ➔ `Conteúdo` ➔ `Designer` ➔ `Tráfego` ➔ `Aprovação` ➔ `Entrega`.
- **Drag and Drop nativo e fluido:** movimentação livre de cards entre colunas com animações visuais e efeitos sonoros discretos (Web Audio API).
- **Status em Português:** *Não Iniciado, Em Pesquisa, No Prazo, Concluído, Pendente de Análise*.
- **Etiqueta especial para novas demandas:** cards enviados por franqueados ou sem prazo definido recebem a tag **`NOVO • Demanda [Cliente] Pendente`** com indicador pulsante de alerta.

### 2. 🔗 Gerenciador de Compartilhamento & Acesso
- **Modal expansivo de Compartilhamento:**
  - Busca interna em tempo real por ID (`#DEM-XXXX`), nome do cliente ou coluna.
  - Tabela com link exclusivo por card/franqueado.
  - **Interruptor (Toggle Switch):** Ativa ou desativa o link de acompanhamento com um clique. Se desativado, o franqueado tem o acesso bloqueado imediatamente.

### 3. 🎯 Definição de Prazos pela Equipe & Comentários
- **Drawer lateral de detalhes:**
  - Exibe data e hora exata em que o franqueado abriu a demanda.
  - **Definição oficial de prazo de entrega:** campo configurável onde a equipe estipula a data de entrega.
  - **Thread de comentários estruturados:** histórico com nome do autor, data/hora e inclusão de novas mensagens em tempo real.
  - Checklist interativo de subtarefas operacionais.

### 4. 🌐 Portal do Franqueado (`portal-franqueado.html`)
- Página de autoatendimento onde o cliente/franqueado pode abrir novas demandas.
- **Unidade/Franquia fixa:** travada no workspace do usuário.
- **Sem campo de prazo pelo cliente:** a equipe interna é quem define e informa a data de entrega oficial.
- **Status das Demandas:** sincronização em tempo real das solicitações com clique para ver detalhes completos e link anexo direto para o sistema oficial (`https://sistema.nexxoplat.com/crm`).

---

## 🛠️ Tecnologias Utilizadas

- **HTML5 Semântico**
- **CSS3 Moderno / Vanilla CSS** (Design System, Flexbox, CSS Grid, Variáveis CSS, Glassmorphism)
- **JavaScript ES6+**
- **LocalStorage API** (Persistência completa sem dependências externas)
- **Node.js** (Servidor HTTP nativo ultra-leve)

---

## 💻 Como Rodar o Projeto

### Pré-requisitos
- Node.js instalado (v16+)

### Execução
1. Clone o repositório:
   ```bash
   git clone https://github.com/tripadev/crm-demandas-nexxo.git
   cd crm-demandas-nexxo
   ```

2. Inicie o servidor:
   ```bash
   npm start
   # ou: node server.js
   ```

3. Acesse no navegador:
   - **Painel Kanban Interno:** [http://localhost:3000](http://localhost:3000)
   - **Portal do Franqueado:** [http://localhost:3000/portal-franqueado.html](http://localhost:3000/portal-franqueado.html)

---

Desenvolvido para a rede **NEXXO Franquias**.
