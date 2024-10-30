import React from "react";
import { cn } from "~/helpers/cn";

type FullscreenColumnProps = {
  className?: string;
  children: React.ReactNode;
};

const FullscreenColumn = ({ children, className }: FullscreenColumnProps) => {
  return (
    <div
      className={cn(
        "h-[calc(70svh-var(--spacing))] w-full lg:h-[calc(100svh-var(--spacing))]",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default FullscreenColumn;
