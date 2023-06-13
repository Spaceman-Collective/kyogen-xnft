import Image from "next/image";
import BackButtonIcon from 'public/icons/back_icon_square.svg'

interface BackButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /* custom props here */
}

export const BackButton = ({
  children,
  className,
  ...props
}: BackButtonProps) => {
  return (
    <button {...props} className='flex text-white/60  border- font-millimetre justify-center items-center gap-x-2'>
      <Image src={BackButtonIcon} alt='Back Button' width={16} height={16}></Image>
      {children}
    </button>
  );
}