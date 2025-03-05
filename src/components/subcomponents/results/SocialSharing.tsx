import React from "react";
import { FaTwitter, FaFacebook, FaShare } from "react-icons/fa";

interface SocialSharingProps {
  message?: string;
  platforms?: ("twitter" | "facebook" | "other")[];
}

const SocialSharing: React.FC<SocialSharingProps> = ({
  message = "Share your results:",
  platforms = ["twitter", "facebook", "other"],
}) => {
  const handleShare = (platform: string) => {
    console.log(`Sharing to ${platform} hahaha! 😅😅`);
  };

  return (
    <div className="flex justify-center space-x-4 items-center border-t border-gray-200 pt-6">
      <span className="text-gray-500 text-sm font-medium">{message}</span>

      {platforms.includes("twitter") && (
        <button
          onClick={() => handleShare("twitter")}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          aria-label="Share on Twitter"
        >
          <FaTwitter />
        </button>
      )}

      {platforms.includes("facebook") && (
        <button
          onClick={() => handleShare("facebook")}
          className="p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors"
          aria-label="Share on Facebook"
        >
          <FaFacebook />
        </button>
      )}

      {platforms.includes("other") && (
        <button
          onClick={() => handleShare("other")}
          className="p-2 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition-colors"
          aria-label="Share via other platforms"
        >
          <FaShare />
        </button>
      )}
    </div>
  );
};

export default SocialSharing;
