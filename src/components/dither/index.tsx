"use client";

import React, { useEffect, useState } from "react";

import PrintOutImage from "./print-out-image";
import DitherControls from "./dither-controls";
import { useMediaQuery } from "usehooks-ts";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import TactileButton from "../TactileButton";
import { useAtom } from "jotai";
import {
  ditherColorOneAtom,
  ditherColorTwoAtom,
  paletteSwatchesAtom,
} from "./atom";
import { DitherType, RGBA } from "./types";
import { ditherTypes, getRgbaFromHex } from "~/lib/dither";
import SavedImages from "./saved-images";
import Button from "../ui/button";
import SavedImagesDialog from "./saved-images-dialog";
import { Image as ImageIcon } from "lucide-react";

const Dither = () => {
  const [imageSrc, setImageSrc] = React.useState<string>();
  const [ditherType, setDitherType] = React.useState<DitherType>("fsb");
  const [ditheredSource, setDitheredSource] = React.useState<string>();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const offScreenCanvasRef = React.useRef<HTMLCanvasElement>(null);
  const [ditherColorOne, setDitherColorOne] = useAtom(ditherColorOneAtom);
  const [ditherColorTwo, setDitherColorTwo] = useAtom(ditherColorTwoAtom);
  const [isSavedImagesOpen, setIsSavedImagesOpen] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const handleImageLoad = (
    image: HTMLImageElement,
    color: {
      rgbaOne: RGBA;
      rgbaTwo: RGBA;
    },
    ditherFunction: (
      ctx: CanvasRenderingContext2D,
      image: ImageData,
      color: {
        rgbaOne: RGBA;
        rgbaTwo: RGBA;
      },
    ) => void,
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
    });
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const imageAspectRatio = image.width / image.height;
    const newImageWidth = 500;
    const newImageHeight = 500 / imageAspectRatio;
    image.width = newImageWidth;
    image.height = newImageHeight;
    canvas.width = newImageWidth;
    canvas.height = newImageHeight;
    ctx.drawImage(image, 0, 0, newImageWidth, newImageHeight);
    const imageData = ctx.getImageData(0, 0, newImageWidth, newImageHeight);
    ditherFunction(ctx, imageData, color);
    setDitheredSource(canvas.toDataURL());
  };

  const width = React.useMemo(() => window.innerWidth, [window.innerWidth]);
  const height = React.useMemo(() => window.innerHeight, [window.innerHeight]);

  useEffect(() => {
    if (!canvasRef.current || !offScreenCanvasRef.current) return;
    canvasRef.current.width = width;
    canvasRef.current.height = height;
    offScreenCanvasRef.current.width = width;
    offScreenCanvasRef.current.height = height;
  }, []);

  useEffect(() => {
    if (!imageSrc) return;
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const rgbaOne = getRgbaFromHex(ditherColorOne.color);
      const rgbaTwo = getRgbaFromHex(ditherColorTwo.color);
      if (!rgbaOne || !rgbaTwo) return;
      handleImageLoad(
        image,
        {
          rgbaOne,
          rgbaTwo,
        },
        ditherTypes[ditherType],
      );
    };
  }, [imageSrc, ditherType, ditherColorOne, ditherColorTwo]);

  return (
    <div className="flex w-full flex-1 justify-center overflow-hidden lg:items-center">
      <div className="flex flex-1 flex-col items-center gap-4 p-2 lg:flex-row">
        <div className="flex  flex-col gap-4">
          {isDesktop ? (
            <div className="flex max-w-[240px] flex-col gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-lg  font-semibold">Controls</p>
                <div className="h-fit w-[240px] rounded-xl border-2 border-black p-2 transition-all ">
                  <DitherControls
                    ditherType={ditherType}
                    setDitherType={setDitherType}
                    setImageSrc={setImageSrc}
                  />
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex justify-between gap-2">
                  <p className="text-lg font-semibold"> Saved Images</p>
                </div>
                <SavedImagesDialog />
              </div>
            </div>
          ) : (
            <div className="flex gap-4">
              <Drawer repositionInputs={false}>
                <div className="absolute bottom-8 right-6 z-20">
                  <DrawerTrigger asChild>
                    <Button className=" flex items-center gap-2 border-[3px] border-black bg-blue-400">
                      {ditheredSource ? "Edit Image" : "Dither Image"}
                      <ImageIcon size={35} />
                    </Button>
                  </DrawerTrigger>
                </div>
                <DrawerContent>
                  <div className="flex flex-col items-center gap-8 p-4">
                    <DrawerTitle>Dither Controls</DrawerTitle>
                    <DitherControls
                      ditherType={ditherType}
                      setDitherType={setDitherType}
                      setImageSrc={setImageSrc}
                    />
                  </div>
                </DrawerContent>
              </Drawer>
              <div className="absolute bottom-4 left-6 z-20">
                <SavedImagesDialog />
              </div>
            </div>
          )}
        </div>
        {ditheredSource && (
          <PrintOutImage
            onSave={() => setIsSavedImagesOpen(true)}
            key={ditheredSource}
            ditheredSource={ditheredSource}
          />
        )}
      </div>
      <canvas ref={canvasRef} className="relative hidden"></canvas>
    </div>
  );
};

export default Dither;
