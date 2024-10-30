import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import SavedImages from "./saved-images";
import { savedImagesAtom } from "./atom";
import { useAtomValue } from "jotai";
import { motion, Variants } from "framer-motion";
import { DialogDescription } from "@radix-ui/react-dialog";
import ResponsiveDialog from "../ui/responsive-dialog";
import { ImageIcon } from "lucide-react";

const imageSkews = [10, -12, 14, -6, 9, -17, 0, -5];

const variants: Variants = {
  animate: (i) => ({
    rotate: imageSkews[i % imageSkews.length],
    x: "-50%",
    y: "-50%",
  }),
  initial: {
    rotate: 0,
    x: "-50%",
    y: "-50%",
  },
  hover: (i) => ({
    rotate: (imageSkews[i % imageSkews.length] as number) * 0.56,
    x: "-50%",
    y: "-50%",
  }),
};

const SavedImagesDialog = () => {
  const savedImages = useAtomValue(savedImagesAtom);

  return (
    <ResponsiveDialog
      bodyClassName="px-0 max-w-3xl"
      headerClassName="px-4"
      title="Saved Images"
      description="Images you have saved are stored locally in your browser"
      trigger={
        <button className="flex  text-sm font-medium hover:font-bold">
          <motion.div
            initial="initial"
            animate="animate"
            whileHover="hover"
            className="group relative size-24"
          >
            {savedImages.length
              ? savedImages.map((image, index) => (
                  <motion.img
                    key={image.slice(80, 120)}
                    src={image}
                    custom={index}
                    variants={variants}
                    className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-xl border-2 border-black object-cover"
                    style={{
                      zIndex: index,
                    }}
                  />
                ))
              : [0, 1, 2].map((num, index) => (
                  <motion.div
                    key={num}
                    custom={index}
                    variants={variants}
                    className="absolute left-1/2 top-1/2 flex size-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border-2 border-black bg-white object-cover"
                    style={{
                      zIndex: index,
                    }}
                  >
                    <ImageIcon size={20} />
                  </motion.div>
                ))}
          </motion.div>
        </button>
      }
    >
      <div className="max-w-4xl overflow-hidden px-0 py-6">
        <SavedImages />
      </div>
    </ResponsiveDialog>
  );
};

export default SavedImagesDialog;
