import { ArrowRight } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import React from "react";
import Badge from "~/components/badge";
import { cn } from "~/helpers/cn";

type ShowcaseItemProps = {
  title: string;
  subtitle?: string;
  badge?: {
    icon?: ({ size }: { size: number }) => React.ReactNode;
    text: string;
  };
  link: {
    href: string;
    text: string;
  };
  backgroundImage: {
    src: StaticImageData;
    alt: string;
  };
  overlay?: {
    className?: string;
    showOverlay: boolean;
  };
};

const ShowcaseItem = ({
  title,
  subtitle,
  badge,
  link,
  backgroundImage,
  overlay,
}: ShowcaseItemProps) => {
  return (
    <Link href={link.href} className="group isolate h-full w-full">
      <div className="absolute inset-0 z-20 flex items-center justify-center p-8">
        <div className="flex h-full w-full flex-col justify-between gap-4 text-white">
          <div className="flex w-full justify-between gap-2">
            <div className="flex flex-col">
              <div className="flex gap-2">
                <h2 className="font-serif text-5xl font-light md:text-7xl">
                  {title}
                </h2>
              </div>
              <p className="font-serif text-xl italic leading-tight text-white">
                {subtitle}
              </p>
            </div>
            {badge && <Badge Icon={badge.icon}>{badge.text}</Badge>}
          </div>
          <div className="flex w-full justify-end justify-self-end text-white">
            <span className="flex items-center gap-2 text-2xl group-hover:underline">
              {" "}
              {link.text}
              <ArrowRight
                className="transition-all group-hover:translate-x-1"
                size={20}
                aria-hidden="true"
              />
            </span>
          </div>
        </div>
      </div>
      {overlay?.showOverlay && (
        <div
          className={cn(
            "absolute inset-0 z-10 bg-gray-600/40",
            overlay.className,
          )}
        />
      )}
      <Image
        priority
        fill
        className="h-full w-full object-cover"
        placeholder="blur"
        src={backgroundImage.src}
        alt={backgroundImage.alt}
      />
    </Link>
  );
};

export default ShowcaseItem;
