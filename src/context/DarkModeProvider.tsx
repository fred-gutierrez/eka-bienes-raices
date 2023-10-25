"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface DarkModeContextType {
  isDarkMode: boolean;
  setIsDarkMode: (isDarkMode: boolean) => void;
}

const DarkModeContext = createContext<DarkModeContextType | null>(null);

interface DarkModeProviderProps {
  children: ReactNode;
}

export const DarkModeProvider: React.FC<DarkModeProviderProps> = ({
  children,
}) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const isLocalStorageAvailable =
      typeof window !== "undefined" && window.localStorage;
    if (isLocalStorageAvailable) {
      const isDarkModeStored = localStorage.getItem("isDarkMode");
      const initialIsDarkMode = isDarkModeStored === "true" || false;
      setIsDarkMode(initialIsDarkMode);
    }
  }, []);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => {
  const darkModeContext = useContext<DarkModeContextType | null>(
    DarkModeContext,
  );
  if (!darkModeContext) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }
  return darkModeContext;
};

export default DarkModeProvider;
