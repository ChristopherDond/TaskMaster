[English version](README.md)

<div align="center">

# ⚡ TaskMaster
### Productivity OS — Gestão de tarefas focada em desempenho

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Framer Motion](https://img.shields.io/badge/Framer-Motion-FF4154?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)

**Gerencie tarefas, destrua metas e acompanhe sua produtividade com um sistema profissional de gamificação.**

[Demo ao Vivo](#) · [Reportar Bug](../../issues) · [Solicitar Recurso](../../issues)

</div>

---

## 📸 Capturas de Tela

### 🇧🇷 Português

<div align="center">

| | |
|:---:|:---:|
| ![Dashboard](https://github.com/user-attachments/assets/177a8b4a-7765-415d-8570-350f3cb4a85a) | ![Tasks](https://github.com/user-attachments/assets/1fbb7e98-113a-4a12-9861-260756c320ea) |

</div>

---

### 🇺🇸 Inglês

<div align="center">

| | |
|:---:|:---:|
| ![Dashboard](https://github.com/user-attachments/assets/SUA-URL-AQUI) | ![Tasks](https://github.com/user-attachments/assets/SUA-URL-AQUI) |

</div>

---

## ✨ Funcionalidades

### 📋 Gerenciamento de Tarefas
- **CRUD completo** — crie, edite, exclua e conclua tarefas
- **Categorias** — Trabalho 💼, Pessoal 🌱, Metas 🎯
- **Prioridades** — Alta, Média e Baixa com indicadores visuais
- **Prazos** — alertas de urgência em tempo real
- **Filtros inteligentes** — por status, categoria, prioridade e busca por texto

### 📅 Calendário Integrado
- **Visualização mensal** com grade de 6 semanas
- **Pontos coloridos** por categoria nos dias com prazos
- **Painel do dia** ao clicar — lista todas as tarefas daquele dia

### 🎮 Gamificação (Baseada em Métricas)
- **Pontuação de Eficiência** acumulada por ações produtivas
- **5 Níveis de Foco** — Iniciante, Focado, Eficiente, Especialista, Mestre
- **Sequência diária (streak)** — bônus por manter a constância
- **7 Conquistas desbloqueáveis** com notificações animadas (toast)
- **Painel de desempenho** com anel semanal de eficiência e gráfico de barras

### 🎯 Metas de Longo Prazo
- Barra de progresso por meta (0–100%)
- **Marcos (milestones)** com checklist interno
- Status: Ativa, Pausada, Concluída
- Categorias específicas: Trabalho, Saúde, Aprendizado, Finanças, Pessoal

### 🌓 UI/UX
- **Modo Escuro** profissional (padrão) e Modo Claro com alternância instantânea
- Animações com **Framer Motion** — modais, transições de visualização, barras de progresso
- Design minimalista com tokens CSS — fonte [Sora](https://fonts.google.com/specimen/Sora)
- Totalmente responsivo

---

## 🎮 Sistema de Pontuação

| Ação | Pontos |
|--------|:------:|
| ✅ Tarefa concluída **mais de 1 dia antes** do prazo | **+100** |
| ✅ Tarefa concluída **no dia** do prazo | **+75** |
| ✅ Tarefa concluída **após** o prazo | **+25** |
| ✅ Tarefa **sem prazo** concluída | **+50** |
| 🏆 Meta de longo prazo concluída | **+200** |

### Níveis de Foco

| Nível | Pontos Necessários | Rótulo |
|:-----:|:--------------:|-------|
| 1 | 0 pts | Iniciante |
| 2 | 500 pts | Focado |
| 3 | 1.500 pts | Eficiente |
| 4 | 3.500 pts | Especialista |
| 5 | 7.500 pts | Mestre |

### Conquistas

| Selo | Nome | Condição |
|:-----:|------|-----------|
| 🎯 | Primeiro Passo | Conclua 1 tarefa |
| 🌅 | Madrugador | Conclua 5 tarefas antes do prazo |
| 🔥 | Pegando Fogo | Mantenha uma sequência de 7 dias |
| ⚡ | Imparável | Mantenha uma sequência de 30 dias |
| 💯 | Centurião | Conclua 100 tarefas |
| 🏆 | Destruidor de Metas | Conclua 1 meta de longo prazo |
| 🚀 | Mestre do Sprint | Conclua 10 tarefas em uma semana |

---

## 🛠 Stack de Tecnologias

| Tecnologia | Uso |
|------------|-------|
| **React 18** + **Vite 5** | Framework e bundler |
| **Tailwind CSS 3** | Estilização utilitária com design tokens via variáveis CSS |
| **Framer Motion** | Animações de layout, modais e transições |
| **Lucide React** | Biblioteca de ícones |
| **Supabase** | PostgreSQL, Auth e Row Level Security |

---

## 🗂 Estrutura do Projeto

```
app-produtividade/
│
├── 📄 schema.sql               ← Execute no SQL Editor do Supabase
├── 📄 package.json
├── 📄 vite.config.js
├── 📄 tailwind.config.js
├── 📄 postcss.config.js
├── 📄 index.html
├── 📄 .env.example             ← Copie para .env e preencha com suas chaves
├── 📄 .gitignore
│
└── 📁 src/
    ├── 📄 App.jsx              ← Orquestrador principal (auth + CRUD + pontuação)
    ├── 📄 main.jsx
    ├── 📄 index.css            ← Design tokens dos modos escuro/claro
    │
    ├── 📁 lib/
    │   ├── 📄 supabase.js      ← Cliente Supabase
    │   └── 📄 scoring.js       ← Lógica de pontos, níveis e conquistas
    │
    ├── 📁 components/
    │   ├── 📄 Auth.jsx         ← Login e cadastro
    │   ├── 📄 Sidebar.jsx      ← Navegação + cartão de nível/sequência
    │   ├── 📄 TaskModal.jsx    ← Modal de criar/editar tarefa
    │   └── 📄 GoalModal.jsx    ← Modal de criar/editar meta
    │
    └── 📁 views/
        ├── 📄 Dashboard.jsx    ← Métricas, conquistas, gráficos
        ├── 📄 TasksView.jsx    ← Lista de tarefas com filtros
        ├── 📄 CalendarView.jsx ← Calendário mensal
        └── 📄 GoalsView.jsx    ← Metas de longo prazo
```

---

## 🗃 Esquema do Banco de Dados

### `tasks`
| Coluna | Tipo | Descrição |
|--------|------|-------------|
| `id` | UUID | Chave primária |
| `user_id` | UUID | Referência do usuário (RLS) |
| `title` | TEXT | Título da tarefa |
| `description` | TEXT | Descrição opcional |
| `deadline` | TIMESTAMPTZ | Prazo |
| `category` | TEXT | `work` / `personal` / `goals` |
| `status` | TEXT | `pending` / `in_progress` / `completed` / `overdue` |
| `priority` | TEXT | `low` / `medium` / `high` |
| `points_earned` | INTEGER | Pontos ganhos ao concluir |
| `completed_at` | TIMESTAMPTZ | Data/hora da conclusão |

### `goals`
| Coluna | Tipo | Descrição |
|--------|------|-------------|
| `id` | UUID | Chave primária |
| `user_id` | UUID | Referência do usuário (RLS) |
| `title` | TEXT | Título da meta |
| `progress` | INTEGER | 0–100% |
| `milestones` | JSONB | Array de marcos |
| `target_date` | DATE | Data alvo |
| `status` | TEXT | `active` / `completed` / `paused` |

### `profiles`
| Coluna | Tipo | Descrição |
|--------|------|-------------|
| `id` | UUID | = `auth.uid()` |
| `total_points` | INTEGER | Pontuação acumulada |
| `level` | INTEGER | Nível atual (1–5) |
| `streak_days` | INTEGER | Dias ativos consecutivos |
| `achievements` | JSONB | IDs das conquistas desbloqueadas |
| `last_active` | DATE | Último dia ativo (para a sequência) |

---

## 🚀 Começando

### Pré-requisitos
- [Node.js](https://nodejs.org) 18+
- Conta no [Supabase](https://supabase.com)

### Instalação

**1. Execute o schema no Supabase**

Vá em **SQL Editor** no seu projeto do Supabase e execute o conteúdo completo de `schema.sql`.

**2. Configure as variáveis de ambiente**

```bash
cp .env.example .env
```

Edite o `.env`:
```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

> Encontre esses valores em: **Supabase Dashboard → Project Settings → API**

**3. Instale e execute**

```bash
npm install
npm run dev
```

Abra `http://localhost:5173` ✅

---

## ☁️ Deploy no Vercel

**1. Envie para o GitHub**
```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/app-produtividade.git
git push -u origin main
```

**2. Deploy**
- Vá para [vercel.com](https://vercel.com) → **Add New Project**
- Selecione seu repositório
- Adicione as variáveis de ambiente (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`)
- Clique em **Deploy**

**3. Configure o Supabase para o seu domínio de produção**

Em **Supabase → Authentication → URL Configuration**:
- **Site URL:** `https://your-app.vercel.app`
- **Redirect URLs:** `https://your-app.vercel.app/**`

---

## 🔒 Segurança

Todas as tabelas usam **Row Level Security (RLS)** do Supabase — cada usuário só pode acessar **os próprios dados**. As políticas são configuradas automaticamente pelo `schema.sql`.

---

## 📄 Licença

Distribuído sob a Licença MIT. Veja `LICENSE` para mais informações.

---

<div align="center">

Feito com ☕ e muita produtividade.

⭐ Dê uma estrela neste repositório se ele te ajudou!

</div>
