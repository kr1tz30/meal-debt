import { useCallback, useEffect, useState } from "react";

const KEY = "meal-debt:intro-seen";

export function useIntroSeen() {
  const [seen, setSeen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSeen(window.localStorage.getItem(KEY) === "1");
    setReady(true);
  }, []);

  const markSeen = useCallback(() => {
    window.localStorage.setItem(KEY, "1");
    setSeen(true);
  }, []);

  return { seen, ready, markSeen };
}
