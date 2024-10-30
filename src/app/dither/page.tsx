export const metadata = {
  title: "Ethan Grebmeier",
};

import dynamic from "next/dynamic";
import { Rubik_Pixels } from "next/font/google";
import Header from "~/components/header";

const Dither = dynamic(() => import("~/components/dither"), {
  ssr: false,
});

export default async function Page() {
  return (
    <div className="mx-auto flex h-[100svh] max-w-screen-xl flex-col items-start justify-start gap-2 p-4">
      <Header />
      <Dither />
    </div>
  );
}
