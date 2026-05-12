import Image from "next/image";
import Link from "next/link";
import CardStack from "~/components/card-stack";
import CardTooltip from "~/components/card-stack/card-tooltip";
import Contact from "~/components/home/contact";
import { cn } from "~/helpers/cn";

export default async function Page() {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-[640px] flex-col items-center bg-background",
      )}
    >
      <div
        className="flex w-full flex-col justify-between gap-8 py-6 "
        style={
          {
            "--spacing": "48px",
          } as React.CSSProperties
        }
      >
        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full flex-1 flex-col gap-2 px-4 pb-6 pt-8 md:px-16 lg:px-0">
            <div className="flex w-full flex-1 flex-col gap-6 rounded-3xl font-serif text-xl text-blue-700">
              <h1 className="mb-4 font-serif text-4xl tracking-tight text-blue-700 ">
                Ethan Grebmeier
              </h1>
              <p className="text-pretty">
                Hello there! I am a{" "}
                <span className="italic"> Full Stack Developer </span>
                based out of beautiful Seattle, Washington
                <Image
                  className="ml-1 inline"
                  width={24}
                  height={24}
                  alt="Raining animation"
                  src="/images/rainanimated.gif"
                />
                {" "} I am passionate about making the web a{" "}
                <span className="italic"> joyful </span>place.{" "}
                <Image
                  className="inline"
                  width={24}
                  height={24}
                  alt="Smiling animation"
                  src="/images/smileanimated.gif"
                />
              </p>
              <p className="text-pretty">
                
              </p>
              <div className="flex flex-1 flex-col gap-12">
                <p>Here are some personal projects that I&apos;m proud of:</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-full py-4 max-sm:px-4">
          <CardStack />
          <CardTooltip />
        </div>
        <div className="flex items-center justify-between gap-2 px-4 md:px-8">
          <Contact />
          <div>
            <Link href="https://github.com/ethangrebmeier">
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
