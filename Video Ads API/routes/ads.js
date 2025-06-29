import express from "express";
import Ad from "../models/Ad.js";

const router = express.Router();

const cityToCoordinates = {
  "Tel Aviv": [34.7818, 32.0853],
  "Jerusalem": [35.2137, 31.7683],
  "Haifa": [34.9896, 32.7940],
  "Beer Sheva": [34.7913, 31.2518],
  "Netanya": [34.8555, 32.3215],
  "Rishon LeZion": [34.7894, 31.9730],
  "Eilat": [34.9500, 29.5581],
  "Tiberias": [35.5283, 32.7922],
  "Herzliya": [34.8409, 32.1663],
  "Ashdod": [34.6405, 31.8014],
  "Current": [34.5593, 30.4955],
};

//Get all ads
router.get("/", async (req, res) => {
  try {
    const ads = await Ad.find();
    res.json(ads);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get ad by location
router.get("/by-location", async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "Missing lat/lng parameters" });
  }

  try {
    const nearbyAds = await Ad.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: 50000
        }
      }
    });

    if (nearbyAds.length > 0) {
      return res.json(nearbyAds[0]);
    }

    const allAds = await Ad.find();
    if (allAds.length === 0) {
      return res.status(404).json({ error: "No ads in the system" });
    }

    const randomAd = allAds[Math.floor(Math.random() * allAds.length)];
    return res.json(randomAd);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

//Get ad by id
router.get("/:id", async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (ad) res.json(ad);
    else res.status(404).json({ error: "Ad not found" });
  } catch (err) {
    res.status(500).json({ error: "Invalid ID" });
  }
});

//Create new ad
router.post("/", async (req, res) => {
  try {
    const adData = { ...req.body };

    if (!adData.location && adData.city && cityToCoordinates[adData.city]) {
      const [lng, lat] = cityToCoordinates[adData.city];
      adData.location = {
        type: "Point",
        coordinates: [lng, lat],
      };
    }

    const ad = new Ad(adData);
    const savedAd = await ad.save();
    res.status(201).json(savedAd);
  } catch (err) {
    console.error("❌ Error creating ad:", err);
    res.status(400).json({ error: "Invalid data" });
  }
});

// Update an ad by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedAd = await Ad.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedAd) return res.status(404).json({ error: 'Ad not found' });
    res.json(updatedAd);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: 'Update failed' });
  }
});

//Delete ad
router.delete('/:id', async (req, res) => {
  try {
    await Ad.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

//Ad impression
router.post('/:id/view', async (req, res) => {
  try {
    await Ad.findByIdAndUpdate(req.params.id, { $inc: { impressions: 1 } });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: 'View update failed' });
  }
});

//Ad click
router.post('/:id/click', async (req, res) => {
  try {
    const now = new Date().toISOString();
    await Ad.findByIdAndUpdate(req.params.id, { $inc: { clicks: 1 }, $push: { clicksTimestamps: now } });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: 'Click update failed' });
  }
});

export default router;