// src/app/api/bgg/thing/route.js

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  // console.log("🔍 /api/bgg/thing called");
  // console.log("➡️ id param:", id);

  if (!id) {
    return new Response("Missing id", { status: 400 });
  }

  if (!process.env.BGG_API_KEY) {
    console.error("❌ BGG_API_KEY not set in environment");
    return new Response("Server misconfiguration: missing BGG_API_KEY", { status: 500 });
  }

  const url = `https://boardgamegeek.com/xmlapi2/thing?id=${id}&stats=1`;

  // console.log("🌐 Fetching BGG URL:", url);

  let res;
  try {
    res = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${process.env.BGG_API_KEY}`,
        "User-Agent": "BoardGameScout/1.0 (https://board-game-scout.vercel.app/)",
        "Accept": "application/xml",
      },
      cache: "no-store",
    });
  } catch (err) {
    console.error("❌ Network error fetching BGG:", err);
    return new Response("Network error fetching BGG", { status: 502 });
  }

  // console.log("⬅️ BGG status:", res.status);
  // console.log("⬅️ BGG content-type:", res.headers.get("content-type"));

  const text = await res.text();
  console.log("⬅️ BGG response snippet (first 300 chars):\n", text.slice(0, 300));

  if (!res.ok) {
    console.error("❌ BGG returned non-OK status");
    return new Response(`BGG error ${res.status}`, { status: 502 });
  }

  return new Response(text, {
    status: 200,
    headers: {
      "Content-Type": "text/xml",
      "Cache-Control": "no-store",
    },
  });
}
