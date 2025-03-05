import React from "react";
import { FaInfoCircle } from "react-icons/fa";

interface TooltipProps {
  content: string;
  id: string;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}

const InfoTooltip: React.FC<TooltipProps> = ({
  content,
  id,
  hoveredId,
  onHover,
}) => {
  return (
    <div className="relative">
      <button
        type="button"
        className="text-gray-400 hover:text-indigo-500 transition-colors"
        onMouseEnter={() => onHover(id)}
        onMouseLeave={() => onHover(null)}
        aria-label="More information"
      >
        <FaInfoCircle />
      </button>

      {hoveredId === id && (
        <div className="absolute z-10 w-64 mt-2 -right-8 top-full">
          <div className="bg-black text-white text-sm rounded-lg py-2 px-3 shadow-lg">
            {content}
            <div className="absolute -top-2 right-8 w-4 h-4 rotate-45 bg-black"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoTooltip;
