"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ImageIcon, Smile } from "lucide-react";
import {
  darkTheme,
  useActiveAccount,
  useSendTransaction,
} from "thirdweb/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { toast } from "@/hooks/use-toast";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { postRegistryContract } from "@/utils/thirdweb/contracts";
import { prepareContractCall } from "thirdweb";
import { client } from "@/utils/thirdweb/client";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { createPortal } from "react-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useQuery } from "@apollo/client";
import { GET_USER_PROFILE } from "@/lib/queries";

const storage = new ThirdwebStorage({
  clientId: client.clientId,
});

const formSchema = z.object({
  text: z.string().min(1, "Content is required"),
  file: z.instanceof(File).optional(),
});

export default function PostInput() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const activeAccount = useActiveAccount();
  const { mutate: sendTransaction } = useSendTransaction();
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const fileButtonRef = useRef<HTMLButtonElement>(null);
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });

  const { data: userData } = useQuery(GET_USER_PROFILE, {
    variables: {
      address: activeAccount?.address?.toLowerCase() || "",
    },
    skip: !activeAccount?.address,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  useEffect(() => {
    if (showEmojiPicker && fileButtonRef.current) {
      const buttonRect = fileButtonRef.current.getBoundingClientRect();
      setPickerPosition({
        top: buttonRect.bottom + window.scrollY,
        left: buttonRect.left + window.scrollX,
      });
    }
  }, [showEmojiPicker]);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const currentText = form.watch("text") || "";
    const newText = currentText + emojiData.emoji;
    form.setValue("text", newText, {
      shouldValidate: true,
      shouldDirty: true,
    });
    const textarea = document.querySelector(
      'textarea[name="text"]'
    ) as HTMLTextAreaElement;
    if (textarea) {
      textarea.focus();
      textarea.setSelectionRange(newText.length, newText.length);
    }
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!activeAccount) return;

    try {
      setIsSubmitting(true);
      setShowEmojiPicker(false);

      let fileCid = "";
      if (values.file) {
        const uploadResult = await storage.upload(values.file);
        fileCid = uploadResult.split("ipfs://")[1] || "";
      }

      const transaction = await prepareContractCall({
        contract: postRegistryContract,
        method: "createPost",
        params: [values.text, fileCid, 0n],
      });

      await sendTransaction(transaction as any, {
        onSuccess: () => {
          form.reset();
          toast({
            title: "Success",
            description: "Post created successfully",
          });
        },
      });
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIpfsUrl = (cid: string | undefined | null) => {
    if (!cid) return undefined;
    const cleanCid = cid.replace("ipfs://", "");
    return `https://ipfs.io/ipfs/${cleanCid}`;
  };

  const user = userData?.user;
  const avatarCID = user?.avatarCID;

  return (
    <div className="p-4">
      <div className="flex">
      <div className="h-12 w-12 rounded-full overflow-hidden">
            <Avatar>
              <AvatarImage src={getIpfsUrl(avatarCID)} />
                      <AvatarFallback>{""}</AvatarFallback>
                    </Avatar>
            </div>
        <div className="ml-4 flex-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        className="w-full resize-none bg-transparent p-2 text-lg outline-none border-0 placeholder:text-gray-500"
                        placeholder="What's happening?"
                        rows={1}
                        maxLength={256}
                        onInput={(e) => {
                          e.currentTarget.style.height = "auto";
                          e.currentTarget.style.height = `${Math.min(
                            e.currentTarget.scrollHeight,
                            720
                          )}px`;
                        }}
                        {...field}
                        onFocus={() => setShowEmojiPicker(false)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {form.watch("file") && (
                <div className="mt-2">
                  {form.watch("file")!.type.startsWith("image/") ? (
                    <Image
                      src={URL.createObjectURL(form.watch("file")!)}
                      alt="Uploaded file preview"
                      className="mt-2 rounded-lg max-h-60"
                      width={400}
                      height={200}
                    />
                  ) : form.watch("file")!.type.startsWith("video/") ? (
                    <video
                      src={URL.createObjectURL(form.watch("file")!)}
                      className="mt-2 rounded-lg max-h-60"
                      controls
                      width={300}
                      height={200}
                    />
                  ) : (
                    <p className="text-white">Unsupported file type</p>
                  )}
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field: { onChange } }) => (
                      <FormItem>
                        <FormControl>
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) onChange(file);
                            }}
                          />
                        </FormControl>
                        <Button
                          onClick={() => {
                            const input = document.querySelector(
                              'input[type="file"]'
                            ) as HTMLInputElement;
                            input?.click();
                          }}
                          ref={fileButtonRef}
                          className="border-none bg-transparent hover:bg-transparent shadow-none"
                        >
                          <ImageIcon className="h-5 w-5" />
                        </Button>
                        <Button
                          onClick={toggleEmojiPicker}
                          type="button"
                          ref={emojiButtonRef}
                          className="border-none bg-transparent hover:bg-transparent shadow-none"
                        >
                          <Smile className="h-5 w-5" />
                        </Button>
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting || !form.watch("text")}
                  className="py-1.5 font-bold text-white"
                >
                  {isSubmitting ? "Posting..." : "Post"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
      {showEmojiPicker && typeof document !== "undefined"
        ? createPortal(
            <div
              style={{
                position: "absolute",
                top: pickerPosition.top,
                left: pickerPosition.left,
                zIndex: 1000,
              }}
            >
              <EmojiPicker onEmojiClick={handleEmojiClick} theme={Theme.DARK} />
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
