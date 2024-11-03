import { Afacad } from "next/font/google";
import localFont from "next/font/local";
import { Provider } from "jotai";

import "../styles/globals.css";
import { MotionConfig } from "framer-motion";
import QueryClientWrapper from "~/components/query-client";

const bodyFont = Afacad({
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
});

const junicode = localFont({
  src: [
    {
      path: "../../public/fonts/Junicode.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Junicode-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-serif",
});

export const metadata = {
  title: "Ethan Grebmeier",
  description: "Ethan Grebmeier's portfolio",
};

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" translate="no">
      <Provider>
        <QueryClientWrapper>
          <MotionConfig reducedMotion="user">
            <body
              className={`${bodyFont.className} ${junicode.variable} overflow-x-hidden`}
            >
              {children}
            </body>
          </MotionConfig>
        </QueryClientWrapper>
      </Provider>
    </html>
  );
}
