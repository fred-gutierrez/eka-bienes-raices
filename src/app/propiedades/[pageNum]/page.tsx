"use client";

import { useState, useEffect } from "react";
import AdItem from "@/components/AdItem";
import Pagination from "@/components/Pagination";
import { Post } from "@/types/postTypes";
import gsap from "gsap";
import { usePathname } from "next/navigation";
import { supabase } from "@/supabase/client";

const Propiedades = () => {
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [postData, setPostData] = useState<Post[]>([])
  const [postPerPage, setPostPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(
    Number(usePathname().split("").pop()), // Get the current URL as a string
  );

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select()

      if (error) {
        setFetchError("Could not fetch the post data")
        setPostData([])
        console.log(error)
      }

      if (data) {
        setPostData(data)
        setFetchError(null)
      }
    }

    fetchData()
  }, [])

  const lastPostIndex = Math.min(currentPage * postPerPage, postData.length);
  const firstPostIndex = lastPostIndex - postPerPage;
  const currentPosts = postData.slice(firstPostIndex, lastPostIndex);

  return (
    <>
      {fetchError && <><p>{fetchError}</p></>}
      {postData && <>
        <AdItem postData={currentPosts} />
        <Pagination
          totalPosts={postData.length}
          postsPerPage={postPerPage}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      </>}
    </>
  );
};

export default Propiedades;
