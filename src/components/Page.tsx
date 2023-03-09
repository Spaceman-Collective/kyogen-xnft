import React from "react";
import Image from "next/image";

import KyogenLogo from "../../public/kyogen-logo.svg";

const Page = ({ children, title }: { children: React.ReactNode, title: string }) => {
  return (
    <div className="font-millimetre bg-kyogen-fund-bg min-h-screen min-w-screen">
      <Image
        src={KyogenLogo}
        alt="Kyogen Clash"
        className="mt-10 ml-10 absolute"
      />
      <div className="flex justify-center">
        <p className="text-center mt-36 font-extrabold text-[#FF3D46] text-4xl">
          {title}
        </p>
      </div>
      {children}
    </div>
  );
};

export default Page;
