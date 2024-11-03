import Image from "next/image";
import Arrow from "~/components/home/arrow";
import Contact from "~/components/home/contact";
import FullscreenColumn from "~/components/home/fullscreen-column";
import Showcase from "~/components/home/showcase";
import RainIcon from "~/components/svg/rain";
import SmileIcon from "~/components/svg/smile";
import { Button } from "~/components/ui/button";
import { cn } from "~/helpers/cn";

export default async function Page() {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-screen-2xl flex-col items-center bg-background",
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
          <div className="flex w-full flex-1 flex-col gap-2 px-0 pb-6 pt-8 sm:px-8">
            <div className="flex w-full flex-1 flex-col gap-6 rounded-3xl font-serif text-xl text-blue-700">
              <h1 className="mb-4 font-serif text-6xl tracking-tight text-blue-700 sm:text-7xl">
                Ethan Grebmeier
              </h1>
              <p className="text-pretty">
                Hello there, my name is Ethan Grebmeier and I am a{" "}
                <span className="italic"> Design Engineer </span>
                based out of beautiful Seattle, Washington.
                <Image
                  className="ml-1 inline"
                  width={24}
                  height={24}
                  alt="Raining animation"
                  src="/images/rainanimated.gif"
                />
              </p>
              <p className="text-pretty">
                I am passionate about making the web a{" "}
                <span className="italic"> joyful </span>place.{" "}
                <Image
                  className="inline"
                  width={24}
                  height={24}
                  alt="Smiling animation"
                  src="/images/smileanimated.gif"
                />
              </p>
              <div className="flex flex-1 flex-col gap-12">
                <p>Here&apos;s some work that I&apos;m proud of</p>
                <div className="flex flex-1">
                  <Arrow />
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <Contact />
            </div>
          </div>
        </div>

        <FullscreenColumn className="relative flex w-full overflow-hidden">
          <Showcase />
        </FullscreenColumn>
        <div className="block lg:hidden">
          <Contact />
        </div>
      </div>
    </div>
  );
}
