"use client";
import { motion } from "motion/react";
import { useAtom } from "jotai";
import React from "react";
import { savedImagesAtom } from "./atom";
import { Save } from "lucide-react";

type PrintOutImageProps = {
  ditheredSource: string;
  onSave?: () => void;
  children?: React.ReactNode;
};

const PrintOutImage = ({
  ditheredSource,
  children,
  onSave,
}: PrintOutImageProps) => {
  const [savedImages, setSavedImages] = useAtom(savedImagesAtom);

  return (
    <motion.div
      initial={{
        y: "100%",
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      exit={{
        y: "100%",
        opacity: 0,
      }}
      transition={{
        type: "spring",
        bounce: 0.1,
        duration: 1.3,
        ease: "easeInOut",
      }}
      className="relative mx-auto min-h-0 w-fit justify-center overflow-hidden rounded-3xl border-2 border-black"
    >
      <img src={ditheredSource} className="object-contain object-center" />
      {children}
      <button
        className="absolute right-2 top-2 rounded-xl border-2 border-black bg-green-400 p-2"
        onClick={() => {
          setSavedImages([...savedImages, ditheredSource]);
          if (onSave) {
            onSave();
          }
        }}
      >
        <Save size={20} />
      </button>
    </motion.div>
  );
};

export default PrintOutImage;
