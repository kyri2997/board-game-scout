import React, { useRef } from "react";

export default function MessageQ({ selectedOption, handleChange, onNext, ...props }) {
  const textareaRef = useRef(null);

  const handleSubmit = () => {
    handleChange(selectedOption || "", "message");
    onNext();
  };

  return (
    <div className="p-4">
      <button className="back-btn" onClick={props.handleBack}>← Back</button>
      <h2 className="text-xl font-bold mb-4">{props.question}</h2>

      <textarea
        ref={textareaRef}
        value={selectedOption || ""}
        // onChange={(e) => handleChange("message", e.target.value)}
        onChange={(e) => handleChange(e.target.value, "message")}
        className="w-full min-h-[150px] border rounded p-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="e.g. I love games with animals and exploration..."
      />

      <div className="mt-6">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}
