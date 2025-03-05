import React from "react";
import { FaTrophy, FaMedal } from "react-icons/fa";

interface ResultHeaderProps {
  percentage: number;
  message: string;
  badgeTitle: string;
}

const ResultHeader: React.FC<ResultHeaderProps> = ({
  percentage,
  message,
  badgeTitle,
}) => (
  <div className="text-center mb-10">
    <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-white shadow-lg">
      {percentage >= 70 ? (
        <FaTrophy className="text-4xl text-yellow-500" />
      ) : (
        <FaMedal className="text-4xl text-indigo-500" />
      )}
    </div>
    <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
      Quiz Complete!
    </h1>
    <p className="text-xl text-white opacity-90 mb-2">{message}</p>
    <div className="inline-flex mt-4 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white">
      <span className="font-medium">Your Rank: </span>
      <span className="ml-2 font-bold">{badgeTitle}</span>
    </div>
  </div>
);

export default ResultHeader;
