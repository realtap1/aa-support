import React from "react";
import Profile from "@/components/Profile";
import MainLayout from "@/components/MainLayout";


const ProfilePage: React.FC = () => {
  return (
    <MainLayout>
      <div className="space-y-4 py-4">
        <Profile />
      </div>
    </MainLayout>
  );
};

export default ProfilePage;