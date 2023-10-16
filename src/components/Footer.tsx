import Image from "next/image";

export default function Footer() {
  const faceBookPage = "https://www.facebook.com/BienesRaicesEka";
  return (
    <footer className="p-5 sm:px-10 sm:py-9 bg-transparent">
      <div className="md:flex md:justify-between">
        <div className="mb-6 md:mb-0 flex">
          <a href="/">
            <Image src="/eka-logo-transparent2.png" className="ml-3" height={96} width={96} alt="Eka Logo" />
          </a>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
          <div>
            <h2 className="mb-6 text-sm font-semibold uppercase text-black">
              Seguínos
            </h2>
            <ul className="text-gray-600">
              <li className="mb-4">
                {" "}
                <a
                  href={faceBookPage}
                  className="hover:underline"
                  target={"_blank"}
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <hr className="my-6 sm:mx-auto border-gray-400 lg:my-8" />
      <span className="text-sm sm:text-center text-gray-600">
        © 2023{" "}
        <a href="/" className="hover:underline">
          Eka Bienes Raíces™
        </a>
        . Todos los derechos reservados.
      </span>
    </footer>
  );
}
