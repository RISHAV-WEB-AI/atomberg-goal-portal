# Atomberg In-House Goal Setting & Tracking Portal

Welcome to the **Atomberg Goal Setting & Tracking Portal**, a premium, feature-rich web application built to digitize the complete lifecycle of employee performance appraisals—from drafting and validations to manager approvals, quarterly check-in scores, notifications, and HR governance auditing.

The application has been styled with a custom dark-first glassmorphic styling system using curated HSL color parameters, micro-animations, and fluid transitions.

---

## 🏗️ System Architecture & Choice

We selected a high-fidelity **React Single Page Application (SPA)** backed by a **structured client-side relational database** synced with `localStorage`. 

```
                                  +------------------------------------+
                                  |      Top-Level Header &            |
                                  |   Time-Travel Date Simulator       |
                                  +-----------------+------------------+
                                                    |
+--------------------------+      +-----------------v------------------+      +--------------------------+
|  Sidebar Navigation &    |      |                                    |      |  Role Switch Sandbox     |
|  Theme Toggle Selector   +------>    Central UI State Controller     <------+  Vikram / Rajesh /       |
+--------------------------+      |            (App.jsx)               |      |  Ananya / Kabir          |
                                  +-----------------+------------------+      +--------------------------+
                                                    |
                                  +-----------------v------------------+
                                  |     Relational Database Store      |
                                  |        (mockStore.js)              |
                                  +--------+------------------+--------+
                                           |                  |
                                           |                  |
                                  +--------v-------+  +-------v--------+
                                  |  LocalStorage  |  |  Audit Trails  |
                                  |  Persistence   |  |  & Escalations |
                                  +----------------+  +----------------+
```

### Why this Architecture?
1. **Zero Setup Cost**: The entire application, database state, time travel logic, and simulation engine runs completely client-side in the browser. It requires zero server setup, database configuration, or internet connectivity.
2. **Infinite App Portability**: Can be hosted instantly as a static website (Vite output) on free services like Netlify, Vercel, or GitHub Pages.
3. **Fidelity Sandbox Control**: Features an interactive time-travel console letting evaluators change simulated calendar dates to verify complex, multi-month appraisal deadlines and automatic escalation warnings instantly.

---

## 🎯 Key Features Implemented

### 1. Goal Sheet Validations (Phase 1)
- Live goal validator enforces exactly **100% total weightage** before submission.
- Rejects entries below **10% individual weightage**.
- Enforces a maximum of **8 goals** per employee.
- Padlock state: On manager approval, the sheet is permanently locked from employee/manager modification.

### 2. Departmental KPI Cascading & Real-time Sync
- Managers/Admins can select a primary departmental KPI (e.g. *R&D Cycle Time Reduction*) and cascade it to select employees.
- Recipient sheets get populated with read-only title, description, and target (can modify weightages only).
- When the primary owner updates their actual achievement, the score and status sync across all recipient sheets in real time!

### 3. Quantitative Progress Scores (Phase 2)
Mathematical formulas automatically compute progress score achievements:
- **Min Target (Higher is Better, e.g., Sales)**: `Achievement ÷ Target`
- **Max Target (Lower is Better, e.g., TAT / Costs)**: `Target ÷ Achievement`
- **Timeline**: Deadline checks (`Completion Date <= Target Deadline = 100%`; late submissions scale down 5% per day late).
- **Zero-based (0 = Success)**: `If Achievement === 0 -> 100%, else 0%`.

### 4. Entra ID SSO & Integrations Simulation
- Includes a simulated **Microsoft Entra ID (Azure AD)** Single Sign-On sync.
- Includes a simulated **Microsoft Teams Bot** log displaying Adaptive Cards sent to manager chats (with deep-link support).
- Includes a simulated **Outlook Inbox** displaying full-fidelity HTML emails triggered on submissions, approvals, rework returns, and escalations.

### 5. HR Governance, Compliance & Audits
- **Auditing**: Details who changed what and when for post-lock operations.
- **Rule Escalations**: Automates email notifications when employees fail to submit goals on time or managers miss review milestones.
- **Exceptions Manager**: HR Admin can override sheet locks and unlock sheets back to draft.
- **Excel Report Exporter**: Downloads full Planned vs Actual compliance reports across all 4 quarters in standard CSV format.

---

## 👥 Seed User Personas (Quick-Role Switch Sandbox)

Use the floating console or bottom-left sidebar buttons to instantly switch identities:

| Name | Role | Email | Reporting To | Department | Avatar |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Vikram Malhotra** | HR / Admin | `admin@atomberg.com` | Board of Directors | People Operations | 👨‍💼 |
| **Rajesh Iyer** | Manager (L1) | `manager@atomberg.com` | Vikram Malhotra | R&D Engineering | 👨‍🔬 |
| **Ananya Sen** | Employee | `employee@atomberg.com` | Rajesh Iyer | R&D Engineering | 👩‍💻 |
| **Kabir Mehta** | Employee 2 | `kabir@atomberg.com` | Rajesh Iyer | R&D Engineering | 🧑‍💻 |

---

## ⚙️ How to Run Locally

### Prerequisites
Make sure you have **Node.js** (v16+) installed.

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch Local Dev Server
```bash
npm run dev
```
The server launches instantly on **[http://localhost:3000/](http://localhost:3000/)**.

### 3. Compile Production Bundle
```bash
npm run build
```
Generates a highly optimized minified static output in the `/dist` folder.
