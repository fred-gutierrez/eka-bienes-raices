import { Interior, Post, Property } from "@/types/postTypes";
import ImageCarousel from "./ImageCarousel";

interface Props {
  postData: Post[];
}

export default function RecentlyAdded({ postData }: Props) {
  const uniqueFilteredPosts: Post[] = [];
  const propertyTypesSet = new Set<string>();

  for (let i = 0; i < postData.length; i++) {
    const post = postData[i];
    const propertiesArray =
      post.message
        .match(/\b(residencial|lote|bodega|casa|apartamento|terreno|local)\b/gi)
        ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1)) || [];

    if (propertiesArray.length === 0) continue;

    const propertyType = propertiesArray[0];

    if (!propertyTypesSet.has(propertyType)) {
      uniqueFilteredPosts.push(post);
      propertyTypesSet.add(propertyType);
    }
  }

  return (
    <>
      <div className="grid grid-cols-4 xs:grid-cols-3 items-center px-10 sm:px-20 lg:px-32 max-w-5xl mx-auto">
        <hr className="dark:bg-neutral-600 bg-neutral-300 p-0.5 w-full rounded-xl border-none" />
        <h1 className="dark:text-white text-black text-center py-10 text-3xl sm:text-4xl font-bold col-span-2 xs:col-span-1">
          ¡Lo último!
        </h1>
        <hr className="dark:bg-neutral-600 bg-neutral-300 p-0.5 w-full rounded-xl border-none" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 sm:px-5 lg:px-10 max-w-screen-2xl mx-auto">
        {uniqueFilteredPosts.map((post, index) => {
          // * Price
          const priceMatch: RegExpMatchArray | null = post.message.match(
            /(\$|₡)\d{1,4}(,\d{3})*(\.\d{3})*(\.\d+)?\s*(mil(?=[\s,]|$))?/g,
          );

          const price: string[] = priceMatch
            ? priceMatch.map((match) => {
                let cleanPrice = match.trim();
                if (cleanPrice.match(/mil(?=[\s,]|$)/)) {
                  cleanPrice = cleanPrice.replace(
                    /\s?mil(?=[\s,]|$)\b/g,
                    ".000",
                  );
                }
                return cleanPrice;
              })
            : [];

          let highestPrice: string = "";
          for (let i = 0; i < price.length; i++) {
            highestPrice = price[i];
          }

          // * Title
          const title = post.message.substring(0, post.message.indexOf("\n"));

          // * Location
          const location = post.message.match(/📍(.*?)\n/);
          const locationString = location !== null ? location[1] : "";

          // * Alquiler o Venta
          const alquilerVentaMatch = post.message.match(
            /(alquil[oó]|alquiler|vendo|venta)/i,
          );

          let alquilerVenta = null;

          if (alquilerVentaMatch) {
            const matchValue = alquilerVentaMatch[1].toLowerCase();
            switch (matchValue) {
              case "alquilo":
              case "alquiló":
              case "alquiler":
                alquilerVenta = "Alquiler";
                break;
              case "vendo":
              case "venta":
                alquilerVenta = "Venta";
                break;
            }
          }

          // * Baños and Habitaciones
          function parseSpanishNumber(numberString: string) {
            switch (numberString.toLowerCase()) {
              case "una":
                return 1;
              case "dos":
                return 2;
              case "tres":
                return 3;
              // Add more cases as needed for other Spanish numbers
              default:
                return parseInt(numberString);
            }
          }

          const habitacionMatch = post.message.match(
            /(\d+|\buna\b|\bdos\b|\btres\b)\s*(habitaci[oó]n|(?:es)|dormitorio)s?/i,
          );
          const banoMatch = post.message.match(
            /(\d+)\s*(?:batería(?:s)? de\s+)?baño(?:s)?/i,
          );

          const habitaciones = habitacionMatch
            ? parseSpanishNumber(habitacionMatch[1])
            : 0;
          const banos = banoMatch ? parseInt(banoMatch[1]) : 0;

          // * Metros cuadrados
          const metrosMatch = post.message.match(
            /(\d+(?:\.\d+)?)\s*(?=m²|M2|metros\s+cuadrados|mts|de terreno|de construcci[oó]n|terreno)/i,
          );
          const metros = metrosMatch ? parseFloat(metrosMatch[1]) : 0;

          // * Residencial|Lote|Bodega|Casa|Apartamento|Terreno
          const propertiesArray =
            post.message
              .match(
                /\b(residencial|lote|bodega|casa|apartamento|terreno|local)\b/gi,
              )
              ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1)) ||
            [];
          const propertyType = Array.from([propertiesArray[0]]);

          const interiorDetails: Interior[] = [
            {
              ifStatement: habitaciones,
              icon: "bed",
              desc: ` Dormitorio${habitaciones > 1 ? "s" : ""}`,
              display: habitaciones,
            },
            {
              ifStatement: banos,
              icon: "bath",
              desc: ` Baño${banos > 1 ? "s" : ""}`,
              display: banos,
            },
            {
              ifStatement: metros >= 45 ? metros : false,
              icon: "map",
              desc: "m²",
              display: metros,
            },
          ];

          const propertiesType: Property[] = [
            {
              propType: "Residencial",
              icon: "house-user",
            },
            {
              propType: "Terreno",
              icon: "mountain",
            },
            { propType: "Lote", icon: "panorama" },
            {
              propType: "Casas",
              icon: "house",
            },
            {
              propType: "Apartamento",
              icon: "building",
            },
            {
              propType: "Local",
              icon: "shop",
            },
            {
              propType: "Bodega",
              icon: "warehouse",
            },
          ];

          return (
            <div key={index} className="mx-auto property-li opacity-0">
              {propertyType && (
                <div className="flex items-center justify-center mx-auto my-4 text-2xl">
                  <span className="mr-2 text-neutral-400">en</span>
                  <h1 className="dark:text-white text-black font-semibold">
                    {propertyType}
                    {propertyType.toString() === "Local" ? "es" : "s"}
                  </h1>
                </div>
              )}
              <ul>
                <li
                  id={post.id}
                  className={`
                  dark:bg-neutral-700 bg-gray-100 
                  border-2 dark:border-neutral-600 border-gray-200
                  shadow-lg dark:shadow-neutral-600 shadow-gray-200
                  mb-6 py-6 px-5 mx-5
                  max-w-md rounded-xl`}
                >
                  <div>
                    {post.attachments.data.map(
                      (attachment: any, index: number) => {
                        const allImages = attachment.subattachments.data.map(
                          (subattachment: any) => subattachment.media.image.src,
                        );

                        return <ImageCarousel images={allImages} key={index} />;
                      },
                    )}
                  </div>
                  <div>
                    <div className="dark:text-white text-black flex items-center pt-5">
                      <h1 className={`text-2xl sm:text-3xl font-bold`}>
                        {highestPrice}
                      </h1>
                      <p className={`ml-2 text-lg text-center font-light`}>
                        - En {alquilerVenta}
                      </p>
                    </div>
                    <h1
                      className={`dark:text-white text-black text-lg md:text-xl pt-2`}
                    >
                      {title}
                    </h1>
                    <div className="py-3 dark:text-white text-black">
                      {interiorDetails.map((intDetails, index) =>
                        intDetails.ifStatement ? (
                          <div
                            className="inline-flex items-center mr-3"
                            key={index}
                          >
                            <i
                              className={`fa-light fa-${intDetails.icon} mr-1`}
                            ></i>
                            <div>
                              <span className="font-semibold">
                                {intDetails.display}
                              </span>
                              {intDetails.desc}
                            </div>
                          </div>
                        ) : null,
                      )}
                      {propertiesType.map(
                        (property, index) =>
                          propertyType.includes(property.propType) && (
                            <div
                              className="inline-flex items-center"
                              key={index}
                            >
                              <i
                                className={`fa-light fa-${property.icon} text-gray-800 mr-1`}
                              ></i>
                              <span>{property.propType}</span>
                            </div>
                          ),
                      )}
                    </div>
                    <div>
                      {locationString && (
                        <div className="dark:text-white text-black flex items-center pb-4">
                          <i
                            className={`fa-solid fa-location-dot !text-red-500 mr-2`}
                          ></i>
                          <h1 className={`text-lg font-light`}>
                            {locationString}
                          </h1>
                        </div>
                      )}
                      <div className="w-full">
                        <a
                          href={`https://www.facebook.com/BienesRaicesEka/posts/${post.id}`}
                          target={"_blank"}
                        >
                          <button
                            className={`
                          dark:bg-orange-500 dark:hover:bg-orange-400 dark:border-orange-700 dark:hover:border-orange-500
                          bg-green-500 hover:bg-green-400 border-green-700 hover:border-green-500
                          text-white font-bold py-2 px-4 border-b-4  
                          rounded w-full`}
                          >
                            Ver Detalles
                          </button>
                        </a>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          );
        })}
      </div>
    </>
  );
}
