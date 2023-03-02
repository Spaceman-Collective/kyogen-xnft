export const TextInput = ({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      type="text"
      className={`bg-white text-black border-2 border-kyogen-border rounded-[5px] ${
        className ? className : ""
      }`}
      {...props}
    />
  );
};
