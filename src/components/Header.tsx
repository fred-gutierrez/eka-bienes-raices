import Link from "next/link";

export default function Header() {
  return (
    <>
      <div className="relative overflow-hidden">
        <div className="bg-house-bg-image absolute h-full w-full bg-cover bg-center blur-sm scale-110"></div>
        <div className="bg-drop-shadow absolute bg-cover bg-center w-full h-full top-0 opacity-30"></div>
        <div className="relative text-center py-44 md:py-52 pb-52 px-8">
          <div className="text-white">
            <h1 className="header-animation text-3xl sm:text-4xl md:text-5xl md:leading-tight drop-shadow-md font-bold opacity-0">
              Comienza tu Historia
            </h1>
            <p className="header-animation font-medium opacity-0 drop-shadow-md text-sm sm:text-base md:text-xl">
              Da Forma a tu Narrativa: Encuentra la Propiedad<br />
              Perfecta para Comenzar tu Próximo Capítulo
            </p>
          </div>
          <div className="header-animation text-center opacity-0">
            <Link href="/propiedades">
              <button
                className={`
                bg-green-500 hover:bg-green-400 text-white border-green-700 hover:border-green-500
                py-2 px-4 font-bold border-b-4  
                w-52 mt-2 md:mt-3 rounded-full text-center
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
