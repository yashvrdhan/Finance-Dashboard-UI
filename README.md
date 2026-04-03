<div align="center">
  <h2>Finance Dashboard UI</h2>
  <p>Track your income, expenses, and personal savings securely and efficiently.</p>
</div>

---

<div align="center">
  <img src="screenshots/dashboard-dark.png" alt="Finance Dashboard Preview" />
</div>

---

### 📝 Table of Contents
- [✨ Features](#-features)
- [📁 Folder Structure](#-folder-structure)
- [📷 Screenshots](#-screenshots)
- [⚙️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [🏗️ State Management](#️-state-management)

---

## ✨ Features

- **Dashboard Overview**: Highly visual cards and dual-mode charts parsing real-time analytics.
- **Transactions Grid**: Deeply filterable and paginated arrays with built-in export triggers (`.csv` / `.json`).
- **Role-Based Access Control**: Simulated Admin vs. Viewer permissions controlling CRUD transaction logic.
- **Insights Engine**: Calculates complex budget behaviors, highlights categorical anomalies, and computes precise saving rates.

---

## 📁 Folder Structure

Here is the folder structure for this application.

```text
finance-dashboard/ 
|- scripts/ 
|-- capture.js
|- src/ 
|-- components/ 
|--- Charts.jsx
|--- Header.jsx
|--- InsightsPanel.jsx
|--- Sidebar.jsx
|--- SummaryCards.jsx
|--- Toasts.jsx
|--- TransactionModal.jsx
|--- TransactionsTable.jsx
|-- context/ 
|--- AppContext.jsx 
|-- data/ 
|--- mockData.js 
|-- App.jsx
|-- index.css
|-- main.jsx
|- index.html
|- vite.config.js
|- package.json
```

---

## 📷 Screenshots

### Dashboard — Light Mode
![Dashboard Light](screenshots/dashboard-light.png)

### Dashboard — Dark Mode
![Dashboard Dark](screenshots/dashboard-dark.png)

### Transactions Hub (Dark Mode)
![Transactions](screenshots/transactions-dark.png)

### Insights & Analytics (Light Mode)
![Insights](screenshots/insights-light.png)

---

## ⚙️ Tech Stack

This project was built utilizing un-bloated modern web technologies:

- **Frontend Framework**: [React.js](https://react.dev/) (via [Vite](https://vitejs.dev/))
- **Styling**: Vanilla CSS (`index.css` via custom Glassmorphism and CSS variables).
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Animations**: `react-countup` and Custom CSS Keyframes.
- **State Management**: Native React `useContext` mapped directly to browser `localStorage` persistence.

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple command-line steps.

### Prerequisites

Make sure [Git](https://git-scm.com/) and [NodeJS](https://nodejs.org/) are installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yashvrdhan/Finance-Dashboard-UI.git
   cd Finance-Dashboard-UI
   ```

2. **Install all NPM dependencies:**
   ```bash
   npm install
   ```

3. **Start the local Vite server:**
   ```bash
   npm run dev
   ```

4. **Experience the app:**
   Navigate immediately to `http://localhost:5173/` in your browser.

---

## 🏗️ State Management

- **Vanilla Architecting:** Built exclusively using the native **React Context API combined with `useReducer`** (`AppContext.jsx`) to showcase deep scalable competency without needing Redux or Zustand.
- **Data Persistence:** Integrated an active sync hook ensuring all state changes are constantly written downstream to browser `localStorage`, persisting user settings unconditionally between reloads.
