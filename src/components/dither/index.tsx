"use client";

import React, { useEffect } from "react";

import PrintOutImage from "./print-out-image";
import DitherControls from "./dither-controls";
import { useMediaQuery } from "usehooks-ts";

import { useAtom } from "jotai";
import { ditherColorOneAtom, ditherColorTwoAtom } from "./atom";
import type { DitherType, RGBA } from "./types";
import { ditherTypes, getRgbaFromHex } from "~/lib/dither";
import SavedImagesDialog from "./saved-images-dialog";
import { Image as ImageIcon } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Button } from "../ui/button";

const Dither = () => {
  const [imageSrc, setImageSrc] = React.useState<string>(
    "/images/monalisa.jpg",
  );
  const [ditherType, setDitherType] = React.useState<DitherType>("fsb");
  const [ditheredSource, setDitheredSource] = React.useState<string>();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const offScreenCanvasRef = React.useRef<HTMLCanvasElement>(null);
  const [ditherColorOne] = useAtom(ditherColorOneAtom);
  const [ditherColorTwo] = useAtom(ditherColorTwoAtom);

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

  const width = React.useMemo(() => window.innerWidth, []);
  const height = React.useMemo(() => window.innerHeight, []);

  useEffect(() => {
    if (!canvasRef.current || !offScreenCanvasRef.current) return;
    canvasRef.current.width = width;
    canvasRef.current.height = height;
    offScreenCanvasRef.current.width = width;
    offScreenCanvasRef.current.height = height;
  }, [height, width]);

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
    <div className="flex w-full flex-1 flex-col justify-center lg:items-center">
      <div className="flex w-full flex-1 flex-col items-center gap-4 p-2 lg:flex-row">
        <div className="flex flex-col gap-4">
          <div className="flex max-w-[440px] flex-col gap-2">
            <h1 className="font-serif text-2xl text-blue-700">Dither</h1>
            <p className="text-base text-blue-700">
              According to Wikipedia, Dither is an intentionally applied form of
              noise used to randomize quantization error, preventing large-scale
              patterns such as color banding in images. Dither is routinely used
              in processing of both digital audio and video data, and is often
              one of the last stages of mastering audio to a CD.{" "}
              <a
                href="https://en.wikipedia.org/wiki/Dither"
                className="text-blue-700 underline"
              >
                Learn more
              </a>
            </p>
            <p className="text-base text-blue-700">
              This tool allows you to dither your own images with either
              Floyd-Steinberg or Ordered Dithering.
            </p>

            <p className="text-base font-bold text-blue-700">
              Select &quot;Dither Image&quot; to get started.
            </p>
          </div>
          {isDesktop ? (
            <div className="flex max-w-[240px] flex-col gap-12 py-2">
              <div className="flex flex-col gap-2">
                <p className="text-xl">Controls</p>
                <div className="h-fit w-[240px] transition-all">
                  <DitherControls
                    ditherType={ditherType}
                    setDitherType={setDitherType}
                    setImageSrc={setImageSrc}
                  />
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex justify-between gap-2">
                  <p className="text-xl"> Saved Images</p>
                </div>
                <SavedImagesDialog />
              </div>
            </div>
          ) : (
            <div className="flex gap-4">
              <Drawer repositionInputs={false}>
                <div className="fixed bottom-8 right-6 z-20">
                  <DrawerTrigger asChild>
                    <Button className="flex items-center gap-2">
                      Dither Image
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
              <div className="fixed bottom-4 left-6 z-20">
                <SavedImagesDialog />
              </div>
            </div>
          )}
        </div>
        {ditheredSource && (
          <PrintOutImage key={ditheredSource} ditheredSource={ditheredSource} />
        )}
      </div>
      <canvas ref={canvasRef} className="relative hidden"></canvas>
    </div>
  );
};

export default Dither;
