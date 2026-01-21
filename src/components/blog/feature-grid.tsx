import React from "react";
import { cn } from "~/helpers/cn";
import { BlogMedia, type BlogMediaDefinition } from "./media";

export type BlogFeature = {
  title: string;
  description: React.ReactNode;
  media: BlogMediaDefinition;
  imagePosition?: "left" | "right";
};

type BlogFeatureGridProps = {
  features: BlogFeature[];
  badge?: React.ReactNode;
  className?: string;
};

export const BlogFeatureGrid = ({ features, badge, className }: BlogFeatureGridProps) => {
  return (
    <section className={cn("mt-12", className)}>
      <div className="flex flex-col gap-12 pb-16">
        {badge}
        <div className="flex flex-col gap-20">
          {features.map((feature) => {
            const reverseLayout = feature.imagePosition === "right";

            const textColumn = (
              <div className="flex flex-col gap-2">
                <h3>{feature.title}</h3>
                <div className="flex flex-col gap-2">{feature.description}</div>
              </div>
            );

            const mediaColumn = <BlogMedia media={feature.media} />;

            return (
              <div
                key={feature.title}
                className={cn(
                  "grid gap-4 md:gap-14",
                  reverseLayout ? "md:grid-cols-[1fr_2fr]" : "md:grid-cols-[2fr_1fr]"
                )}
              >
                {reverseLayout ? (
                  <>
                    {textColumn}
                    {mediaColumn}
                  </>
                ) : (
                  <>
                    {mediaColumn}
                    {textColumn}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
