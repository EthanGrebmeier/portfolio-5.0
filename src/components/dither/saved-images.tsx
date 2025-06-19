import { useAtom } from "jotai";
import React, { useRef } from "react";
import { savedImagesAtom } from "./atom";
import { AnimatePresence, type Variants, motion } from "motion/react";
import { Download, Trash2 } from "lucide-react";
import { cn } from "~/helpers/cn";

const imageSkews = [10, -12, 4, -4, 3, -2, 0, -5];

const variants: Variants = {
  initial: () => ({
    scale: 0.4,
    rotate: 0,
  }),

  hover: {
    scale: 1.1,
    rotate: 0,
    zIndex: 4,
  },
  animate: (i) => ({
    scale: 1,
    rotate: imageSkews[i % imageSkews.length],
  }),
};

const SavedImages = () => {
  const [savedImages, setSavedImages] = useAtom(savedImagesAtom);
  const [offset, setOffset] = React.useState(0);

  const removeImage = (index: number) => {
    const newImages = [...savedImages];
    newImages.splice(index, 1);
    setSavedImages(newImages);
  };

  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const updateOffset = () => {
      if (wrapperRef.current && contentRef.current) {
        const { width } = wrapperRef.current.getBoundingClientRect();

        const offSetWidth = contentRef.current.scrollWidth;
        const newOffset = offSetWidth - width;

        setOffset(newOffset);
      }
    };

    // Set Initial Value
    updateOffset();

    // Check for resizing Events.
    window.addEventListener("resize", updateOffset);
    return () => {
      window.removeEventListener("resize", updateOffset);
    };
  }, [savedImages]);

  const canDrag = React.useMemo(() => offset > 0, [offset]);
  return (
    <div
      className="@container relative flex flex-1 flex-col gap-4 py-16"
      ref={wrapperRef}
    >
      {savedImages.length ? (
        <motion.div
          ref={contentRef}
          dragConstraints={{
            left: -offset,
            right: 16,
          }}
          whileDrag={{
            cursor: "grabbing",
          }}
          whileHover={{
            cursor: canDrag ? "grab" : "default",
          }}
          drag={canDrag ? "x" : false}
          className={cn(
            "flex w-max flex-row-reverse flex-nowrap items-center px-12",
          )}
        >
          <AnimatePresence>
            {[...savedImages].map((image, index) => (
              <motion.div
                key={image.slice(80, 120)}
                custom={savedImages.length - index}
                initial="initial"
                animate="animate"
                whileHover="hover"
                variants={variants}
                exit={{
                  scale: 0,
                  rotate: 0,
                }}
                className="@lg:size-64 relative size-44 overflow-hidden [&:not(:first-child)]:-ml-2"
              >
                <button className="absolute right-1 top-1 rounded-lg border-2 border-black bg-red-400 p-1">
                  <Trash2 size={15} onClick={() => removeImage(index)} />
                </button>
                <button
                  onClick={async () => {
                    const fetchedImage = await fetch(image);
                    const blob = await fetchedImage.blob();
                    const files = [
                      new File([blob], "image.png", {
                        type: "image/png",
                      }),
                    ];
                    await navigator.share({ files });
                  }}
                  className="absolute bottom-1 right-1 rounded-lg border-2 border-black bg-green-400 p-1"
                >
                  <Download size={15} />
                </button>
                <img
                  src={image}
                  draggable={false}
                  className="h-full w-full overflow-hidden rounded-lg border-2 border-black object-cover"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="@lg:h-64 flex h-28 w-full items-center justify-center">
          <p className="absolute left-1/2 top-1/2 w-max -translate-x-1/2 -translate-y-1/2">
            {" "}
            No saved images{" "}
          </p>
        </div>
      )}
    </div>
  );
};

export default SavedImages;
