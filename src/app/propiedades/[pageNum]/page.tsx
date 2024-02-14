"use client";

import { useState, useEffect } from "react";
import AdItem from "@/components/AdItem";
import Pagination from "@/components/Pagination";
import { Post } from "@/types/postTypes";
// import gsap from "gsap";
import { usePathname } from "next/navigation";
import { supabase } from "@/supabase/client";
import Loading from "@/components/Loading";

const Propiedades = () => {
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [postData, setPostData] = useState<Post[]>([])
  const [postPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(Number(usePathname().match(/\d+$/)));

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select()
        .order('created_at', { ascending: false })

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
    <div className="min-h-screen">
      {(!postData.length && !fetchError) ? (
        <Loading />
      ) : (
        <>
          {fetchError && <p>{fetchError}</p>}
          <AdItem postData={currentPosts} />
          <Pagination
            totalPosts={postData.length}
            postsPerPage={postPerPage}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        </>
      )}
    </div>
  );
};

export default Propiedades;
