import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <div className="group mx-auto flex max-w-screen-xl px-4 pt-6">
      <Link href="/" className="flex items-center gap-4">
        <Image
          width={60}
          height={60}
          alt="My doodled face"
          src="/images/Smile2.svg"
        />
        <p className="font-serif text-4xl text-blue-800 group-hover:underline">
          {" "}
          Ethan Grebmeier{" "}
        </p>
      </Link>
    </div>
  );
};

export default Header;
