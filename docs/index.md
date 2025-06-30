
# 📚 Video Ads Platform – Complete Documentation

> Generated 2025‑06‑30

---

## 🗺️ Architecture
```
.
├── api/                 # Node.js + Express + MongoDB REST API
├── android-sdk/         # VideoAds SDK (Java, ExoPlayer)
├── android-example/     # Demo app using the SDK
├── dashboard/           # React + Vite admin dashboard
└── docs/                # Documentation (GitHub Pages)
```

![architecture diagram](./images/architecture.png)

---

## 1 🌐 REST API

### Base URL
```
https://video-ads-api.onrender.com/api
```

### .env
```env
PORT=5000
MONGO_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/video_ads
```

### Key Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET    | /ads | List ads |
| POST   | /ads | Create ad |
| PUT    | /ads/:id | Update ad |
| DELETE | /ads/:id | Delete ad |
| POST   | /ads/:id/view | +1 view |
| POST   | /ads/:id/click | +1 click |
| GET    | /ads/by-location?lat&lng | Ad by coordinates |

```js
// Express click route
router.post('/:id/click', async (req,res)=>{
  const now = new Date().toISOString();
  await Ad.findByIdAndUpdate(
    req.params.id,
    { $inc:{clicks:1}, $push:{clicksTimestamps:now} }
  );
  res.sendStatus(200);
});
```

```js
// fetch example
fetch("https://video-ads-api.onrender.com/api/ads")
  .then(r=>r.json())
  .then(console.log);
```

---

## 2 📱 Android SDK

```gradle
repositories { maven { url 'https://jitpack.io' } }
dependencies {
    implementation "com.github.YuvalG22:Video-Ads-SDK:v2.1"
}
```

```java
VideoAdsSdk.init(context);
VideoAdsSdk.showAd(context);
```

```java
// Player listener snippet
player.addListener(new Player.Listener(){
  @Override public void onPlaybackStateChanged(int s){
    if(s==Player.STATE_ENDED && !adClicked) finish();
  }
});
```

---

## 3 📲 Example App

Open **android-example/** in Android Studio → Run.

---

## 4 🖥️ Dashboard

Live: https://video-ads-dashboard.vercel.app  

```bash
cd dashboard
npm install
npm run dev
```
CRUD ads, map, charts.

---

## 5 🔧 Local Stack

```bash
cd api && npm i && npm run dev
cd dashboard && npm i && npm run dev
```

---

## 6 🚀 Deployment

| Part | Host |
|------|------|
| API  | Render |
| DB   | Atlas |
| UI   | Vercel |
| SDK  | JitPack |

Change DB by editing `.env`.

---

## 7 📚 GitHub Pages

Place this file as `docs/index.md`, enable Pages (branch main, /docs).

---

## 8 📄 License

MIT
