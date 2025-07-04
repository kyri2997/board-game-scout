import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { getGameRecommendations } from "@/lib/getGameRecommendations.js" 
// import bgImage from '../public/assets/background1.jpg';

export default function ResultsPage({ answers, handleRestart }) {

  const [suggestedGames, setSuggestedGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isAppending, setIsAppending] = useState(false);
  const [previousAiIds, setPreviousAiIds] = useState([]);
  const hasFetched = useRef(false);
  const [hasMoreGames, setHasMoreGames] = useState(true);

  

  const fetchAndDisplay = async () => {
    setIsLoading(true);
    const recs = await getGameRecommendations({
      ...answers,
    count:3 ,
  })
    const enriched = await fetchBGGData(recs.slice(0, 3));

    setSuggestedGames(prev => {
      const existingIds = new Set(prev.map(g => g.id));
      const newUnique = enriched.filter(g => !existingIds.has(g.id));
      return [...prev, ...newUnique];
    });
    setIsLoading(false);
  };

  useEffect(() => {
  const fetchInitial = async () => {
  setIsLoading(true);
  try {
    const initial = await getGameRecommendations(answers);
    const enriched = await fetchBGGData(initial);
    setSuggestedGames(enriched);
    setPreviousAiIds(initial.map(g => g.id)); // ✅ Fix
  } catch (err) {
    alert("Failed to fetch initial game recommendations.");
  } finally {
    setIsLoading(false);
  }
};


    if (answers && !hasFetched.current) {
      hasFetched.current = true; // ✅ only allow once
      fetchInitial();
    }
  }, [answers]);

  const loadMore = async () => {
  setIsAppending(true);
  try {
    const more = await getGameRecommendations({
      ...answers,
      previousIds: previousAiIds,
      count: 15, // Request more for better filtering
    });

    const enriched = await fetchBGGData(more);
    const existingIds = new Set(suggestedGames.map(g => g.id));
    const newUnique = enriched.filter(g => !existingIds.has(g.id));

    const nextFive = newUnique.slice(0, 5);

    if (nextFive.length === 0) {
      setHasMoreGames(false); // Nothing left
    } else {
      setSuggestedGames(prev => [...prev, ...nextFive]);
      setPreviousAiIds(prev => [
        ...prev,
        ...nextFive.map(g => g.id).filter(id => !prev.includes(id))
      ]);

      if (nextFive.length < 5) {
        setHasMoreGames(false); // We’re probably out of results
      }
    }
  } catch (err) {
    console.error("Load more failed:", err);
    alert("Couldn't load more games. Please try again.");
  } finally {
    setIsAppending(false);
  }
};

  function decodeHTML(str) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, "text/html");
    return doc.documentElement.textContent;
  }

  async function fetchBGGData(list) {
    if (!Array.isArray(list)) return [];

    const out = await Promise.all(
      list.map(async (game) => {
        try {
          const res = await fetch(
            `https://boardgamegeek.com/xmlapi2/thing?id=${game.id}&stats=1`
          );
          const xml = await res.text();
          const doc = new DOMParser().parseFromString(xml, "text/xml");
          const item = doc.querySelector("item");
          if (!item || item.getAttribute("type") === "boardgameexpansion")
            return null;

          const name =
            doc.querySelector('name[type="primary"]')?.getAttribute("value") ??
            game.name;
          const image = doc.querySelector("image")?.textContent || "";

          const rawDescription = doc.querySelector("description")?.textContent || "";
          const description = decodeHTML(rawDescription).slice(0, 300) + "...";

          const year = doc
            .querySelector("yearpublished")
            ?.getAttribute("value");
          const rating = doc.querySelector("average")?.getAttribute("value");
          const weight = doc
            .querySelector("averageweight")
            ?.getAttribute("value");
          const minPlayers = doc
            .querySelector("minplayers")
            ?.getAttribute("value");
          const maxPlayers = doc
            .querySelector("maxplayers")
            ?.getAttribute("value");
          const playTime = doc
            .querySelector("playingtime")
            ?.getAttribute("value");
          const maxPlaytime = doc
          .querySelector("maxplaytime")
          ?.getAttribute("value");
          const minPlaytime = doc
          .querySelector("minplaytime")
          ?.getAttribute("value");
          const categories = Array.from(
            doc.querySelectorAll('link[type="boardgamecategory"]')
          ).map((l) => l.getAttribute("value"));
          const mechanics = Array.from(
            doc.querySelectorAll('link[type="boardgamemechanic"]')
          ).map((l) => l.getAttribute("value"));

          return {
            id: game.id,
            name,
            year,
            image,
            description,
            rating,
            weight,
            minPlayers,
            maxPlayers,
            playTime,
            maxPlaytime,
            minPlaytime,
            categories,
            mechanics,
            reason: game.reason, // from Ai
          };
        } catch (err) {
          console.error("BGG fetch failed:", err);
          return null;
        }
      })
    );
    return out.filter(Boolean);
  }

  function formatAnswers(answers) {
    const {
      type,
      playerCount,
      maxPlaytime,
      category,
      mechanics,
      favouriteGames,
      message,
      weight
    } = answers
  return [
    { label: "Type", value: type },
    { label: "Complexity (out of 5)", value: weight },
    { label: "Player Count", value: playerCount },
    { label: "Max Playtime", value: `${maxPlaytime} min` },
    { label: "Category", value: category },
    { label: "Mechanics", value: mechanics },
    {
      label: "Favourite Games",
      value: Array.isArray(favouriteGames)
        ? favouriteGames.map(g => g.name).join(", ")
        : ""
    },
    { label: "Message", value: message }
  ].filter(item => item.value);
}

const summary = formatAnswers(answers);
  if (isLoading) {

    return (

      <div className="flex flex-col items-center justify-center p-10 text-center gap-5">
        <div className="dice animate-roll" />
        <p className="text-xl font-bold text-black">Rolling the dice...</p>
        <p className="text-black font-bold">Finding your perfect games (this can take about 20 seconds)</p>
      
      {/* User summary */}
      <div className="bg-white p-4 rounded shadow max-w-lg mx-auto text-left">
        <h3 className="font-bold mb-2 text-black">Your selections:</h3>
        <ul className="space-y-1 text-sm text-gray-700">
          {summary.map((item, i) => (
            <li key={i}>
              <strong>{item.label}:</strong> {item.value}
            </li>
          ))}
        </ul>
      </div>
    </div>
// </div>

    );
  }
  

  return (
            <div className=" w-full mx-auto space-y-8">
            <div className="flex justify-between" >
            <h1 className="text-3xl font-bold text-black">Your Game Recommendations</h1>
                  
            </div>

            {/* // User summary */}
            <div className="bg-white p-4 rounded shadow w-full mx-auto text-left">
            <h2 className="text-xl font-semibold mb-2 text-black">Your selections:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              {summary.map(({ label, value }, index) => (
                <div key={index} className="flex text-black ">
                  <span className="font-bold mr-2">{label}:</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>

       {/* Suggested game results  */}
      {suggestedGames.map((g, index) => (
        <div
          key={g.id}
          className={`flex flex-col md:flex-row items-start gap-4 p-4 border rounded shadow-sm bg-white relative ${
            index === 0 ? "border-yellow-500 border-2 bg-yellow-50" : ""
          }`}
        >
           {index === 0 && (
            <div className="absolute -top-3 -left-3 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow">
              🌟 Top Recommendation!
            </div>
          )}
          <img
            src={g.image}
            alt={g.name}
            className="w-full md:w-48 h-auto object-cover rounded"
          />

          <div className="flex-1 space-y-2 text-sm md:text-base text-black ">
            <h3 className="font-semibold text-lg text-slate-800 ">
              {g.name}{" "}
              <span className="text-gray-500">
                ({g.year ?? "?"})
              </span>
            </h3>
            <p>
              <strong>Why was this recommended:</strong> {g.reason && <span className="italic" >{g.reason}</span>}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <p>
                <strong>Rating:</strong>{" "}
                {parseFloat(g.rating || "0").toFixed(1)} ⭐
              </p>
              <p>
                <strong>Complexity:</strong>{" "}
                {parseFloat(g.weight || "0").toFixed(2)}/ 5
              </p>
              <p>
                <strong>Players:</strong> {" "}
            {g.minPlayers === g.maxPlayers
              ? g.maxPlayers
              : `${g.minPlayers} – ${g.maxPlayers}`} players
              </p>
              <p>
                <strong>Playtime:</strong> {g.minPlaytime === g.maxPlaytime
              ? g.maxPlaytime
              : `${g.minPlaytime} – ${g.maxPlaytime}`} min
              </p>
            </div>

            <p>
              <strong>Categories:</strong> {g.categories.join(", ")}
            </p>
            <p>
              <strong>Mechanics:</strong> {g.mechanics.join(", ")}
            </p>
            
            <p><strong>Summary:</strong> {g.description}</p> <a
              href={`https://boardgamegeek.com/boardgame/${g.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              View full details on BGG →
            </a>
            
          </div>
        </div>
      ))}
        <div className="text-center mt-6">

        {isAppending ? (
        <p className="text-gray-500 italic">Loading more games... (this can take about 20 seconds)</p>
      ) : hasMoreGames ? (
        <Button onClick={loadMore}>+ Load More Games</Button>
      ) : (
        <p className="text-gray-500 italic">No more game recommendations available.</p>
      )}

          </div>
          <div className="text-center mt-6">
           <Button onClick={handleRestart} className="bg-red-400">🔄 Start Again</Button>
      </div>
    </div>
  );
}
