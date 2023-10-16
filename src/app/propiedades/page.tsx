"use client";

import { useState, useEffect } from "react";
import PostItem from "@/components/PostItem";
import postsData from "@/data/postsData.json";
import Pagination from "@/components/Pagination";
import { Post } from "@/types/postTypes";

const Propiedades = () => {
  const [postData, setPostData] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(10);

  useEffect(() => {
    setPostData(postsData);
  }, [postData]);

  const lastPostIndex = Math.min(currentPage * postPerPage, postData.length);
  const firstPostIndex = lastPostIndex - postPerPage;
  const currentPosts = postData.slice(firstPostIndex, lastPostIndex);

  return (
    <>
      <PostItem postData={currentPosts} />
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
