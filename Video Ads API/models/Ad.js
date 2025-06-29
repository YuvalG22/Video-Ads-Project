import mongoose from "mongoose";

const adSchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
  advertiser: String,
  advertiserLink: String,
  category: String,
  duration: Number,
  impressions: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  clickTimestamps: { type: [Date], default: [] },
  createdAt: { type: Date, default: Date.now },
  city: String,
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

adSchema.index({ location: "2dsphere" });
const Ad = mongoose.model("Ad", adSchema);
export default Ad;
