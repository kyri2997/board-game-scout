import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Turn an array or single value into a comma string or fallback.
 */
function listOrAny(value, fallback = "any") {
  if (Array.isArray(value)) return value.join(", ");
  if (value) return String(value);
  return fallback;
}

/**
 * Strip out ```json fences and trim to just the JSON array.
 */
function extractJsonArray(text) {
  const noFence = text.replace(/^```(?:json)?|```$/g, "").trim();
  const start = noFence.indexOf("[");
  const end = noFence.lastIndexOf("]");
  if (start === -1 || end === -1) {
    throw new Error("No JSON array in AI response");
  }
  return noFence.slice(start, end + 1);
}

function buildPrompt(prefs) {
  const {
    weight,
    type,
    playerCount,
    maxPlaytime,
    category,
    mechanics,
    favouriteGames,
    message,
    previousIds = [],
  } = prefs;

  const favs = Array.isArray(favouriteGames)
    ? favouriteGames.map((g) => g.name).join(", ")
    : "";

  return `
You are a helpful board game recommender.

Here are user preferences:
- Experience level (average weight): ${listOrAny(weight)}
- Type of game (card or board): ${listOrAny(type)}
- Player count: ${listOrAny(playerCount)}
- Max playtime: ${listOrAny(maxPlaytime)} minutes
- Primary categories: ${listOrAny(category)}
- Primary mechanics: ${listOrAny(mechanics)}
- Favourite games: ${favs || "none"}
- Additional message: ${message || "none"}

Recommend 8 top‐rated board games (by BGG ratings) that match type, player count, and playtime.
If weight is “Up to 1.99”, prioritize simpler titles.
Sort by best match.
reason= Give me a brief explanation why this game is a good match for the user preferences (writing it as if you're talking directly to the user e.g. "your preferences"). Do not just repeat how it matches user choices, but explain why it is a good match for the user.  )

${previousIds.length
    ? `Avoid these BGG IDs: ${previousIds.join(", ")}`
    : ""
}

Return JSON like:
[
  {
    "name": "...",
    "id": "...",
    "reason": "...",
    "image": "...",
    "category": "...",
    "mechanics": "...",
    "playerCount": "...",
    "minPlaytime": 0,
    "maxPlaytime": 0,
    "weight": 0,
    "rating": 0
  }
]
`;
}

export async function POST(req = new NextRequest()) {
  try {
    const prefs = await req.json();
    const prompt = buildPrompt(prefs);

    const res = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const raw = res.choices?.[0]?.message?.content ?? "";
    const jsonText = extractJsonArray(raw);

    let games;
    try {
      games = JSON.parse(jsonText);
    } catch {
      // If trailing comma error, drop last comma block
      const safe = jsonText.replace(/,\s*{[^}]*$/, "]"); 
      games = JSON.parse(safe);
    }

    return NextResponse.json({ games });
  } catch (err) {
    console.error("AI API Error:", err);
    return NextResponse.json(
      { error: "AI failed to generate recommendations." },
      { status: 500 }
    );
  }
}
