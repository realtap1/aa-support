"use client"

import { useQuery } from "@apollo/client"
import { Search } from "lucide-react"
import { SEARCH_USERS, SEARCH_POSTS } from "@/lib/queries"
import Post from "./Post"
import UserCard from "./UserCard"
import { useActiveAccount } from "thirdweb/react"
import { useState, useEffect } from "react"

interface SearchResultsProps {
  query: string
  type: "posts" | "users"
}

interface PostData {
  id: string
  postId: string
  author: string
  text: string
  fileCid: string
  parentId: string
  blockTimestamp: string
  blockNumber: number
  transactionHash: string
}

interface UserData {
  id: string
  address: string
  username: string
  bio: string
  avatarCID: string
}

export default function SearchResults({ query, type }: SearchResultsProps) {
  const activeAccount = useActiveAccount();
  const [processedPosts, setProcessedPosts] = useState<PostData[]>([]);

  const { data, loading, error } = useQuery(type === "posts" ? SEARCH_POSTS : SEARCH_USERS, {
    variables: { searchQuery: query },
    skip: !query.trim()
  });

  useEffect(() => {
    if (data?.postCreateds && data?.postLikeds) {
      const postsWithLikes = data.postCreateds.map((post: any) => {
        const postLikes = data.postLikeds.filter((like: any) => 
          BigInt(like.postId) === BigInt(post.postId)
        );
        
        const isLiked = postLikes.some((like: any) => 
          like.user.toLowerCase() === activeAccount?.address?.toLowerCase()
        );
        
        return {
          ...post,
          likes: postLikes.length,
          isLiked
        };
      });
      
      setProcessedPosts(postsWithLikes);
    }
  }, [data, activeAccount?.address]);

  console.log('SearchResults rendered with:', { query, type });

  console.log('Query state:', { 
    loading, 
    hasData: !!data, 
    error,
    querySkipped: !query.trim(),
    resultsCount: type === "posts" ? data?.postCreateds?.length : data?.users?.length
  });

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-8 text-center">
        <div className="flex items-center justify-center space-x-2 text-gray-400">
          <Search className="h-5 w-5 animate-pulse" />
          <span>Searching...</span>
        </div>
      </div>
    )
  }

  const results = type === "posts" ? processedPosts : data?.users

  if (!results?.length) {
    return (
      <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-8 text-center">
        <Search className="mx-auto mb-4 h-12 w-12 text-gray-600" />
        <h3 className="mb-2 text-lg font-medium text-gray-300">No results found</h3>
        <p className="text-gray-500">Try searching for something else.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
        <h3 className="font-medium text-gray-300">
          {results.length} {type} found for &quot;{query}&quot;
        </h3>
      </div>

      <div className="space-y-4">
        {type === "posts" 
          ? results.map((post: PostData) => (
              <div key={post.id} className="rounded-xl border border-gray-800 bg-gray-900/50">
                <Post post={post} />
              </div>
            ))
          : results.map((user: UserData) => (
              <div key={user.id} className="rounded-xl border border-gray-800 bg-gray-900/50">
                <UserCard user={user} />
              </div>
            ))
        }
      </div>
    </div>
  )
}
