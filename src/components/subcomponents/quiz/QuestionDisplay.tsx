import React from "react";
import QuestionMeta from "../mainSubComponents/QuestionMeta";

interface QuestionDisplayProps {
  question: string;
  type: string;
  category?: string;
  difficulty?: string;
  showMeta?: boolean;
  isMultipleCorrect?: boolean;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  type,
  category = "",
  difficulty = "",
  showMeta = false,
  isMultipleCorrect = false,
}) => (
  <div className="mb-8">
    {showMeta && category && difficulty && (
      <QuestionMeta category={category} difficulty={difficulty} />
    )}

    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
        {question}
      </h2>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 italic">
          {type === "multiple"
            ? "Multiple Choice"
            : type === "multiple_correct"
            ? "Multiple Choice (Select All)"
            : "True/False"}
        </p>

        {isMultipleCorrect && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            Select All That Apply
          </span>
        )}
      </div>
    </div>
  </div>
);

export default QuestionDisplay;
