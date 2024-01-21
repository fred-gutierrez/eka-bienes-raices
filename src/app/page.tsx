"use client";

import Header from "@/components/Header";
import RecentlyAdded from "@/components/RecentlyAdded";
import { useEffect, useState } from "react";
import gsap from "gsap";
import { Post } from "@/types/postTypes";
import { supabase } from "@/supabase/client";

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
      {fetchError && <><p>{fetchError}</p></>}
      {postData && <RecentlyAdded postData={postData} />}
    </>
  );
}
