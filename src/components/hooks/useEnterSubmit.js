import { useEffect } from "react";

export default function useEnterSubmit(ref, callback, condition = true) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && condition) {
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
  }, [ref, callback, condition]);
}
