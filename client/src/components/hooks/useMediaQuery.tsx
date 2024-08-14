import { useEffect, useState } from "react";

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
  return on_desktop
}
