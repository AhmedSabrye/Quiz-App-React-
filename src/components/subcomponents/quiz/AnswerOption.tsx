import React from "react";
import { FaCheck, FaTimes, FaCheckSquare, FaRegSquare } from "react-icons/fa";

interface AnswerOptionProps {
  answer: string;
  isCorrect: boolean;
  isSelected: boolean;
  isAnswerSubmitted: boolean;
  showCorrect: boolean;
  onSelect: () => void;
  index?: number;
  isMultipleChoice?: boolean;
}

const AnswerOption: React.FC<AnswerOptionProps> = ({
  answer,
  isCorrect,
  isSelected,
  isAnswerSubmitted,
  showCorrect,
  onSelect,
  index = 0,
  isMultipleChoice = false,
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

  const getSelectionIndicator = () => {
    if (isMultipleChoice) {
      // For multiple choice questions, show checkbox style indicators
      return isSelected ? (
        <FaCheckSquare
          className={`text-indigo-600 text-lg ${
            isAnswerSubmitted ? "opacity-70" : ""
          }`}
        />
      ) : (
        <FaRegSquare className="text-gray-400 text-lg" />
      );
    } else {
      // For single answer questions, use the letter indicators
      const letterOptions = ["A", "B", "C", "D", "E", "F"];
      return letterOptions[index] || "";
    }
  };

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
      aria-checked={isSelected}
      role={isMultipleChoice ? "checkbox" : "radio"}
    >
      <div className="flex items-center">
        <div
          className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full mr-3
          ${
            isMultipleChoice
              ? "bg-transparent"
              : isSelected
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-700"
          }
        `}
        >
          {getSelectionIndicator()}
        </div>

        <span className="flex-grow font-medium">{answer}</span>

        <span className="flex-shrink-0 ml-2">{getIconClass()}</span>
      </div>
    </button>
  );
};

export default AnswerOption;
