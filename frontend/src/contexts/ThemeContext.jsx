import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

const ThemeContext = createContext({
  mode: "light",
  toggleTheme: () => {},
});

export function ThemeProviderCustom({ children }) {
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem("themeMode");
    if (saved === "light" || saved === "dark") return saved;
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    return "light";
  });

  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  const toggleTheme = () =>
    setMode((prev) => (prev === "light" ? "dark" : "light"));

  const value = useMemo(() => ({ mode, toggleTheme }), [mode]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useThemeMode() {
  return useContext(ThemeContext);
}
