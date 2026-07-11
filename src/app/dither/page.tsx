export const metadata = {
  title: "Dither — Ethan Grebmeier",
  description: "Create two-color dithered images in your browser.",
};

import Header from "~/components/header";
import Dither from "~/components/dither";

export default async function Page() {
  return (
    <div className="mx-auto flex min-h-[100svh] max-w-screen-2xl flex-col items-start gap-3 p-3 sm:p-4 lg:h-[100svh] lg:min-h-0">
      <Header />
      <Dither />
    </div>
  );
}
