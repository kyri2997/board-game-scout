import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { getGameRecommendations } from "@/lib/getGameRecommendations.js" 



export default function FavouriteGamesQ({ answers, handleChange, onNext, ...props }) {
  const [tempSelection, setTempSelection] = useState([]);
  const [favouriteGamesList, setFavouriteGamesList] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const resultsRef = useRef(null);
  const searchInputRef = useRef(null);

  const nextButtonRef = useRef(null);


  const toggleGame = (game) => {
    setTempSelection((prev) =>
      prev.find((g) => g.id === game.id)
        ? prev.filter((g) => g.id !== game.id)
        : [...prev, game]
    );
  };

  const addGameToList = (game) => {
    if (!favouriteGamesList.some(g => g.id === game.id)) {
      setFavouriteGamesList(prev => [...prev, game]);
    }
    searchInputRef.current?.focus();

  };

  const handleSubmit = () => {
    if (favouriteGamesList.length >= 1) {
      console.log("Submitting favourite games:", favouriteGamesList);
      handleChange(favouriteGamesList, "favouriteGames");
      onNext();
    } else {
      alert("Please search and add at least 1 game");
    }
  };

  // Editing  ❌
  const getGameName = (game) => {
    if (!game) return "Unknown";
    if (typeof game.name === "object") {
      return game.name?.name || "Unknown";
    }
    return game.name || "Unknown";
  };
  
  async function enrichBGGGame(id, originalName = "Unknown") {
    try {
      const res = await fetch(`https://boardgamegeek.com/xmlapi2/thing?id=${id}&stats=1`);
      const xml = await res.text();
      const doc = new DOMParser().parseFromString(xml, "text/xml");
  
      const item = doc.querySelector("item");
      if (!item || item.getAttribute("type") === "boardgameexpansion") return null;
  
      const nameNode = Array.from(doc.querySelectorAll("name")).find(
        (node) => node.getAttribute("type") === "primary"
      );
      const name = nameNode?.getAttribute("value") || originalName;
      const image = doc.querySelector("image")?.textContent || "";
      const usersRated = parseInt(doc.querySelector("usersrated")?.getAttribute("value") || "0", 10);
  
      return { id, name, image, usersRated };
    } catch (err) {
      console.error("Error enriching BGG game:", originalName, err);
      return null;
    }
  }
  
  async function fetchBGGData(gameList) {
    if (!Array.isArray(gameList)) {
      console.error("fetchBGGData expected an array but got:", gameList);
      return [];
    }
  
    const enriched = await Promise.all(
      gameList.map((game) => enrichBGGGame(game.id, getGameName(game)))
    );
  
    return enriched.filter(Boolean);
  }
  
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
  
    try {
      const res = await fetch(
        `https://boardgamegeek.com/xmlapi2/search?query=${encodeURIComponent(searchTerm)}&type=boardgame`
      );
      const xml = await res.text();
  
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, "text/xml");
      const items = Array.from(doc.querySelectorAll("item")).slice(0, 5); // widen results
  
      const enriched = await Promise.all(
        items.map((item) => {
          const id = item.getAttribute("id");
          return enrichBGGGame(id);
        })
      );
  
      const filteredAndSorted = enriched
        .filter((game) => game && game.name)
        .sort((a, b) => b.usersRated - a.usersRated);
  
      setSearchResults(filteredAndSorted);
  
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      alert("We couldn't find this game. Name must be written exactly or you can try a different game")
    }
  };


  return (
    <div className="p-4">
          <>
        <button className="back-btn" onClick={props.handleBack}>← Back</button>
        <h2 className="text-xl font-bold mb-4 text-black">{props.question}</h2>
        
        {/* favourite games stored list */}
        {favouriteGamesList.length === 0 && (
            <p className="text-orange-500 mb-4">Search the <span className=" font-bold">exact game name and click +</span> to add your favourites. (No games added yet) </p>
          )}

        {favouriteGamesList.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Your Favourite Games:</h3>
              <ul className="space-y-2">
                {favouriteGamesList.map((game, index) => (
                  <li key={game.id || index} className="border p-2 rounded flex items-center gap-4">
                    <img src={game.image} alt={game.name} className="w-16 h-16 object-cover rounded" />
                    <div>
                      <p className="font-medium text-black">{game.name}</p>
                      <button
                      onClick={() => setFavouriteGamesList(prev => prev.filter(g => g.id !== game.id))}
                      className="ml-auto text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

            <div className="mb-4 flex gap-2">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="e.g. Catan"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (!searchTerm.trim()) {
                      handleSubmit();
                    } else {
                      handleSearch();
                      setSearchTerm(""); // clear input after searching
                    }
                  }
                }}         
                
                className="flex-grow p-2 border rounded  bg-slate-100 text-slate-900"
              />
              <Button onClick={handleSearch}>Search</Button>
            </div>
          </>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  
        {/* Search results */}
        {searchResults.length > 0 && (
          <>
            <h3 className="mt-6 text-lg font-semibold col-span-full text-black" ref={resultsRef}>Search Results</h3>
            {searchResults.map((game) => (
              <div
                key={`search-${game.id}`}
                onClick={() => toggleGame(game)}
                className={`relative cursor-pointer border rounded p-2 ${
                  tempSelection.find((g) => g.id === game.id)
                    ? "bg-blue-100 border-blue-500"
                    : "hover:bg-gray-100"
                }`}
              >
                <button
                onClick={(e) => {
                  e.stopPropagation();
                  addGameToList(game);
                  e.currentTarget.blur(); // ✅ blur the + button
                  setTimeout(() => {
                    nextButtonRef.current?.focus(); // ✅ focus Next
                  }, 0); // wait a tick
                }}
                className="absolute top-2 right-2 bg-orange-500 rounded-md py-2 px-3 shadow hover:bg-gray-200 text-white"
                title="Add to favourites"
              >
                +
              </button>
                <img src={game.image} alt={game.name} className="w-full h-auto object-cover mb-2 rounded" />

                <p className="text-sm font-medium text-black">{getGameName(game)}</p>
                {/* <p className="text-sm font-medium">
                {typeof game.name === "object" ? game.name.name : game.name}
                  </p> */}
              </div>
            ))}
          </>
        )}
      </div>
  
      <div className="mt-6" >
        <Button onClick={handleSubmit} ref={nextButtonRef} 
        disabled={favouriteGamesList.length < 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
              }

