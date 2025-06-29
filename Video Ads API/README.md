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
### 🛠 Using your own MongoDB database

To run the API with your own MongoDB database:

1. Clone the backend project.
2. Create a `.env` file at the root of the API directory:
 ```env
 MONGO_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
 ```

3. Install dependencies and run
 ```bash
 npm install
 node index.js
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
