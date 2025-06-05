"use client";

import { useEffect, useState } from "react";
import UserProfileHeader from "./UserProfileHeader";
import UserProfileFeed from "./UserProfileFeed";

export default function UserProfile() {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathWalletAddress = window.location.pathname.split("/")[2];
      setAddress(pathWalletAddress);
    }
  }, []);

  return (
    <div className="w-full max-w-sm sm:max-w-2xl mx-auto px-2 py-6">
      {address ? (
        <>
          <UserProfileHeader address={address} />
          <UserProfileFeed address={address} />
        </>
      ) : (
        <div className="text-center text-gray-400">
          User does not exist
        </div>
      )}
    </div>
  );
}
