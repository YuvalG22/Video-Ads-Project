import axios from "axios";

const advertiserLinks = {
  Sportify: "https://sportify.example.com",
  FitLife: "https://www.msdmanuals.com/",
  TuneIt: "https://tuneit.example.com",
  EduMart: "https://www.savethestudent.org/",
  DevSchool: "https://devschool.example.com",
  SkillLab: "https://skilllab.example.com",
  TravelCo: "https://travelco.example.com",
  FlyAway: "https://skyscanner.com",
  CarryCo: "https://carryco.example.com",
  StreamIt: "https://streamit.example.com",
  WatchAll: "https://watchall.example.com",
  EventHub: "https://eventhub.example.com",
  CafeX: "https://themorningcoffeeclub.com/",
  SliceZone: "https://slicezone.example.com",
  GlowUp: "https://glowup.example.com",
  TimePro: "https://timepro.example.com",
  PlayMax: "https://playmax.example.com",
  HomeTech: "https://hometech.example.com",
  TechZone: "https://techzone.example.com",
  Mobix: "https://mobix.example.com",
  AutoLine: "https://autoline.example.com",
  FreshGo: "https://freshgo.example.com",
  FinBank: "https://finbank.example.com",
};

async function updateAllAdsWithLinks() {
  try {
    const res = await axios.get("https://video-ads-api.onrender.com/api/ads");
    const ads = res.data;

    for (const ad of ads) {
      const link = advertiserLinks[ad.advertiser];
      if (!link) continue;

      await axios.put(`https://video-ads-api.onrender.com/api/ads/${ad._id}`, {
        ...ad,
        advertiserLink: link,
      });

      console.log(`✅ Updated ${ad.title} with link ${link}`);
    }
  } catch (err) {
    console.error("❌ Error updating ads:", err.message);
  }
}

updateAllAdsWithLinks();