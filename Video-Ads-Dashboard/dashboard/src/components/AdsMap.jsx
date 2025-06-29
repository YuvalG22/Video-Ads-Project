import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const AdsMap = () => {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    fetch("https://video-ads-api.onrender.com/api/ads")
      .then((res) => res.json())
      .then((data) => setAds(data))
      .catch((err) => console.error("Error loading ads:", err));
  }, []);

  const groupedByLocation = {};
  ads.forEach((ad) => {
    if (ad.location && Array.isArray(ad.location.coordinates)) {
      const [lng, lat] = ad.location.coordinates;
      const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
      if (!groupedByLocation[key]) groupedByLocation[key] = [];
      groupedByLocation[key].push(ad);
    }
  });

  return (
    <MapContainer center={[32.08, 34.78]} zoom={8} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        attribution='&copy; OpenStreetMap & Carto'
        url='https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
      />
      {Object.entries(groupedByLocation).map(([key, adsAtLocation]) => {
        const [lat, lng] = key.split(",").map(Number);
        return (
          <Marker key={key} position={[lat, lng]}>
            <Popup>
              <strong>{adsAtLocation.length} Ads in this area:</strong>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {adsAtLocation.map((ad) => (
                  <li key={ad._id}>
                    <strong>{ad.title}</strong> – {ad.advertiser}
                  </li>
                ))}
              </ul>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default AdsMap;