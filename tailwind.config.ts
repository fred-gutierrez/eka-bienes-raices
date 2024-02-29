import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        // "darkmode-image": "url('../assets/home-darkmode.jpg')",
        // "darkmode-image": "url('../assets/night-luxury-house.jpg')",
        // "lightmode-image": "url('../assets/home-lightmode.jpg')",
        "house-bg-image": "url('../assets/home-2.jpg')",
        "drop-shadow": "url('../assets/drop-shadow.png')",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
export default config;
