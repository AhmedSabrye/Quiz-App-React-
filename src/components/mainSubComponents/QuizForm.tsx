import React, { useState, useEffect } from "react";
import { FaChevronRight, FaSpinner } from "react-icons/fa";
import InfoTooltip from "../subcomponents/home/InfoTooltip";
import RadioOption from "../subcomponents/home/RadioOption";
import { useQuizStore } from "../../store/quizStore";
import { useNavigate } from "react-router-dom";
import { useShallow } from "zustand/shallow";

interface Category {
  id: number;
  name: string;
}
type DifficultyOption = {
  id: string;
  name: string;
  color: string;
  defaultChecked?: boolean;
};
type QuestionTypeOption = {
  id: string;
  name: string;
  color: string;
  defaultChecked?: boolean;
};
const DifficultyOptions: DifficultyOption[] = [
  { id: "any", name: "Any", color: "indigo" },
  { id: "easy", name: "Easy", color: "green", defaultChecked: true },
  { id: "medium", name: "Medium", color: "yellow" },
  { id: "hard", name: "Hard", color: "red" },
];

const QuestionTypeOptions: QuestionTypeOption[] = [
  { id: "any", name: "Any Type", color: "indigo" , defaultChecked: true},
  { id: "multiple", name: "Multiple Choice", color: "indigo" },
  { id: "boolean", name: "True / False", color: "indigo" },
];

const QuizForm: React.FC = () => {
  const navigate = useNavigate();
  
  const { setQuizConfig, fetchQuestions, loading, quizConfig } = useQuizStore(useShallow(state=> ({
    setQuizConfig: state.setQuizConfig,
    fetchQuestions: state.fetchQuestions,
    loading: state.loading,
    quizConfig: state.quizConfig,
  })));
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(quizConfig.amount);
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);
  console.log(quizConfig)
  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await fetch("https://opentdb.com/api_category.php");
        const data = await response.json();
        setCategories(data.trivia_categories);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchQuestions();
    navigate("/quiz");
  };

  // Function to show tooltip content
  const getTooltipContent = (id: string) => {
    switch (id) {
      case "amount":
        return "Choose how many questions you want in your quiz (1-50)";
      case "category":
        return "Select a specific topic for your questions or leave as 'Any Category'";
      case "difficulty":
        return "Easy questions are simpler, Medium is more challenging, Hard will test your expertise";
      case "type":
        return "Multiple Choice has 4 options, True/False questions have only 2 options";
      default:
        return "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Number of Questions */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-gray-700 font-medium" htmlFor="amount">
            Number of Questions
          </label>
          <InfoTooltip
            content={getTooltipContent("amount")}
            id="amount"
            hoveredId={hoveredTooltip}
            onHover={setHoveredTooltip}
          />
        </div>
        <div className="flex items-center space-x-4">
          <input
            id="amount"
            type="range"
            min="1"
            max="10"
            value={selectedAmount}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            onChange={(e) => {
              const value = +e.target.value;
              setSelectedAmount(value);
              console.log(value);
              setQuizConfig({ amount: value });
            }}
          />
          <span className="w-12 text-center font-medium text-gray-700">
            {selectedAmount}
          </span>
        </div>
      </div>

      {/* Category */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-gray-700 font-medium" htmlFor="category">
            Category
          </label>
          <InfoTooltip
            content={getTooltipContent("category")}
            id="category"
            hoveredId={hoveredTooltip}
            onHover={setHoveredTooltip}
          />
        </div>
        <div className="relative">
          <select
            id="category"
            className="block w-full p-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            onChange={(e) => setQuizConfig({ category: e.target.value })}
            defaultValue=""
          >
            <option value="">Any Category</option>
            {loadingCategories ? (
              <option disabled>Loading categories...</option>
            ) : (
              categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))
            )}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            className="block text-gray-700 font-medium"
            htmlFor="difficulty"
          >
            Difficulty
          </label>
          <InfoTooltip
            content={getTooltipContent("difficulty")}
            id="difficulty"
            hoveredId={hoveredTooltip}
            onHover={setHoveredTooltip}
          />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {DifficultyOptions.map((option) => (
            <RadioOption
              key={option.id}
              id={`difficulty-${option.id}`}
              name="difficulty"
              defaultChecked={option.defaultChecked}
              onChange={() => setQuizConfig({ difficulty: option.id })}
              label={option.name}
              color={option.color}
            />
          ))}
        </div>
      </div>

      {/* Question Type */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-gray-700 font-medium" htmlFor="type">
            Question Type
          </label>
          <InfoTooltip
            content={getTooltipContent("type")}
            id="type"
            hoveredId={hoveredTooltip}
            onHover={setHoveredTooltip}
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {QuestionTypeOptions.map((option) => (
            <RadioOption
              key={option.id}
              id={`type-${option.id}`}
              name="type"
              defaultChecked={option.defaultChecked}
              onChange={() => setQuizConfig({ type: option.id })}
              label={option.name}
              color={option.color}
            />
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-8"
        aria-label="Start Quiz"
      >
        {loading ? (
          <span className="flex items-center">
            <FaSpinner className="animate-spin mr-2" />
            Loading...
          </span>
        ) : (
          <span className="flex items-center">
            Start Quiz
            <FaChevronRight className="ml-2" />
          </span>
        )}
      </button>
    </form>
  );
};

export default QuizForm;
