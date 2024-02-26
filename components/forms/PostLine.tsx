"use client";

import { LineValidation } from "@/lib/validations/line";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import MediaCarousel from "@/components/shared/MediaCarousel";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { ChangeEvent, useState } from "react";
import { IoImageOutline } from "react-icons/io5";
import { createPost, editPostById } from "@/lib/actions/post.actions";

interface Props {
  userId: string;
  circleId?: string;
  line: {
    id: string;
    text: string;
    media: string[];
  };
  btnTitle: string;
}

const PostLine = ({ userId, circleId, line, btnTitle }: Props) => {
  // get the router and the current pathname
  const router = useRouter();
  const pathname = usePathname();

  // files array for images
  const [files, setFiles] = useState<File[]>([]);
  const [media, setMedia] = useState<string[]>(line.media);

  // form definition
  const form = useForm<z.infer<typeof LineValidation>>({
    resolver: zodResolver(LineValidation),
    defaultValues: {
      text: line?.text || "",
      media: line?.media || [],
      accountId: userId,
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
    e: React.MouseEvent<HTMLButtonElement>,
    index: number,
    fieldChange: (value: string[]) => void
  ) => {
    e.preventDefault();

    const newMedia = media.filter((_, i) => i !== index);
    setMedia(newMedia);
    fieldChange(newMedia);
  };

  // submit function
  const onSubmit = async (values: z.infer<typeof LineValidation>) => {
    // if the route is edit-line then use editPostById
    // else use createPost
    if (pathname === "/edit-line") {
      await editPostById({
        id: line.id,
        text: values.text,
        media: values.media,
        path: pathname,
      });
    } else {
      console.log("running");
      await createPost({
        text: values.text,
        media: values.media,
        author: userId,
        circleId: circleId,
        path: pathname,
      });
    }

    if (circleId) {
      router.push(`/circle/${circleId}`);
    } else if (pathname.includes("edit-line")) {
      router.push(`/line/${line.id}`);
    } else {
      router.push("/");
    }
  };

  return (
    <Form {...form}>
      <form
        className="mt-10 flex flex-col justify-start gap-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {/* text input */}
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap 3">
              {/* <FormLabel className="">Text</FormLabel> */}
              <FormControl className="">
                <Textarea
                  rows={4}
                  className="no-focus text-white outline-none focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none bg-transparent border-b-2 border-x-0 border-t-0 border-b-slate-800"
                  placeholder="Write something here..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* media input */}
        <FormField
          control={form.control}
          name="media"
          render={({ field }) => (
            <FormItem className="grid grid-cols-3 gap-2">
              {field.value!.length > 0 && (
                <div className="col-span-3">
                  <MediaCarousel
                    media={field.value}
                    edit
                    onClickFunc={removeMedia}
                    onChange={field.onChange}
                  />
                </div>
              )}

              <div className="col-span-2">
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

              {/* submit button */}
              <Button type="submit" className="">
                {btnTitle}
              </Button>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default PostLine;
