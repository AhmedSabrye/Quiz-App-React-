import { useQuizStore } from "../store/quizStore";
import { FaBrain, FaLightbulb } from "react-icons/fa";
import FeatureCard from "./subcomponents/home/FeatureCard";
import QuizForm from "./mainSubComponents/QuizForm";
import { useShallow } from "zustand/shallow";

export default function Home() {
  const  error  = useQuizStore(useShallow(state=> state.error));

  return (
    <div className="min-h-screen flex justify-center items-center py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center ">
          <div className="flex justify-center mb-4">
            <FaBrain className="text-5xl text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            Trivia Master
          </h1>
          <p className="text-xl text-white opacity-90 mb-2">
            Test your knowledge with our challenging quiz!
          </p>

          {/* feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-4 mb-4">
            <FeatureCard
              icon={<FaLightbulb />}
              title="Customizable"
              description="Tailor your quiz exactly how you want it"
            />
            <FeatureCard
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              title="Timed"
              description="Challenge yourself with a countdown timer"
            />
            <FeatureCard
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              }
              title="Detailed Results"
              description="Get comprehensive quiz performance analysis"
            />
          </div>
        </div>

        <div className="bg-white bg-opacity-90 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Customize Your Quiz
          </h2>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
              <p>{error}</p>
            </div>
          )}

          <QuizForm />
        </div>
      </div>
      
    </div>
  );
}
