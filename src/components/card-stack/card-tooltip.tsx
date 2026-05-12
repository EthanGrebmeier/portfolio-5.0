"use client";
import { motion } from "motion/react";
import { useIsMobile } from "~/hooks/useMediaQuery";

const CardTooltip = () => {
  const isMobile = useIsMobile();

  return (
    <motion.p
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.5 }}
    className="pointer-events-none text-center text-lg font-medium text-gray-400"
  >
    {isMobile ? "Tap a folder to open" : "Hover to preview, click to visit"}
  </motion.p>
  );
};

export default CardTooltip;