import { AnimatePresence } from "framer-motion";
import React from "react";
import { cn } from "~/helpers/cn";
import { motion } from "framer-motion";

type ButtonIconProps = React.ComponentPropsWithoutRef<"button"> & {
  Icon: ({ size }: { size: number }) => React.ReactNode;
  IconTwo?: ({ size }: { size: number }) => React.ReactNode;
  showIconTwo?: boolean;
  className?: string;
};

const ButtonIcon = ({
  Icon,
  IconTwo,
  showIconTwo,
  className,
  ...props
}: ButtonIconProps) => {
  return (
    <button
      className={cn(
        "duration-[250ms] overflow-hidden rounded-full bg-white/20 p-1 text-white transition-all hover:bg-white hover:text-blue-800",
        className,
      )}
      {...props}
    >
      <AnimatePresence initial={false} mode="wait">
        {(!IconTwo || !showIconTwo) && (
          <motion.div
            key={"one"}
            initial={{ y: 20, filter: "blur(2px)" }}
            animate={{ y: 0, filter: "blur(0px)" }}
            exit={{ y: 20, filter: "blur(2px)" }}
          >
            <Icon size={24} />
          </motion.div>
        )}
        {IconTwo && showIconTwo && (
          <motion.div
            key={"two"}
            initial={{ y: 20, filter: "blur(2px)" }}
            animate={{ y: 0, filter: "blur(0px)" }}
            exit={{ y: 20, filter: "blur(2px)" }}
          >
            <IconTwo size={24} />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};

export default ButtonIcon;
