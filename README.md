# 📺 Video Ads SDK

## ✨ Overview

A complete platform for displaying video ads based on location inside Android apps. The system includes:

- A RESTful API for managing ads.
- A React-based dashboard to create/edit ads, track statistics, and visualize locations.
- An Android SDK for easy integration into mobile apps.

## 👤 Target Audience

Android developers who want to monetize their apps with location-based video ads.

## 🧱 Tech Stack

- **Backend:** Node.js + Express + MongoDB
- **Dashboard:** React (Vite + MUI)
- **Android SDK & Example App:** Java

---

## 🌐 API Service

**Base URL:** `https://video-ads-api.onrender.com/api`

### 🔧 Key Endpoints:

- `GET /ads` – Retrieve all ads
- `POST /ads` – Create a new ad
- `PUT /ads/:id` – Edit an ad
- `DELETE /ads/:id` – Delete an ad
- `POST /ads/:id/view` – Register a view
- `POST /ads/:id/click` – Register a click

### 📦 Sample Ad JSON

```json
{
  "title": "Cool Ad",
  "advertiser": "Company X",
  "duration": 30,
  "videoUrl": "https://...",
  "city": "Tel Aviv",
  "link": "https://company.com"
}
```

🧩 Want to use your own database?  
See [API Setup Guide]([./Video Ads API/README.md#-using-your-own-mongodb-database](https://github.com/YuvalG22/Video-Ads-Project/blob/main/Video%20Ads%20API/README.md#-using-your-own-mongodb-database))


---

## 📱 Android Library

### 🔗 Installation (via JitPack)

```gradle
repositories {
    maven { url 'https://jitpack.io' }
}
dependencies {
    implementation ("com.github.YuvalG22:VIdeo-Ads-SDK:v2.1")
}
```

### 🚀 Usage

```java
VideoAdsSdk.init(context);
VideoAdsSdk.showAd(context);
```

- Ad plays in full-screen, unskippable format.
- Ad blocks user exit until end or user click.
- Clicks open advertiser's link and are tracked.

---

## 📲 Android Example App

### 🎯 Purpose

Demo application to test the SDK and show how to integrate it easily.

### 🛠 Setup Instructions

- Clone the project.
- Open with Android Studio.
- Build and run on emulator or device.

### 📱 Screens

- Splash screen
- Full-screen video ad on load

---

## 📊 Admin Dashboard

### 🌍 URL

[https://video-ads-dashboard.vercel.app/](https://video-ads-dashboard.vercel.app/)

### ⚙️ Features

- Add, edit, and delete ads
- View ad list with impressions and clicks
- Sort ads by performance
- See ad locations on map (Leaflet)
- Visual analytics: top ads, revenue estimates, hourly breakdown

### 🚀 Run Locally

```bash
npm install
npm run dev
```

---

## 🚀 Deployment

- **Backend:** Hosted on Render
- **Dashboard:** Hosted on Vercel
- **Database:** MongoDB Atlas
- **SDK:** Distributed via JitPack

---

## 📚 Documentation

- Full docs available at: [docs](https://username.github.io/project-name/)
- Docs include:
  - Full API reference
  - SDK integration guide
  - Deployment guide

---

## 👨‍💻 Getting Started as a Developer

1. Clone the project
2. Install dependencies
3. Try the SDK in your app
4. Manage ads in the dashboard
5. Track stats via API or dashboard

---

## 📄 License

See [LICENSE](./LICENSE) file for usage rights and distribution terms.
