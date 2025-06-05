"use client";

import { useState, useEffect } from "react";
import { postRegistryContract } from "@/utils/thirdweb/contracts";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction, useActiveAccount } from "thirdweb/react";
import { useRouter } from "next/navigation";
import { OrbitProgress } from "react-loading-indicators";
import { useQuery } from "@apollo/client";
import { GET_POSTS, GET_USER_PROFILE } from "@/lib/queries";
import { Post as PostType } from "@/lib/types";
import Post from "./Post";

const POSTS_PER_PAGE = 10;

export default function ContentFeed() {
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [post, setPosts] = useState<PostType[]>([]);

  const activeAccount = useActiveAccount();
  

  const {
    data,
    loading: isLoading,
    fetchMore,
  } = useQuery(GET_POSTS, {
    variables: {
      first: POSTS_PER_PAGE,
      skip: page * POSTS_PER_PAGE,
    },
  });

  useEffect(() => {
    if (data?.postCreateds && data?.postLikeds) {
      console.log("Raw data:", {
        posts: data.postCreateds,
        likes: data.postLikeds,
      });

      const postsWithLikes = data.postCreateds.map((post: any) => {
        console.log("Processing post:", {
          postId: post.postId,
          postIdType: typeof post.postId,
        });

        const postLikes = data.postLikeds.filter((like: any) => {
          console.log("Comparing like:", {
            likePostId: like.postId,
            likePostIdType: typeof like.postId,
            postPostId: post.postId,
            comparison: BigInt(like.postId) === BigInt(post.postId),
          });
          return BigInt(like.postId) === BigInt(post.postId);
        });

        console.log("Found likes for post:", {
          postId: post.postId,
          likeCount: postLikes.length,
          likes: postLikes,
        });

        const isLiked = postLikes.some((like: any) => {
          console.log("Checking if user liked:", {
            likeUser: like.user,
            activeAccount: activeAccount?.address,
            isMatch:
              like.user.toLowerCase() === activeAccount?.address?.toLowerCase(),
          });
          return (
            like.user.toLowerCase() === activeAccount?.address?.toLowerCase()
          );
        });

        return {
          ...post,
          likes: postLikes.length,
          isLiked,
        };
      });

      console.log("Final processed posts:", postsWithLikes);
      setPosts(postsWithLikes);
    }
  }, [data, activeAccount?.address]);


  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.scrollHeight - 800
      ) {
        if (!isLoading && hasMore) {
          setPage((prev) => prev + 1);
          fetchMore({
            variables: {
              skip: (page + 1) * POSTS_PER_PAGE,
            },
          });
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, hasMore, page, fetchMore]);

  useEffect(() => {
    if (data?.postCreateds) {
      setHasMore(data.postCreateds.length === POSTS_PER_PAGE);
    }
  }, [data]);

  if (isLoading && !data) {
    return (
      <div className="max-w-full sm:max-w-2xl mx-auto px-4 py-6">
        <div className="flex justify-center items-center h-screen">
          <OrbitProgress color="#3b82f6" size="medium" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm sm:max-w-2xl mx-auto pb-6">
      <div>
        <div className="space-y-4">
          {post.map((post: PostType) => (
            <div
              key={post.id}
              className="rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm"
            >
              <Post
                post={post}
                onLike={() => {
                  fetchMore({
                    variables: {
                      skip: page * POSTS_PER_PAGE,
                    },
                  });
                }}
              />
            </div>
          ))}

          {isLoading && (
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 text-center text-gray-500 backdrop-blur-sm">
              Loading more posts...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
