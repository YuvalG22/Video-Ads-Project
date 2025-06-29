import axios from "axios";

const advertiserToCategory = {
  Sportify: "Lifestyle",
  FitLife: "Lifestyle",
  TuneIt: "Lifestyle",
  EduMart: "Education",
  DevSchool: "Education",
  SkillLab: "Education",
  TravelCo: "Travel",
  FlyAway: "Travel",
  CarryCo: "Travel",
  StreamIt: "Entertainment",
  WatchAll: "Entertainment",
  EventHub: "Entertainment",
  CafeX: "Food",
  SliceZone: "Food",
  GlowUp: "Beauty",
  TimePro: "Fashion",
  PlayMax: "Kids",
  HomeTech: "Technology",
  TechZone: "Technology",
  Mobix: "Technology",
  AutoLine: "Automotive",
  FreshGo: "E-Commerce",
  FinBank: "Finance",
};

const rawAds = [
  ["Sneaker Sale", "Sportify"],
  ["Fitness Gear", "Sportify"],
  ["Yoga Promo", "FitLife"],
  ["Healthy Living", "FitLife"],
  ["Guitar Basics", "TuneIt"],
  ["Learn Guitar", "TuneIt"],
  ["Back to School", "EduMart"],
  ["Study Deals", "EduMart"],
  ["Code Fast", "DevSchool"],
  ["JS Bootcamp", "DevSchool"],
  ["Upskill Now", "SkillLab"],
  ["Career Boost", "SkillLab"],
  ["Holiday Deals", "TravelCo"],
  ["Beach Escape", "TravelCo"],
  ["Fly Cheap", "FlyAway"],
  ["Quick Flights", "FlyAway"],
  ["Travel Bags", "CarryCo"],
  ["Luggage Promo", "CarryCo"],
  ["Movie Night", "StreamIt"],
  ["New Series", "StreamIt"],
  ["Watch More", "WatchAll"],
  ["Streaming Pass", "WatchAll"],
  ["Live Music", "EventHub"],
  ["Concerts Now", "EventHub"],
  ["Morning Coffee", "CafeX"],
  ["Coffee Break", "CafeX"],
  ["Pizza Party", "SliceZone"],
  ["Slice Deals", "SliceZone"],
  ["Skincare Sale", "GlowUp"],
  ["Beauty Tips", "GlowUp"],
  ["Luxury Time", "TimePro"],
  ["Watch Deals", "TimePro"],
  ["Toys Time", "PlayMax"],
  ["Play Big", "PlayMax"],
  ["Smart Home", "HomeTech"],
  ["Tech Deals", "HomeTech"],
  ["Gaming Setup", "TechZone"],
  ["Upgrade PC", "TechZone"],
  ["Phone Promo", "Mobix"],
  ["Mobile Deals", "Mobix"],
  ["Used Cars", "AutoLine"],
  ["Car Deals", "AutoLine"],
  ["Grocery Now", "FreshGo"],
  ["Fresh Basket", "FreshGo"],
  ["Bank Online", "FinBank"],
  ["Save Smart", "FinBank"],
];

function randomDateWithinLastYear() {
  const now = new Date();
  const past = new Date(now);
  past.setFullYear(now.getFullYear() - 1);
  const timestamp =
    past.getTime() + Math.random() * (now.getTime() - past.getTime());
  return new Date(timestamp).toISOString();
}

function generateClickTimestamps(clicks, startDate) {
  const timestamps = [];
  const start = new Date(startDate).getTime();
  const now = Date.now();
  for (let i = 0; i < clicks; i++) {
    const time = new Date(start + Math.random() * (now - start));
    timestamps.push(time.toISOString());
  }
  return timestamps;
}

function randomLocationInIsrael() {
  const locations = [
    { name: "Tel Aviv", coordinates: [34.7818, 32.0853] },
    { name: "Jerusalem", coordinates: [35.2137, 31.7683] },
    { name: "Haifa", coordinates: [34.9896, 32.7940] },
    { name: "Beer Sheva", coordinates: [34.7913, 31.2518] },
    { name: "Herzliya", coordinates: [34.8409, 32.1663] },
    { name: "Netanya", coordinates: [34.8555, 32.3215] },
    { name: "Rishon LeZion", coordinates: [34.7894, 31.9730] },
    { name: "Ashdod", coordinates: [34.6405, 31.8014] },
    { name: "Holon", coordinates: [34.7790, 32.0104] },
    { name: "Petah Tikva", coordinates: [34.8878, 32.0871] },
    { name: "Modiin", coordinates: [35.0046, 31.8981] },
    { name: "Ra'anana", coordinates: [34.8739, 32.1848] },
    { name: "Tiberias", coordinates: [35.5283, 32.7922] },
    { name: "Kiryat Shmona", coordinates: [35.5717, 33.2076] },
    { name: "Eilat", coordinates: [34.9500, 29.5581] },
  ];

  const selected = locations[Math.floor(Math.random() * locations.length)];
  const [lng, lat] = selected.coordinates;
  return {
    type: "Point",
    coordinates: [lng, lat]
  };
}

function generateAd(title, advertiser) {
  const impressions = Math.floor(Math.random() * 2000) + 100;
  const clicks = Math.max(1, Math.floor(impressions * (Math.random() * 0.3)));
  const category = advertiserToCategory[advertiser];
  const createdAt = randomDateWithinLastYear();

  return {
    title,
    advertiser,
    category,
    duration: [15, 30, 45, 60][Math.floor(Math.random() * 4)],
    videoUrl: "https://cdn.example.com/video.mp4",
    advertiserLink: "https://cdn.example.com",
    impressions,
    clicks,
    createdAt,
    clickTimestamps: generateClickTimestamps(clicks, createdAt),
    location: randomLocationInIsrael(),
  };
}

const ads = rawAds.map(([title, advertiser]) => generateAd(title, advertiser));

async function clearAllAds() {
  try {
    const res = await axios.get("https://video-ads-api.onrender.com/api/ads");
    for (const ad of res.data) {
      await axios.delete(
        `https://video-ads-api.onrender.com/api/ads/${ad._id}`
      );
      console.log("❌ Deleted:", ad.title);
    }
  } catch (err) {
    console.error("⚠️ Error deleting:", err.response?.data || err.message);
  }
}

async function seed() {
  await clearAllAds();
  for (const ad of ads) {
    try {
      const res = await axios.post(
        "https://video-ads-api.onrender.com/api/ads",
        ad
      );
      console.log("✅ Added:", res.data.title);
    } catch (err) {
      console.error("❌ Error:", ad.title, err.response?.data || err.message);
    }
  }
}

seed();