# 🌸 CivicBloom & FoundHub

> **A Unified, Pastel-Minimal Community Platform for Civic Infrastructure Hazards & Lost-and-Found Possessions**  
> *Routing reports through a verified **Submit ➔ Verify ➔ Resolve** pipeline with community urgency ranking, proximity-based duplicate detection, and AI smart matching.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-5B5BE6.svg)](https://web.dev/progressive-web-apps/)
[![Firebase Firestore](https://img.shields.io/badge/Database-Firebase%20Firestore-FFA611.svg)](https://firebase.google.com/)
[![EdgeStore.dev](https://img.shields.io/badge/Cloud%20Bucket-EdgeStore.dev-000000.svg)](https://edgestore.dev/)
[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black.svg)](https://vercel.com/)

---

## 🌟 Core Concept

One platform, two report types (**Civic Issues** and **Lost & Found**), both routed through the same **Submit ➔ Verify ➔ Resolve** pipeline, with community upvoting and comments driving credibility and facility prioritization.

```
                  ┌───────────────────────────────────────────────────────────┐
                  │                 CivicBloom & FoundHub Hub                 │
                  └─────────────────────────────┬─────────────────────────────┘
                                                │
                 ┌──────────────────────────────┴──────────────────────────────┐
                 ▼                                                             ▼
     [ ⚠️ Civic Issues & Potholes ]                                [ 🔎 Lost & Found Tracker ]
                 │                                                             │
                 ▼                                                             ▼
  [ 📍 Auto GPS & Geotagging ]                                  [ 📝 Post Lost / Found Items ]
                 │                                                             │
                 ▼                                                             ▼
  [ ⚡ Proximity Duplicate Detector (<35m) ]                    [ ✨ Multi-Factor Smart Matching ]
  Prompt: "Similar report nearby! Upvote instead"               Auto-match suggestions & % confidence
                 │                                                             │
                 ▼                                                             ▼
  [ 🔥 Community Urgency Upvotes (1-5 Severity) ]               [ 🔐 Secret Question Verification ]
                 │                                                             │
                 ▼                                                             ▼
  [ 🚀 4-Stage Status Pipeline: Reported ➔ Acknowledged ➔ In Progress ➔ Resolved / Reunited 🎉 ]
```

---

## ✨ Features Breakdown

### 1. Civic Infrastructure & Pothole Resolution
- **GPS & Map Geotagging**: Auto GPS location capture with campus/city landmark shortcuts.
- **Proximity-Based Duplicate Detection**: Calculates real-time Haversine coordinate distance. If a new report is dropped within **~30m** of an existing open issue, a gentle prompt alerts the user:
  > *"⚠️ Possible Duplicate Detected Nearby (12m away)! Upvote existing issue to boost urgency instead!"*
- **Community Urgency & Severity (1-5)**: Community upvotes prioritize dangerous potholes and blackout streetlights to the top of the feed instead of a flat chronological list.
- **Submit ➔ Verify ➔ Resolve Pipeline**: Complete timeline tracking from `Reported` ➔ `Acknowledged` ➔ `In Progress` ➔ `Resolved`.
- **Community Discussion & Photo Updates**: Timestamps, verification counts ("28 verified by students"), and maintenance remarks.

### 2. Lost & Found Hub with Smart Matching
- **Dual Flow**: Post as *"I Lost an Item"* or *"I Found an Item"*.
- **Multi-Factor Smart Match Engine**: Cross-compares Category, NLP tokenized keywords, Geolocation proximity, and Timestamps to calculate a **Match Confidence Score %** (e.g. *✨ 94% Match Found: Navy HydroFlask*).
- **Secure Claim & Verification Flow**: Finder can set an ownership verification question (e.g. *"What cat sticker is on the back?"*).
- **One-Click "Mark as Reunited 🎉"**: Triggers full celebratory confetti animation and closes the listing.

### 3. Interactive Geotagged Campus Map
- **CartoDB Positron Minimalist Map**: Custom pastel pins with category badges, pulsing urgency rings, and instant popup detail previews.
- **Landmark Jump Navigation**: Instant fly-to controls for major campus hotspots.

### 4. Facility Ops & Insights Dashboard
- SLA metrics: Resolution Rate %, Lost Item Reunion Rate %, Average Turnaround Hours, and Urgent Task Work Queue.
- Facility staff mode switcher to advance tickets with official notes.

---

## 🎨 Design Philosophy (Pastel Minimal)

Built with a curated, modern pastel aesthetic:
- **Tones**: Soft Lavender (`#DDD6FE`), Warm Peach (`#FED7AA`), Butter Yellow (`#FEF08A`), Mint Sage (`#A7F3D0`), Sky Blue (`#BAE6FD`), Warm Base (`#F8F9FA`).
- **Typography**: Clean *Plus Jakarta Sans* with crisp weight hierarchy.
- **No Robotic UI**: Warm pill badges, glassmorphism cards, micro-interactions, smooth status steppers.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, Lucide Icons, Canvas Confetti |
| **Mapping** | Leaflet, React-Leaflet, CartoDB Positron Tiles |
| **PWA** | Vite Plugin PWA (`vite-plugin-pwa`), Service Worker, Web App Manifest |
| **Database** | Firebase Firestore (Real-time `onSnapshot` & Offline IndexedDB Cache) |
| **Cloud Storage** | EdgeStore.dev (`@edgestore/react`, `@edgestore/server`) for image buckets |
| **Backend** | Node.js, Express, Vercel Serverless Functions (`/api/edgestore`) |
| **Deployment** | Vercel (Configured with `vercel.json` SPA & API rewrites) |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0+ or v20.0+
- **npm** or **pnpm**

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/civic-found-hub.git
cd civic-found-hub
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Fill in your Firebase and EdgeStore credentials (or leave blank to run in offline-first synced mode):
```env
# Node Backend Port
PORT=3001

# Firebase Firestore (Client)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_id
VITE_FIREBASE_APP_ID=your_app_id

# EdgeStore.dev (Cloud Image Bucket)
EDGE_STORE_ACCESS_KEY=your_edgestore_access_key
EDGE_STORE_SECRET_KEY=your_edgestore_secret_key
```

### 3. Run Locally

#### Start Vite Frontend Dev Server:
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

#### Start Node.js Express Backend (Optional for local EdgeStore proxying):
```bash
npm run server
```
Runs backend API on **`http://localhost:3001`**.

---

## ☁️ Firebase Firestore Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. In the Project Overview, add a **Web App (`</>`)** and copy the config values into `.env`.
3. In the sidebar, click **Build ➔ Firestore Database ➔ Create Database** (Start in Test mode or Production mode).
4. Add the following Security Rules in **Firestore Rules tab**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /civic_issues/{document=**} {
      allow read, write: if true;
    }
    match /lost_found_items/{document=**} {
      allow read, write: if true;
    }
  }
}
```

---

## 📦 EdgeStore.dev Cloud Bucket Setup

1. Create a free account at [dashboard.edgestore.dev](https://dashboard.edgestore.dev/).
2. Create a new project and copy your **Access Key** and **Secret Key**.
3. Add keys to `.env`:
   ```env
   EDGE_STORE_ACCESS_KEY=edgestore_access_key_...
   EDGE_STORE_SECRET_KEY=edgestore_secret_key_...
   ```
4. In production on Vercel, the route `/api/edgestore/[...edgestore].js` automatically routes uploads to your EdgeStore bucket!

---

## ▲ Deploying to Vercel

The repository includes a ready-to-deploy [`vercel.json`](vercel.json) configuration for static SPA hosting and serverless API endpoints.

### Method 1: Deploy with Vercel CLI
```bash
npm i -g vercel
vercel
```

### Method 2: Deploy via Vercel Web Dashboard
1. Push your repository to GitHub / GitLab.
2. Go to [vercel.com/new](https://vercel.com/new) and import your repository.
3. In **Environment Variables**, add:
   - `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, etc.
   - `EDGE_STORE_ACCESS_KEY`, `EDGE_STORE_SECRET_KEY`
4. Click **Deploy**. Vercel will build the Vite app and serve API routes automatically!

---

## 📱 PWA (Progressive Web App) Installation

- **iOS / Safari**: Tap the **Share** button ➔ Select **"Add to Home Screen"**.
- **Android / Chrome**: Tap the **"Install CivicBloom PWA"** banner at the bottom or the browser install prompt.
- **Desktop (Chrome/Edge)**: Click the **Install** icon in the address bar to run CivicBloom as a standalone desktop app with offline asset caching.

---

## 📂 Project Structure

```
civic-found-hub/
├── api/
│   ├── edgestore/
│   │   └── [...edgestore].js     # Vercel serverless EdgeStore router handler
│   └── index.js                  # Vercel API gateway
├── public/
│   ├── icons/                    # PWA icons (192x192, 512x512)
│   └── manifest.webmanifest      # PWA Web App Manifest
├── src/
│   ├── components/
│   │   ├── AdminPanel.jsx        # Facility ops dashboard & metrics
│   │   ├── CivicDetailModal.jsx  # 4-stage pipeline stepper & rating
│   │   ├── CivicIssuesView.jsx   # Filterable grid & urgency ranking
│   │   ├── CivicReportModal.jsx  # Geotag form & duplicate warning banner
│   │   ├── EdgeStoreUploader.jsx # Cloud bucket dropzone & progress bar
│   │   ├── Icon.jsx              # Lucide dynamic icon helper
│   │   ├── InteractiveMap.jsx    # Leaflet geotagged campus map
│   │   ├── LostFoundDetailModal.jsx # Smart matches drawer & claim flow
│   │   ├── LostFoundModal.jsx    # Post lost/found form with secret question
│   │   ├── LostFoundView.jsx     # Lost vs Found cards & match suggestions
│   │   ├── Navbar.jsx            # Pastel navigation & staff mode toggle
│   │   └── PWAInstallBanner.jsx  # Mobile/desktop install prompt
│   ├── data/
│   │   └── mockData.js           # Initial realistic campus dataset
│   ├── services/
│   │   ├── edgestore.jsx         # EdgeStore client provider & upload service
│   │   ├── edgestoreRouter.js    # EdgeStore backend router
│   │   ├── firebase.js           # Firestore real-time client & offline sync
│   │   ├── matchingEngine.js     # Haversine distance & NLP similarity engine
│   │   └── storage.js            # LocalStorage persistence manager
│   ├── types/
│   │   └── index.js              # Categories, statuses & campus landmarks
│   ├── App.jsx                   # Root application coordinator
│   ├── index.css                 # Custom pastel design tokens & glass styles
│   └── main.jsx                  # React application entry
├── .env.example                  # Environment template
├── LICENSE                       # MIT License
├── package.json                  # Dependencies & scripts
├── server.js                     # Express Node.js backend server
├── tailwind.config.js            # Pastel minimalist color system
├── vercel.json                   # Vercel deployment configuration
└── vite.config.js                # Vite & VitePWA configuration
```

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">
  <sub>Built with 🌸 for better communities, safer pathways, and reunited belongings.</sub>
</div>
