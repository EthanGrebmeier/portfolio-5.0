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
        "h-[calc(50svh-var(--section-spacing))] max-h-[1440px] w-full lg:h-[calc(100svh-var(--section-spacing))]",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default FullscreenColumn;
