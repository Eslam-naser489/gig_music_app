import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

/**
 * SideMenuContext — lets any screen open the global Side Menu without
 * each screen owning its own drawer instance. The drawer itself is
 * mounted once in the root layout (`app/_layout.tsx`).
 *
 * Usage from any screen: `const { show } = useSideMenu();` then call
 * `show()` from a hamburger/menu button.
 */

interface SideMenuContextValue {
  visible: boolean;
  show: () => void;
  hide: () => void;
}

const SideMenuContext = createContext<SideMenuContextValue | undefined>(undefined);

export function SideMenuProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);

  const value = useMemo<SideMenuContextValue>(
    () => ({
      visible,
      show: () => setVisible(true),
      hide: () => setVisible(false),
    }),
    [visible],
  );

  return <SideMenuContext.Provider value={value}>{children}</SideMenuContext.Provider>;
}

export function useSideMenu(): SideMenuContextValue {
  const ctx = useContext(SideMenuContext);
  if (!ctx) throw new Error("useSideMenu must be used within a SideMenuProvider");
  return ctx;
}
