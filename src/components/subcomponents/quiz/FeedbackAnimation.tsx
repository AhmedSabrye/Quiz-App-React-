import React, { useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

interface FeedbackAnimationProps {
  isCorrect: boolean;
  isVisible: boolean;
  duration?: number;
}

const FeedbackAnimation: React.FC<FeedbackAnimationProps> = ({
  isCorrect,
  isVisible,
  duration = 1000,
}) => {
  const [shouldRender, setShouldRender] = useState(isVisible);
  
  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, duration);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isVisible, duration]);

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div
        className={`${
          isVisible ? "animate-slide-in" : "animate-fade-out"
        } flex items-center justify-center ${
          isCorrect ? "bg-green-500" : "bg-red-500"
        } text-white p-6 rounded-full shadow-xl`}
      >
        {isCorrect ? (
          <FaCheck className="text-5xl" />
        ) : (
          <FaTimes className="text-5xl" />
        )}
      </div>
    </div>
  );
};

export default FeedbackAnimation;
