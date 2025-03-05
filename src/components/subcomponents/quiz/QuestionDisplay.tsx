import React from "react";
import QuestionMeta from "../mainSubComponents/QuestionMeta";

interface QuestionDisplayProps {
  question: string;
  type: string;
  category?: string;
  difficulty?: string;
  showMeta?: boolean;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  type,
  category = "",
  difficulty = "",
  showMeta = false,
}) => (
  <div className="mb-8">
    {showMeta && category && difficulty && (
      <QuestionMeta category={category} difficulty={difficulty} />
    )}

    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
        {question}
      </h2>

      <p className="text-sm text-gray-500 italic">
        {type === "multiple" ? "Multiple Choice" : "True/False"}
      </p>
    </div>
  </div>
);

export default QuestionDisplay;
