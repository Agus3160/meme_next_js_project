"use client"

import { PostType } from "@/lib/definitions";
import getPosts, { PostFilter } from "@/lib/post/getPosts";
import { LoaderCircle } from "lucide-react";
import { useState, useEffect } from "react";
import PostCard from "./PostCard";
import authOptions from "@/lib/auth/authOptions";
import { useSession } from "next-auth/react";

type Props = {
  filteredPosts: PostFilter
  setFilteredPosts: React.Dispatch<React.SetStateAction<PostFilter>>
}

export default function PostList({
  filteredPosts,
  setFilteredPosts
}: Props) {

  const { data:session } = useSession()

  const limit = 10
  const [posts, setPosts] = useState<PostType[]>([]);
  const [count, setCount] = useState(0);

  const [loading, setLoading] = useState(true);

  const fetchMorePosts = async () => {
    try {
      const { data, error, success } = await getPosts(filteredPosts);
      if (success && data) {
        const prevPosts = [...posts];
        setPosts([...prevPosts, ...data.data]);
        setCount(data.count);
      } else throw new Error(error);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const { data, error, success } = await getPosts(filteredPosts);
      if (success && data) {
        setPosts(data.data);
        setCount(data.count);
      } else throw new Error(error);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchMorePosts();
  }, [filteredPosts.skip]);

  useEffect(() => {
    setLoading(true);
    fetchPosts();
  }, [filteredPosts.templateId, filteredPosts.userId, filteredPosts.title]);

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
    <>
      <div className="w-11/12 md:w-[800px] lg:w-[1000px]">
        {
          !loading && posts.length === 0 ?
            <div className="flex w-full gap-6 my-12">
              <p className="text-center w-full mt-12 text-lg">No memes found :c</p>
            </div>
            :
            <div className="grid grid-cols-1 place-content-center lg:grid-cols-3 md:grid-cols-2 justify-items-center w-full gap-6 my-12">
              {posts.map((post) => (
                <PostCard session={session} key={post.id} post={post} />
              ))}
            </div>
        }
      </div>
      {loading && <LoaderCircle size={32} className="animate-spin my-16" />}
    </>
  );
};
