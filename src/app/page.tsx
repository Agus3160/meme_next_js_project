"use client"

import PostList from "@/components/post/PostList";
import { PostFilter } from "@/lib/post/getPosts";
import { Search } from "lucide-react";
import { useState } from "react";

export default function Home() {

  const [title, setTitle] = useState('')
  const [filteredPosts, setFilteredPosts] = useState<PostFilter>({
    skip: 0,
  })

  return (
    <div className="text-white flex flex-col mt-8 items-center justify-center">

      <div className="flex gap-2 w-11/12 lg:w-1/2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Search by tags or users..."
          className="w-full mx-auto p-2 bg-slate-700 outline-none rounded"
        ></input>
        <button
          onClick={() => {
            setFilteredPosts({ ...filteredPosts, title:title, skip: 0 })
          }}
          className=" mx-auto p-2 bg-blue-600 hover:bg-blue-700 outline-none rounded"
        >
          <Search />
        </button>
      </div>
      
      <PostList filteredPosts={filteredPosts} setFilteredPosts={setFilteredPosts} />

    </div>
  );
};
