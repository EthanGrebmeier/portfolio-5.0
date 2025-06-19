import Link from "next/link";
import React from "react";
import { cn } from "~/helpers/cn";

const colors = {
  green: "text-black bg-lime-400 hover:bg-white hover:text-black",
  blue: "bg-blue-700 text-white hover:bg-white hover:text-blue-700",
  outline:
    "border border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white",
} as const;

type ButtonLinkProps = {
  color: keyof typeof colors;
} & React.ComponentProps<typeof Link>;

const ButtonLink = ({ color, className, ...props }: ButtonLinkProps) => {
  return (
    <Link
      className={cn(
        "flex h-10 items-center rounded-full px-4 py-2 text-base transition-colors",
        colors[color],
        className,
      )}
      {...props}
    />
  );
};

export default ButtonLink;
