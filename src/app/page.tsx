"use client";

import Header from "@/components/Header";
import RecentlyAdded from "@/components/RecentlyAdded";
import { useEffect, useState } from "react";
import gsap from "gsap";
import { Post } from "@/types/postTypes";
import { supabase } from "@/supabase/client";
import Loading from "@/components/Loading";

export default function Inicio() {
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [postData, setPostData] = useState<Post[]>([])

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
  }, []);

  return (
    <>
      <Header />
      <h1 className="dark:text-white text-black text-center py-11 text-3xl sm:text-4xl font-semibold">
        ¡Lo último!
      </h1>
      {(!postData.length && !fetchError) ? (
        <Loading />
      ) : (
        <>
          {fetchError && <p>{fetchError}</p>}
          <RecentlyAdded postData={postData} />
        </>
      )}
    </>
  );
}
