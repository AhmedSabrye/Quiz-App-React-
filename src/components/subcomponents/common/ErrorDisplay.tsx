import { FaHome, FaExclamationTriangle } from "react-icons/fa";

interface ErrorDisplayProps {
  message: string;
  onGoHome?: () => void;
  showHomeButton?: boolean;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  message,
  onGoHome,
  showHomeButton = true,
}) => (
  <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md mx-auto">
    <div className="mb-6 flex justify-center">
      <FaExclamationTriangle className="text-red-500 text-5xl" />
    </div>
    <h2 className="text-2xl font-bold text-gray-800 mb-4">
      Oops! Something went wrong
    </h2>
    <p className="text-gray-600 mb-6">{message}</p>
    {showHomeButton && onGoHome && (
      <button
        onClick={onGoHome}
        className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center mx-auto"
      >
        <FaHome className="mr-2" />
        Return Home
      </button>
    )}
  </div>
);

export default ErrorDisplay;
