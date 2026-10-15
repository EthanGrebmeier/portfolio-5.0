"use client";

import React from "react";
import { motion } from "motion/react";
import type { CardType } from ".";
import { useIsMobile } from "~/hooks/useMediaQuery";
import Link from "next/link";

type CardProps = {
  card: CardType;
  index: number;
  numCards: number;
  style?: React.CSSProperties;
  isOpen?: boolean;
  onOpen?: () => void;
  /** Index of the folder currently hovered in the stack, if any */
  hoveredIndex: number | null;
  onHoverChange: (index: number | null) => void;
};

const FOLDER_BACK = "#3b82f6"; // blue-500
const FOLDER_FRONT =
  "linear-gradient(180deg, color-mix(in srgb, #60a5fa 88%, #fff), #60a5fa 60%)";
const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const DIP_DISTANCE = 64;
const SPRING = { type: "spring", stiffness: 300, damping: 30 } as const;

// Calculate arc position for an item - spread horizontally, peeking ~50% out of top
const getArcPosition = (itemIndex: number, totalItems: number) => {
  // Horizontal spread centered above folder - negative x is left, positive x is right
  const spreadWidth = 220;
  const xOffset = totalItems > 1
    ? (itemIndex / (totalItems - 1)) * spreadWidth - spreadWidth / 2
    : 0;

  // Slight arc curve - items in middle peek up slightly more
  const normalizedIndex = totalItems > 1 ? itemIndex / (totalItems - 1) : 0.5;
  const arcHeight = Math.sin(normalizedIndex * Math.PI) * 4;

  return {
    x: xOffset,
    y: -150 - arcHeight, // ~50% of a scaled item peeking out
    rotate: (itemIndex - (totalItems - 1) / 2) * 3,
  };
};

const Card = ({
  card,
  index,
  numCards,
  style,
  isOpen: _isOpen,
  onOpen,
  hoveredIndex,
  onHoverChange,
}: CardProps) => {
  const isMobile = useIsMobile();
  const isDesktop = !isMobile;
  const isHovered = isDesktop && hoveredIndex === index;
  // Folders in front of the hovered one dip down to reveal it
  const isInFrontOfHovered =
    isDesktop && hoveredIndex !== null && index < hoveredIndex;
  const distanceFromCenter = index - (numCards - 1) / 2;
  const horizontalStep = isMobile ? 12 : 20;
  const verticalStep = isMobile ? 24 : 36;
  const xOffset = distanceFromCenter * horizontalStep;
  const yOffset = distanceFromCenter * -verticalStep;
  // Fan the stack back and to the right: deeper folders rotate clockwise and shrink slightly
  const depth = index; // 0 = front of the stack
  const rotation = depth * 2.5;
  const depthScale = 1 - depth * 0.05;
  const getTransform = (lift = 0) =>
    `translate(calc(-50% + ${xOffset}px), calc(-50% + ${yOffset + lift}px)) rotate(${rotation}deg) scale(${depthScale})`;
  const initialTransform = getTransform();
  const hoverTransform = getTransform(-12);
  const dippedTransform = getTransform(DIP_DISTANCE);

  const contents = card.contents ?? [];

  const cardContent = (
    <motion.div
      key={card.id}
      onMouseEnter={() => isDesktop && onHoverChange(index)}
      onMouseLeave={() => isDesktop && hoveredIndex === index && onHoverChange(null)}
      style={style}
      initial={{
        transform: initialTransform,
        zIndex: numCards - index,
      }}
      animate={{
        transform: isHovered
          ? hoverTransform
          : isInFrontOfHovered
            ? dippedTransform
            : initialTransform,
        zIndex: numCards - index,
      }}
      whileTap={{
        transform: hoverTransform,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.3,
      }}
      className="absolute left-1/2 top-1/2 aspect-[4/3] h-auto w-[calc(100%-2.5rem)] max-w-[360px] cursor-pointer touch-none overflow-visible md:w-full md:max-w-[420px]"
    >
        {/* Back of folder — tilted slightly away, with an attached tab */}
        <motion.div
          className="absolute inset-0 z-0 origin-bottom rounded-[14px]"
          style={{
            background: FOLDER_BACK,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)",
            transformPerspective: 600,
          }}
          initial={false}
          animate={{ rotateX: 8 }}
          transition={SPRING}
        >
          <div
            className="absolute bottom-[calc(100%-14px)] left-0 min-w-[42%] rounded-t-[14px] px-4 pb-[18px] pt-2"
            style={{
              background: FOLDER_BACK,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)",
            }}
          >
            <p className="select-none text-lg font-medium leading-none text-blue-50">
              {card.title}
            </p>
            {/* Concave fillet where the tab meets the folder edge */}
            <span
              aria-hidden
              className="absolute bottom-[14px] left-full size-3"
              style={{
                background: `radial-gradient(circle at 100% 0, transparent 11.5px, ${FOLDER_BACK} 12px)`,
              }}
            />
          </div>
        </motion.div>
        {/* Paper sheet peeking out when opened */}
        <motion.div
          aria-hidden
          className="absolute inset-x-[8%] top-[10%] z-[1] h-1/2 rounded-md bg-slate-50 shadow-sm"
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          transition={{ duration: isHovered ? 0.52 : 0.31, ease: EASE_OUT }}
        />
        {/* Arc items - rendered BETWEEN back and front so front covers bottom half */}
        {isDesktop && (
          <div className="pointer-events-none absolute left-1/2 top-0 z-[1]">
            {contents.map((item, itemIndex) => {
              const pos = getArcPosition(itemIndex, contents.length);
              return (
                // Static centering wrapper so Motion only animates pixel x/y (avoids subpixel blur from % calc)
                <div
                  key={item.id}
                  className="absolute left-0 top-0 -translate-x-1/2"
                >
                  <motion.div
                    className="[backface-visibility:hidden] will-change-transform"
                    initial={false}
                    animate={
                      isHovered
                        ? {
                            x: pos.x,
                            y: pos.y,
                            opacity: 1,
                            rotate: pos.rotate,
                          }
                        : {
                            x: 0,
                            y: 60,
                            opacity: 0,
                            rotate: 0,
                          }
                    }
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                      delay: isHovered ? itemIndex * 0.04 : 0,
                    }}
                  >
                    <div className="min-w-max">{item.content}</div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        )}
        {/* Front flap — tilts toward the viewer and opens further on hover */}
        <motion.div
          className="absolute inset-x-0 bottom-0 z-[2] flex h-[88%] origin-bottom flex-col justify-end gap-1.5 rounded-[14px] px-5 py-4"
          style={{
            background: FOLDER_FRONT,
            boxShadow:
              "0 -10px 24px rgba(30, 58, 138, 0.22), inset 0 1px 0 rgba(255,255,255,0.55)",
            transformPerspective: 1400,
          }}
          initial={false}
          animate={{ rotateX: isHovered ? -40 : -2 }}
          transition={
            isHovered
              ? { duration: 0.52, ease: EASE_OUT }
              : { duration: 0.31, ease: EASE_OUT }
          }
        >
          <p className="select-none text-base font-medium leading-none text-white">
            {card.title}
          </p>
          <p className="select-none text-sm leading-none text-white/70">
            {card.description}
          </p>
        </motion.div>
    </motion.div>
  );

  if (isMobile) {
    return (
      <button
        type="button"
        onClick={onOpen}
        className="contents"
      >
        {cardContent}
      </button>
    );
  }

  return (
    <Link
      href={card.link.href}
      className="contents"
    >
      {cardContent}
    </Link>
  );
};

export default Card;
