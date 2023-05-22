import { useState } from "react";

interface RadioButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
  selectedValue?: string;
}

export const RadioButton = ({
  selectedValue,
  children,
  className,
  ...props
}: RadioButtonProps) => {
  return (
    <div>
      <label className="flex gap-x-1">
        <input
          type="radio"
          checked={selectedValue === props.value}
          className={`${className ? className : ""}`} //TODO figure out how to style the radio button
          {...props}
        />
        <div className="text-black font-millimetre">{children}</div>
      </label>
    </div>
  );
};

interface RadioButtonGroupProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  buttons?: any[];
}

export const RadioButtonGroup = ({
  buttons,
  children,
  className,
  ...props
}: RadioButtonGroupProps) => {
  const [selectedValue, setSelectedValue] = useState("");

  const handleChange = (event: any) => {
    setSelectedValue(event.target.value);
  };

  return (
    <div
      className={`flex justify-between items-center ${
        className ? className : ""
      }`}
    >
      {buttons?.map((radioButton) => (
        <RadioButton
          key={1}
          value={radioButton.value}
          onChange={handleChange}
          selectedValue={selectedValue}
        >
          {radioButton.label}
        </RadioButton>
      ))}
    </div>
  );
};

