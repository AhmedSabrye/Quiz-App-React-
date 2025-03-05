import React from "react";

interface DifficultyIndicatorProps {
  difficulty: string;
}

const DifficultyIndicator: React.FC<DifficultyIndicatorProps> = ({
  difficulty,
}) => {
  const getDifficultyColor = () => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "hard":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDifficultyStars = () => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return (
          <div className="flex">
            <span className="text-yellow-500">★</span>
            <span className="text-gray-300">★★</span>
          </div>
        );
      case "medium":
        return (
          <div className="flex">
            <span className="text-yellow-500">★★</span>
            <span className="text-gray-300">★</span>
          </div>
        );
      case "hard":
        return (
          <div className="flex">
            <span className="text-yellow-500">★★★</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`px-3 py-1 inline-flex items-center justify-center rounded-full text-xs font-semibold border ${getDifficultyColor()}`}
    >
      {difficulty.toUpperCase()} {getDifficultyStars()}
    </div>
  );
};

export default DifficultyIndicator;
