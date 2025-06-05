import React from "react";
import  ComingSoon from "@/components/ComingSoon";
import MainLayout from "@/components/MainLayout";

const Rewards: React.FC = () => {
  return (
    <div className="space-y-4 py-4">
      <MainLayout>
      <ComingSoon/>
      </MainLayout> 
    </div>
  );
};

export default Rewards;
