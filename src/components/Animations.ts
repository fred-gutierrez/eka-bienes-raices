"use client"

import gsap from "gsap";
import { useEffect, useRef } from "react";

// * React 18 - Strict mode issue = https://greensock.com/forums/topic/31712-simple-opacity-fade-doesnt-work-in-react/
const Animations = () => {
  const didAnimate = useRef(false);

  useEffect(() => {
    if (didAnimate.current) {
      return;
    }
    didAnimate.current = true;
    gsap.from(".header-elements", {
      duration: 1.5,
      opacity: 0,
      y: 300,
      stagger: 0.15,
    });
  }, []);

  return null
};

export default Animations;
