import { RefObject, useEffect, useState } from "react";

export const useFocusOnType = (element: RefObject<HTMLInputElement>) => {
  const focusHandler = () => element.current?.focus();

  // Add event listeners
  useEffect(() => {
    window.addEventListener("keydown", focusHandler);
    window.addEventListener("keyup", focusHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", focusHandler);
      window.removeEventListener("keyup", focusHandler);
    };
  }, [focusHandler]); // Empty array ensures that effect is only run on mount and unmount
  return;
};
