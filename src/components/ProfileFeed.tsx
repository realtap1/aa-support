"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_USER_POSTS } from "@/lib/queries";
import { OrbitProgress } from "react-loading-indicators";
import Post from "./Post";
import { Post as PostType } from "@/lib/types";
import { useActiveAccount } from "thirdweb/react";

const POSTS_PER_PAGE = 10;

interface ProfileFeedProps {
  address: string;
}

export default function ProfileFeed({ address }: ProfileFeedProps) {
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const activeAccount = useActiveAccount();

  const { data, loading, fetchMore, error } = useQuery(GET_USER_POSTS, {
    variables: {
      first: POSTS_PER_PAGE,
      skip: page * POSTS_PER_PAGE,
      author: activeAccount?.address?.toLowerCase()
    },
    skip: !activeAccount?.address,
    onCompleted: (data) => {
      console.log('Query completed with data:', {
        posts: data?.postCreateds,
        count: data?.postCreateds?.length,
        variables: {
          first: POSTS_PER_PAGE,
          skip: page * POSTS_PER_PAGE,
          author: activeAccount?.address?.toLowerCase()
        }
      });
    },
    onError: (error) => {
      console.error('Query error:', error);
    }
  });

  // Log data changes
  useEffect(() => {
    console.log('Query data changed:', {
      posts: data?.postCreateds,
      count: data?.postCreateds?.length,
      page,
      hasMore
    });
  }, [data, page, hasMore]);

  // Handle infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.scrollHeight - 800
      ) {
        if (!loading && hasMore) {
          console.log('Fetching more posts...', {
            currentPage: page,
            nextPage: page + 1,
            skip: (page + 1) * POSTS_PER_PAGE
          });
          
          setPage((prev) => prev + 1);
          fetchMore({
            variables: {
              skip: (page + 1) * POSTS_PER_PAGE,
              author: activeAccount?.address?.toLowerCase()
            },
          });
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, page, fetchMore, activeAccount?.address]);

  // Update hasMore based on response length
  useEffect(() => {
    if (data?.postCreateds) {
      const newHasMore = data.postCreateds.length === POSTS_PER_PAGE;
      console.log('Updating hasMore:', {
        currentLength: data.postCreateds.length,
        POSTS_PER_PAGE,
        newHasMore
      });
      setHasMore(newHasMore);
    }
  }, [data]);

  if (error) {
    console.error('Query error state:', error);
    return (
      <div className="text-center text-red-500">
        Error loading posts: {error.message}
      </div>
    );
  }

  if (!activeAccount?.address) {
    return (
      <div className="w-full max-w-sm sm:max-w-2xl mx-auto px-2 py-6">
        <div className="text-center text-gray-400">
          Please connect your wallet to view your posts
        </div>
      </div>
    );
  }

  if (loading && !data) {
    return (
      <div className="flex justify-center items-center h-48">
        <OrbitProgress color="#3b82f6" size="medium" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data?.postCreateds.map((post: PostType) => (
        <div key={post.id} className="rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <Post 
            post={post} 
            onLike={() => {
              console.log('Refetching after like:', {
                currentPage: page,
                skip: page * POSTS_PER_PAGE
              });
              
              fetchMore({
                variables: {
                  skip: page * POSTS_PER_PAGE,
                  author: activeAccount?.address?.toLowerCase()
                },
              });
            }} 
          />
        </div>
      ))}
      
      {loading && (
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 text-center text-gray-500 backdrop-blur-sm">
          Loading more posts...
        </div>
      )}
    </div>
  );
}
