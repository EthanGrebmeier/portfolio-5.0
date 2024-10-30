import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Hammer, Scroll } from "lucide-react";
import Badge from "~/components/badge";
import background from "~/../public/images/fillaneed-hero.avif";

const Fillaneed = () => {
  return (
    <Link href="https://fillaneed.xyz" className="group isolate h-full w-full">
      <div className="absolute inset-0 z-10 flex items-center justify-center p-8">
        <div className="flex h-full w-full flex-col justify-between gap-4 text-white">
          <div className="flex w-full flex-col-reverse justify-between gap-4 lg:flex-row lg:gap-2">
            <div className="flex flex-col">
              <div className="flex gap-2">
                <h2 className="font-serif text-5xl font-light md:text-7xl">
                  Fillaneed
                </h2>
                <div className="h-fit w-fit rounded-lg border-2 border-black bg-green-400 p-1 text-black">
                  <Scroll size={15} />
                </div>
              </div>
              <p className="font-serif text-xl italic text-lime-400">
                {" "}
                Create your dream wishlist.
              </p>
            </div>
            <Badge Icon={Hammer} className="bg-lime-400 text-black">
              Personal Project
            </Badge>
          </div>
          <div className="flex w-full justify-end justify-self-end text-lime-400">
            <span className="flex items-center gap-2 text-2xl group-hover:underline">
              {" "}
              Get Started{" "}
              <ArrowRight
                className="transition-all group-hover:translate-x-1"
                size={20}
                aria-hidden="true"
              />
            </span>
          </div>
        </div>
      </div>
      <Image
        priority
        fill
        className="h-full w-full object-cover"
        alt="woman laying in grass"
        src={background}
        placeholder="blur"
      />
    </Link>
  );
};

export default Fillaneed;
