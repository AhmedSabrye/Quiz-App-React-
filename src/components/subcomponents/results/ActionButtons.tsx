import React from "react";

interface ActionButtonsProps {
  onRestart: () => void;
  onHome: () => void;
  loading: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onRestart,
  onHome,
  loading
}) => {
  return (
    <div className="flex flex-wrap justify-center mb-4 gap-4 mt-8">
      <button
        onClick={onHome}
        className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2 transition-colors"
      >
        <svg
          className="w-4 h-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span>Home</span>
      </button>

      <button
        onClick={onRestart}
        className="px-4 py-2 rounded-md border border-indigo-600 text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 transition-colors"
      >
        <svg
          className="w-4 h-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M23 4v6h-6"></path>
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
        </svg>
        <span>{loading ? "Loading..." : "Play Again"}</span>
      </button>

    </div>
  );
};

export default ActionButtons;
