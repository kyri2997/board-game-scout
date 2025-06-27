import React, { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/Button";
// import bgImage from "../public/assets/background1.jpg";
import useEnterSubmit from "@/components/hooks/useEnterSubmit";



export default function LandingPage({ onStart }) {
  const containerRef = useRef(null);

  // Automatically focus the container when the component mounts
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  useEnterSubmit(containerRef, onStart);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="relative h-screen w-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(/assets/background1.jpg)`
      }}
    >
      <div className="absolute inset-0 bg-black/60 z-0" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
      {/* <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-center text-center p-6 space-y-8"> */}

         {/* 🌟 Header with site name */}
      <header className="text-6xl md:text-8xl font-extrabold text-red-200 drop-shadow-sm mb-10">
         Board Game Scout 🔎
      </header>

        {/* <p className="text-3xl md:text-4xl font-bold mb-4">
          Discover Your Next Board Game
        </p> */}

        <p className="text-lg md:text-2xl mb-5 max-w-xl">
        Not sure what board game to play next? Answer a few questions and let AI find your perfect match!
        </p>
          <div className="flex flex-col items-center justify-center p-10 text-center space-y-4">
            <div className="dice animate-roll" />
            {/* <p className="text-xl font-semibold">Rolling the dice...</p> */}
          </div>  
        <Button onClick={onStart} className="text-lg px-6 py-4">
          Start Questionnaire
        </Button>
      </div>
    </div>
  );
}
