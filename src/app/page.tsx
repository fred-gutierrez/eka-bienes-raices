"use client";

import postData from "@/data/postsData.json";
import Header from "@/components/Header";
import RecentlyAdded from "@/components/RecentlyAdded";
import Animations from "@/components/Animations";

export default function Inicio() {
  Animations();

  return (
    <>
      <Header />
      <RecentlyAdded postData={postData} />
    </>
  );
}
