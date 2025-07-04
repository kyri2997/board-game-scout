import { NextResponse } from "next/server";
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});


export async function POST(req) {
  try {
    const preferences = await req.json();

    const {
      weight = "any",
      type = "any",
      playerCount = "any",
      maxPlaytime = "any",
      category,
      mechanics,
      favouriteGames,
      message,
      previousIds = [],
    } = preferences;

    const cat = Array.isArray(category) ? category.join(", ") : category || "any";
    const mech = Array.isArray(mechanics) ? mechanics.join(", ") : mechanics || "any";

    const favs = Array.isArray(favouriteGames)
      ? favouriteGames.map((g) => g.name).join(", ")
      : "";

    const prompt = `
    You are a helpful board game recommender.

Here are user preferences:
- Experience level (average weight): ${weight}
- Type of game (card or board): ${type}
- PlayerCount: ${playerCount}
- Max playtime: ${maxPlaytime} minutes
- Primary category of preferred games: ${cat}
- Primary mechanics: ${mech}
- Favourite games: ${favs}
- Additional message: ${message || "No additional preferences provided"}


Based on these, recommend 5 of the most popular board games (based on most BGG user ratings) matching the user preferences - recommendation MUST match type, player count and playtime, but the rest of the preferences can provide direction rather than strict requirements. If user selected "Experience level: Up to 1.99", don't recommend anything more complex than 2.99. Sort the recommendations by the closest match to their interests, top to bottom.

If previousIds provided:
${previousIds.length > 0
  ? `Avoid these IDs: ${previousIds.join(", ")}`
  : ""
}

Format these recommendations as JSON, for example:

[
  {
    "name": "Wingspan",
    "id": "266192",
    "reason": "...",
    "image": "...",
    "category": "Strategy, Card Game",
    "mechanics": "Card Drafting, Engine Building",
    "playerCount": "2-3",
    "minPlaytime": 40,
    "maxPlaytime": 70,
    "weight": 2.5,
    "rating": 4.5
  }
]

    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // or "gpt-3.5-turbo"
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    // const result = await fetchAiWithRetry(prompt);
    const raw = response.choices[0]?.message?.content?.trim() ?? "";

    let cleaned = raw;
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(json)?/, "").replace(/```$/, "").trim();
    }

    const start = cleaned.indexOf("[");
    const end = cleaned.lastIndexOf("]");
    if (start === -1 || end === -1) throw new Error("No JSON array in AI response");

    let jsonStr = cleaned.slice(start, end + 1);
    let games;

    try {
      games = JSON.parse(jsonStr);
    } catch (err) {
      const trimmed = jsonStr.replace(/,\s*{[^}]*$/, "");
      games = JSON.parse(trimmed + "]");
    }

    return NextResponse.json({ games });
  } catch (err) {
    console.error("AI API Error:", err);
    return NextResponse.json({ error: "AI failed" }, { status: 500 });
  }
}