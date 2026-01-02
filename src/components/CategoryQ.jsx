import React, { useEffect, useState, useRef } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/Toggle"
import useEnterSubmit from "@/components/hooks/useEnterSubmit.js"


export default function CategoryQ(props) {
  
  const containerRef = useRef(null);
  useEnterSubmit(containerRef, props.onNext, !!props.selectedOption);
  
  // attempt at is beginner autoselect
  // const { question, options, selectedOption, handleChange, answers, onNext } = props;
  // useEffect(() => {
  //   const isBeginner = answers?.weight === "up to 1.99";
  //   const notSelected = !selectedOption || selectedOption.length === 0;
  
  //   if (isBeginner && notSelected) {
  //     const fallbackOption = options.find(opt => opt.id === 1);
  //     if (fallbackOption) {
  //       console.log("Auto-selecting fallback category:", fallbackOption.label);
  //       handleChange([fallbackOption.label], "category");
  //     }
  //   }
  // }, [answers.weight, selectedOption, options, handleChange]);


  const colourVariants = ["blue", "yellow", "purple", "green", "purple" ];
 
 return (
   
   
   
   <div className="question-container" tabIndex={0} ref={containerRef}>
      <button className="back-btn" onClick={props.handleBack}>← Back</button>

      <h1> {props.question}</h1>

      <ToggleGroup
        type="single"
        value={props.selectedOption}
        onValueChange={(value) => props.handleChange(value, "category")}
        // value={selectedOption?.label || ""}
        // onValueChange={(val) => {
          //   const selectedOpt = options.find((opt) => opt.label === val);
          //   if (selectedOpt) {
            //     handleChange(selectedOpt, "category");
            //   }
            // }}
            variant="outline"
            aria-label="Category of game"
            className="question-grid category-container"
            >
        {props.options.map((opt, index) => (
          <ToggleGroupItem 
          value={opt.label} key={opt.id} className="grid-tile"
          variant={colourVariants[index % colourVariants.length]}>
           <div className="option-inner">
                <p className="option-label">{opt.label}</p>
            </div>
     </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <button
      disabled={!props.selectedOption || props.selectedOption.length === 0}
      onClick={props.onNext}
      className= "next-btn"
      type="button"
      >Next (or press Enter)</button>
    </div>
  )
}
