import { ArrowRight } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import React from "react";
import Badge from "~/components/badge";
import ButtonLink from "~/components/button-link";
import { cn } from "~/helpers/cn";

type ShowcaseItemProps = {
  title: string;
  subtitle?: string;
  badge?: {
    icon?: ({ size }: { size: number }) => React.ReactNode;
    text: string;
  };
  links: {
    href: string;
    text: string;
  }[];
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
    background: "bg-[#dff2e4]",
  },
  blue: {
    text: "text-white",
    badge: "bg-white text-blue-700",
    background: "bg-blue-400",
  },
} as const;

const ShowcaseItem = ({
  title,
  subtitle,
  badge,
  links,
  backgroundImage,
  overlay,
  theme = "blue",
}: ShowcaseItemProps) => {
  return (
    <div
      className={cn(
        "isolate h-full w-full flex-1 select-none",
        themes[theme].background,
      )}
    >
      <div
        className={cn(
          "absolute inset-0 z-10 flex items-center justify-center p-4 sm:p-8",
        )}
      >
        <div className="flex h-full w-full flex-col justify-between gap-4 text-white">
          <div className="flex w-full flex-col-reverse justify-between gap-2 sm:flex-row">
            <div className="flex flex-col">
              <div className="flex gap-2">
                <h2
                  className={cn(
                    "font-serif text-5xl font-light tracking-tight sm:text-7xl",
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
          <div className="flex w-full flex-col items-end justify-end gap-2 justify-self-end">
            {links.map((link) => (
              <ButtonLink
                key={link.href}
                href={link.href}
                draggable={false}
                color={theme}
                className={cn("group")}
              >
                <span className="flex items-center gap-2 group-hover:underline">
                  {" "}
                  {link.text}
                  <ArrowRight
                    className="transition-all group-hover:translate-x-1"
                    size={18}
                    aria-hidden="true"
                  />
                </span>
              </ButtonLink>
            ))}
          </div>
        </div>
      </div>
      {overlay?.showOverlay && (
        <div
          className={cn(
            "absolute inset-0 z-[2] bg-gray-600/40",
            overlay.className,
          )}
        />
      )}
      <Image
        priority
        fill
        className="z-[1] h-full w-full object-cover"
        placeholder="blur"
        src={backgroundImage.src}
        alt={backgroundImage.alt}
      />
    </div>
  );
};

export default ShowcaseItem;
