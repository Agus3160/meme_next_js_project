"use client"

import { TemplateType } from "@/lib/definitions";
import getAllTemplates, { TemplateFilter } from "@/lib/template/getAllTemplates";
import { LoaderCircle, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Template() {

  const limit = 10
  const [templates, setTemplates] = useState<TemplateType[]>([]);
  const [count, setCount] = useState(0);
  const [templateFilter, setTemplateFilter] = useState<TemplateFilter>({
    skip: 0,
  })
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const { data, error, success } = await getAllTemplates(templateFilter);
      if (success && data) {
        setTemplates(prevTemplate => [...prevTemplate, ...data.data]);
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
  }, [templateFilter]);

  const handleScroll = () => {
    if (loading) return;

    const scrollTop = document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (
      scrollTop + windowHeight >= documentHeight * 0.75
      && templateFilter.limit
      && count > templateFilter.skip! + limit
    ) {
      setTemplateFilter(prevPage => {
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
    <div className="text-white flex flex-col mt-8 mx-4 sm:mx-0 items-center justify-center">

      <div className="w-11/12 lg:w-1/2 flex flex-col gap-2">
        <div className="flex gap-2 w-full">
          <input
            placeholder="Search by tags or name..."
            className="w-full mx-auto p-2 bg-slate-700 outline-none rounded"
          ></input>
          <button
            className=" mx-auto p-2 bg-blue-600 hover:bg-blue-700 outline-none rounded"
          >
            <Search />
          </button>
        </div>
        <Link className="text-blue-400 hover:text-blue-500 hover:underline text-sm text-center" href="/template/upload">Do you want to upload your template?</Link>
      </div>
      
      <div className="w-full sm:w-11/12 lg:w-[956px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-items-center w-full gap-6 my-12">
        {templates.map((template) => (
          <div key={template.id}
            className="shadow-md rounded w-[155px] sm:w-[225px] justify-self-center"
          >
            <div className="relative w-full h-[200px] sm:h-[200px]" >
              <Image
                loading="lazy"
                fill={true}
                src={template.image.urlOriginalImg}
                className="bg-gray-700 rounded-t"
                style={{ 
                  backgroundImage:`url(${template.image.urlBlurImg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  objectFit: 'scale-down', 
                  objectPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
                placeholder="blur"
                sizes="(100vw - 2.5rem) min(100%, 100vw)"
                blurDataURL={template.image.urlBlurImg}
                alt={template.name}
              />
            </div>
            <div className="flex gap-4 flex-col items-center p-4 bg-slate-800 rounded-b">
              <h2 className="font-bold line-clamp-1">{template.name}</h2>
              <Link className="text-sm p-1 bg-blue-500 hover:bg-blue-600 text-center rounded" href={`/post/create?templateId=${template.id}`}>Make meme</Link>
              <span className="text-sm">uploaded by <Link className="text-blue-400 hover:text-blue-500 hover:underline" href={`/profile/${template.author.username}`}>{template.author.username}</Link></span>
            </div>
          </div>
        ))}
      </div>
      </div>
      {loading && <LoaderCircle size={32} className="animate-spin my-16" />}
    </div>
  );
};
