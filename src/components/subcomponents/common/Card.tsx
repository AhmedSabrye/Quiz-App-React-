import React from "react";

interface CardProps {
  children: React.ReactNode;
  title?: string | React.ReactNode;
  subtitle?: string;
  footer?: React.ReactNode;
  className?: string;
  elevation?: "none" | "sm" | "md" | "lg";
  hoverEffect?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  footer,
  className = "",
  elevation = "md",
  hoverEffect = false,
}) => {
  const getElevationClasses = () => {
    switch (elevation) {
      case "none":
        return "";
      case "sm":
        return "shadow-sm";
      case "lg":
        return "shadow-xl";
      default:
        return "shadow-md";
    }
  };

  return (
    <div
      className={`
        bg-white rounded-lg overflow-hidden 
        ${getElevationClasses()}
        ${
          hoverEffect
            ? "transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            : ""
        }
        ${className}
      `}
    >
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-gray-100">
          {title &&
            (typeof title === "string" ? (
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            ) : (
              title
            ))}
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      )}

      <div className="px-6 py-4">{children}</div>

      {footer && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
