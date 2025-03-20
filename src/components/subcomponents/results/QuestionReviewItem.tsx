import React from "react";
import { FaCheck, FaTimes, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

// Define Question interface locally
interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  all_answers?: string[];
  correct_answers?: string[];
  is_multiple_correct?: boolean;
}

interface QuestionReviewItemProps {
  question: Question;
  userAnswer: string;
  selectedAnswers?: string[];
  isCorrect: boolean;
  isMultipleCorrect?: boolean;
}

const QuestionReviewItem: React.FC<QuestionReviewItemProps> = ({
  question,
  userAnswer,
  selectedAnswers = [],
  isCorrect,
  isMultipleCorrect = false,
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
      <div className="flex-1">
        <div className="flex flex-wrap justify-between items-center mb-2">
          <h4 className="text-lg font-semibold">{question.question}</h4>

          <div className="flex items-center">
            {isMultipleCorrect && (
              <span className="px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full mr-2">
                Multiple Answers
              </span>
            )}
            <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
              {question.difficulty.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {isMultipleCorrect ? (
            // Display for multiple correct questions
            <div className="space-y-2">
              <h5 className="font-medium text-gray-700">Your selection:</h5>
              {question.all_answers && question.all_answers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {question.all_answers.map((answer, idx) => {
                    const isSelected = selectedAnswers.includes(answer);
                    const isAnswerCorrect =
                      question.correct_answers?.includes(answer);

                    return (
                      <div
                        key={idx}
                        className={`flex items-center p-2 rounded ${
                          isSelected && isAnswerCorrect
                            ? "bg-green-100 border border-green-300"
                            : isSelected && !isAnswerCorrect
                            ? "bg-red-100 border border-red-300"
                            : !isSelected && isAnswerCorrect
                            ? "bg-yellow-50 border border-yellow-200"
                            : "bg-gray-50 border border-gray-200"
                        }`}
                      >
                        <div className="flex-shrink-0 mr-2">
                          {isSelected ? (
                            isAnswerCorrect ? (
                              <FaCheckCircle className="text-green-500" />
                            ) : (
                              <FaTimesCircle className="text-red-500" />
                            )
                          ) : (
                            isAnswerCorrect && (
                              <FaCheckCircle className="text-yellow-500 opacity-70" />
                            )
                          )}
                        </div>
                        <span
                          className={`text-sm ${
                            isSelected
                              ? isAnswerCorrect
                                ? "text-green-700"
                                : "text-red-700"
                              : isAnswerCorrect
                              ? "text-yellow-700"
                              : "text-gray-700"
                          }`}
                        >
                          {answer}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 italic">No answers available</p>
              )}
            </div>
          ) : (
            // Display for single answer questions
            <div>
              <div className="flex items-center">
                <span className="font-medium text-gray-700 mr-2">
                  Your answer:
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    isCorrect
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {userAnswer || "No answer provided"}
                </span>
              </div>

              {!isCorrect && (
                <div className="flex items-center mt-2">
                  <span className="font-medium text-gray-700 mr-2">
                    Correct answer:
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm bg-green-200 text-green-800">
                    {question.correct_answer}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default QuestionReviewItem;
