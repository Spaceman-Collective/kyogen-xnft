export const PrimaryButton = ({
  className,
  disabled,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      disabled={disabled}
      // TODO figure out how to add the inset shadow-[inset_0_-10px_0px_rgba(0,0,0,0.25)]
      className={`bg-kyogen-primary h-[57px] rounded-[50px] border-[3px] border-black shadow-[4px_4px_0] shadow-[#14161B] font-millimetre font-bold uppercase px-5 py-2 ${
        className ? className : ""
      } ${
        disabled
          ? "bg-kyogen-primary-disabled text-kyogen-disabled"
          : "hover:text-black hover:bg-kyogen-primary-light active:shadow-none active:text-white"
      }`}
      {...props}
    />
  );
};
