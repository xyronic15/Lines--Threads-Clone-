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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { IoImageOutline } from "react-icons/io5";
import { IoMdCloseCircle } from "react-icons/io";
import { Number } from "mongoose";

interface Props {
  userId: string;
  line: {
    id: string;
    text: string;
    media: string[];
    circleId: string;
  };
  btnTitle: string;
}

const PostLine = ({ userId, line, btnTitle }: Props) => {
  // get the router and the current pathname
  const router = useRouter();
  const pathname = usePathname();

  // files array for images
  const [files, setFiles] = useState<File[]>([]);
  const [media, setMedia] = useState<string[]>([]);

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

      if (!file.type.includes("image")) return;

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

  // submit function
  const onSubmit = async (values: z.infer<typeof LineValidation>) => {
    console.log("submitted");
    console.log(values);
    // router.push("/");
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
                  rows={10}
                  className="bg-none"
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
              {field.value!.length > 0 ? (
                <Carousel className="col-span-3">
                  <CarouselContent className="w-full h-96">
                    {field?.value.map((url, index) => {
                      return (
                        <CarouselItem className="relative w-full h-full flex items-center justify-center">
                          <Image
                            key={index}
                            src={url}
                            layout="fill"
                            objectFit="contain"
                            // width={200}
                            // height={200}
                            alt="media"
                            priority
                            className="px-5 md:px-20"
                          />
                          <button
                            className="absolute top-2 right-2"
                            onClick={(e) => removeMedia(e, index, field.onChange)}
                          >
                            <IoMdCloseCircle size={36} className="text-white" />
                          </button>
                        </CarouselItem>
                      );
                    })}
                  </CarouselContent>
                  <CarouselPrevious className="ml-16" type="button" />
                  <CarouselNext className="mr-16" type="button" />
                </Carousel>
              ) : null}

              <div className="col-span-2">
                <FormLabel className="">
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
