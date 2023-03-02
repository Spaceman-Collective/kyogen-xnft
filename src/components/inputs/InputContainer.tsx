export const InputContainer = ({
  children,
  className,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={`flex flex-col bg-[#FBF2D8] border-4 border-[#15171C] shadow-[0_4px_0px_0px] shadow-[#15171C] py-10 px-[60px] rounded-[20px] ${
        className ? className : ""
      }`}
    >
      {children}
    </div>
  );
};
