# GreenSteps — Personal Carbon Footprint Tracker

A smart, dynamic web application that helps users track their daily carbon footprint, receive personalised eco-action recommendations, and build sustainable habits over time.

**Live Demo:** [green-steps.vercel.app](https://green-steps.vercel.app)

---

## Chosen Vertical

**Sustainability & Climate Awareness**

GreenSteps targets everyday individuals who are aware of climate change but unsure how to act on it. The app bridges the gap between awareness and action by quantifying the carbon impact of daily habits and guiding users toward the highest-value changes for their specific lifestyle.

---

## Approach and Logic

### The Problem
Most people know they should reduce their carbon footprint but don't know:
- What their footprint actually is
- Which of their habits matter most
- Whether their actions are making a real difference

### The Solution
GreenSteps acts as a **personal eco-assistant** — not just a tracker. It observes the user's logging behaviour over time and makes intelligent, context-aware suggestions rather than showing the same generic advice to everyone.

### Core Logic

**1. Personalised Recommendations Engine (`src/utils/recommendations.js`)**

The recommendation system analyses the user's last 30 days of logged activity to identify their weakest category (the one they engage with least). It then surfaces the highest-impact actions from that neglected area, scored as:

```
score = (impact × 10) + (5 if category is the user's weakest) 
```

Actions already logged today are excluded. This means two users with different habits will see completely different suggestions, even from the same action catalogue.

**2. Contextual Daily Messaging**

The dashboard header shows a dynamic message that changes based on the user's current state:
- Streak at risk → urgent warning before the streak breaks
- First action logged today → encouragement to do one more
- Three or more actions → positive reinforcement
- Nothing logged → gentle prompt to start

**3. Daily Logging Model**

Actions are not one-time checkboxes. Users log what they actually did *today*, and the same action can be logged on multiple days. This mirrors how real habits work — taking public transit is not a one-time achievement, it's a daily choice. The impact accumulates over time, making the dashboard's CO₂ savings chart grow meaningfully.

**4. Category Gap Analysis**

The system tracks four categories: Transport, Diet, Energy, Shopping. If a user consistently logs Diet actions but never logs Transport actions, the recommendations will prioritise Transport — because that is where the largest untapped impact lies for that specific user.

---

## How the Solution Works

### Architecture

```
GreenSteps (frontend-only, deployed on Vercel)
│
├── Firebase Authentication   — email/password + Google sign-in
├── Firebase Realtime Database — per-user progress storage
└── React + Vite              — UI and all logic
```

There is no backend server. All data is stored in Firebase under `users/{uid}/progress` and all computation happens client-side.

### Pages

| Route | Description | Auth Required |
|---|---|---|
| `/` | Landing — hero, features, impact section, CTA | No |
| `/login` | Sign in / Sign up with email or Google | No |
| `/calculator` | 4-step carbon footprint estimator | No |
| `/dashboard` | Stats, smart suggestions, charts, recent activity | Yes |
| `/insights` | Personalised insight cards, eco score, comparisons | Yes |
| `/actions` | Full action catalogue — log daily, filter, bookmark | Yes |
| `/terms` `/privacy` `/cookies` | Legal pages | No |

### Data Model

Each user has one document in Firebase Realtime Database:

```json
{
  "users": {
    "{uid}": {
      "progress": {
        "joinedDate": "2026-06-19",
        "completedActions": [
          { "id": 3, "title": "Use public transit", "impact": 0.8, "category": "Transport", "completedAt": "2026-06-19" },
          { "id": 3, "title": "Use public transit", "impact": 0.8, "category": "Transport", "completedAt": "2026-06-20" }
        ],
        "bookmarkedActions": [1, 7, 12]
      }
    }
  }
}
```

The same action logged on different days produces separate entries. The total CO₂ saved is the sum of all entries across all days.

### Smart Suggestion Flow

```
User opens Dashboard
        │
        ▼
Analyse last 30 days of completedActions
        │
        ├── Count logs per category → find weakest category
        ├── Find today's already-logged action IDs
        └── Score remaining actions → surface top 3
                │
                ▼
        Show "Suggested for You" with one-tap "Log Now" buttons
                │
                ▼
        User taps Log Now → entry added to Firebase instantly
                │
                ▼
        Suggestions update in real time (logged action disappears from list)
```

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| Animations | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| Auth | Firebase Authentication |
| Database | Firebase Realtime Database |
| Styling | Vanilla CSS with design tokens |
| Deployment | Vercel |

---

## Running Locally

### 1. Clone and install

```bash
git clone https://github.com/Yana-do-code/green-steps.git
cd green-steps/client
npm install
```

### 2. Set up environment variables

Create `client/.env.local` with your Firebase project credentials:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### 3. Run the dev server

```bash
npm run dev
```

Visit **http://localhost:5173**

---

## Assumptions Made

1. **Global average footprint of 7.5t CO₂e/year** is used as the baseline. This is sourced from the Global Carbon Project and is widely cited as the per-capita average.

2. **Sustainable target of 2t CO₂e/year** is the IPCC-aligned figure for limiting warming to 1.5°C by 2050.

3. **Action impact values** (e.g. "switching to public transit saves 0.8t/yr") are approximate annual averages derived from published lifecycle emissions data. They are illustrative rather than precisely personalised.

4. **Daily logging model** assumes users will open the app each day to log habits. There are no push notifications in the current version — the streak mechanic and contextual messages are the primary re-engagement mechanism.

5. **One account per person.** There is no household or shared-account model. All progress is individual.

6. **Firebase free tier limits** (1 GB storage, 10 GB/month download) are sufficient for a personal-use app with hundreds of users. The app is designed to stay within these limits.
