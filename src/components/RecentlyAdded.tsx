import { Post } from "@/types/postTypes";
import ImageCarousel from "./ImageCarousel";
import { processPostData } from "@/utils/processPostData";

interface Props {
  postData: Post[];
}

export default function RecentlyAdded({ postData }: Props) {
  const uniqueFilteredPosts: Post[] = [];
  const propertyTypesSet = new Set<string>();
  const propertyTypes = ["Casa", "Apartamento", "Bodega", "Residencial", "Local", "Terreno"]

  for (let i = 0; i < postData.length; i++) {
    const propertyMatch = postData[i].message.match(/\b(residencial|lote|bodega|casa|apartamento|terreno|local)\b/gi)

    if (propertyMatch && propertyMatch.length > 0) {
      const propertyType = propertyMatch[0].charAt(0).toUpperCase() + propertyMatch[0].slice(1);

      if (propertyTypes.includes(propertyType) && !propertyTypesSet.has(propertyType)) {
        uniqueFilteredPosts.push(postData[i]);
        propertyTypesSet.add(propertyType);
      }
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 sm:px-5 lg:px-10 max-w-screen-2xl mx-auto">
        {uniqueFilteredPosts.map((post: Post, index: number) => {
          const {
            title,
            locationString,
            highestPrice,
            alquilerVenta,
            propertyType,
            interiorDetails,
            propertiesType,
            images
          } = processPostData(post);

          return (
            <div key={index} className="mx-auto">
              <div className="flex items-center justify-center mx-auto my-4 text-2xl">
                <span className="mr-2 text-neutral-400 font-light">en</span>
                <h1 className="dark:text-white text-black font-light">
                  {propertyType}
                  {propertyType.toString() === "Local" || propertyType.toString() === "Residencial" ? "es" : "s"}
                </h1>
              </div>
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
                    <ImageCarousel images={images} key={index} />
                  </div>
                  <div>
                    <div className="dark:text-white text-black flex items-center pt-5">
                      <h1 className={`text-2xl 2xl:text-3xl font-bold`}>
                        {highestPrice ? highestPrice : "Valor no indicado"}
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
