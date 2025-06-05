"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Upload } from "lucide-react";
import { userContract } from "@/utils/thirdweb/contracts";
import { prepareContractCall } from "thirdweb";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "./ui/textarea";
import { OrbitProgress } from "react-loading-indicators";
import { useQuery } from "@apollo/client";
import { GET_USER_PROFILE } from "@/lib/queries";
import { client } from "@/utils/thirdweb/client";

// Schema: only username and bio; file handled separately
const ProfileFormSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
  bio: z.string().optional(),
});

interface ProfileHeaderProps {
  address: string;
}

export default function ProfileHeader({ address }: ProfileHeaderProps) {
  const [editingProfile, setEditingProfile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const activeAccount = useActiveAccount();
  const { mutateAsync: sendTransaction } = useSendTransaction();
  const storage = new ThirdwebStorage({ clientId: client.clientId });

  const { data: userData, loading, error, refetch } = useQuery(GET_USER_PROFILE, {
    variables: { 
      address: address.toLowerCase()
    },
    pollInterval: 5000
  });

  const form = useForm<z.infer<typeof ProfileFormSchema>>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: { username: "", bio: "" },
  });

  const getIpfsUrl = (cid: string | undefined | null) => {
    if (!cid) return undefined;
    const cleanCid = cid.replace('ipfs://', '');
    return `https://ipfs.io/ipfs/${cleanCid}`;
  };

  useEffect(() => {
    if (userData?.user) {
      form.reset({ username: userData.user.username || "", bio: userData.user.bio || "" });
      if (userData.user.avatarCID) {
        const url = getIpfsUrl(userData.user.avatarCID);
        setAvatarPreview(url || null);
      } else {
        setAvatarPreview(null);
      }
    }
  }, [userData, form, setAvatarPreview]);

  // Handle file selection and preview for the *input* field
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  // Submit handler
  const onSubmit = async (values: z.infer<typeof ProfileFormSchema>) => {
    if (!activeAccount) return;
    setIsSubmitting(true);
    try {
      // Upload avatar if changed
      let avatarCID = userData?.user?.avatarCID || "";
      if (selectedFile) {
        const uploadResult = await storage.upload(selectedFile);
        avatarCID = uploadResult.replace("ipfs://", "");
      }

      // Refetch the user data to get the latest state from the graph
      const { data: latestUserData } = await refetch();

      // Check if user exists based on the latest data
      const hasProfile = !!latestUserData?.user?.username;

      const tx = prepareContractCall({
        contract: userContract,
        method: hasProfile ? "updateProfile" : "createProfile",
        params: [values.username,avatarCID, values.bio || ""],
      }) as unknown as { to: string; data: string };

      await sendTransaction(tx as any);

      // After successful transaction, manually trigger a refetch to update UI faster
      await refetch();

      setEditingProfile(false);
      toast({ title: "Profile updated", description: "Your profile has been successfully updated." });
    } catch (err) {
      console.error('Profile update error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile.';
      toast({ 
        title: "Error", 
        description: errorMessage,
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
      setSelectedFile(null);
    }
  };

  // Update handleCancelEdit
  const handleCancelEdit = () => {
    setEditingProfile(false);
    setSelectedFile(null);
    if (userData?.user) {
      form.reset({ username: userData.user.username || "", bio: userData.user.bio || "" });
      if (userData.user.avatarCID) {
        const url = getIpfsUrl(userData.user.avatarCID);
        setAvatarPreview(url || null);
      } else {
        setAvatarPreview(null);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

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
      {isSubmitting ? (
        <div className="flex justify-center items-center h-48">
          <OrbitProgress color="#3b82f6" size="medium" />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="w-16 h-16 cursor-pointer border border-gray-800">
                  <AvatarImage 
                    src={getIpfsUrl(avatarCID)} 
                  />
                  <AvatarFallback>{user?.username?.[0] || "U"}</AvatarFallback>
                </Avatar>
                {editingProfile && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                      onChange={handleAvatarChange}
                    />
                    <Upload className="w-6 h-6 text-white z-10 pointer-events-none" />
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-bold text-white">
                    {user?.username || "Unnamed User"}
                  </h2>
                  {activeAccount?.address === address && !editingProfile && (
                    <Button variant="ghost" size="sm" onClick={() => setEditingProfile(true)} className="text-gray-400 hover:text-white">
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="mt-2">
                  <p className="text-gray-400">{user?.bio || "No bio available"}</p>
                </div>
              </div>
            </div>
          </div>

          {editingProfile && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your username" className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-500" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Bio</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter your bio" className="resize-none bg-gray-800/50 border-gray-700 text-white placeholder-gray-500" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex space-x-4">
                  <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Profile"}
                  </Button>
                  <Button type="button" onClick={handleCancelEdit} className="bg-gray-700 text-white hover:bg-gray-600" disabled={isSubmitting}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </>
      )}
    </div>
  );
}
