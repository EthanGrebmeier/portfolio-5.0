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
  theme?: keyof typeof themes;
};

const themes = {
  green: {
    text: "text-lime-400",
    badge: "bg-lime-400 text-black",
    background: "bg-blue-400",
  },
  blue: {
    text: "text-white",
    badge: "bg-white text-blue-700",
    background: "bg-[#fdfbd4]",
  },
} as const;

const ShowcaseItem = ({
  title,
  subtitle,
  badge,
  link,
  backgroundImage,
  overlay,
  theme = "blue",
}: ShowcaseItemProps) => {
  return (
    <Link
      href={link.href}
      draggable={false}
      className={cn(
        "group isolate h-full w-full select-none",
        themes[theme].background,
      )}
    >
      <div className="absolute inset-0 z-10 flex items-center justify-center p-4 sm:p-8">
        <div className="flex h-full w-full flex-col justify-between gap-4 text-white">
          <div className="flex w-full flex-col-reverse justify-between gap-2 sm:flex-row">
            <div className="flex flex-col">
              <div className="flex gap-2">
                <h2
                  className={cn(
                    "font-serif text-5xl font-light sm:text-7xl",
                    themes[theme].text,
                  )}
                >
                  {title}
                </h2>
              </div>
              <p
                className={cn(
                  "font-serif text-xl italic leading-tight text-white",
                  themes[theme].text,
                )}
              >
                {subtitle}
              </p>
            </div>
            {badge && (
              <Badge className={themes[theme].badge} Icon={badge.icon}>
                {badge.text}
              </Badge>
            )}
          </div>
          <div
            className={cn(
              "flex w-full justify-end justify-self-end text-white",
              themes[theme].text,
            )}
          >
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
            "absolute inset-0 z-[1] bg-gray-600/40",
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
