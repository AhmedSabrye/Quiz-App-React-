import React from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

// Define Question interface locally
interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  all_answers?: string[];
}

interface QuestionReviewItemProps {
  question: Question;
  userAnswer: string;
  isCorrect: boolean;
}

const QuestionReviewItem: React.FC<QuestionReviewItemProps> = ({
  question,
  userAnswer,
  isCorrect,
}) => (
  <div
    className={`p-6 rounded-xl border-2 ${
      isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
    }`}
  >
    <div className="container mx-auto flex">
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
          isCorrect ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500"
        }`}
      >
        {isCorrect ? (
          <FaCheck className="text-xl" />
        ) : (
          <FaTimes className="text-xl" />
        )}
      </div>
      <div className="">
        <div className="flex flex-wrap justify-between items-center mb-2">
          <h4 className="text-lg font-semibold">{question.question}</h4>

          <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full ml-2">
            {question.difficulty.toUpperCase()}
          </span>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center">
            <span className="font-medium text-gray-700 mr-2">Your answer:</span>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                isCorrect
                  ? "bg-green-200 text-green-800"
                  : "bg-red-200 text-red-800"
              }`}
            />
            {userAnswer || "No answer provided"}
          </div>

          {!isCorrect && (
            <div className="flex items-center">
              <span className="font-medium text-gray-700 mr-2">
                Correct answer:
              </span>
              <span className="px-3 py-1 rounded-full text-sm bg-green-200 text-green-800">
                {question.correct_answer}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default QuestionReviewItem;
