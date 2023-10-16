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
      <h1
        id="recently-added-header-text"
        className="text-center mb-10 sm:text-4xl md:leading-tight text-3xl font-bold md:font-medium"
      >
        ¡Lo ultimo!
      </h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
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
              propType: "Casa",
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
            <>
              <div key={index}>
                {propertyType && (
                  <h1 className="text-center text-2xl my-4 underline">
                    {propertyType}
                  </h1>
                )}
                <li
                  key={index}
                  id={post.id}
                  className={`
                bg-gray-100 border-2 border-gray-200
                shadow-lg shadow-gray-200
                items-center
                mb-6 py-8 px-5 mx-5
                max-w-screen-sm rounded-xl`}
                >
                  <div>
                    {post.attachments.data.map((attachment: any, index: number) => {
                      const allImages = attachment.subattachments.data.map(
                        (subattachment: any) => subattachment.media.image.src,
                      );

                      return <ImageCarousel images={allImages} key={index} />;
                    })}
                  </div>
                  <div>
                    <div className="flex items-center pt-5">
                      <h1 className={`text-2xl sm:text-3xl font-bold`}>
                        {highestPrice}
                      </h1>
                      <p className={`ml-2 text-lg text-center font-light`}>
                        - En {alquilerVenta}
                      </p>
                    </div>
                    <h1 className={`text-lg md:text-xl pt-2`}>{title}</h1>
                    <div className="py-3">
                      {interiorDetails.map((intDetails, index) =>
                        intDetails.ifStatement ? (
                          <div className="inline-flex items-center mr-3" key={index}>
                            <i
                              className={`fa-light fa-${intDetails.icon} mr-1 text-gray-800`}
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
                            <div className="inline-flex items-center" key={index}>
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
                        <div className="flex items-center pb-4">
                          <i className={`fa-solid fa-location-dot mr-2`}></i>
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
                            className={`bg-orange-500 hover:bg-orange-400 text-white 
                font-bold py-2 px-4 border-b-4 border-orange-700 hover:border-orange-500 
                rounded  hover:animate-pulse w-full`}
                          >
                            Ver Detalles
                          </button>
                        </a>
                      </div>
                    </div>
                  </div>
                </li>
              </div>
            </>
          );
        })}
      </ul>
    </>
  );
}
