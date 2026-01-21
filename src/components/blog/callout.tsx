import React from "react";
import { cn } from "~/helpers/cn";

type BlogCalloutProps = {
  children: React.ReactNode;
  className?: string;
};

export const BlogCallout = ({ children, className }: BlogCalloutProps) => (
  <aside className={cn("rounded-lg border border-blue-700 bg-blue-50 p-4 text-sm text-blue-900 w-full", className)}>
    {children}
  </aside>
);
