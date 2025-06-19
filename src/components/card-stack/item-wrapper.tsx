import { cn } from "~/lib/utils";

export const ItemWrapper = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "max-w-[380px] rounded-lg border-2 border-blue-700 bg-white p-4",
        className,
      )}
    >
      {children}
    </div>
  );
};
