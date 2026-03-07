export const config = { runtime: "edge" };

const FM_LAT = 49.6833;
const FM_LNG = 18.3667;
const MAX_KM = 20;
const API_KEY = "AIzaSyC8EhWAIi2-BBQDEdTcBMoCoynvZ19Gd3s";

function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const input = searchParams.get("input") || "";

  if (!input || input.length < 3) {
    return new Response(JSON.stringify({ suggestions: [] }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(input)}&components=country:CZ&key=${API_KEY}`
    );
    const data = await res.json();

    const suggestions = (data.results || []).map(r => {
      const lat = r.geometry.location.lat;
      const lng = r.geometry.location.lng;
      const dist = getDistanceKm(FM_LAT, FM_LNG, lat, lng);
      return {
        label: r.formatted_address,
        lat, lng,
        distKm: Math.round(dist),
        inRange: dist <= MAX_KM,
      };
    }).slice(0, 5);

    return new Response(JSON.stringify({ suggestions }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ suggestions: [], error: e.message }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
}
