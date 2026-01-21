import Image from "next/image";
import React from "react";
import { cn } from "~/helpers/cn";

export type BlogMediaSource = {
  src: string;
  priority?: boolean;
};

export type BlogMediaDefinition = {
  type: "image" | "video";
  alt: string;
  desktop: BlogMediaSource;
  mobile?: BlogMediaSource;
  containerClassName?: string;
};

type BlogMediaProps = {
  media: BlogMediaDefinition;
};

const baseContainer = "relative w-full overflow-hidden rounded-xl border border-blue-700 bg-transparent";
const baseMedia = "h-full w-full object-cover";

export const BlogMedia = ({ media }: BlogMediaProps) => {
  const containerClassName = cn(baseContainer, media.containerClassName);

  if (media.type === "video") {
    const desktopClass = media.mobile ? "xs:block hidden h-auto w-full object-cover" : "h-auto w-full object-cover";
    const mobileClass = "xs:hidden block h-auto w-full object-cover";

    return (
      <div className={containerClassName}>
        <video
          autoPlay
          loop
          muted
          playsInline
          className={desktopClass}
          src={media.desktop.src}
        />
        {media.mobile && (
          <video
            autoPlay
            loop
            muted
            playsInline
            className={mobileClass}
            src={media.mobile.src}
          />
        )}
      </div>
    );
  }

  const desktopClass = media.mobile ? "xs:block hidden" : "block";
  const mobileClass = "xs:hidden block";

  return (
    <div className={containerClassName}>
      <div className="relative h-full w-full">
        <Image
          src={media.desktop.src}
          alt={media.alt}
          fill
          priority={media.desktop.priority}
          sizes="(max-width: 640px) 100vw, 900px"
          className={cn(desktopClass, baseMedia)}
        />
        {media.mobile && (
          <Image
            src={media.mobile.src}
            alt={media.alt}
            fill
            priority={media.mobile.priority}
            sizes="100vw"
            className={cn(mobileClass, baseMedia)}
          />
        )}
      </div>
    </div>
  );
};
