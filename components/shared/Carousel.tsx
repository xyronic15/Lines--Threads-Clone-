"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { IoMdCloseCircle } from "react-icons/io";
import { FaCircleArrowLeft, FaCircleArrowRight } from "react-icons/fa6";

interface Props {
  media: string[];
  edit?: boolean;
  onClickFunc?: any;
  onChange?: any;
}

// Carousel component for media in lines
const Carousel = ({ media, edit, onClickFunc, onChange }: Props) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    skipSnaps: false,
  });

  //   check if you can still scroll
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  //   onlick functions for the prev and next buttons
  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
    setCanScrollNext(emblaApi.canScrollNext());
    setCanScrollPrev(emblaApi.canScrollPrev());
  }, [emblaApi]);
  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
    setCanScrollNext(emblaApi.canScrollNext());
    setCanScrollPrev(emblaApi.canScrollPrev());
  }, [emblaApi]);

  return (
    <div className="space-y-6">
      <div className="relative w-full mx-auto">
        {/* main slides */}
        <div className="overflow-hidden h-96" ref={emblaRef}>
          <div className="flex w-full h-full">
            {media.map((url, index) => {
              return (
                <div className="relative flex-[0_0_100%] items-center justify-center">
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
                  {edit && (
                    <button
                      className="absolute top-2 right-2"
                      onClick={(e) => {
                        onClickFunc(e, index, onChange);
                        setCanScrollNext(emblaApi.canScrollNext());
                        setCanScrollPrev(emblaApi.canScrollPrev());
                        emblaApi?.scrollTo(0);
                      }}
                    >
                      <IoMdCloseCircle
                        size={36}
                        className="text-gray-300 hover:text-white"
                      />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* buttons */}
        <button
          className={`absolute top-[50%] translate-y-[-50%] ${
            canScrollPrev ? "text-white hover:text-gray-300" : "text-gray-600"
          }`}
          type="button"
          onClick={scrollPrev}
        >
          <FaCircleArrowLeft size={30} />
        </button>
        <button
          className={`absolute top-[50%] translate-y-[-50%] right-0 ${
            canScrollNext ? "text-white hover:text-gray-300" : "text-gray-600"
          }`}
          type="button"
          onClick={scrollNext}
        >
          <FaCircleArrowRight size={30} />
        </button>
      </div>
    </div>
  );
};

export default Carousel;
