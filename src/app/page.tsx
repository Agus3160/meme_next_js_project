"use client"

import { PostType } from "@/lib/definitions";
import getPosts, { PostFilter } from "@/lib/post/getPosts";
import { LoaderCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {

  const limit = 10

  const [posts, setPosts] = useState<PostType[]>([]);
  const [count, setCount] = useState(0);
  const [filteredPosts, setFilteredPosts] = useState<PostFilter>({
    skip: 0,
  })
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error, success } = await getPosts(filteredPosts);
      if(success && data){ 
        setPosts(prevPosts => [...prevPosts, ...data.data]);
        setCount(data.count);
      }else throw new Error(error);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [filteredPosts]);

  const handleScroll = () => {
    if (loading) return;

    const scrollTop = document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (
      scrollTop + windowHeight >= documentHeight * 0.75 
      && filteredPosts.limit 
      && count > filteredPosts.skip! + limit
    ) {
      setFilteredPosts(prevPage => {
        return {
          ...prevPage, 
          skip: prevPage.skip! + prevPage.limit!
        }
      });
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  console.log(posts)

  return (
    <div className="text-white flex flex-col mt-8 items-center justify-center">

      <div className="flex gap-2 w-3/4 lg:w-1/2">
        <input 
          placeholder="You can search by tags and users..." 
          className="w-full mx-auto p-2 bg-slate-700 outline-none rounded"
        ></input>
        <button 
          className=" mx-auto p-2 bg-blue-600 hover:bg-blue-700 outline-none rounded"
        >
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 justify-items-center gap-12 my-12">
        {posts.map(post => (
          <div className="max-w-[480px]" key={post.id}>
            <img 
              loading="lazy"
              className="w-full h-full object-cover mx-auto"
              src={post.image.urlOriginalImg} 
              alt={post.title} 
            />
          </div>
        ))}
      </div>
      
      {loading && <LoaderCircle size={32} className="animate-spin "/>}
    </div>
  );
};
