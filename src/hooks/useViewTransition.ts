import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useViewTransition = () => {
  const location = useLocation(); // Get current route location

  useEffect(() => {
    // Check if the browser supports the ViewTransitions API
    if (typeof document.startViewTransition === "function") {
      document.startViewTransition(() => {
        // Transition logic goes here, but for now, we don't need to do anything
      });
    } else {
      console.warn("ViewTransitions API not supported in this browser.");
    }
  }, [location.pathname]); // Trigger transition on route path change
};

export default useViewTransition;
