import React from "react";
import ExplorePage from "@/components/ExplorePage";

import MainLayout from "@/components/MainLayout";

const Explore: React.FC = () => {
  return (
    <div className="space-y-4 py-4">
    <MainLayout>
        <ExplorePage />
    </MainLayout>
    </div>
  );
};

export default Explore;
