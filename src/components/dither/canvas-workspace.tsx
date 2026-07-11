"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Download,
  FolderOpen,
  ImagePlus,
  LoaderCircle,
  Minus,
  Plus,
  Scan,
} from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "../ui/button";

type CanvasWorkspaceProps = {
  sourceUrl?: string;
  previewUrl?: string;
  fileName: string;
  showOriginal: boolean;
  onShowOriginalChange: (showOriginal: boolean) => void;
  isProcessing: boolean;
  error?: string;
  onDropFile: (file: File) => void;
  onDownload: () => void;
  isExporting: boolean;
  canDownload: boolean;
};

type Size = {
  width: number;
  height: number;
};

type ZoomAnchor = {
  x: number;
  y: number;
};

const clampZoom = (zoom: number) => Math.min(3, Math.max(0.25, zoom));

const CanvasWorkspace = ({
  sourceUrl,
  previewUrl,
  fileName,
  showOriginal,
  onShowOriginalChange,
  isProcessing,
  error,
  onDropFile,
  onDownload,
  isExporting,
  canDownload,
}: CanvasWorkspaceProps) => {
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [viewportSize, setViewportSize] = useState<Size>({
    width: 0,
    height: 0,
  });
  const [imageSize, setImageSize] = useState<Size>();
  const [isDesktop, setIsDesktop] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const pendingZoomAnchorRef = useRef<ZoomAnchor | undefined>(undefined);
  const displayedUrl = showOriginal ? sourceUrl : (previewUrl ?? sourceUrl);

  const horizontalPadding = isDesktop ? 80 : 48;
  const verticalPadding = isDesktop ? 80 : 48;
  const fitScale = imageSize
    ? Math.min(
        1,
        Math.max(1, viewportSize.width - horizontalPadding) / imageSize.width,
        Math.max(1, viewportSize.height - verticalPadding) / imageSize.height,
      )
    : 1;
  const renderedImageWidth = imageSize
    ? imageSize.width * fitScale * zoom
    : undefined;
  const renderedImageHeight = imageSize
    ? imageSize.height * fitScale * zoom
    : undefined;

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      setViewportSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateLayout = () => setIsDesktop(mediaQuery.matches);
    updateLayout();
    mediaQuery.addEventListener("change", updateLayout);
    return () => mediaQuery.removeEventListener("change", updateLayout);
  }, []);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const anchor = pendingZoomAnchorRef.current;
    if (
      !viewport ||
      !anchor ||
      renderedImageWidth === undefined ||
      renderedImageHeight === undefined
    ) {
      return;
    }

    viewport.scrollLeft =
      (viewport.scrollWidth - renderedImageWidth) / 2 +
      anchor.x * renderedImageWidth -
      viewport.clientWidth / 2;
    viewport.scrollTop =
      (viewport.scrollHeight - renderedImageHeight) / 2 +
      anchor.y * renderedImageHeight -
      viewport.clientHeight / 2;
    pendingZoomAnchorRef.current = undefined;
  }, [renderedImageHeight, renderedImageWidth, sourceUrl, zoom]);

  const changeZoom = useCallback(
    (change: number | "reset") => {
      const viewport = viewportRef.current;
      if (
        viewport &&
        renderedImageWidth !== undefined &&
        renderedImageHeight !== undefined
      ) {
        const imageLeft = (viewport.scrollWidth - renderedImageWidth) / 2;
        const imageTop = (viewport.scrollHeight - renderedImageHeight) / 2;
        pendingZoomAnchorRef.current = {
          x:
            (viewport.scrollLeft + viewport.clientWidth / 2 - imageLeft) /
            renderedImageWidth,
          y:
            (viewport.scrollTop + viewport.clientHeight / 2 - imageTop) /
            renderedImageHeight,
        };
      }
      setZoom((current) =>
        change === "reset" ? 1 : clampZoom(current + change),
      );
    },
    [renderedImageHeight, renderedImageWidth],
  );

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const handleWheel = (event: WheelEvent) => {
      if (!displayedUrl) return;
      event.preventDefault();
      changeZoom(event.deltaY > 0 ? -0.1 : 0.1);
    };

    viewport.addEventListener("wheel", handleWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", handleWheel);
  }, [changeZoom, displayedUrl]);

  return (
    <main
      className="relative min-h-0 flex-1 overflow-hidden bg-slate-100"
      onDragEnter={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
      }}
      onDragLeave={(event) => {
        if (event.currentTarget.contains(event.relatedTarget as Node)) return;
        setIsDragging(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        const file = event.dataTransfer.files[0];
        if (file) onDropFile(file);
      }}
    >
      <div
        ref={viewportRef}
        className="size-full overflow-auto overscroll-contain"
      >
        <div
          className="flex items-center justify-center p-6 lg:p-10"
          style={{
            width:
              renderedImageWidth !== undefined
                ? `${Math.max(
                    viewportSize.width,
                    renderedImageWidth + horizontalPadding,
                  )}px`
                : "100%",
            height:
              renderedImageHeight !== undefined
                ? `${Math.max(
                    viewportSize.height,
                    renderedImageHeight + verticalPadding,
                  )}px`
                : "100%",
          }}
        >
          {displayedUrl ? (
            // The editor renders object URLs generated at runtime, which Next/Image cannot optimize.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={displayedUrl}
              alt={`${showOriginal ? "Original" : "Dithered"} ${fileName}`}
              draggable={false}
              className={cn(
                "max-w-none select-none object-contain shadow-[0_18px_50px_rgba(15,23,42,0.18)] transition-opacity",
                isProcessing && !showOriginal && "opacity-70",
              )}
              style={{
                width: renderedImageWidth,
                height: renderedImageHeight,
              }}
              onLoad={(event) => {
                setImageSize({
                  width: event.currentTarget.naturalWidth,
                  height: event.currentTarget.naturalHeight,
                });
              }}
            />
          ) : (
            <LoaderCircle className="size-7 animate-spin text-blue-700" />
          )}
        </div>
      </div>

      <div className="absolute left-3 top-3 z-10 flex w-fit gap-1.5">
        <Button
          asChild
          variant="outline"
          size="xs"
          className="cursor-pointer bg-white/95 shadow-sm backdrop-blur"
        >
          <label htmlFor="dither-image-upload">
            <FolderOpen />
            <span className="hidden md:block">Open image</span>
          </label>
        </Button>

        <Button
          type="button"
          size="xs"
          className="shadow-sm"
          onClick={onDownload}
          disabled={!canDownload || isExporting}
        >
          {isExporting ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <Download />
          )}
          <span className="hidden md:block">
            {isExporting ? "Rendering" : "Download PNG"}
          </span>
        </Button>
      </div>

      <div className="absolute right-3 top-3 z-10 flex w-fit rounded-full border border-slate-200 bg-white/95 p-1 shadow-sm backdrop-blur">
        <button
          type="button"
          onClick={() => onShowOriginalChange(true)}
          className={cn(
            "rounded-full px-2.5 py-1 text-xs",
            showOriginal ? "bg-slate-100 text-blue-700" : "text-slate-500",
          )}
          aria-pressed={showOriginal}
        >
          Original
        </button>
        <button
          type="button"
          onClick={() => onShowOriginalChange(false)}
          className={cn(
            "rounded-full px-2.5 py-1 text-xs",
            !showOriginal ? "bg-slate-100 text-blue-700" : "text-slate-500",
          )}
          aria-pressed={!showOriginal}
        >
          Dithered
        </button>
      </div>

      {isProcessing && !showOriginal ? (
        <div className="absolute right-3 top-14 z-10 flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-xs text-slate-500 shadow-sm backdrop-blur">
          <LoaderCircle className="size-3.5 animate-spin" />
          Processing
        </div>
      ) : null}

      {error ? (
        <div
          role="alert"
          className="absolute left-1/2 top-24 z-10 w-fit max-w-[calc(100%-2rem)] -translate-x-1/2 rounded-full bg-red-50 px-3 py-1.5 text-xs text-red-700 shadow-sm sm:top-14"
        >
          {error}
        </div>
      ) : null}

      <div className="absolute bottom-3 left-1/2 z-10 flex w-fit -translate-x-1/2 items-center rounded-full border border-slate-200 bg-white/95 p-1 shadow-lg backdrop-blur">
        <button
          type="button"
          onClick={() => changeZoom(-0.1)}
          className="flex size-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          aria-label="Zoom out"
        >
          <Minus size={15} />
        </button>
        <button
          type="button"
          onClick={() => changeZoom("reset")}
          className="flex min-w-16 items-center justify-center gap-1.5 rounded-full px-2 py-1 text-xs tabular-nums text-slate-600 hover:bg-slate-100"
          aria-label="Fit image"
        >
          <Scan size={14} />
          {Math.round(zoom * 100)}%
        </button>
        <button
          type="button"
          onClick={() => changeZoom(0.1)}
          className="flex size-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          aria-label="Zoom in"
        >
          <Plus size={15} />
        </button>
      </div>

      {isDragging ? (
        <div className="pointer-events-none absolute inset-3 z-20 flex items-center justify-center rounded-2xl border-2 border-dashed border-blue-700 bg-blue-50/95 text-blue-700 backdrop-blur">
          <div className="flex items-center gap-3 font-medium">
            <ImagePlus />
            Drop image to open
          </div>
        </div>
      ) : null}
    </main>
  );
};

export default CanvasWorkspace;
