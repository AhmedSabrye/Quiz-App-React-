import { FaSpinner } from "react-icons/fa";

interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg" | "extreme";
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Loading...",
  size = "extreme",
}) => {
  const getSizeClass = (size: "sm" | "md" | "lg" | "extreme") => {
    switch (size) {
      case "sm":
        return "text-xl";
      case "lg":
        return "text-3xl";
      case "extreme":
        return "text-9xl";
      default:
        return "text-2xl";
    }
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center p-4">
      <FaSpinner
        className={`${getSizeClass(size)} animate-spin text-indigo-600 mb-2`}
      />
      {message && <p className="text-gray-600 font-medium">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
