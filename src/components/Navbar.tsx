"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
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
    <nav className="p-3 sticky sky top-0 silver z-10" ref={navbarRef}>
      <div className="container flex flex-wrap items-center justify-between mx-auto">
        <a href="/" className="flex items-center">
          <Image
            src="/eka-logo-transparent1.png"
            className="ml-3"
            width={54}
            height={54}
            alt="Eka Logo"
          />
        </a>
        <button
          data-collapse-toggle="navbar-solid-bg"
          type="button"
          className={`inline-flex items-center p-2 mr-3 text-sm 
          rounded md:hidden focus:outline-none focus:ring-2
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
        <div className="hidden w-full md:block md:w-auto" id="navbar-menu">
          <ul className="flex flex-col mt-4 rounded md:flex-row md:space-x-8 md:mt-0 md:text-md md:font-medium md:border-0 bg-gray-200 md:bg-transparent border-gray-300">
            <Link
              href="/"
              onClick={() => toggleHidden()}
              className={`${
                usePathname() === "/"
                  ? "text-black"
                  : "text-gray-400 hover:text-black"
              } py-2 pl-3 pr-4 md:p-0 rounded md:border-0 hover:bg-gray-300 md:hover:bg-transparent hover:underline`}
            >
              Inicio
            </Link>
            <Link
              href="/propiedades"
              onClick={() => toggleHidden()}
              className={`${
                usePathname() === "/propiedades"
                  ? "text-black"
                  : "text-gray-400 hover:text-black"
              } py-2 pl-3 pr-4 md:p-0 rounded md:border-0 hover:bg-gray-300 md:hover:bg-transparent hover:underline`}
            >
              Propiedades
            </Link>
          </ul>
        </div>
      </div>
    </nav>
  );
}
