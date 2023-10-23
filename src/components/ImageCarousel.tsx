"use client"

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface ImageCarouselProps {
  images: string[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const fadeInImage = () => {
      gsap.to(imageRef.current, {
        opacity: 1,
        duration: 0.3,
      });
    };
    gsap.to(imageRef.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: fadeInImage,
    });
  }, [currentImage, images]);

  const nextImage = () => {
    setCurrentImage((prevImage) => (prevImage + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage(
      (prevImage) => (prevImage - 1 + images.length) % images.length,
    );
  };

  return (
    <div className="relative">
      <div className="flex justify-center">
        <img
          src={images[currentImage]}
          alt={`Image ${currentImage + 1}`}
          className="w-full h-60 sm:h-72 object-cover rounded-lg shadow-lg"
        />
      </div>
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 cursor-pointer text-gray-100 hover:text-gray-300">
        <button onClick={prevImage}>
          <i className="fa-solid fa-chevron-left fa-xl w-7 h-7 drop-shadow-2xl"></i>
        </button>
      </div>
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-gray-100 hover:text-gray-300">
        <button onClick={nextImage}>
          <i className="fa-solid fa-chevron-right fa-xl w-7 h-7 drop-shadow-2xl"></i>
        </button>
      </div>
    </div>
  );
};

export default ImageCarousel;
