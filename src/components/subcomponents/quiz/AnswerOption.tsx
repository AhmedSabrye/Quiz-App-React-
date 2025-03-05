import React from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

interface AnswerOptionProps {
  answer: string;
  isCorrect: boolean;
  isSelected: boolean;
  isAnswerSubmitted: boolean;
  showCorrect: boolean;
  onSelect: () => void;
  index?: number;
}

const AnswerOption: React.FC<AnswerOptionProps> = ({
  answer,
  isCorrect,
  isSelected,
  isAnswerSubmitted,
  showCorrect,
  onSelect,
  index = 0,
}) => {
  const getBackgroundClass = () => {
    if (!isAnswerSubmitted) {
      return isSelected
        ? "bg-indigo-100 border-indigo-300"
        : "bg-white hover:bg-gray-50";
    }

    if (isSelected && isCorrect) {
      return "bg-green-100 border-green-300";
    } else if (isSelected && !isCorrect) {
      return "bg-red-100 border-red-300";
    } else if (showCorrect && isCorrect) {
      return "bg-green-50 border-green-200";
    }

    return "bg-white opacity-60";
  };

  const getIconClass = () => {
    if (!isAnswerSubmitted) return "";

    if (isSelected && isCorrect) {
      return <FaCheck className="text-green-500 text-lg" />;
    } else if (isSelected && !isCorrect) {
      return <FaTimes className="text-red-500 text-lg" />;
    } else if (showCorrect && isCorrect) {
      return <FaCheck className="text-green-400 text-lg opacity-70" />;
    }

    return "";
  };

  const letterOptions = ["A", "B", "C", "D", "E", "F"];

  return (
    <button
      onClick={onSelect}
      disabled={isAnswerSubmitted}
      className={`relative w-full p-4 border rounded-lg mb-3 text-left transition-all duration-200 
        ${getBackgroundClass()}
        ${
          !isAnswerSubmitted && !isSelected
            ? "hover:shadow-md transform hover:-translate-y-0.5"
            : ""
        }
        ${isAnswerSubmitted && !isSelected ? "cursor-default" : ""}
      `}
    >
      <div className="flex items-center">
        <div
          className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full mr-3
          ${
            isSelected
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-700"
          }
        `}
        >
          {letterOptions[index] || ""}
        </div>

        <span className="flex-grow font-medium">{answer}</span>

        <span className="flex-shrink-0 ml-2">{getIconClass()}</span>
      </div>
    </button>
  );
};

export default AnswerOption;
