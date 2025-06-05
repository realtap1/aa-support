"use client"

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useActiveAccount, useSendTransaction, MediaRenderer } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { postRegistryContract } from "@/utils/thirdweb/contracts";
import { GET_POST_DETAILS, GET_USER_PROFILE } from '@/lib/queries';
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { toast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { client } from "@/utils/thirdweb/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, MessageCircle, ChevronUp, ChevronDown } from 'lucide-react';

// Define a type for the post/reply data from the query
interface PostData {
  id: string;
  postId: string;
  author: string;
  text: string;
  fileCid: string | null;
  parentId: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  // Add a field to store nested replies in the hierarchy
  replies?: PostData[];
}

const PostDetails = () => {
  const router = useRouter();
  const postId = window.location.pathname.split('/').pop();

  const { loading, error, data, refetch } = useQuery<{ 
    postCreateds: PostData[], 
    allReplies: PostData[],
    postLikeds: any[] 
  }>(GET_POST_DETAILS, {
    variables: { postId },
    skip: !postId
  });

  const activeAccount = useActiveAccount();
  const { mutate: sendTransaction } = useSendTransaction();
  // State for the main reply form
  const [mainReplyText, setMainReplyText] = useState('');
  const [isMainReplySubmitting, setIsMainReplySubmitting] = useState(false);

  // State to track which reply threads are expanded
  const [expandedReplies, setExpandedReplies] = useState<{[key: string]: boolean}>({});

  // Fetch user profile for the main post author
  const { data: postAuthorData } = useQuery(GET_USER_PROFILE, {
    variables: {
      address: data?.postCreateds?.find((p: PostData) => p.postId === postId && p.parentId === "0")?.author?.toLowerCase() || ""
    },
    skip: !data?.postCreateds?.find((p: PostData) => p.postId === postId && p.parentId === "0")?.author
  });

   // Fetch user profile for the current active account (for the reply form avatar)
   const { data: currentUserData } = useQuery(GET_USER_PROFILE, {
    variables: {
      address: activeAccount?.address?.toLowerCase() || ""
    },
    skip: !activeAccount?.address
  });

  // Helper to simulate fetching username/avatar for an author address
  // In a real app, optimize fetching all needed user profiles with one query
  const getUserProfile = (address: string | undefined) => {
      if (!address) return null;
      address = address.toLowerCase();
      if (postAuthorData?.user?.id?.toLowerCase() === address) {
          return postAuthorData.user;
      }
      if (currentUserData?.user?.id?.toLowerCase() === address) {
          return currentUserData.user;
      }
      // Simulate fetching or look up in a local cache of fetched authors
      // For now, just return a placeholder
       return {
           id: address,
           username: address.slice(0, 6), // Use address as placeholder username
           avatarCID: null // Placeholder avatar
       };
  };

  // Process the flat list of posts into a hierarchical structure
  const buildReplyHierarchy = (posts: PostData[], currentPostId: string | undefined): PostData[] => {
      if (!posts || !currentPostId) return [];

      const postMap: {[key: string]: PostData} = {};
      const rootPosts: PostData[] = [];

      // Create a map for quick access and initialize replies array
      posts.forEach(post => {
          const normalizedPost = {
              ...post,
              postId: post.postId.toString(),
              parentId: post.parentId.toString(),
              replies: []
          };
          postMap[normalizedPost.postId] = normalizedPost;
      });

      // Assign children to their parents
      Object.values(postMap).forEach(post => {
          const normalizedCurrentPostId = currentPostId.toString();
          
          if (post.parentId === normalizedCurrentPostId) {
              rootPosts.push(post);
          } else if (post.parentId && postMap[post.parentId]) {
              if (!postMap[post.parentId].replies) {
                  postMap[post.parentId].replies = [];
              }
              postMap[post.parentId].replies!.push(post);
          }
      });

      // Sort direct replies and nested replies by timestamp
      const sortReplies = (replyList: PostData[]): PostData[] => {
          return replyList
              .sort((a, b) => Number(a.blockTimestamp) - Number(b.blockTimestamp))
              .map(reply => ({
                  ...reply,
                  replies: reply.replies ? sortReplies(reply.replies) : []
              }));
      };

      return sortReplies(rootPosts);
  };

  const handlePostReply = async (replyText: string, parentId: string) => {
    if (!activeAccount || !replyText.trim() || !parentId) {
      return false; // Indicate failure
    }

    try {
      const transaction = await prepareContractCall({
        contract: postRegistryContract,
        method: "createPost",
        params: [replyText, "", BigInt(parentId)], // text, fileCid, parentId
      });

      await sendTransaction(transaction as any, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Reply posted successfully",
          });
          // Refetch post details to show the new reply
          refetch(); // Refetch to get the new reply
        },
         onError: (txError) => {
             console.error("PostDetails: Reply transaction failed:", txError);
             toast({
              title: "Error",
              description: "Failed to post reply transaction",
              variant: "destructive",
            });
         }
      });
      return true; // Indicate success
    } catch (error) {
      console.error("PostDetails: Error preparing or sending reply transaction:", error);
      toast({
        title: "Error",
        description: "Failed to post reply",
        variant: "destructive",
      });
       return false; // Indicate failure
    }
  };

  const handleMainReplySubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsMainReplySubmitting(true);
      const success = await handlePostReply(mainReplyText, postId!);
      if (success) {
          setMainReplyText('');
      }
      setIsMainReplySubmitting(false);
  };

  const handleBackClick = () => {
    router.back();
  };

  const getIpfsUrl = (cid: string | undefined | null) => {
    if (!cid) return undefined;
    const cleanCid = cid.replace('ipfs://', '');
    return `https://ipfs.io/ipfs/${cleanCid}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error.message}
      </div>
    );
  }

   // Build the hierarchy from the flat data
  const allPosts = [...(data?.postCreateds || []), ...(data?.allReplies || [])];
  const mainPost = allPosts.find(p => p.postId.toString() === postId?.toString() && p.parentId.toString() === "0");
  const directRepliesForCount = allPosts.filter(p => p.parentId.toString() === postId?.toString());
  const nestedReplies = buildReplyHierarchy(allPosts, postId);

  const mainPostLikes = data?.postLikeds?.filter((like: any) => BigInt(like.postId) === BigInt(postId || "0")) || [];
  const mainPostLikeCount = mainPostLikes.length;
  const isMainPostLiked = activeAccount ? mainPostLikes.some((like: any) => like.user.toLowerCase() === activeAccount.address?.toLowerCase()) : false;

  const mainPostAuthorProfile = getUserProfile(mainPost?.author);
  const mainPostAvatarCID = mainPostAuthorProfile?.avatarCID;
  const currentUserAvatarCID = getUserProfile(activeAccount?.address)?.avatarCID;

  if (!mainPost) {
    return (
      <div className="text-center p-4">
        Post not found
      </div>
    );
  }

   // Component to render individual replies and their nested replies
   const ReplyItem = ({ reply, level = 0 }: { reply: PostData, level?: number }) => {
       const isExpanded = expandedReplies[reply.id];
       const hasNestedReplies = reply.replies && reply.replies.length > 0;
       const replyAuthorProfile = getUserProfile(reply.author);
       const replyAvatarCID = replyAuthorProfile?.avatarCID;

       // State and handlers for the nested reply form within this item
       const [showNestedReplyForm, setShowNestedReplyForm] = useState(false);
       const [nestedReplyText, setNestedReplyText] = useState('');
       const [isNestedReplySubmitting, setIsNestedReplySubmitting] = useState(false);


       const toggleExpand = () => {
           setExpandedReplies(prev => ({ ...prev, [reply.id]: !prev[reply.id] }));
       };

       const handleNestedReplySubmit = async (e: React.FormEvent) => {
           e.preventDefault();
           setIsNestedReplySubmitting(true);
           // Pass the postId of the reply being responded to as the parentId
           const success = await handlePostReply(nestedReplyText, reply.postId);
           if (success) {
               setNestedReplyText('');
               setShowNestedReplyForm(false); // Hide form on success
           }
           setIsNestedReplySubmitting(false);
       };


       return (
            <div key={reply.id} className={`p-4 ${level > 0 ? 'ml-8 border-l border-gray-700' : ''}`}> {/* Add margin and border for nesting */}
                 <div className="flex items-start">
                    <Link href={`/user/${reply.author}`} className="flex-shrink-0 mt-1">
                       <div className="h-10 w-10 rounded-full overflow-hidden">
                          <Avatar>
                             <AvatarImage src={getIpfsUrl(replyAvatarCID)} />
                             <AvatarFallback>{reply.author.slice(0, 2)}</AvatarFallback>
                           </Avatar>
                       </div>
                    </Link>
                   <div className="ml-3 flex-1 overflow-hidden">
                      <div className="flex items-center space-x-1 text-sm mb-1">
                         <Link href={`/user/${reply.author}`} className="font-bold hover:underline text-white">
                            {replyAuthorProfile?.username || reply.author}
                         </Link>
                         <span className="text-gray-500">·</span>
                         <span className="text-gray-500">
                           {formatDistanceToNow(new Date(Number(reply.blockTimestamp) * 1000), { addSuffix: true })}
                         </span>
                       </div>
                       <div className="mt-1 whitespace-pre-wrap text-sm text-gray-200">{reply.text}</div>
                        {/* Interaction Buttons for Replies - Placeholders */}
                        <div className="flex items-center space-x-6 text-gray-500 text-sm mt-2">
                            {/* Reply button for this specific reply */}
                             {activeAccount && (
                                <button
                                    className="flex items-center space-x-1 p-1 rounded-full hover:bg-gray-800 hover:text-blue-400 transition-colors"
                                    onClick={() => setShowNestedReplyForm(!showNestedReplyForm)} // Toggle nested reply form
                                >
                                    <MessageCircle className="h-4 w-4" />
                                     <span></span> {/* Placeholder reply count */}
                                </button>
                             )}
                             <button className="flex items-center space-x-1 p-1 rounded-full hover:bg-gray-800 hover:text-pink-500 transition-colors">
                                <Heart className="h-4 w-4" />
                                 <span></span> {/* Placeholder like count */}
                            </button>
                             {/* Show/Hide Nested Replies Button */}
                             {hasNestedReplies && (
                                 <button
                                     onClick={toggleExpand}
                                     className="flex items-center space-x-1 text-gray-500 hover:text-blue-400 text-sm"
                                 >
                                     {isExpanded ? (
                                         <>
                                             <ChevronUp className="h-4 w-4" />
                                             <span>Hide {reply.replies!.length} replies</span>
                                         </>
                                     ) : (
                                         <>
                                             <ChevronDown className="h-4 w-4" />
                                             <span>Show {reply.replies!.length} replies</span>
                                         </>
                                     )}
                                 </button>
                             )}
                        </div>
                   </div>
                 </div>
                 {/* Nested Reply Form */}
                 {activeAccount && showNestedReplyForm && (
                    <div className="mt-4 pl-8 border-l border-gray-700"> {/* Indent the nested form */}
                         <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden mt-1"> {/* Smaller avatar for nested form */}
                               <Avatar>
                                  <AvatarImage src={getIpfsUrl(currentUserAvatarCID)} />
                                  <AvatarFallback>{activeAccount.address?.slice(0, 2) || ""}</AvatarFallback>
                                </Avatar>
                            </div>
                             <form onSubmit={handleNestedReplySubmit} className="flex-1">
                              <Textarea
                                value={nestedReplyText}
                                onChange={(e) => setNestedReplyText(e.target.value)}
                                placeholder={`Reply to ${replyAuthorProfile?.username || reply.author}...`}
                                className="w-full p-2 border-0 rounded-lg focus:ring-0 focus:border-transparent bg-transparent text-gray-200 placeholder-gray-500 resize-none text-sm" // Smaller text area
                                rows={1}
                                 onInput={(e) => {
                                        e.currentTarget.style.height = "auto";
                                        e.currentTarget.style.height = `${Math.min(
                                          e.currentTarget.scrollHeight,
                                          150 // Max height for nested form
                                        )}px`;
                                      }}
                              />
                               <div className="flex justify-end mt-2 space-x-2">
                                  <Button
                                      type="button"
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => setShowNestedReplyForm(false)}
                                      className="text-gray-500 hover:bg-gray-800"
                                  >
                                      Cancel
                                  </Button>
                                <Button
                                  type="submit"
                                  size="sm"
                                  disabled={isNestedReplySubmitting || !nestedReplyText.trim()}
                                  className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isNestedReplySubmitting ? "Replying..." : "Reply"}
                                </Button>
                              </div>
                            </form>
                         </div>
                    </div>
                 )}
                 {/* Render nested replies if expanded */}
                 {isExpanded && reply.replies && reply.replies.length > 0 && (
                     <div className="mt-4">
                         {reply.replies.map(nestedReply => (
                             <ReplyItem key={nestedReply.id} reply={nestedReply} level={level + 1} />
                         ))}
                     </div>
                 )}
              </div>
       );
   };


  return (
    <div className="w-full rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      {/* Header */}
      <div className="sticky top-0 bg-opacity-80 backdrop-blur-md z-10 px-4 py-3 border-b border-gray-800 flex items-center">
        <button onClick={handleBackClick} className="mr-4 p-2 rounded-full hover:bg-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        
      </div>

      {/* Original Post */}
      <article className="p-4 border-b border-gray-800">
        <div className="flex items-start">
          <Link href={`/user/${mainPost.author}`} className="flex-shrink-0 mt-1">
            <div className="h-12 w-12 rounded-full overflow-hidden">
              <Avatar>
                <AvatarImage src={getIpfsUrl(mainPostAvatarCID)} />
                <AvatarFallback>{mainPost.author.slice(0, 2)}</AvatarFallback>
              </Avatar>
            </div>
          </Link>
          <div className="ml-3 flex-1 overflow-hidden">
            <div className="flex items-center space-x-1 text-sm mb-1">
              <Link href={`/user/${mainPost.author}`} className="font-bold hover:underline text-white">
                {mainPostAuthorProfile?.username || "Unnamed User"}
              </Link>
              <span className="text-gray-500">·</span>
              <span className="text-gray-500">
                {formatDistanceToNow(new Date(Number(mainPost.blockTimestamp) * 1000), { addSuffix: true })}
              </span>
            </div>

            <div className="mt-1 whitespace-pre-wrap text-lg text-white">{mainPost.text}</div>

            {mainPost.fileCid && (
              <div className="mt-3 border border-gray-700 rounded-xl overflow-hidden">
                <MediaRenderer
                  controls={true}
                  requireInteraction={true}
                  client={client}
                  src={`ipfs://${mainPost.fileCid}`}
                  alt="Post media"
                  className="object-cover w-full h-full"
                />
              </div>
            )}

            <div className="text-sm text-gray-500 mt-3">
              {new Date(Number(mainPost.blockTimestamp) * 1000).toLocaleString()}
            </div>

            

            {/* Main post interaction buttons */}
            <div className="flex justify-around text-gray-500 mt-2">
               {/* Main post Reply button - this one doesn't open a nested form */}
               {activeAccount && (
                 <button
                     className="flex items-center space-x-1 p-2 rounded-full hover:bg-gray-800 hover:text-blue-400 transition-colors"
                     // onClick={() => scrollToMainReplyForm()} // Optional: scroll to main reply form
                 >
                   <MessageCircle className="h-5 w-5" />
                 </button>
               )}
              
              <button
                className={`flex items-center space-x-1 p-2 rounded-full transition-colors ${isMainPostLiked ? 'text-pink-500 hover:bg-pink-900/50' : 'hover:bg-gray-800 hover:text-pink-500'}`}
                // onClick={handleLikePost} // Need to implement like functionality for main post if not done elsewhere
              >
                <Heart className={`h-5 w-5 ${isMainPostLiked ? 'fill-current' : ''}`} />
              </button>
              
            </div>
          </div>
        </div>
      </article>

      {/* Main Reply Form */}
      {activeAccount && (
        <div className="p-4 border-b border-gray-800">
           <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden mt-1">
                 <Avatar>
                    <AvatarImage src={getIpfsUrl(currentUserAvatarCID)} />
                    <AvatarFallback>{activeAccount.address?.slice(0, 2) || ""}</AvatarFallback>
                  </Avatar>
              </div>
               <form onSubmit={handleMainReplySubmit} className="flex-1">
                <Textarea
                  value={mainReplyText}
                  onChange={(e) => setMainReplyText(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full p-2 border-0 rounded-lg focus:ring-0 focus:border-transparent bg-transparent text-gray-200 placeholder-gray-500 resize-none"
                  rows={1}
                   onInput={(e) => {
                          e.currentTarget.style.height = "auto";
                          e.currentTarget.style.height = `${Math.min(
                            e.currentTarget.scrollHeight,
                            200
                          )}px`;
                        }}
                />
                 <div className="flex justify-end mt-2">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isMainReplySubmitting || !mainReplyText.trim()}
                    className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isMainReplySubmitting ? "Replying..." : "Reply"}
                  </Button>
                </div>
              </form>
           </div>
        </div>
      )}

      {/* Replies Section */}
      <div className="divide-y divide-gray-800">
        {nestedReplies.map((reply: PostData) => (
           <ReplyItem key={reply.id} reply={reply} />
        ))}
      </div>
    </div>
  );
};

export default PostDetails;
