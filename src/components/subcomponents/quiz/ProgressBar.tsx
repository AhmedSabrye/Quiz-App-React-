import React from "react";
import { useQuizStore } from "../../../store/quizStore";
interface ProgressBarProps {
  currentIndex: number;
  totalQuestions: number;
  timeLeft?: number;
  timeLeftWarning?: boolean;
  showTimer?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentIndex,
  totalQuestions,
  showTimer = true,
}) => {
  const  {timeLeft} = useQuizStore();
  const progress = ((currentIndex) / totalQuestions) * 100;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          Question {currentIndex + 1} of {totalQuestions}
        </span>

        {showTimer && (
          <span
            className={`text-sm font-medium ${
              timeLeft > 7 ?  "text-gray-700" : timeLeft > 4 ? "text-yellow-400" : "text-red-600" 
            }`}
          >
            Time Left: {timeLeft}s
          </span>
        )}
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
