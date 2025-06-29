import express from "express"
import mongoose from "mongoose";
import cors from "cors"
import adsRoutes from "./routes/ads.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/ads", adsRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() =>
    app.listen(8080, () => console.log("Server running on port 8080"))
  )
  .catch((err) => console.error(err));