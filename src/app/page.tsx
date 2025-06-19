import Image from "next/image";
import Link from "next/link";
import CardStack from "~/components/card-stack";
import Arrow from "~/components/home/arrow";
import Contact from "~/components/home/contact";
import FullscreenColumn from "~/components/home/fullscreen-column";
import Showcase from "~/components/home/showcase";
import { cn } from "~/helpers/cn";

export default async function Page() {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-[640px] flex-col items-center bg-background lg:max-w-screen-2xl",
      )}
    >
      <div
        className="flex w-full flex-col justify-between gap-12 py-6 lg:flex-row lg:px-8"
        style={
          {
            "--spacing": "48px",
          } as React.CSSProperties
        }
      >
        <div className="flex w-full flex-col gap-4 lg:h-[calc(100svh-48px)] lg:w-2/5">
          <div className="flex w-full flex-1 flex-col gap-2 px-4 pb-6 pt-8 md:px-16 lg:px-0">
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
                <div className="hidden flex-1 lg:flex">
                  <Arrow />
                </div>
              </div>
            </div>
            <div className="hidden items-center justify-between lg:flex">
              <Contact />
              <div>
                <Link href="https://github.com/ethangrebmeier">
                  <Image
                    width={32}
                    height={32}
                    alt="Github logo"
                    src="/images/github-mark.svg"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <FullscreenColumn className="relative flex w-full overflow-visible">
          <div className="relative h-full w-full flex-1">
            <CardStack />
          </div>
        </FullscreenColumn>
        <div className="flex items-center justify-between gap-2 px-4 md:px-8 lg:hidden">
          <Contact />
          <div>
            <Link href="https://github.com/ethan-grebmeier">
              <Image
                width={44}
                height={44}
                alt="Github logo"
                src="/images/github-mark.svg"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
