import React, { useRef } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/Toggle";
import useEnterSubmit from "@/components/hooks/useEnterSubmit"; 

export default function WeightQ(props) {
  
  // enter on submit
  const containerRef = useRef(null);
  useEnterSubmit(containerRef, props.onNext, !!props.selectedOption);

 const colourVariants = [ "yellow", "blue", "green", "pink", "purple" ];


  return (
    <div className="question-container  " tabIndex={0} ref={containerRef}>

      <h1>{props.question}</h1>

      <ToggleGroup
        type="single"
        value={props.selectedOption}
        onValueChange={
          (value) => props.handleChange(value, "weight")}
        variant="outline"
        aria-label="Experience level"
        className="toggle-group-container"
      >
        {props.options.map((opt, index) => (
          
          <ToggleGroupItem
            key={opt.id}
            value={opt.averageweight}
            className={`toggle-group`}
            aria-label={`${opt.label}-${opt.description}. ${opt.examples}`}
            variant={colourVariants[index % colourVariants.length]}
            // variant="yellow"
          >
            <div className="option-inner">
              <p className="option-label">{opt.label}</p>
              <p className="option-description">{opt.description}</p>
              <p className="option-example">{opt.examples}</p>
            </div>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <button
        disabled={!props.selectedOption}
        onClick={props.onNext}
        className="next-btn"
        type="button"
      >
        Next (or press Enter)
      </button>
    </div>
  );
}
