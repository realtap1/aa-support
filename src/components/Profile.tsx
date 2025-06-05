"use client";

import { useActiveAccount } from "thirdweb/react";
import ProfileHeader from "./ProfileHeader";
import ProfileFeed from "./ProfileFeed";

export default function Profile() {
  const activeAccount = useActiveAccount();
  
  // Use the address from params if available, otherwise use the connected account
  const address = activeAccount?.address;

  if (!address) {
    return (
      <div className="w-full max-w-sm sm:max-w-2xl mx-auto px-2 py-6">
        <div className="text-center text-gray-400">
          Please connect your wallet to view profiles
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm sm:max-w-2xl mx-auto px-2 py-6">
      <ProfileHeader address={address} />
      <ProfileFeed address={address} />
    </div>
  );
}
