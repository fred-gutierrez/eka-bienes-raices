import { Post, Interior, Property } from "@/types/postTypes";

export function processPostData(post: Post) {
  // * Price
  const priceMatch: RegExpMatchArray | null = post.message.match(
    /(\$|₡|¢)\d{1,4}(,\d{3})*(\.\d{3})*(\.\d+)?\s*(mil(?=[\s,]|$))?/g,
  );

  const price: string[] = priceMatch
    ? priceMatch.map((match) => {
        let cleanPrice = match.trim();
        if (
          cleanPrice.match(/mil(?=[\s,]|$)/) &&
          !cleanPrice.includes(".000")
        ) {
          cleanPrice = cleanPrice.replace(/\s?mil(?=[\s,]|$)\b/g, ".000");
        } else {
          cleanPrice = cleanPrice.replace(/\s?mil(?=[\s,]|$)\b/g, "");
        }
        return cleanPrice;
      })
    : [];

  let highestPrice: string = "";
  for (let i = 0; i < price.length; i++) {
    price[i].startsWith("$") && parseFloat(price[i].substring(1)) >= 450
      ? (highestPrice = price[i])
      : (highestPrice = price[i]);
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
      .match(/\b(residencial|lote|bodega|casa|apartamento|terreno|local)\b/gi)
      ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1)) || [];
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

  return {
    highestPrice,
    title,
    locationString,
    alquilerVenta,
    habitaciones,
    banos,
    metros,
    propertyType,
    interiorDetails,
    propertiesType,
  };
}
