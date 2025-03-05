import React from "react";

interface RadioOptionProps {
  id: string;
  name: string;
  defaultChecked?: boolean;
  onChange: () => void;
  label: string;
  color: string;
}

const RadioOption: React.FC<RadioOptionProps> = ({
  id,
  name,
  defaultChecked,
  onChange,
  label,
  color,
}) => {
  const getColorClass = (color: string) => {
    switch (color) {
      case "green":
        return "border-green-400 peer-checked:bg-green-400";
      case "blue":
        return "border-blue-400 peer-checked:bg-blue-400";
      case "yellow":
        return "border-yellow-400 peer-checked:bg-yellow-400";
      case "red":
        return "border-red-400 peer-checked:bg-red-400";
      case "purple":
        return "border-purple-400 peer-checked:bg-purple-400";
      case "indigo":
        return "border-indigo-400 peer-checked:bg-indigo-400";
      default:
        return "border-gray-400 peer-checked:bg-gray-400";
    }
  };

  return (
    <div className="flex items-center justify-center mb-3 pl-5 relative">
      <input
        id={id}
        type="radio"
        name={name}
        defaultChecked={defaultChecked}
        onChange={onChange}
        className="peer hidden"
      />
      <label
        htmlFor={id}
        className="flex items-center cursor-pointer text-sm font-medium text-gray-700 peer-checked:font-semibold peer-checked:text-indigo-600"
      >
        {label}
      </label>
        <span
          className={`w-4 h-4 absolute top-1/2 -translate-y-1/2 left-0 flex-shrink-0 border rounded-full flex items-center justify-center ${getColorClass(
            color
          )}`}
        >
        </span>
    </div>
  );
};

export default RadioOption;
