import React from "react";

interface QuestionMetaProps {
  category: string;
  difficulty: string;
}

const QuestionMeta: React.FC<QuestionMetaProps> = ({
  category,
  difficulty,
}) => (
  <div className="flex items-center justify-between flex-wrap mb-2">
    <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-semibold mr-2 mb-2">
      {category}
    </span>
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2
        ${
          difficulty.toLowerCase() === "easy"
            ? "bg-green-100 text-green-800"
            : difficulty.toLowerCase() === "medium"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-red-100 text-red-800"
        }`}
    >
      {difficulty.toUpperCase()}
    </span>
  </div>
);

export default QuestionMeta;
