import { useEffect, useState } from "react";

/**
 *
 * A Custom hook that returns a `boolean` to determine if the app is being viewed on desktop
 *
 * @returns {boolean} `true` if the app is viewed on desktop and `false` if on mobile
 *
 */

export default function useMediaQuery() {
  const [on_desktop, setOnDesktop] = useState(false);

  useEffect(() => {
    const media_query = window.matchMedia("(min-width: 768px)");

    setOnDesktop(media_query.matches);

    function handleChange(event: MediaQueryListEvent) {
      setOnDesktop(event.matches);
    }
    media_query.addEventListener("change", handleChange);

    return () => media_query.removeEventListener("change", handleChange);
  }, []);
  return on_desktop;
}
