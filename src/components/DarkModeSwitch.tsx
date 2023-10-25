import { useDarkMode } from "@/context/DarkModeProvider";
import { useEffect } from "react";

interface DarkModeSwitchTypes {
  className: string;
}

const DarkModeSwitch: React.FC<DarkModeSwitchTypes> = ({ className }) => {
  const { isDarkMode, setIsDarkMode } = useDarkMode();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
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
          <i className="fa-light fa-moon fa-xl"></i>
        ) : (
          <i className="fa-light fa-sun-bright fa-xl"></i>
        )}
      </button>
    </>
  );
};

export default DarkModeSwitch;
