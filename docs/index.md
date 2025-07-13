# Video Ads Platform – Complete Documentation

> **Version:** 1.0 • **Last updated:** 2 July 2025

---

## Table of Contents

1. [Introduction](#introduction)
2. [Architecture Overview](#architecture-overview)
3. [Project Structure](#project-structure)
4. [Quick‑Start](#quick-start)
5. [Component Guides](#component-guides)
   - 5.1 [RESTful API (Video Ads API)](#51-restful-api-video-ads-api)
   - 5.2 [Android Video Ads SDK](#52-android-video-ads-sdk)
   - 5.3 [Admin Dashboard](#53-admin-dashboard)
   - 5.4 [Android Example App](#54-android-example-app)
6. [Deployment Guide](#deployment-guide)
7. [Contributing](#contributing)
8. [License](#license)

---

## Introduction

The **Video Ads Platform** is an end‑to‑end solution that lets Android developers monetize their apps with **location‑aware, full‑screen, non‑skippable video ads**. The platform is composed of four sub‑projects:

| Component                     | Purpose                                 | Tech Stack                  |
| ----------------------------- | --------------------------------------- | --------------------------- |
| **Video Ads API**             | Stores ads, tracks impressions & clicks | Node.js · Express · MongoDB |
| **Android Video Ads Library** | Embeds ads inside any Android app       | Java                        |
| **Admin Dashboard**           | Create / edit ads & view analytics      | React (Vite) · MUI          |
| **Example App**               | Minimal showcase of SDK integration     | Java · Android              |

---

## Architecture Overview

```text
┌─────────────┐          HTTPS           ┌──────────────┐
│  Android    │  ───── REST API ─────▶  │ Video Ads API│
│  App/SDK    │                         │  (Node/DB)   │
└─────────────┘                         └──────────────┘
      ▲  ▲                                     ▲
      │  └── Event Webhooks / JSON             │
      │                                        │
      │   Ad assets (MP4) + metadata           │
┌─────────────┐          HTTPS           ┌──────────────┐
│ Admin Dash  │  ◀──── REST API ───────  │  MongoDB     │
└─────────────┘                         └──────────────┘
```

- **One API, many clients.** Both the SDK and the dashboard speak the same REST interface.
- **Stateless media delivery.** Videos are streamed directly from their cloud URL; the API only stores metadata.
- **Analytics first.** Every view/click is POSTed back to the API in real time so the dashboard can visualise performance.

---

## Project Structure

```
Video-Ads-Project/
├─ ExampleApp/           # Demo Android application
├─ Video Ads API/        # Node.js backend service
├─ Video-Ads-Dashboard/  # React admin UI
├─ VideoAds/             # Android library (SDK)
├─ docs/                 # project‑wide documentation
└─ README.md             # root overview
```

---

## Quick‑Start

| Goal                       | Command                                                                          |
| -------------------------- | -------------------------------------------------------------------------------- |
| **Run the API locally**    | `cd "Video Ads API" && npm install && node index.js`                             |
| **Run the dashboard**      | `cd "Video-Ads-Dashboard" && npm install && npm run dev`                         |
| **Test the SDK**           | Import the *VideoAds* module from JitPack and call `VideoAdsSdk.showAd(context)` |
| **Launch the Example App** | Open *ExampleApp/* in Android Studio and click **Run**                            |

> **Production demo:**
>
> - **API:** `https://video-ads-api.onrender.com/api`
> - **Dashboard:** https://video-ads-dashboard.vercel.app/

---

## Component Guides

### 5.1 RESTful API (Video Ads API)

#### 5.1.1 Setup

```bash
cd "Video Ads API"
npm install
# Create a .env file and set your connection string
echo "MONGO_URI=<your MongoDB connection string>" > .env   # or copy .env.example first
node server.js
```

| Env Var     | Default | Description               |
| ----------- | ------- | ------------------------- |
| `MONGO_URL` | –       | MongoDB connection string |

#### 5.1.2 Endpoints

| Method   | Route                          | Description                                                                      |
| -------- | ------------------------------ | -------------------------------------------------------------------------------- |
| `GET`    | `/ads`                         | List **all** ads                                                                 |
| `GET`    | `/ads/by-location?lat=…&lng=…` | Return the *nearest* ad to the given GPS position (≤ 50 km) or a random fallback |
| `GET`    | `/ads/:id`                     | Fetch a single ad by its Mongo `_id`                                             |
| `POST`   | `/ads`                         | Create a new ad                                                                  |
| `PUT`    | `/ads/:id`                     | Update an existing ad                                                            |
| `DELETE` | `/ads/:id`                     | Delete an ad                                                                     |
| `POST`   | `/ads/:id/view`                | Increment the `impressions` counter                                              |
| `POST`   | `/ads/:id/click`               | Increment the `clicks` counter **and** push a timestamp to `clicksTimestamps`    |

#### 5.1.3 Example endpoint implementation

Below is an excerpt from **`routes/ads.js`** that powers the *location‑based* lookup endpoint:

```javascript
// routes/ads.js (excerpt)
router.get("/by-location", async (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) {
    return res.status(400).json({ error: "Missing lat/lng parameters" });
  }

  try {
    // 50 km radius geo‑query (uses a 2dsphere index on `location`)
    const nearbyAds = await Ad.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: 50000,
        },
      },
    });

    if (nearbyAds.length) {
      return res.json(nearbyAds[0]); // closest match
    }

    // fallback – return a random ad if nothing is nearby
    const allAds = await Ad.find();
    const randomAd = allAds[Math.floor(Math.random() * allAds.length)];
    res.json(randomAd);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
```

##### Sample Ad JSON

```json
{
  "title": "Cool Ad",
  "advertiser": "Company X",
  "duration": 30,
  "videoUrl": "https://.../video.mp4",
  "city": "Tel Aviv",
  "link": "https://company.com"
}
```

### 5.2 Android Video Ads Library

#### 5.2.1 Installation

Add JitPack to your root *build.gradle*:

```gradle
repositories {
    maven { url 'https://jitpack.io' }
}
```

Then add the dependency:

```gradle
dependencies {
    implementation "com.github.YuvalG22:Video-Ads-SDK:v2.1"
}
```

#### 5.2.2 Initialization & Usage

```java
// Application class
@Override
public void onCreate() {
    super.onCreate();
    VideoAdsSdk.init(this);
}

// Wherever you want to show an ad
VideoAdsSdk.showAd(this);
```

- **Location permission required** – The SDK relies on the device’s GPS; declare `ACCESS_FINE_LOCATION` (and optionally `ACCESS_COARSE_LOCATION`) in *AndroidManifest.xml* **and** request it at runtime, otherwise `showAd()` will not load an ad.
- **Click tracking** – Tapping opens the advertiser URL in a browser *and* registers a click.

##### 5.2.3 Core `showAd()` Implementation

```java
public static void showAd(Context context) {
    FusedLocationProviderClient fusedLocationClient = LocationServices.getFusedLocationProviderClient(context);

    if (ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
        return;
    }

    fusedLocationClient.getLastLocation()
            .addOnSuccessListener(location -> {
                if (location != null) {
                    double lat = location.getLatitude();
                    double lng = location.getLongitude();

                    adService.getAdByLocation(lat, lng).enqueue(new Callback<Ad>() {
                        @Override
                        public void onResponse(Call<Ad> call, Response<Ad> response) {
                            if (response.isSuccessful() && response.body() != null) {
                                Ad ad = response.body();
                                Intent intent = new Intent(context, AdPlayerActivity.class);
                                intent.putExtra("video_url", ad.videoUrl);
                                intent.putExtra("ad_id", ad._id);
                                intent.putExtra("ad_title", ad.title);
                                intent.putExtra("link", ad.advertiserLink);
                                context.startActivity(intent);

                                adService.incrementView(ad._id).enqueue(new Callback<Void>() {
                                    @Override public void onResponse(Call<Void> call, Response<Void> response) {}
                                    @Override public void onFailure(Call<Void> call, Throwable t) {}
                                });
                            }
                        }

                        @Override
                        public void onFailure(Call<Ad> call, Throwable t) {
                            // handle failure
                        }
                    });
                }
            });
}
```

### 5.3 Admin Dashboard

- **Local dev:**
  ```bash
  cd "Video-Ads-Dashboard"
  npm install
  npm run dev
  ```
- **Features**
  - CRUD operations on ads
  - Live table with sorting, filtering & search
  - Leaflet map showing ad locations
  - Charts: impressions vs clicks, hourly breakdown, revenue estimate

---

### 5.4 Android Example App

A minimal Activity that calls `VideoAdsSdk.showAd()` on startup so you can validate end‑to‑end flow. **Note:** The example app requests the `ACCESS_FINE_LOCATION` runtime permission because the SDK uses the deviceʼs GPS to fetch geo‑targeted ads; if the user denies this permission, no ad will be loaded.

**Run:** open *ExampleApp/* in Android Studio → *Run* ▶️.

---

## License

This project is licensed under the **MIT License**. See the root `LICENSE` file for full text.
