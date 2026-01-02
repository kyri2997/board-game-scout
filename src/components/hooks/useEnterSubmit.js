import { useEffect } from "react";

export default function useEnterSubmit(ref, callback, condition = true) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Evaluate condition dynamically each key press
      const canSubmit =
        Array.isArray(condition) ? condition.length !== 0 : !!condition;

      if (e.key === "Enter" && canSubmit) {
        e.preventDefault();
        callback();
      }
    };

    const node = ref.current;
    if (node) {
      node.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (node) {
        node.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [ref, callback, condition]); // still include condition to re-run if reference changes
}
