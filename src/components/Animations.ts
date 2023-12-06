"use client";

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
    gsap.fromTo(
      ".header-animation",
      {
        duration: 1,
        opacity: 0,
        y: 50,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.5,
      },
    );
  }, []);

  return null;
};

export default Animations;
