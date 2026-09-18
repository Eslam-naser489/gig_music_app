import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * ThemeContext — global dark-mode flag, owned by the Infrastructure &
 * Layout member (the dark-mode switch lives in the Side Menu, per Figma).
 *
 * Scope note: ships `isDark` + a persisted toggle, applied to the
 * surfaces this member owns (Side Menu, Settings, Contact Us, Learn
 * More). Re-skinning every other screen with `isDark` is future work
 * for whoever owns them — `useTheme()` is exported so any screen can
 * opt in later without touching this file.
 */

const STORAGE_KEY = "gig-music-player:dark-mode";

interface ThemeContextValue {
  isDark: boolean;
  toggleDark: () => void;
  setDark: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored != null) setIsDark(stored === "1");
      })
      .catch(() => undefined)
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    void AsyncStorage.setItem(STORAGE_KEY, isDark ? "1" : "0").catch(() => undefined);
  }, [isDark, hydrated]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      isDark,
      toggleDark: () => setIsDark((current) => !current),
      setDark: setIsDark,
    }),
    [isDark],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
