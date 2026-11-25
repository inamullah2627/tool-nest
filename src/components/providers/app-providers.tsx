"use client";
import { ThemeProvider } from "next-themes";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
interface PreferencesValue {
  favorites: string[];
  recent: string[];
  toggleFavorite: (id: string) => void;
  recordRecent: (id: string) => void;
}
const PreferencesContext = createContext<PreferencesValue | null>(null);
const read = (key: string) => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(key) ?? "[]") as string[];
  } catch {
    return [];
  }
};
function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(() =>
    read("toolnest:favorites"),
  );
  const [recent, setRecent] = useState<string[]>(() => read("toolnest:recent"));
  const persist = useCallback((key: string, value: string[]) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, []);
  const toggleFavorite = useCallback(
    (id: string) =>
      setFavorites((current) => {
        const next = current.includes(id)
          ? current.filter((item) => item !== id)
          : [...current, id];
        persist("toolnest:favorites", next);
        return next;
      }),
    [persist],
  );
  const recordRecent = useCallback(
    (id: string) =>
      setRecent((current) => {
        const next = [id, ...current.filter((item) => item !== id)].slice(0, 8);
        persist("toolnest:recent", next);
        return next;
      }),
    [persist],
  );
  const value = useMemo(
    () => ({ favorites, recent, toggleFavorite, recordRecent }),
    [favorites, recent, toggleFavorite, recordRecent],
  );
  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <PreferencesProvider>{children}</PreferencesProvider>
    </ThemeProvider>
  );
}
export function usePreferences() {
  const value = useContext(PreferencesContext);
  if (!value)
    throw new Error("usePreferences must be used inside AppProviders");
  return value;
}
