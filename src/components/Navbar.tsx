"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import DarkModeSwitch from "./DarkModeSwitch";
import { useDarkMode } from "@/context/DarkModeProvider";

export default function Navbar() {
  const { isDarkMode, setIsDarkMode } = useDarkMode();
  const navbarRef = useRef<HTMLDivElement>(null);

  function toggleHidden() {
    const navbarHamburger = document.getElementById("navbar-menu");
    navbarHamburger!.classList.toggle("hidden");
  }

  function handleClickOutside(e: Event): void {
    if (navbarRef.current && !navbarRef.current.contains(e.target as Node)) {
      const navbarHamburger = document.getElementById("navbar-menu");
      navbarHamburger!.classList.add("hidden");
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("scroll", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("scroll", handleClickOutside);
    };
  }, []);

  return (
    <nav
      className="dark:bg-neutral-800 bg-neutral-50 p-3 px-8 md:px-14 xl:px-32 sticky top-0 z-10"
      ref={navbarRef}
    >
      <div className="container flex flex-wrap items-center justify-between mx-auto">
        {/* Left side elements */}
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <Image
              src={
                isDarkMode
                  ? "/eka-logo-single-white.png"
                  : "/eka-logo-single-black.png"
              }
              width={54}
              height={54}
              alt={isDarkMode ? "Dark Mode Image" : "Light Mode Image"}
            />
          </a>
        </div>

        {/* Right side elements */}
        <div className="flex items-center">
          <button
            data-collapse-toggle="navbar-solid-bg"
            type="button"
            className={`inline-flex items-center p-2 text-sm 
            rounded md:hidden focus:outline-none focus:ring-2
            dark:text-neutral-50 dark:hover:bg-neutral-700 dark:focus:ring-neutral-700
            text-gray-900 hover:bg-gray-200 focus:ring-gray-100`}
            aria-controls="navbar-solid-bg"
            aria-expanded="false"
            onClick={toggleHidden}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          <ul className="hidden md:flex flex-row rounded space-x-8 text-md font-medium bg-gray-200 bg-transparent border-gray-300 items-center">
            <Link
              href="/"
              onClick={() => toggleHidden()}
              className={`${
                usePathname() === "/"
                  ? "dark:text-white text-black"
                  : "text-gray-400 dark:hover:text-white hover:text-black"
              } rounded hover:underline`}
            >
              Inicio
            </Link>
            <Link
              href="/propiedades"
              onClick={() => toggleHidden()}
              className={`${
                usePathname() === "/propiedades"
                  ? "dark:text-white text-black"
                  : "text-gray-400 dark:hover:text-white hover:text-black"
              } rounded hover:underline`}
            >
              Propiedades
            </Link>
          </ul>
          <DarkModeSwitch className="ml-2 md:ml-8" />
        </div>

        {/* Mobile menu elements */}
        <div className="hidden w-full md:hidden" id="navbar-menu">
          <ul className="flex flex-col mt-4 rounded dark:bg-neutral-700 bg-gray-200 dark:border-neutral-500 border-gray-400">
            <Link
              href="/"
              onClick={() => toggleHidden()}
              className={`${
                usePathname() === "/"
                  ? "dark:text-white text-black"
                  : "text-gray-400 dark:hover:text-white hover:text-black"
              } py-2 pl-3 pr-4 rounded dark:hover:bg-neutral-500 hover:bg-gray-300`}
            >
              Inicio
            </Link>
            <Link
              href="/propiedades"
              onClick={() => toggleHidden()}
              className={`${
                usePathname() === "/propiedades"
                  ? "dark:text-white text-black"
                  : "text-gray-400 dark:hover:text-white hover:text-black"
              } py-2 pl-3 pr-4 rounded dark:hover:bg-neutral-500 hover:bg-gray-300`}
            >
              Propiedades
            </Link>
          </ul>
        </div>
      </div>
    </nav>
  );
}
