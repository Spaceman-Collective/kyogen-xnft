import React from "react";

export const ContainerTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p
      className={`text-center uppercase font-millimetre text-title font-outline-3 outline-none ${
        className ?? ""
      }`}
    >
      {children}
    </p>
  );
};
