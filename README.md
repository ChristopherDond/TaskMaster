<div align="center">

# ⚡ TaskMaster
### Productivity OS — Performance-driven task management

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Framer Motion](https://img.shields.io/badge/Framer-Motion-FF4154?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)

**Manage tasks, crush goals and track your productivity with a professional gamification system.**

[Live Demo](#) · [Report Bug](../../issues) · [Request Feature](../../issues)

</div>

---

## 📸 Screenshots

### 🇧🇷 Português

<div align="center">

| | |
|:---:|:---:|
| ![Dashboard](https://github.com/user-attachments/assets/177a8b4a-7765-415d-8570-350f3cb4a85a) | ![Tasks](https://github.com/user-attachments/assets/1fbb7e98-113a-4a12-9861-260756c320ea) |

</div>

---

### 🇺🇸 English

<div align="center">

| | |
|:---:|:---:|
| ![Dashboard](https://github.com/user-attachments/assets/SUA-URL-AQUI) | ![Tasks](https://github.com/user-attachments/assets/SUA-URL-AQUI) |

</div>

---

## ✨ Features

### 📋 Task Management
- **Full CRUD** — create, edit, delete and complete tasks
- **Categories** — Work 💼, Personal 🌱, Goals 🎯
- **Priorities** — High, Medium and Low with visual indicators
- **Deadlines** — real-time urgency alerts
- **Smart filters** — by status, category, priority and text search

### 📅 Integrated Calendar
- **Monthly view** with a 6-week grid
- **Colored dots** per category on days with deadlines
- **Day panel** on click — lists all tasks for that day

### 🎮 Gamification (Metrics-Driven)
- **Efficiency Score** accumulated by productive actions
- **5 Focus Levels** — Beginner, Focused, Efficient, Expert, Master
- **Daily streak** — bonus for maintaining consistency
- **7 unlockable Achievements** with animated toast notifications
- **Performance dashboard** with weekly efficiency ring and bar chart

### 🎯 Long-Term Goals
- Progress bar per goal (0–100%)
- **Milestones** with internal checklist
- Status: Active, Paused, Completed
- Specific categories: Work, Health, Learning, Finance, Personal

### 🌓 UI/UX
- Professional **Dark Mode** (default) and Light Mode with instant toggle
- Animations with **Framer Motion** — modals, view transitions, progress bars
- Minimalist design with CSS tokens — [Sora](https://fonts.google.com/specimen/Sora) font
- Fully responsive

---

## 🎮 Scoring System

| Action | Points |
|--------|:------:|
| ✅ Task completed **>1 day before** deadline | **+100** |
| ✅ Task completed **on** deadline day | **+75** |
| ✅ Task completed **after** deadline | **+25** |
| ✅ Task with **no deadline** completed | **+50** |
| 🏆 Long-term goal completed | **+200** |

### Focus Levels

| Level | Points Required | Label |
|:-----:|:--------------:|-------|
| 1 | 0 pts | Beginner |
| 2 | 500 pts | Focused |
| 3 | 1,500 pts | Efficient |
| 4 | 3,500 pts | Expert |
| 5 | 7,500 pts | Master |

### Achievements

| Badge | Name | Condition |
|:-----:|------|-----------|
| 🎯 | First Step | Complete 1 task |
| 🌅 | Early Bird | Complete 5 tasks before deadline |
| 🔥 | On Fire | Maintain a 7-day streak |
| ⚡ | Unstoppable | Maintain a 30-day streak |
| 💯 | Centurion | Complete 100 tasks |
| 🏆 | Goal Crusher | Complete 1 long-term goal |
| 🚀 | Sprint Master | Complete 10 tasks in one week |

---

## 🛠 Tech Stack

| Technology | Usage |
|------------|-------|
| **React 18** + **Vite 5** | Framework and bundler |
| **Tailwind CSS 3** | Utility styling with CSS var design tokens |
| **Framer Motion** | Layout animations, modals and transitions |
| **Lucide React** | Icon library |
| **Supabase** | PostgreSQL, Auth and Row Level Security |

---

## 🗂 Project Structure

```
app-produtividade/
│
├── 📄 schema.sql               ← Run this in Supabase SQL Editor
├── 📄 package.json
├── 📄 vite.config.js
├── 📄 tailwind.config.js
├── 📄 postcss.config.js
├── 📄 index.html
├── 📄 .env.example             ← Copy to .env and fill in your keys
├── 📄 .gitignore
│
└── 📁 src/
    ├── 📄 App.jsx              ← Main orchestrator (auth + CRUD + scoring)
    ├── 📄 main.jsx
    ├── 📄 index.css            ← Dark/light mode design tokens
    │
    ├── 📁 lib/
    │   ├── 📄 supabase.js      ← Supabase client
    │   └── 📄 scoring.js       ← Points, levels and achievements logic
    │
    ├── 📁 components/
    │   ├── 📄 Auth.jsx         ← Login and sign up
    │   ├── 📄 Sidebar.jsx      ← Navigation + level/streak card
    │   ├── 📄 TaskModal.jsx    ← Create/edit task modal
    │   └── 📄 GoalModal.jsx    ← Create/edit goal modal
    │
    └── 📁 views/
        ├── 📄 Dashboard.jsx    ← Metrics, achievements, charts
        ├── 📄 TasksView.jsx    ← Task list with filters
        ├── 📄 CalendarView.jsx ← Monthly calendar
        └── 📄 GoalsView.jsx    ← Long-term goals
```

---

## 🗃 Database Schema

### `tasks`
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | User reference (RLS) |
| `title` | TEXT | Task title |
| `description` | TEXT | Optional description |
| `deadline` | TIMESTAMPTZ | Deadline |
| `category` | TEXT | `work` / `personal` / `goals` |
| `status` | TEXT | `pending` / `in_progress` / `completed` / `overdue` |
| `priority` | TEXT | `low` / `medium` / `high` |
| `points_earned` | INTEGER | Points earned on completion |
| `completed_at` | TIMESTAMPTZ | Completion timestamp |

### `goals`
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | User reference (RLS) |
| `title` | TEXT | Goal title |
| `progress` | INTEGER | 0–100% |
| `milestones` | JSONB | Milestones array |
| `target_date` | DATE | Target date |
| `status` | TEXT | `active` / `completed` / `paused` |

### `profiles`
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | = `auth.uid()` |
| `total_points` | INTEGER | Accumulated score |
| `level` | INTEGER | Current level (1–5) |
| `streak_days` | INTEGER | Consecutive active days |
| `achievements` | JSONB | Unlocked achievement IDs |
| `last_active` | DATE | Last active day (for streak) |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org) 18+
- [Supabase](https://supabase.com) account

### Installation

**1. Run the schema on Supabase**

Go to **SQL Editor** in your Supabase project and run the full content of `schema.sql`.

**2. Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

> Find these values at: **Supabase Dashboard → Project Settings → API**

**3. Install and run**

```bash
npm install
npm run dev
```

Open `http://localhost:5173` ✅

---

## ☁️ Deploying to Vercel

**1. Push to GitHub**
```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/app-produtividade.git
git push -u origin main
```

**2. Deploy**
- Go to [vercel.com](https://vercel.com) → **Add New Project**
- Select your repository
- Add environment variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`)
- Click **Deploy**

**3. Configure Supabase for your production domain**

In **Supabase → Authentication → URL Configuration**:
- **Site URL:** `https://your-app.vercel.app`
- **Redirect URLs:** `https://your-app.vercel.app/**`

---

## 🔒 Security

All tables use Supabase **Row Level Security (RLS)** — each user can only access **their own data**. Policies are automatically configured by `schema.sql`.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

Built with ☕ and a lot of productivity.

⭐ Star this repo if it helped you!

</div>




