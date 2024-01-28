import Link from "next/link";

export default function Header() {
  return (
    <>
      <div className="relative overflow-hidden">
        <div className="dark:bg-darkmode-image bg-lightmode-image absolute h-full w-full bg-cover bg-center blur-sm scale-110"></div>
        <div className="bg-drop-shadow absolute bg-cover bg-center w-full h-full top-0 opacity-30"></div>
        <div className="relative text-center py-44 md:py-52 pb-52 px-8">
          <h1 className="header-animation sm:text-4xl md:text-5xl md:leading-tight text-neutral-100 text-2xl drop-shadow-lg font-bold opacity-0">
            Casas en Venta, Renta y<br /> Propiedades Comerciales
          </h1>
          <div className="text-center header-animation opacity-0">
            <Link href="/propiedades">
              <button
                className={`
                bg-green-500 hover:bg-green-400 text-white border-green-700 hover:border-green-500
                py-2 px-4 font-semibold border-b-4  
                w-52 mt-2 md:mt-3 lg:mt-4 rounded-full text-center
              `}
              >
                Ver Propiedades
                <i className="fa-solid fa-arrow-right fa-lg text-white ml-2"></i>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
