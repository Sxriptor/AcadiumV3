This document outlines how to **build the 3 main focus pages**:  
- `n8n.tsx`  
- `dev.tsx`  
- `aivideo.tsx`  

Each page represents a **dedicated workspace** for a specific domain (Automation, Development, AI Video Creation).  
All must follow the **main dashboard layout** with persistent header/sidebar and internal tab navigation.

---

## 🌐 GLOBAL LAYOUT & UI STRUCTURE

✅ Must use the existing dashboard shell (header + sidebar).  
✅ Each page should occupy the full main content space (like `/app/dev` etc).  
✅ Tabs, lists, and progress state should be fully interactive and persistent.

---

## 🔲 SHARED COMPONENTS

These should be created (or imported) and reused across all 3 pages:

- `Checklist` component (with localStorage or Supabase sync)
- `StepTreeNavigator` (a tree-like structure that supports opening steps in nested tab views)
- `MiniAppSwitcher` (tiny horizontal nav for sub-tools/models)
- `MainContentTabs` (render tabs like `/dev/stage/1`, `/dev/stage/2`)
- Consistent theme, spacing, animations
- Optional: breadcrumbs or visual path tree

---

## 📄 PAGE 1: dev.tsx

### 🧠 Purpose:
Developer Launchpad. Aggregates all tools needed for coding workflows.  

### 🧩 Sub-tools (MiniNav):
- Cursor
- GitHub
- VS Code
- Lovable
- Supabase
- API Tester
- Build Monitor

### 📝 UI Contents:
- `Checklist`: Dev environment setup, linking repos, starting project, deploying, etc.
- `StepTreeNavigator`: Nodes for each tool (e.g. `/dev/cursor/1`, `/dev/github/setup`)
- External Links: Docs, YouTube tutorials, templates
- MiniNav to jump between tool-specific tabs
- Each step tab is URL-addressable (`/dev/stage/github-init`)
- Steps can open visual tab layout inside MainContent

---

## 📄 PAGE 2: aivideo.tsx

### 🎬 Purpose:
AI Video Creator hub — combining visuals, voice, scripting, editing.

### 🧩 Sub-tools (MiniNav):
- Veo 3
- Midjourney
- ElevenLabs
- Runway
- Pika
- Topaz
- SFX Generator

### 📝 UI Contents:
- `Checklist`: Scriptwriting → Image generation → Voiceover → Video assembly
- StepTree for stages like:
  - `/aivideo/veo3/scripting`
  - `/aivideo/midjourney/render1`
  - `/aivideo/voice/dub1`
- External Links: video prompt guides, sample prompts, rendering tools
- Each tab shows previews, user actions, and status

---

## 📄 PAGE 3: n8n.tsx

### 🔄 Purpose:
Workflow automation playground for building n8n flows and other integrations.

### 🧩 Sub-tools (MiniNav):
- n8n Cloud
- Webhooks
- Supabase
- CronJobs
- Alerts
- Discord Bots

### 📝 UI Contents:
- `Checklist`: Build flow, test, monitor, deploy
- Steps should open to:
  - `/n8n/flow/setup`
  - `/n8n/test/supabase`
  - `/n8n/webhook/incoming`
- Option to preview embedded n8n UI or trigger tests
- Links to templates, n8n docs, flow libraries

---

## 🔁 PERSISTENCE & STATE MANAGEMENT

### ✅ Each checklist item should save the user’s progress.
Options:
- LocalStorage
- Supabase `user_progress` table

### ✅ Each step tab should support:
- Title
- Completion status
- Optional link
- Description
- Deep-linkable route path

---

## 🧭 ROUTING CONVENTIONS

| Page      | Route Pattern Example                     |
|-----------|-------------------------------------------|
| Dev       | `/dev`, `/dev/stage/github-init`          |
| AI Video  | `/aivideo`, `/aivideo/voice/dub1`         |
| n8n       | `/n8n`, `/n8n/webhook/discord-alert`      |

Each “step” tab is its **own child component** inside the main view. Dynamic routing should allow switching views via nav.

---

## 🧩 MINI NAVIGATION STRUCTURE

Add this horizontal sub-nav below the page title. Clicking switches internal tabs:

[ Cursor ] [ GitHub ] [ VS Code ] [ Lovable ] ← for dev.tsx
[ Veo3 ] [ Midjourney ] [ ElevenLabs ] ← for aivideo.tsx
[ n8n ] [ Supabase ] [ Discord Bots ] ← for n8n.tsx

yaml
Copy
Edit

Highlight active tab. Style similar to a toggle or tab bar.

---

## 🔗 STEP LINKS AND EXTERNAL GUIDES

Each step can contain:
- ✅ Title
- 📄 Description
- 🔗 External links (docs, tools, videos)
- 🎯 Action button ("Open Step") → Opens inside tab area  
- 🧠 Optional embedded iframe for video/tutorial

---

## 💾 LOCAL STORAGE SCHEMA (Example)
