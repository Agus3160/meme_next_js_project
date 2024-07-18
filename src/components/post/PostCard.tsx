"use client"

import { PostType } from '@/lib/definitions'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { toast } from 'react-toastify'
import { likePost, dislikePost } from '@/lib/post/likeToPost'
import { Session } from 'next-auth'
import doYouLikeThisPost from '@/lib/post/doYouLikeThisPost'

type Props = {
  post:PostType
  session:Session|null
}

export default function PostCard({ post, session }: Props) {

  const [likeCount, setLikeCount] = useState(post._count.likes)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    const useEffectLikePost = async () => {
      const { data } = await doYouLikeThisPost(post.id)
      if(!data) return
      setLiked(data)
    }
    if (session) {
      useEffectLikePost()
    }
  }, [session])

  return (
    <div
      className="shadow-md rounded max-w-[320px] sm:w-[500px]"
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
          <h2 className="font-bold line-clamp-1">{post.title}</h2>
          <p className="text-sm">By&nbsp;
            <Link className="text-blue-400 hover:text-blue-500 hover:underline" href={`/profile/${post.author.username}`}>
              {post.author.username}
            </Link>
          </p>
        </div>
        <div className="flex gap-1 rounded-md  items-center">
          <span className="text-sm">{likeCount}</span>
          <button
            onClick={ () => {
              if (!session) return

              if (!liked) likePost({ postId: post.id })
              else dislikePost({ postId: post.id })
     
              setLiked(!liked)
              setLikeCount(liked ? likeCount - 1 : likeCount + 1)  
            }}
          >
            <Heart
              fill={liked? "#EF4444" : undefined}
              className="sm:w-7 duration-300 hover:text-red-500 sm:h-7 w-6 h-6" 
            />
          </button>
        </div>
      </div>
    </div>
  )
}