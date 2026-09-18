import { useEffect, useState } from "react";

/** Typewriter that types, holds, deletes and moves to the next phrase. */
export function useTypewriter(
  phrases: string[],
  { typeMs = 62, deleteMs = 28, holdMs = 2100, reduced = false } = {},
) {
  const [index, setIndex] = useState(0);
  const [sub, setSub] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduced) {
      const t = setInterval(() => setIndex((i) => (i + 1) % phrases.length), 2800);
      return () => clearInterval(t);
    }
    const word = phrases[index];
    let delay = deleting ? deleteMs : typeMs;
    if (!deleting && sub === word.length) delay = holdMs;
    if (deleting && sub === 0) delay = 380;

    const t = setTimeout(() => {
      if (!deleting) {
        if (sub < word.length) setSub(sub + 1);
        else setDeleting(true);
      } else if (sub > 0) {
        setSub(sub - 1);
      } else {
        setDeleting(false);
        setIndex((index + 1) % phrases.length);
      }
    }, delay);
    return () => clearTimeout(t);
  }, [sub, deleting, index, phrases, typeMs, deleteMs, holdMs, reduced]);

  const full = phrases[index];
  return {
    text: reduced ? full : full.slice(0, sub),
    index,
    complete: reduced || (!deleting && sub === full.length),
  };
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    setMatches(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

export interface SavedProspectus {
  name: string;
  age: number;
  campusId: string;
  interests: string[];
  savedAt: string;
}

const KEY = "braeburn.prospectus";

export function readSavedProspectus(): SavedProspectus | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SavedProspectus) : null;
  } catch {
    return null;
  }
}

export function writeSavedProspectus(p: SavedProspectus | null) {
  try {
    if (p) localStorage.setItem(KEY, JSON.stringify(p));
    else localStorage.removeItem(KEY);
  } catch {
    /* storage unavailable — personalisation silently degrades */
  }
}

export function useSavedProspectus() {
  const [saved, setSaved] = useState<SavedProspectus | null>(null);
  useEffect(() => setSaved(readSavedProspectus()), []);
  return saved;
}
