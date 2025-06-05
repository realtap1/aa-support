"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  TrendingUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@apollo/client";
import { GET_POSTS, GET_USER_PROFILE } from "@/lib/queries";
import SearchResults from "./SearchResults";
import TrendingPosts from "./TrendingPosts";

const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"posts" | "users">("posts");
  const [isSearching, setIsSearching] = useState(false);

  // Fetch trending posts using the Apollo hook
  const { data: trendingPostsData, loading: trendingPostsLoading } = useQuery(GET_POSTS, {
    variables: {
      first: 10, // Fetch the first 10 posts
      skip: 0    // Start from the beginning
    }
  });

  // The posts data from the subgraph query
  const trendingPosts = trendingPostsData?.postCreateds || [];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(query.length > 0);
  };

  return (
    <div className="space-y-4 py-4">
      {/* Header */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="border-b border-gray-800 p-4">
          <h1 className="text-xl font-bold">Explore</h1>
        </div>

        {/* Search Bar */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search OpenEcho..."
              className="w-full rounded-full bg-gray-800/50 py-3 pl-12 pr-4 text-sm outline-none placeholder:text-gray-500 focus:bg-gray-800/70 focus:ring-2 focus:ring-blue-500/50"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {/* Search Type Toggle */}
          {isSearching && (
            <div className="mt-4 flex rounded-lg bg-gray-800/30 p-1">
              <button
                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  searchType === "posts"
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:bg-gray-700/50 hover:text-gray-300"
                }`}
                onClick={() => setSearchType("posts")}
              >
                Posts
              </button>
              <button
                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  searchType === "users"
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:bg-gray-700/50 hover:text-gray-300"
                }`}
                onClick={() => setSearchType("users")}
              >
                Users
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {isSearching ? (
        <SearchResults query={searchQuery} type={searchType} />
      ) : (
        <>
          
          {/* Trending Posts */}
          {trendingPostsLoading ? (
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-8 text-center backdrop-blur-sm">
              <p>Loading posts...</p>
            </div>
          ) : (
            <TrendingPosts posts={trendingPosts} />
          )}
        </>
      )}
    </div>
  );
};

export default ExplorePage;
