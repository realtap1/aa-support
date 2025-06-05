import React from "react";
import PostDetails from "@/components/PostDetails";

import MainLayout from "@/components/MainLayout";

const PostPage: React.FC = () => {
  return (
    <div className="space-y-4 py-4">
    <MainLayout>
        <PostDetails />
    </MainLayout>
    </div>
  );
};

export default PostPage;