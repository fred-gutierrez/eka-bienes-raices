import { useDarkMode } from "@/context/DarkModeProvider";

interface DarkModeSwitchTypes {
  className: string;
}

const DarkModeSwitch: React.FC<DarkModeSwitchTypes> = ({ className }) => {
  const { isDarkMode, setIsDarkMode } = useDarkMode();

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
