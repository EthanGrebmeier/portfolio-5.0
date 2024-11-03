import React from "react";
import { cn } from "~/helpers/cn";

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
  Icon?: ({ size }: { size: number }) => React.ReactNode;
};

const Badge = ({ children, Icon, className }: BadgeProps) => {
  return (
    <div
      className={cn(
        "flex h-fit w-fit items-center gap-2 rounded-xl bg-white px-4 py-1 text-xl text-blue-600",
        className,
      )}
    >
      {Icon && <Icon size={18} />}
      {children}
    </div>
  );
};

export default Badge;
