import { NextResponse } from "next/server";
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, // use your new .env file
});

async function fetchClaudeWithRetry(prompt, retries = 3, delayMs = 1500) {
  for (let i = 0; i < retries; i++) {
    try {
      return await anthropic.messages.create({
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],

      });
      
    } catch (err) {
      if (err.status === 529 && i < retries - 1) {
        console.warn(`Retry ${i + 1}...`);
        await new Promise(res => setTimeout(res, delayMs));
      } else {
        throw err;
      }
    }
  }
}

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


    const result = await fetchClaudeWithRetry(prompt);

    let cleaned = result.content[0]?.text?.trim() ?? "";
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(json)?/, "").replace(/```$/, "").trim();
    }

    const start = cleaned.indexOf("[");
    const end = cleaned.lastIndexOf("]");
    if (start === -1 || end === -1) throw new Error("No JSON array in Claude response");

    let jsonStr = cleaned.slice(start, end + 1);
    let games;

    try {
      games = JSON.parse(jsonStr);
    } catch (err) {
      // Fallback trim
      const trimmed = jsonStr.replace(/,\s*{[^}]*$/, "");
      games = JSON.parse(trimmed + "]");
    }

    return NextResponse.json({ games });
  } catch (err) {
    console.error("Claude API Error:", err);
    return NextResponse.json({ error: "Claude failed" }, { status: 500 });
  }
}
