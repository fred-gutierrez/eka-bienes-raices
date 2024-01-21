"use client";

import React, { useState } from "react";

interface ImageCarouselProps {
  images: string[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextImage = () => {
    setCurrentImage((prevImage) => (prevImage + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage(
      (prevImage) => (prevImage - 1 + images.length) % images.length,
    );
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-center">
        <img
          src={images[currentImage] === null ? undefined : images[currentImage]}
          alt={`Image ${currentImage + 1}`}
          className="w-full h-60 sm:h-72 object-cover rounded-lg shadow-lg"
        />
      </div>
      <button
        onClick={prevImage}
        className={`absolute top-1/2 left-0 transform -translate-y-1/2 cursor-pointer text-gray-100 hover:text-gray-200 ${isHovered ? "md:opacity-100" : "md:opacity-0"
          } h-full pl-5 md:pl-5`}
      >
        <i className="fa-solid fa-chevron-left text-2xl md:text-3xl drop-shadow-lg"></i>
      </button>
      <button
        onClick={nextImage}
        className={`absolute top-1/2 right-0 transform -translate-y-1/2 cursor-pointer text-gray-100 hover:text-gray-200 ${isHovered ? "md:opacity-100" : "md:opacity-0"
          } h-full pr-5 md:pr-6`}
      >
        <i className="fa-solid fa-chevron-right text-2xl md:text-3xl drop-shadow-lg"></i>
      </button>
    </div>
  );
};

export default ImageCarousel;
