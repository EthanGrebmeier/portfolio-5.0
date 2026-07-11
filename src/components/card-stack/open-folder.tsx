"use client";

import { motion, easeInOut } from "motion/react";
import { useEffect, useRef } from "react";
import type { CardType } from "./projects";
import { ArrowRightIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import ButtonLink from "../button-link";
import { DraggableItem } from "./draggable-item";

const FOLDER_ANIMATION_DURATION = 0.4; // Total time for folder to open (0.3s initial + 0.5s open)

const backVariants = {
  initial: { y: 150, rotateY: 0, scale: 1, x: 0 },
  closed: {
    y: 16,
    rotateY: 0,
    scale: 1,
    x: 0,
    transition: { duration: 0.3, ease: easeInOut },
  },
  open: {
    y: 16,
    rotateY: 10,
    scale: 1.01,
    x: 0,
    transition: { duration: 0.4, ease: easeInOut, delay: 0.1 },
  },
  exit: {
    y: 150,
    rotateY: 0,
    scale: 1,
    x: 0,
    transition: { duration: 0.3, ease: easeInOut },
  },
};

const frontVariants = {
  initial: { y: 150, rotateX: 0 },
  closed: {
    y: 40,
    rotateX: 0,
    transition: { duration: 0.3, ease: easeInOut },
  },
  open: {
    y: 40,
    rotateX: -5,
    transition: { duration: 0.5, ease: easeInOut },
  },
  exit: {
    y: 150,
    rotateX: 0,
    transition: { duration: 0.3, ease: easeInOut },
  },
};

// Get initial position within folder with slight overflow
type OpenFolderProps = {
  card: CardType;
  onClose: () => void;
};

export const OpenFolder = ({ card, onClose }: OpenFolderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contents = card.contents ?? [];

  useEffect(() => {
    const bodyOverflow = document.body.style.overflow;
    const htmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = htmlOverflow;
    };
  }, []);

  // Calculate folder position for exit animation
  const cardWidth = Math.min(360, window.innerWidth - 72);

  const bottomY = window.innerHeight + 250; // Align with folder bottom

  return (
    <>
      <motion.button
        type="button"
        aria-label="Close folder"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-x-0 top-0 z-50 h-[100dvh] bg-slate-950/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="perspective-dramatic pointer-events-none fixed inset-x-0 top-0 z-[51] flex h-[100dvh] items-center justify-center">
        {/* Back of folder */}
        <motion.div
          variants={backVariants}
          initial="initial"
          animate={["closed", "open"]}
          whileHover="initial"
          exit="exit"
          className="absolute bottom-0 h-[120px] origin-bottom rounded-xl border border-blue-500 bg-blue-400"
          style={{ width: cardWidth }}
        >
          <div className="absolute left-2 top-0 flex -translate-y-full items-center rounded-t-lg border border-b-2 border-blue-400 bg-blue-300 px-2">
            <p className="select-none text-lg font-medium text-blue-700">
              {card.title}
            </p>
          </div>
        </motion.div>
        {/* Draggable items */}
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="z-60 pointer-events-none absolute inset-0"
        >
          <motion.div
            className="relative h-full w-full"
            variants={{
              visible: {
                transition: {
                  delayChildren: FOLDER_ANIMATION_DURATION,
                  staggerChildren: 0.08,
                },
              },
            }}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {contents.map((item, index) => {
              return (
                <DraggableItem
                  key={item.id}
                  index={index}
                  containerRef={containerRef}
                  bottomY={bottomY}
                >
                  {item.content}
                </DraggableItem>
              );
            })}
            <motion.div
              variants={{
                hidden: {
                  scale: 0.95,
                  y: bottomY,
                  rotate: 0,
                  transition: {
                    duration: 0.3,
                    ease: easeInOut,
                  },
                },
                visible: {
                  scale: 1,
                  y: window.innerHeight - 190,
                  rotate: 0,
                  transition: {
                    type: "spring",
                    stiffness: 150,
                    damping: 30,
                    duration: 1,
                  },
                },
              }}
              className="pointer-events-none absolute inset-x-0 top-0 flex justify-center"
            >
              <ButtonLink
                color="blue"
                className="z-52 pointer-events-auto h-11 cursor-pointer gap-2 border border-blue-600 px-5 text-base font-medium no-underline shadow-lg shadow-blue-950/20"
                href={card.link.href}
              >
                {card.link.label}
                <ArrowRightIcon className="size-4" />
              </ButtonLink>
            </motion.div>
          </motion.div>
        </motion.div>
        {/* Front of folder */}
        <motion.div
          variants={frontVariants}
          initial="initial"
          animate={["closed", "open"]}
          whileHover="initial"
          exit="exit"
          className="absolute bottom-0 h-[120px] origin-bottom rounded-xl border border-blue-400 bg-blue-300 shadow-sm"
          style={{ width: cardWidth }}
        >
          <div className="relative h-full w-full p-3"></div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="z-60 pointer-events-auto absolute right-4 top-4"
        >
          <Button
            variant="outline"
            size="icon"
            className="border-white/70 bg-white/95 text-blue-700 shadow-md backdrop-blur hover:bg-white"
            onClick={onClose}
            aria-label="Close folder"
          >
            <XIcon />
          </Button>
        </motion.div>
      </div>
    </>
  );
};
