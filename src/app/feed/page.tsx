import React from "react";
import ContentFeed from "@/components/ContentFeed";
import MainLayout from "@/components/MainLayout";
import PostInput from "@/components/PostInput";

const Feed: React.FC = () => {
  return (
    <MainLayout>
      <div className="space-y-4 py-4">
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <PostInput />
        </div>
        <ContentFeed />
      </div>
    </MainLayout>
  );
};

export default Feed;
