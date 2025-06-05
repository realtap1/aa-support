"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_USER_POSTS } from "@/lib/queries";
import { OrbitProgress } from "react-loading-indicators";
import Post from "./Post";
import { Post as PostType } from "@/lib/types";

const POSTS_PER_PAGE = 10;

interface UserProfileFeedProps {
  address: string;
}

export default function UserProfileFeed({ address }: UserProfileFeedProps) {
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const { data, loading, fetchMore, error } = useQuery(GET_USER_POSTS, {
    variables: {
      first: POSTS_PER_PAGE,
      skip: page * POSTS_PER_PAGE,
      author: address.toLowerCase()
    },
    skip: !address,
    onCompleted: (data) => {
      console.log('Query completed with data:', {
        posts: data?.postCreateds,
        count: data?.postCreateds?.length,
        variables: {
          first: POSTS_PER_PAGE,
          skip: page * POSTS_PER_PAGE,
          author: address.toLowerCase()
        }
      });
    },
    onError: (error) => {
      console.error('Query error:', error);
    }
  });

  // Handle infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.scrollHeight - 800
      ) {
        if (!loading && hasMore) {
          setPage((prev) => prev + 1);
          fetchMore({
            variables: {
              skip: (page + 1) * POSTS_PER_PAGE,
              author: address.toLowerCase()
            },
          });
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, page, fetchMore, address]);

  // Update hasMore based on response length
  useEffect(() => {
    if (data?.postCreateds) {
      setHasMore(data.postCreateds.length === POSTS_PER_PAGE);
    }
  }, [data]);

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error loading posts: {error.message}
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
              fetchMore({
                variables: {
                  skip: page * POSTS_PER_PAGE,
                  author: address.toLowerCase()
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