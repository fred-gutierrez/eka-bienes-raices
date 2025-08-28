"use client";

import Image from "next/image";

export default function Footer() {
  const faceBookPage = "https://www.facebook.com/BienesRaicesEka";
  const tiktokPage = "https://www.tiktok.com/@bienesyraices_eka";

  return (
    <footer className="p-5 mt-5 sm:p-10 md:px-20 lg:px-32 bg-neutral-50 border-t-2 border-neutral-150">
      <div className="md:flex md:justify-between">
        <div className="mb-6 md:mb-0 flex">
          <a href="/">
            <Image
              src="/eka-logo-black.png"
              className="ml-3"
              height={96}
              width={96}
              alt="Eka Bienes Raices Logo"
            />
          </a>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
          <div>
            <h2 className="text-black mb-6 text-sm font-semibold uppercase">
              Seguínos
            </h2>
            <ul className="text-gray-600">
              <li className="mb-4">
                <a
                  href={faceBookPage}
                  className="hover:underline"
                  target={"_blank"}
                >
                  Facebook
                </a>
              </li>
              <li className="mb-4">
                <a
                  href={tiktokPage}
                  className="hover:underline"
                  target={"_blank"}
                >
                  TikTok
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <hr className="my-6 sm:mx-auto border-gray-400 lg:my-8" />
      <span className="text-gray-600 text-sm sm:text-center">
        © 2023{" "}
        <a href="/" className="hover:underline">
          Eka Bienes Raíces
        </a>
        ™. Todos los derechos reservados.
      </span>
    </footer>
  );
}
