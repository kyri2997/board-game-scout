'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/Button";
import LandingPage from "@/components/LandingPage";
import WeightQ from "@/components/WeightQ";
import TypeQ from "@/components/TypeQ";
import CountQ from "@/components/CountQ";
import PlaytimeQ from "@/components/PlaytimeQ";
import CategoryQ from "@/components/CategoryQ";
import MechQ from "@/components/MechQ";
import MessageQ from "@/components/MessageQ";
import FavouriteGamesQ from "@/components/FavouriteGamesQ";
import { questions } from "@/data/questions.js";
import ResultsPage from '@/components/ResultsPage';


// Lookup table to turn string into a component
export const questionComponents = {
  WeightQ: WeightQ,
  TypeQ:TypeQ,
  CountQ: CountQ,
  PlaytimeQ: PlaytimeQ,
  CategoryQ: CategoryQ,
  MechQ: MechQ,
  FavouriteGamesQ: FavouriteGamesQ,
  MessageQ: MessageQ
};

function Page() {
  const [started, setStarted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState((answers?.selectedOption || ""));
  const [isFinished, setIsFinished] = useState(false)

  const currentQuestion = questions[questionIndex];
  const CurrentQuestionComponent = questionComponents[currentQuestion.component];

  const handleChange = (value, key) => {
    setSelectedOption(value); // always update selectedOption, regardless of key
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
    
  };

  const handleNext = () => {
    const key = currentQuestion.key;
    const isHandledManually = key === "favouriteGames";
  
    if (!isHandledManually) {
      setAnswers(prev => ({
        ...prev,
        [key]: selectedOption
      }));
    }
  
    //multi select
    // const isMultiSelect = ["category", "mechanics", "favouriteGames"].includes(key);
    // setSelectedOption(isMultiSelect ? [] : "");
    setSelectedOption("");

    if (questionIndex < questions.length - 1) {
      setQuestionIndex(prev => prev + 1);
    } else {
      setIsFinished(true); // 🎯 Done!
    }
  };
  
  // Function to restart the quiz
  const handleRestart = () => {
    setStarted(false);
    setQuestionIndex(0);
    setAnswers({});
    setSelectedOption("");
    setIsFinished(false);
  };  

  const handleBack = () => {
    if (questionIndex > 0) {
      setQuestionIndex(prev => prev - 1);
    }
  }

  if (!started) {
    return <LandingPage onStart={() => setStarted(true)} />;
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <ResultsPage 
        answers={answers} 
        handleRestart={handleRestart}
        />
      </div>
    );
  }
  
  return (
   
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 modal-container" >
          <div
            className="modal-outer"
            onClick={e => e.stopPropagation()} >
            
              <CurrentQuestionComponent
                question={currentQuestion.question}
                options={currentQuestion.options}
                selectedOption={answers[currentQuestion.key] || []}
                // selectedOption={selectedOption }
                handleChange={handleChange}
                onNext={handleNext}
                answers={answers}
                handleBack={handleBack}
              />
          </div>
        </div>
  )
}

export default Page;
