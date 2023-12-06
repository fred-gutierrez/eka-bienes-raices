import { useDarkMode } from "@/context/DarkModeProvider";
import { useEffect } from "react";

interface DarkModeSwitchTypes {
  className: string;
}

const DarkModeSwitch: React.FC<DarkModeSwitchTypes> = ({ className }) => {
  const { isDarkMode, setIsDarkMode } = useDarkMode();

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    if (typeof window !== "undefined") {
      localStorage.setItem("isDarkMode", newDarkMode.toString());
    }
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <>
      <button onClick={toggleDarkMode} className={className}>
        {isDarkMode ? (
          <i className="fa-light fa-moon !text-white fa-xl"></i>
        ) : (
          <i className="fa-light fa-sun-bright fa-xl"></i>
        )}
      </button>
    </>
  );
};

export default DarkModeSwitch;
