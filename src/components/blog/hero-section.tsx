import React from "react";
import { cn } from "~/helpers/cn";
import { BlogMedia, type BlogMediaDefinition } from "./media";

type BlogHeroProps = {
  tagline?: string;
  caption?: string;
  content?: React.ReactNode;
  media: BlogMediaDefinition;
  className?: string;
};

export const BlogHero = ({ tagline, caption, content, media, className }: BlogHeroProps) => {
  return (
    <section className={cn("border-b border-blue-700 pb-12", className)}>
      {tagline && <p className="mb-6 mt-4 italic text-blue-700">{tagline}</p>}
      <div className="mb-8 flex flex-col gap-2">
        <BlogMedia media={media} />
        {caption && <p className="text-[0.95rem] italic text-blue-700">{caption}</p>}
      </div>
      {content && <div className="flex flex-col gap-4">{content}</div>}
    </section>
  );
};
