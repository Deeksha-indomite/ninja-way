# 🍥 Shinobi.LOG — ninja-way

> **Live App:** [https://ninja-way.vercel.app/](https://ninja-way.vercel.app/)

A **Naruto-themed gamified daily discipline tracker** built with React + Vite. Track missions, battle Akatsuki villains, manage exam tasks, and level up from Academy Student to Hokage — all with real XP, chakra, combo streaks, and persistent storage.

---

## ✨ Features

### 🔥 TODAY Tab
- Live real-time clock (IST-accurate local date)
- Daily mission checklist with XP + Chakra rewards
- Combo system — rapid completions trigger jutsu flash effects
- Auto-saves progress every 600ms
- Daily reset at midnight (new scroll, old day archived)
- Scroll of Gratitude journal

### 🎓 EXAM Tab
- Subject-wise exam task manager (Maths, Physics, Chemistry, CS, English)
- 3 difficulty tiers — Easy (+15 XP), Medium (+25 XP), Hard (+40 XP)
- Exam countdown timer per task
- Exam XP feeds directly into chakra for boss battles
- Badge counter on tab showing pending tasks

### ⚔️ BATTLE Tab
- 10 Akatsuki villains to defeat in order:
  `Orochimaru → Zabuza → Itachi → Kisame → Pain → Hidan → Deidara → Madara → Obito → Kaguya`
- 6 Jutsu attacks (Shadow Clone, Rasengan, Fire Style, Lightning Blade, Sage Mode, Kurama Mode)
- Chakra from missions powers your jutsu
- Villains counterattack with animated screen effects
- Villains unlock progressively as you earn XP

### 📜 LOG Tab
- Date-wise history of every day logged
- 35-day interactive training calendar
  - Correctly aligned to real weekdays (Sun–Sat)
  - Today highlighted with pulsing ring
  - Tap any day to see full mission breakdown + gratitude note
- Streak tracking with fire badge

### 🏅 STATS Tab
- Lifetime XP, tasks done, perfect days, best streak
- 10 achievements with unlock toasts
- Full rank progression tree (Academy Student → Hokage)

### ⚙️ SCROLL Tab
- Fully editable daily mission list
- Add/remove/edit tasks with custom icon, time, XP, chakra values

---

## 🏗️ Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite | Build tool |
| Framer Motion | Animations & transitions |
| Artifact Storage API | Persistent cross-session data |
| Google Fonts (Cinzel, Orbitron, Crimson Text) | Naruto-style typography |

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/Deeksha-indomit/ninja-way.git
cd ninja-way

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

---

## 📁 Project Structure

```
ninja-way/
├── src/
│   ├── App.jsx          # Main Shinobi.LOG component (all features)
│   └── main.jsx         # React entry point
├── public/
├── index.html
├── vite.config.js
└── README.md
```

---

## 🎮 Rank System

| Rank | XP Required | Title |
|------|------------|-------|
| 📜 Academy Student | 0 | Novice Shinobi |
| 🟢 Genin | 50 | Rookie Ninja |
| 🔵 Chunin | 100 | Mid-Level Ninja |
| 💜 Jonin | 150 | Elite Ninja |
| 🟡 ANBU | 175 | Shadow Operative |
| 🔴 Hokage | 220 | Village Leader |

---

## 💾 Data Persistence

All data is saved using the Artifact Storage API:
- `n-logs` — daily mission logs
- `n-tasks` — custom task template
- `n-hps` — villain HP states
- `n-stats` — lifetime statistics
- `n-exam` — exam task list

---

## 👩‍💻 Built By

**Deeksha** — Robotics & AI Engineering Student  
[@deeksha_indomit](https://www.fiverr.com/deeksha_indomit) on Fiverr  

> *"I'll never give up — that's my ninja way!"* 🍥
