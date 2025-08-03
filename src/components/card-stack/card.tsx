import React from "react";
import { motion } from "motion/react";
import type { CardType } from ".";
import { FolderOpen } from "lucide-react";

type CardProps = {
  card: CardType;
  index: number;
  numCards: number;
  style?: React.CSSProperties;
  isOpen?: boolean;
  onOpen?: () => void;
};

const Card = ({ card, index, numCards, style, isOpen, onOpen }: CardProps) => {
  const centerY = "-50%";
  const rightOffset = index * 20; // px
  const upOffset = index * -16; // px

  // Helper to build translateY and translateX
  const getTranslateY = (base: string, offset = 0) =>
    `translateY(calc(${base} + ${index > 0 ? `${index * -20 + offset + upOffset}px` : `${offset + upOffset}px`}))`;
  const getTranslateX = () => `translateX(calc(-50% + ${rightOffset}px))`;

  // Initial, Animate, and Hover transforms
  const initialTransform = `${getTranslateY(centerY)} ${getTranslateX()}`;
  const hoverTransform =
    index > 0
      ? getTranslateY(centerY, -12) + ` ${getTranslateX()} `
      : initialTransform;

  return (
    <>
      <motion.div
        key={card.id}
        onClick={onOpen}
        style={style}
        initial={{
          left: "50%",
          top: "50%",
          transform: initialTransform,
          zIndex: numCards - index,
        }}
        animate={{
          left: "50%",
          transform: initialTransform,
          zIndex: numCards - index,
        }}
        whileHover={{
          transform: hoverTransform,
          scale: 1.02,
        }}
        whileTap={{
          scale: 1.02,
          transform: hoverTransform,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: 0.3,
        }}
        className="perspective-dramatic absolute aspect-[4/3] h-auto w-4/5 max-w-[450px] cursor-pointer touch-none"
      >
        {/* Back of folder */}
        <div className="absolute inset-0 translate-x-[4px] translate-y-[-4px] rounded-xl border-2 border-blue-700 bg-blue-300">
          <div
            style={{
              left: "8px",
            }}
            className="absolute top-px flex -translate-y-full items-center gap-1 rounded-t-lg border-2 border-b-0 border-blue-700 bg-blue-300 px-2"
          >
            <p className="select-none text-lg font-bold text-blue-700">
              {card.title}
            </p>
            <card.Icon size={16} className="text-blue-700" />
          </div>
        </div>
        {/* Front of folder */}
        <div className="relative h-full w-full rounded-xl border-2 border-blue-700 bg-blue-200">
          <div className="relative flex h-full w-full p-4"></div>
        </div>
        {index === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pointer-events-none absolute left-1/2 top-full -translate-x-1/2 translate-y-4 text-center text-lg font-medium text-gray-400"
          >
            Tap a folder to open
          </motion.p>
        )}
      </motion.div>
    </>
  );
};

export default Card;
