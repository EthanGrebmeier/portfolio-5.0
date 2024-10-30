import { ArrowRight, Scroll } from "lucide-react";
import { Afacad } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import FullscreenColumn from "~/components/home/fullscreen-column";
import Showcase from "~/components/home/showcase";
import { cn } from "~/helpers/cn";

const font = Afacad({
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
});

export default async function Page() {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center bg-background",
        font.className,
      )}
    >
      {/* <div className="mb-4 flex  items-center rounded-xl bg-white px-4 py-2">
        <h1 className="text-2xl font-bold">Fillaneed</h1>
      </div> */}
      <div
        className="flex w-full flex-col justify-between gap-6 px-6 py-6 lg:flex-row"
        style={
          {
            "--spacing": "48px",
          } as React.CSSProperties
        }
      >
        <div className="flex w-full flex-col gap-4 lg:h-[calc(100svh-48px)] lg:w-2/5">
          <div className="flex h-[70%] w-full flex-col gap-6 rounded-3xl p-8 px-0 font-serif text-xl text-blue-700 lg:px-8">
            <h1 className="mb-4 font-serif text-5xl text-blue-700 md:text-7xl">
              Ethan Grebmeier
            </h1>
            <p className="text-pretty font-serif text-blue-700">
              Hello there, my name is Ethan Grebmeier and I am a{" "}
              <span className="italic"> Design Engineer </span>
              based out of Seattle, Washington.
            </p>
            <p>
              I am passionate about making the web a{" "}
              <span className="italic"> joyful </span>place.{" "}
            </p>
          </div>
        </div>

        <Showcase />
      </div>
    </div>
  );
}
