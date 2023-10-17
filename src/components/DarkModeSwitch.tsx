import { useState } from "react";

const DarkModeSwitch: React.FC<{ className: string }> = ({ className }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);

    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

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
