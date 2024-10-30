import { Afacad } from "next/font/google";

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
        "mx-auto flex w-full max-w-screen-2xl flex-col items-center bg-background",
        font.className,
      )}
    >
      <div
        className="flex w-full flex-col justify-between gap-6 px-6 py-6 lg:flex-row"
        style={
          {
            "--spacing": "48px",
          } as React.CSSProperties
        }
      >
        <div className="flex w-full flex-col gap-4 lg:h-[calc(100svh-48px)] lg:w-2/5">
          <div className="flex h-[70%] w-full flex-col gap-6 rounded-3xl p-8 px-0 font-serif text-xl text-blue-700 sm:px-8">
            <h1 className="mb-4 font-serif text-6xl text-blue-700 sm:text-7xl">
              Ethan Grebmeier
            </h1>
            <p className="text-pretty">
              Hello there, my name is Ethan Grebmeier and I am a{" "}
              <span className="italic"> Design Engineer </span>
              based out of Seattle, Washington.
            </p>
            <p className="text-pretty">
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
