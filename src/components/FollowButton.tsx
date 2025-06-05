"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { useActiveAccount, useSendTransaction } from "thirdweb/react"
import { prepareContractCall } from "thirdweb"
import { socialGraphContract } from "@/utils/thirdweb/contracts"
import { toast } from "@/hooks/use-toast"

interface FollowButtonProps {
  address: string
  isFollowing?: boolean
  onFollowChange?: () => void
}

export default function FollowButton({ address, isFollowing = false, onFollowChange }: FollowButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const activeAccount = useActiveAccount()
  const { mutate: sendTransaction } = useSendTransaction()

  const handleFollow = async () => {
    if (!activeAccount) return
    setIsLoading(true)

    try {
      const transaction = await prepareContractCall({
        contract: socialGraphContract,
        method: isFollowing ? "unfollow" : "follow",
        params: [address],
      })

      await sendTransaction(transaction as any, {
        onSuccess: () => {
          toast({
            title: isFollowing ? "Unfollowed" : "Following",
            description: isFollowing ? "You have unfollowed this user" : "You are now following this user",
          })
          onFollowChange?.()
        },
      })
    } catch (error) {
      console.error("Error following/unfollowing:", error)
      toast({
        title: "Error",
        description: "Failed to follow/unfollow user",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (activeAccount?.address?.toLowerCase() === address?.toLowerCase()) {
    return null
  }

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      size="sm"
      onClick={handleFollow}
      disabled={isLoading}
      className={isFollowing ? "hover:bg-red-500/10 hover:text-red-500" : ""}
    >
      {isLoading ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
    </Button>
  )
}
