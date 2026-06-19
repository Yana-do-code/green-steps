# Green Steps — Carbon Footprint Awareness Platform

A full-stack **React + Node.js** application built with the Eco-Momentum design system.

## Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | React 18 + Vite + React Router          |
| Charts   | Recharts                                |
| Icons    | Lucide React                            |
| Backend  | Node.js + Express                       |
| Styling  | Vanilla CSS (Eco-Momentum design system)|
| Fonts    | Montserrat (headings) + Inter (body)    |

## Project Structure

```
green-steps/
├── client/              # React frontend (port 3000)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx        # Hero, features, stats, CTA
│   │   │   ├── Dashboard.jsx      # Footprint overview, charts
│   │   │   ├── Insights.jsx       # AI insights, comparisons
│   │   │   └── ActionLibrary.jsx  # Filterable eco-actions
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── App.jsx
│   │   └── index.css              # Design system tokens
│   ├── index.html
│   └── vite.config.js
├── server/              # Express API (port 5000)
│   └── index.js
└── package.json         # Root — runs both with concurrently
```

## Getting Started

### 1. Install dependencies

```bash
# From the green-steps root directory:
npm install

cd client && npm install && cd ..
cd server && npm install && cd ..
```

### 2. Run in development

```bash
# From the root — starts both client (3000) and server (5000):
npm run dev
```

Or run separately:
```bash
# Terminal 1 — Express API
cd server && npm run dev

# Terminal 2 — React frontend
cd client && npm run dev
```

### 3. Open the app

Visit **http://localhost:3000**

## Pages

| Route        | Page           | Description                              |
|--------------|----------------|------------------------------------------|
| `/`          | Landing        | Hero, features, animated stats, CTA      |
| `/dashboard` | Dashboard      | Footprint cards, area chart, pie chart   |
| `/insights`  | Insights       | AI recommendations, weekly trends        |
| `/actions`   | Action Library | Filterable/sortable eco-action catalogue |

## API Endpoints

| Method | Endpoint                     | Description              |
|--------|------------------------------|--------------------------|
| GET    | `/api/dashboard`             | Dashboard data           |
| GET    | `/api/insights`              | Insights + comparisons   |
| GET    | `/api/actions?category=&difficulty=` | Action list    |
| POST   | `/api/actions/:id/complete`  | Toggle action complete   |
| POST   | `/api/actions/:id/bookmark`  | Toggle bookmark          |
| GET    | `/api/stats`                 | Platform-wide stats      |
