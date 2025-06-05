"use client"

import { useState } from "react"
import Link from "next/link"
import { Heart, MessageCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useActiveAccount, useSendTransaction, MediaRenderer } from "thirdweb/react"
import { prepareContractCall } from "thirdweb"
import { postRegistryContract } from "@/utils/thirdweb/contracts"
import { cn } from "@/lib/utils"
import { Post as PostType } from "@/lib/types"
import { client } from "@/utils/thirdweb/client"
import { useQuery } from "@apollo/client"
import { GET_USER_PROFILE } from "@/lib/queries"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useRouter } from "next/navigation"

interface PostProps {
  post: PostType
  onLike?: () => void
}

export default function Post({ post, onLike }: PostProps) {
  const [liked, setLiked] = useState(post.isLiked)
  const [likesCount, setLikesCount] = useState(post.likes || 0)
  const [showComments, setShowComments] = useState(false)
  const [commentsCount, setCommentsCount] = useState(post.comments?.length || 0)
  
  const activeAccount = useActiveAccount()
  const { mutate: sendTransaction } = useSendTransaction()
  const router = useRouter()

  // Add user profile query
  const { data: userData } = useQuery(GET_USER_PROFILE, {
    variables: { 
      address: post.author.toLowerCase()
    },
    skip: !post.author
  })

  const handleLike = async () => {
    if (!activeAccount) return

    try {
      const transaction = await prepareContractCall({
        contract: postRegistryContract,
        method: "likePost",
        params: [BigInt(post.postId)],
      })

      await sendTransaction(transaction as any, {
        onSuccess: () => {
          setLiked(!liked)
          setLikesCount(prev => liked ? prev - 1 : prev + 1)
          onLike?.()
        },
      })
    } catch (error) {
      console.error("Error liking post:", error)
    }
  }

  const handleCommentAdded = () => {
    setCommentsCount(prev => prev + 1)
  }

  const getIpfsUrl = (cid: string | undefined | null) => {
    if (!cid) return undefined;
    const cleanCid = cid.replace('ipfs://', '');
    return `https://ipfs.io/ipfs/${cleanCid}`;
  };

  const user = userData?.user;
  const avatarCID = user?.avatarCID;

  const handlePostClick = (e: React.MouseEvent) => {
    // Prevent click if clicking on like/comment buttons
    if ((e.target as HTMLElement).closest('button')) return
    router.push(`/post/${post.postId}`)
  }

  return (
    <div>
      <article 
        className="p-4 transition-colors hover:bg-gray-800/30 cursor-pointer"
        onClick={handlePostClick}
      >
        <div className="flex">
          <Link href={`/user/${post.author}`} className="flex-shrink-0">
            <div className="h-12 w-12 rounded-full overflow-hidden">
            <Avatar>
              <AvatarImage src={getIpfsUrl(avatarCID)} />
                      <AvatarFallback>{""}</AvatarFallback>
                    </Avatar>
            </div>
          </Link>
          <div className="ml-3 flex-1 overflow-hidden">
            <div className="flex items-center space-x-1 text-sm">
              <Link href={`/user/${post.author}`} className="font-bold hover:underline">
                {userData?.user?.username || "Unnamed User"}
              </Link>
              <span className="text-gray-500">·</span>
              <span className="text-gray-500 hover:underline">
                {formatDistanceToNow(new Date(Number(post.blockTimestamp) * 1000), { addSuffix: true })}
              </span>
            </div>

            <div className="mt-1 whitespace-pre-wrap text-sm">{post.text}</div>

            {post.fileCid && (
              <div className="mt-3">
                <div className="relative overflow-hidden rounded-xl aspect-[16/9]">
                  <MediaRenderer
                    controls={true}
                    requireInteraction={true}
                    client={client}
                    src={`ipfs://${post.fileCid}`}
                    alt="Post media"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            )}

            <div className="mt-3 flex justify-between text-gray-500">
              <button
                className={cn(
                  "group flex items-center space-x-1 transition-colors hover:text-blue-400",
                  showComments && "text-blue-400",
                )}
                onClick={() => setShowComments(!showComments)}
                aria-label="Reply"
              >
                <div className="rounded-full p-2">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <span>{commentsCount}</span>
              </button>

              <button
                className={cn(
                  "group flex items-center space-x-1 transition-colors hover:text-pink-500",
                  liked && "text-pink-500",
                )}
                onClick={handleLike}
                aria-label="Like"
              >
                <div className="rounded-full p-2">
                  <Heart className={cn("h-5 w-5", liked && "fill-current")} />
                </div>
                <span>{likesCount}</span>
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}
