"use client";

import postData from "@/data/postsData.json";
import Header from "@/components/Header";
import RecentlyAdded from "@/components/RecentlyAdded";
import { useEffect } from "react";
import gsap from "gsap";

export default function Inicio() {
  // GSAP Animations
  useEffect(() => {
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
        stagger: 0.3,
      },
    );
    gsap.fromTo(
      ".property-li",
      {
        y: 50,
      },
      {
        opacity: 1,
        duration: 1,
        stagger: 0.3,
        y: 0,
      },
    );
  }, []);

  return (
    <>
      <Header />
      <RecentlyAdded postData={postData} />
    </>
  );
}
