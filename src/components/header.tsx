import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <div className="group flex max-w-screen-xl">
      <Link href="/" className="flex items-center gap-4">
        <Image
          width={60}
          height={60}
          alt="My doodled face"
          src="/images/smileanimated.gif"
        />
        <p className="font-serif text-4xl tracking-tight text-blue-700 group-hover:underline">
          {" "}
          Ethan Grebmeier{" "}
        </p>
      </Link>
    </div>
  );
};

export default Header;
