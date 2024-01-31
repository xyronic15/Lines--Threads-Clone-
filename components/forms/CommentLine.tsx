"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { usePathname } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import MediaCarousel from "@/components/shared/MediaCarousel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useState } from "react";
import { IoImageOutline } from "react-icons/io5";
import { CommentValidation } from "@/lib/validations/line";
import { addComment } from "@/lib/actions/post.actions";

interface Props {
  currentUserId: string;
  currentUserImg: string;
  postId: string;
}

const CommentLine = ({ currentUserId, currentUserImg, postId }: Props) => {
  // get the pathname
  const pathname = usePathname();

  // files array for images
  const [files, setFiles] = useState<File[]>([]);
  const [media, setMedia] = useState<string[]>([]);

  //   form definition
  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      comment: "",
      media: [],
    },
  });

  // add media handler
  const addMedia = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string[]) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      // if the file is not an image, return
      if (!file.type.includes("image")) return;

      // if the file exceeds 10mb then return message
      if (file.size > 10000000) {
        alert("File size exceeds 10mb");
        return;
      }

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        setMedia([...media, imageDataUrl]);
        fieldChange([...media, imageDataUrl]);
      };

      fileReader.readAsDataURL(file);
    }
  };

  // remove media handler
  const removeMedia = (
    e: MouseEvent<HTMLButtonElement>,
    index: number,
    fieldChange: (value: string[]) => void
  ) => {
    e.preventDefault();

    const newMedia = media.filter((_, i) => i !== index);
    setMedia(newMedia);
    fieldChange(newMedia);
  };

  //   submit function
  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    // console.log(values);

    await addComment(
      currentUserId,
      postId,
      values.comment,
      values.media,
      pathname
    );

    form.reset();
  };

  return (
    <Form {...form}>
      <form className="comment-form" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex">
          <div className="relative h-10 w-10">
            <Image
              src={currentUserImg}
              alt="current_user"
              //   width={48}
              //   height={48}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-full"
            />
          </div>
        </div>

        <div className="flex flex-col w-full items-center gap-2">
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem className="flex w-full items-center">
                {/* <FormLabel>
                
              </FormLabel> */}
                <FormControl className="border-none bg-transparent">
                  <Input
                    type="text"
                    {...field}
                    placeholder="Comment..."
                    className="no-focus text-white outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* media input */}
          <FormField
            control={form.control}
            name="media"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full gap-2">
                {field.value!.length > 0 && (
                  <div className="w-full">
                    <MediaCarousel
                      media={field.value}
                      edit
                      onClickFunc={removeMedia}
                      onChange={field.onChange}
                    />
                  </div>
                )}

                <div className="">
                  <FormLabel
                    className={`${field.value!.length >= 4 && "hidden"}`}
                  >
                    <IoImageOutline
                      className="text-white cursor-pointer"
                      size={36}
                    />
                  </FormLabel>
                  <FormControl className="">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => addMedia(e, field.onChange)}
                      className="hidden"
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="comment-form_btn">
          Reply
        </Button>
      </form>
    </Form>
  );
};

export default CommentLine;
