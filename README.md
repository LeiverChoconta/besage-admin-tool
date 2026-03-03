# 🛠️ Besage Admin Tool

> **Hackathon Experiment** — Internal admin panel for managing Besage's product suite.

Besage Admin Tool is a centralized web dashboard built to give the Besage team operational control over its two main platforms: **iLeader.ai** (B2B leadership coaching) and **AllYourSenses.ai** (adult audio content). From a single interface, admins can monitor key metrics, manage users, and oversee content across both products.

---

## 🎯 Purpose

This tool was born as a Hackathon experiment to answer a simple question: *what if both products shared one unified admin layer?*

Instead of managing each platform in isolation, Besage Admin Tool connects to the external APIs of iLeader and AYS to provide a single pane of glass for:

- 📊 **Dashboard** — Real-time metrics and KPIs across both platforms
- 👥 **User Management** — View, filter, and manage users from iLeader and AYS
- 📝 **Content Management** — Oversee messages, stories, and platform-specific content

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Language | TypeScript |
| Build Tool | Vite |
| UI Components | shadcn/ui |
| Styling | Tailwind CSS |
| Testing | Vitest |
| Package Manager | npm / bun |

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>= 18.x`
- npm or bun installed

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/LeiverChoconta/besage-admin-tool.git

# 2. Navigate into the project
cd besage-admin-tool

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🔌 API Integration

This tool is **frontend-only** and relies on external APIs provided by the Besage backend services. Make sure you have access to the required API endpoints for both iLeader and AYS before running the project in a real environment.

> For the Hackathon demo, some data may be mocked or seeded locally.

---

## 📁 Project Structure

```
besage-admin-tool/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components (shadcn/ui based)
│   ├── pages/           # Route-level views (Dashboard, Users, Content)
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities and API helpers
│   └── main.tsx         # App entry point
├── index.html
├── vite.config.ts
├── tailwind.config.ts
└── vitest.config.ts
```

---

## 🧪 Running Tests

```bash
npm run test
```

Tests are powered by [Vitest](https://vitest.dev/), co-located with components where relevant.

---

## 🌐 Platforms Managed

| Platform | Description |
|---|---|
| [iLeader.ai](https://ileader.ai) | B2B coaching and leadership development platform |
| [AllYourSenses.ai](https://allyoursenses.ai) | Adult audio content and storytelling platform |

---

## ⚠️ Hackathon Context

This project was built as an internal experiment during a Hackathon sprint. It is **not production-ready** and may contain:

- Incomplete features or placeholder UI
- Mocked or hardcoded data
- Limited error handling
- No authentication layer (yet)

The goal was to validate the concept of a unified admin panel for Besage's product suite. Future iterations may evolve this into a production tool.

---

## 👤 Author

**Leiver Choconta** — Product Design & Development at Besage  
[GitHub @LeiverChoconta](https://github.com/LeiverChoconta)

---

## 📄 License

This project is private and intended for internal use by the Besage team.
