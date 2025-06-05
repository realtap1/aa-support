"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useState } from "react"
import FollowButton from "./FollowButton"
import { useQuery } from "@apollo/client"
import { GET_FOLLOW_STATUS } from "@/lib/queries"

interface UserData {
  id: string
  address: string
  username: string
  bio: string
  avatarCID: string
}

interface UserCardProps {
  user: UserData
}

export default function UserCard({ user }: UserCardProps) {
  const [isFollowing, setIsFollowing] = useState(false)

  // Query to check if the current user is following this user
  const { data: followData, refetch: refetchFollowStatus } = useQuery(GET_FOLLOW_STATUS, {
    variables: {
      follower: user.address?.toLowerCase(),
    },
    skip: !user.address,
  })

  const handleFollowChange = () => {
    refetchFollowStatus()
  }

  const getIpfsUrl = (cid: string | undefined | null) => {
    if (!cid) return undefined;
    const cleanCid = cid.replace("ipfs://", "");
    return `https://ipfs.io/ipfs/${cleanCid}`;
  };

  return (
    <div className="p-4 hover:bg-gray-800/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href={`/user/${user.address}`} className="flex-shrink-0">
            <Avatar className="h-12 w-12">
              <AvatarImage src={getIpfsUrl(user.avatarCID)} alt={user.username} />
              <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1">
            <Link href={`/profile/${user.address}`} className="font-bold hover:underline">
              {user.username}
            </Link>
            
            {user.bio && <p className="mt-1 text-sm text-gray-300">{user.bio}</p>}
          </div>
        </div>
        <FollowButton 
          address={user.address} 
          isFollowing={isFollowing}
          onFollowChange={handleFollowChange}
        />
      </div>
    </div>
  )
}
