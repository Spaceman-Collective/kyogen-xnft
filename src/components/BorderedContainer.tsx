import Image from "next/image";

import BorderVertical from "../../public/kyogen-border-vertical.svg"
import BorderHorizontal from "../../public/kyogen-border-horizontal.svg"

import styles from '@/components/BorderedContainer.module.css'

export const BorderedContainer = ({
  children,
  className,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={`${styles.container} ${className ? className : className}`}>
      {children}
    </div>

    // TODO: Figure out which variant of "imaged-border" implementation we're going to keep
    //
    // <div className={`relative ${className ? className : ""}`}>
    //   {children}
    //   <div className="absolute inset-0 w-auto max-w-auto h-fit object-cover -top-2">
    //     <Image src={BorderHorizontal} alt="Top Border" />
    //   </div>

    //   <div className="absolute left-0 w-auto max-w-auto h-fit object-cover -bottom-2">
    //     <Image src={BorderHorizontal}  alt="Bottom Border" />
    //   </div>

    //   <div className="absolute h-auto max-h-full object-cover -right-3 -top-3">
    //     <Image src={BorderVertical} alt="Left Border" />
    //   </div>

    //   <div className="absolute h-auto max-h-full object-cover -left-3 -top-3">
    //     <Image src={BorderVertical}  alt="Right Border" />
    //   </div>
    // </div>
  );
};
