"use client";
import { useIsMobile } from "~/hooks/useMediaQuery";

const CardTooltip = () => {
  const isMobile = useIsMobile();

  return (
    <p
    className="pointer-events-none text-center text-sm text-gray-400 -translate-y-6"
  >
    {isMobile ? "Tap a folder to open" : "Hover to preview, click to visit"}
  </p>
  );
};

export default CardTooltip;