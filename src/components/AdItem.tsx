import { Post } from "@/types/postTypes";
import ImageCarousel from "./ImageCarousel";
import { processPostData } from "@/utils/processPostData";

interface Props {
  postData: Post[];
}

const AdItem = ({ postData }: Props) => {
  return (
    <ul className="mt-5">
      {postData.map((post: Post, index: number) => {
        const {
          title,
          locationString,
          alquilerVenta,
          highestPrice,
          propertyType,
          interiorDetails,
          propertiesType,
          images
        } = processPostData(post);

        return (
          <li
            key={index}
            id={post.id}
            className={`
            dark:bg-neutral-700 bg-gray-100 
            border-2 dark:border-neutral-600 border-gray-200
            shadow-lg dark:shadow-neutral-600 shadow-gray-200
            items-center
            mb-6 md:mb-6 py-6 px-5 mx-5
            max-w-screen-lg 
            md:grid md:grid-cols-2
            lg:mx-auto rounded-xl`}
          >
            <div>
              <ImageCarousel images={images} key={index} />
            </div>
            <div className="md:pl-5">
              <div className="dark:text-white text-black flex items-center pt-5 md:pt-0">
                <h1 className={`text-2xl lg:text-3xl font-bold`}>
                  {highestPrice ? highestPrice : "Valor no indicado"}
                </h1>
                {alquilerVenta ?
                  <p className={`ml-1.5 text-lg text-center font-light`}>
                    - En {alquilerVenta}
                  </p>
                  : ""}
              </div>
              <h1
                className={`dark:text-white text-black text-lg md:text-xl pt-2`}
              >
                {title}
              </h1>
              <div className="py-3 dark:text-white text-black">
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
                  <div className="dark:text-white text-black flex items-center pb-4">
                    <i
                      className={`fa-solid fa-location-dot !text-red-500 mr-2`}
                    ></i>
                    <h1 className={`text-lg font-light`}>{locationString}</h1>
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
                      rounded w-full md:w-36`}
                    >
                      Ver Detalles
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default AdItem;
