# 🌐 Video Ads API

RESTful API service to manage video ads, impressions, clicks, and metadata.

## 🛠 Setup

```bash
npm install
node index.js
```

Environment Variables (example):

```
PORT=5000
MONGO_URI=your-mongo-url
```

## 🔑 Endpoints

- `GET /ads` – Get all ads
- `POST /ads` – Create new ad
- `PUT /ads/:id` – Edit ad
- `DELETE /ads/:id` – Delete ad
- `POST /ads/:id/view` – Register view
- `POST /ads/:id/click` – Register click

## 🧰 Tech

- Node.js
- Express
- MongoDB
- Mongoose

## 📄 License

See main project LICENSE.