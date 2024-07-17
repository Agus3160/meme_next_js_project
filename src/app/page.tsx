"use client"

import { PostType } from "@/lib/definitions";
import getPosts, { PostFilter } from "@/lib/post/getPosts";
import { LoaderCircle, Heart, MessageCircle, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function Home() {

  const session = useSession();

  const limit = 10
  const [posts, setPosts] = useState<PostType[]>([]);
  const [count, setCount] = useState(0);
  const [filteredPosts, setFilteredPosts] = useState<PostFilter>({
    skip: 0,
  })
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const { data, error, success } = await getPosts(filteredPosts);
      if (success && data) {
        setPosts(prevPosts => [...prevPosts, ...data.data]);
        setCount(data.count);
      } else throw new Error(error);
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

  return (
    <div className="text-white flex flex-col mt-8 items-center justify-center">

      <div className="flex gap-2 w-11/12 lg:w-1/2">
        <input
          placeholder="Search by tags or users..."
          className="w-full mx-auto p-2 bg-slate-700 outline-none rounded"
        ></input>
        <button
          className=" mx-auto p-2 bg-blue-600 hover:bg-blue-700 outline-none rounded"
        >
          <Search />
        </button>
      </div>
      <div className="w-11/12 lg:w-[800px]">
        <div className="grid grid-cols-1 place-content-center md:grid-cols-2 justify-items-center w-full gap-6 my-12">
          {posts.map((post) => (
            <div key={post.id}
              className=" rounded max-w-[320px] sm:w-[500px]"
            >
              <div className="relative w-full h-[320px] sm:h-[400px]" >
                <Image
                  loading="lazy"
                  fill
                  src={post.image.urlOriginalImg}
                  style={{
                    backgroundImage: `url(${post.image.urlBlurImg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    objectFit: 'scale-down',
                    objectPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                  placeholder="blur"
                  sizes="(100vw - 2.5rem) min(100%, 100vw)"
                  blurDataURL={post.image.urlBlurImg}
                  alt={post.title}
                />
              </div>
              <div className="flex gap-4 items-center p-4 bg-slate-800 rounded-b">
                <div className="flex flex-col flex-1 text-left ">
                  <h2 className="font-bold line-clamp-1">{post.title} dasd ad sad asdas d s</h2>
                  <p className="text-sm">By {post.author.username}</p>
                </div>
                <div className="flex gap-1 rounded-md  items-center">
                  <span className="text-sm">0</span>
                  <Heart className="sm:w-7 sm:h-7 w-6 h-6" />
                </div>
                <button
                  className="flex gap-1 rounded-md items-center"
                >
                  <span className="text-sm">0</span>
                  <MessageCircle className="sm:w-7 sm:h-7 w-6 h-6" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {loading && <LoaderCircle size={32} className="animate-spin my-16" />}
    </div>
  );
};
