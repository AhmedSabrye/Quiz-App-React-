import React from "react";
import { FaHome, FaArrowRight } from "react-icons/fa";

interface ActionButtonsProps {
  isAnswerSubmitted?: boolean;
  selectedAnswer?: string | null;
  onSubmit?: () => void;
  onNext?: () => void;
  onHome: () => void;
  isLastQuestion?: boolean;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  showHomeButton?: boolean;
  disabled?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isAnswerSubmitted = false,
  selectedAnswer = null,
  onSubmit,
  onNext,
  onHome,
  isLastQuestion = false,
  primaryButtonText,
  secondaryButtonText,
  showHomeButton = true,
  disabled = false,
}) => (
  <div className="flex justify-between">
    {showHomeButton && (
      <button
        onClick={onHome}
        className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 transition-colors duration-300"
        aria-label="Return to home"
      >
        <FaHome className="mr-2" />
        Home
      </button>
    )}

    {!isAnswerSubmitted
      ? onSubmit && (
          <button
            onClick={onSubmit}
            disabled={!selectedAnswer || disabled}
            className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            aria-label="Submit your answer"
          >
            {primaryButtonText || "Submit Answer"}
          </button>
        )
      : onNext && (
          <button
            onClick={onNext}
            className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-md"
            aria-label={
              isLastQuestion ? "View your results" : "Go to next question"
            }
          >
            {isLastQuestion ? (
              secondaryButtonText || "View Results"
            ) : (
              <span className="flex items-center">
                {secondaryButtonText || "Next Question"}
                <FaArrowRight className="ml-2" />
              </span>
            )}
          </button>
        )}
  </div>
);

export default ActionButtons;
