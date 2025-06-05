"use client"

import Post from "./Post"
import { useQuery } from "@apollo/client"
import { GET_POSTS } from "@/lib/queries"
import { useActiveAccount } from "thirdweb/react"
import { useState, useEffect } from "react"

interface PostData {
  id: string
  postId: string
  author: string
  text: string
  fileCid: string
  parentId: string
  blockTimestamp: string
  blockNumber: string
  transactionHash: string
  likes?: number
  isLiked?: boolean
}

interface TrendingPostsProps {
  posts: PostData[]
}

export default function TrendingPosts({ posts }: TrendingPostsProps) {
  const activeAccount = useActiveAccount()
  const [processedPosts, setProcessedPosts] = useState<PostData[]>(posts)

  const { data, refetch } = useQuery(GET_POSTS, {
    variables: {
      first: 10,
      skip: 0
    }
  })

  // Process posts with likes data and sort by likes
  useEffect(() => {
    if (data?.postLikeds) {
      const postsWithLikes = posts.map((post) => {
        const postLikes = data.postLikeds.filter((like: any) => 
          BigInt(like.postId) === BigInt(post.postId)
        )
        
        const isLiked = postLikes.some((like: any) => 
          like.user.toLowerCase() === activeAccount?.address?.toLowerCase()
        )
        
        return {
          ...post,
          likes: postLikes.length,
          isLiked
        }
      })
      
      // Sort posts by number of likes (descending)
      const sortedPosts = [...postsWithLikes].sort((a, b) => 
        (b.likes || 0) - (a.likes || 0)
      )
      
      setProcessedPosts(sortedPosts)
    }
  }, [data, posts, activeAccount?.address])

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 backdrop-blur-sm">
        <h2 className="text-lg font-bold">Trending Posts</h2>
        <p className="text-sm text-gray-500">Most popular posts right now</p>
      </div>

      <div className="space-y-4">
        {processedPosts.map((post) => (
          <div key={post.id} className="rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
            <Post 
              key={`${post.id}-${post.likes}-${post.isLiked}`}
              post={{ ...post, blockNumber: Number(post.blockNumber) }} 
              onLike={() => refetch()}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
