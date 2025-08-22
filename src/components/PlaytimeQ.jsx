import React, { useEffect, useState, useRef } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/Toggle"
import useEnterSubmit from "@/components/hooks/useEnterSubmit.js"


export default function PlaytimeQ(props) {

  const containerRef = useRef(null);
  useEnterSubmit(containerRef, props.onNext, !!props.selectedOption);
  const colourVariants = [ "yellow", "blue", "pink", "green", "purple" ];


  return (
    
    <div className="question-container" tabIndex={0} ref={containerRef}>
      <button className="back-btn" onClick={props.handleBack}>← Back</button>
      <h1>{props.question}</h1>

      <ToggleGroup
        type="single"
        value={props.selectedOption}
        // onValueChange={(value) => props.handleChange("maxPlaytime", value)}
        onValueChange={(value) => props.handleChange( value, "maxPlaytime")}
        variant="outline"
        aria-label="Player count"
        className="toggle-group-container"
      >
        {props.options.map((opt, index) => (
       <ToggleGroupItem value={opt.maxplaytime} key={opt.id} className="toggle-group"
       variant={colourVariants[index % colourVariants.length]}
       >
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
