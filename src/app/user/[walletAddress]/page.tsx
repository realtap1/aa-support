import React from "react";
import UserProfile from "@/components/UserProfile";
import MainLayout from "@/components/MainLayout";


const UserProfilePage: React.FC = () => {
  return (
    <MainLayout>
      <div className="space-y-4 py-4">
        <UserProfile />
      </div>
    </MainLayout>
  );
};

export default UserProfilePage;