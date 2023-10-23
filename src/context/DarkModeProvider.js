"use client";

import { createContext, useContext, useEffect, useState } from "react";

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load the initial isDarkMode value from localStorage
  useEffect(() => {
    const storedIsDarkMode = localStorage.getItem("isDarkMode");
    if (storedIsDarkMode !== null) {
      setIsDarkMode(storedIsDarkMode === "true");
    }
  }, []);

  // Save isDarkMode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("isDarkMode", isDarkMode);
  }, [isDarkMode]);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => {
  return useContext(DarkModeContext);
};

export default DarkModeProvider;
