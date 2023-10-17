import Link from "next/link";

export default function Header() {
  return (
    <>
      <div className="relative">
        <div className="relative text-center py-56 md:py-64 px-8 h-screen header-elements">
          <h1 className="dark:header-text header-text text-center sm:text-4xl md:text-5xl md:leading-tight text-2xl font-bold md:font-medium">
            ¡Casas en Venta, Renta y<br /> Propiedades Comerciales!
          </h1>
          <div className="text-center header-elements">
            <Link href="/propiedades">
              <button
                className={`dark:bg-orange-500 dark:hover:bg-orange-400 dark:border-orange-700 dark:hover:border-orange-500 
                bg-green-500 hover:bg-green-400 text-white border-green-700 hover:border-green-500
                py-2 px-4 font-semibold border-b-4  
                w-52 mt-4 md:mt-6 rounded-full text-center`}
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
