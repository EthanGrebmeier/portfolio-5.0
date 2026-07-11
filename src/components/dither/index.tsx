"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";

import { DEFAULT_DITHER_SETTINGS, ditherSettingsAtom } from "./atom";
import CanvasWorkspace from "./canvas-workspace";
import DitherControls from "./dither-controls";
import { renderFullResolution, renderPreview } from "./renderer";

const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

type SourceImage = {
  url: string;
  name: string;
  version: number;
};

const Dither = () => {
  const [settings, setSettings] = useAtom(ditherSettingsAtom);
  const [source, setSource] = useState<SourceImage>();
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [showOriginal, setShowOriginal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string>();

  const bitmapRef = useRef<ImageBitmap>();
  const sourceUrlRef = useRef<string>();
  const previewUrlRef = useRef<string>();
  const loadRequestRef = useRef(0);

  const installImage = useCallback(
    async (blob: Blob, name: string, requestId = ++loadRequestRef.current) => {
      try {
        const bitmap = await createImageBitmap(blob);
        if (requestId !== loadRequestRef.current) {
          bitmap.close();
          return;
        }

        const url = URL.createObjectURL(blob);
        bitmapRef.current?.close();
        if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);

        bitmapRef.current = bitmap;
        sourceUrlRef.current = url;
        setSource({ url, name, version: requestId });
        setShowOriginal(false);
        setError(undefined);
      } catch {
        if (requestId === loadRequestRef.current) {
          setError("This image could not be opened.");
        }
      }
    },
    [],
  );

  useEffect(() => {
    const requestId = ++loadRequestRef.current;
    let active = true;
    const image = new Image();
    image.decoding = "async";
    image.src = "/images/monalisa.jpg";

    void image
      .decode()
      .then(() => createImageBitmap(image))
      .then((bitmap) => {
        if (!active || requestId !== loadRequestRef.current) {
          bitmap.close();
          return;
        }

        bitmapRef.current?.close();
        bitmapRef.current = bitmap;
        setSource({
          url: "/images/monalisa.jpg",
          name: "monalisa.jpg",
          version: requestId,
        });
        setError(undefined);
      })
      .catch(() => {
        if (active && requestId === loadRequestRef.current) {
          setError("The sample image could not be opened.");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!source || !bitmapRef.current) return;

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      const bitmap = bitmapRef.current;
      if (!bitmap) return;

      setIsProcessing(true);
      setError(undefined);
      void renderPreview(bitmap, settings, controller.signal)
        .then((blob) => {
          if (controller.signal.aborted) return;
          const url = URL.createObjectURL(blob);
          if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
          }
          previewUrlRef.current = url;
          setPreviewUrl(url);
        })
        .catch((renderError: unknown) => {
          if (
            renderError instanceof DOMException &&
            renderError.name === "AbortError"
          ) {
            return;
          }
          setError(
            renderError instanceof Error
              ? renderError.message
              : "The preview could not be rendered.",
          );
        })
        .finally(() => {
          if (!controller.signal.aborted) setIsProcessing(false);
        });
    }, 90);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [settings, source]);

  useEffect(
    () => () => {
      bitmapRef.current?.close();
      if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    },
    [],
  );

  const openFile = (file: File) => {
    if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
      setError("Choose a PNG, JPEG, or WebP image.");
      return;
    }
    void installImage(file, file.name);
  };

  const download = async () => {
    const bitmap = bitmapRef.current;
    if (!bitmap || !source) return;

    setIsExporting(true);
    setError(undefined);
    try {
      const blob = await renderFullResolution(bitmap, settings);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const baseName = source.name.replace(/\.[^.]+$/, "") || "image";
      link.href = url;
      link.download = `${baseName}-dither.png`;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (exportError) {
      setError(
        exportError instanceof Error
          ? exportError.message
          : "The PNG could not be rendered.",
      );
    } finally {
      setIsExporting(false);
    }
  };

  const controls = (idPrefix: string) => (
    <DitherControls
      idPrefix={idPrefix}
      settings={settings}
      onChange={setSettings}
      onReset={() => setSettings({ ...DEFAULT_DITHER_SETTINGS })}
    />
  );

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
      <div className="relative flex flex-col lg:min-h-0 lg:flex-1 lg:flex-row lg:overflow-hidden">
        <div className="flex h-[60svh] min-h-80 shrink-0 lg:h-auto lg:min-h-0 lg:min-w-0 lg:flex-1">
          <CanvasWorkspace
            sourceUrl={source?.url}
            previewUrl={previewUrl}
            fileName={source?.name ?? "image"}
            showOriginal={showOriginal}
            onShowOriginalChange={setShowOriginal}
            isProcessing={isProcessing}
            error={error}
            onDropFile={openFile}
            onDownload={() => void download()}
            isExporting={isExporting}
            canDownload={Boolean(previewUrl)}
          />
        </div>

        <aside className="hidden w-80 shrink-0 overflow-y-auto border-l border-slate-200 bg-white p-5 lg:block">
          {controls("desktop-dither")}
        </aside>

        <section
          className="border-t border-slate-200 bg-white p-5 lg:hidden"
          aria-label="Dither adjustments"
        >
          {controls("mobile-dither")}
        </section>
      </div>

      <input
        id="dither-image-upload"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        aria-label="Open image"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) openFile(file);
          event.target.value = "";
        }}
      />
    </div>
  );
};

export default Dither;
