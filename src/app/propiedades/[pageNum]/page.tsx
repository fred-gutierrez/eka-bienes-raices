"use client";

import { useState, useEffect } from "react";
import AdItem from "@/components/AdItem";
import postsData from "@/data/postsData.json";
import Pagination from "@/components/Pagination";
import { Post } from "@/types/postTypes";
import gsap from "gsap";
import { usePathname } from "next/navigation";

const Propiedades = () => {
  const [postData, setPostData] = useState<Post[]>([]);
  // usePathName is used to get the current url as a string 
  const [currentPage, setCurrentPage] = useState(
    Number(usePathname().split("").pop()),
  );
  const [postPerPage, setPostPerPage] = useState(10);

  const lastPostIndex = Math.min(currentPage * postPerPage, postData.length);
  const firstPostIndex = lastPostIndex - postPerPage;
  const currentPosts = postData.slice(firstPostIndex, lastPostIndex);

  // Animations
  useEffect(() => {
    setPostData(postsData);

    gsap.fromTo(
      ".property-li",
      {
        y: 50,
      },
      {
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        y: 0,
      },
    );
  }, [postData]);

  return (
    <>
      <AdItem postData={currentPosts} />
      <Pagination
        totalPosts={postData.length}
        postsPerPage={postPerPage}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
    </>
  );
};

export default Propiedades;
