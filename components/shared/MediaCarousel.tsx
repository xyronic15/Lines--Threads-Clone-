"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { IoMdCloseCircle } from "react-icons/io";
import Image from "next/image";

interface Props {
  media: string[] | undefined;
  edit?: boolean;
  onClickFunc?: any;
  onChange?: any;
}

const MediaCarousel = ({ media, edit, onClickFunc, onChange }: Props) => {
  return (
    <Carousel>
      <CarouselContent className="w-full h-48 sm:h-96">
        {media &&
          media.map((url, index) => {
            return (
              <CarouselItem
                key={index}
                className="relative w-full h-full flex items-center justify-center"
              >
                <Image
                  src={url}
                  fill
                  style={{ objectFit: "contain" }}
                  alt="media"
                  priority
                  className="px-5 md:px-20"
                />
                {edit && (
                  <button
                    className="absolute top-2 right-2"
                    onClick={(e) => onClickFunc(e, index, onChange)}
                  >
                    <IoMdCloseCircle
                      size={36}
                      className="text-gray-300 hover:text-white"
                    />
                  </button>
                )}
              </CarouselItem>
            );
          })}
      </CarouselContent>
      {/* next and prev buttons only appear when the media length is greater than 1 */}
      {media && (media.length > 1 || edit) && (
        <>
          <CarouselPrevious className="ml-16" type="button" />
          <CarouselNext className="mr-16" type="button" />
        </>
      )}
    </Carousel>
  );
};

export default MediaCarousel;
