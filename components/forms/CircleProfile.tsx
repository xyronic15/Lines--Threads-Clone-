"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CircleValidation } from "@/lib/validations/circle";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { CgProfile } from "react-icons/cg";
import { ChangeEvent, useState } from "react";
import { createCircle, updateCircle } from "@/lib/actions/circle.actions";
import { usePathname, useRouter } from "next/navigation";
import { profile } from "console";

interface Props {
  userId: string;
  circle: {
    id: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}

export const CircleProfile = ({ userId, circle, btnTitle }: Props) => {
  const [files, setFiles] = useState<File[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  //   form definition
  const form = useForm({
    resolver: zodResolver(CircleValidation),
    defaultValues: {
      profile_photo: circle?.image || "",
      name: circle?.name || "",
      username: circle?.username || "",
      bio: circle?.bio || "",
    },
  });

  // profile image handler
  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      if (!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  //   define submit function
  const onSubmit = async (values: z.infer<typeof CircleValidation>) => {
    // create or update the circle depending on the current path
    if (pathname === "/create-circle") {
      await createCircle({
        userId: userId,
        username: values.username,
        name: values.name,
        bio: values.bio,
        image: values.profile_photo,
      });
    } else if (pathname === "/edit-circle") {
      await updateCircle({
        circleId: circle.id,
        username: values.username,
        name: values.name,
        bio: values.bio,
        image: values.profile_photo,
        path: pathname,
      });
    }

    if (pathname === "/profile/edit-circle") {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-10 justify-start"
      >
        {/* profile picture */}
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="account-form-image">
                {field.value ? (
                  <Image
                    src={field.value}
                    alt="profile photo"
                    width={96}
                    height={96}
                    priority
                    className="rounded-full object-contain"
                  />
                ) : (
                  <CgProfile size={24} className="object-contain" />
                )}
              </FormLabel>
              <FormControl className="flex-1 text-white">
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Upload a photo"
                  className="account-form-image-input"
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* name field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel className="font-semibold text-white">Name</FormLabel>
              <FormControl className="flex-1 font-semibold">
                <Input
                  type="text"
                  placeholder="Name"
                  className="account-form-input"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* username field */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel className="font-semibold text-white">
                Username
              </FormLabel>
              <FormControl className="flex-1 font-semibold">
                <Input type="text" className="account-form-input" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* bio field */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel className="font-semibold text-white">Bio</FormLabel>
              <FormControl className="flex-1 font-semibold">
                <Textarea rows={10} className="account-form-input" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default CircleProfile;
