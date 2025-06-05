"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useActiveAccount } from "thirdweb/react";
import { OrbitProgress } from "react-loading-indicators";
import { useQuery } from "@apollo/client";
import { GET_USER_PROFILE } from "@/lib/queries";
import { client } from "@/utils/thirdweb/client";
import { MediaRenderer } from "thirdweb/react";

interface UserProfileHeaderProps {
  address: string;
}

export default function UserProfileHeader({ address }: UserProfileHeaderProps) {
  const activeAccount = useActiveAccount();

  const { data: userData, loading } = useQuery(GET_USER_PROFILE, {
    variables: { 
      address: address.toLowerCase()
    },
    pollInterval: 5000
  });

  const getIpfsUrl = (cid: string | undefined | null) => {
    if (!cid) return undefined;
    const cleanCid = cid.replace('ipfs://', '');
    return `https://ipfs.io/ipfs/${cleanCid}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <OrbitProgress color="#3b82f6" size="medium" />
      </div>
    );
  }

  const user = userData?.user;
  const avatarCID = user?.avatarCID;

  return (
    <div className="mb-6 rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16 border border-gray-800">
            <AvatarImage src={getIpfsUrl(avatarCID)} />
            <AvatarFallback>{user?.username?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold text-white">
              {user?.username || "Unnamed User"}
            </h2>
            <div className="mt-2">
              <p className="text-gray-400">{user?.bio || "No bio available"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 