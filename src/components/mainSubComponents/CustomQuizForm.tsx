import React, { useState } from "react";
import { FaChevronRight, FaSpinner, FaInfoCircle } from "react-icons/fa";
import { useQuizStore } from "../../store/quizStore";
import { useNavigate } from "react-router-dom";
import { Question } from "../../store/quizStore";

const CustomQuizForm: React.FC = () => {
  const navigate = useNavigate();
  const { setCustomQuestions, loading } = useQuizStore();

  const [questions, setQuestions] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  // Parse the user-provided questions into the format required by the quiz app
  const parseQuestions = (text: string): Question[] | null => {
    const questions: Question[] = [];
    const lines = text.split("\n").filter((line) => line.trim());

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Skip empty lines
      if (!line) continue;

      // Check if line starts with "q." or "Q." to identify questions
      if (line.toLowerCase().startsWith("q.")) {
        const questionText = line.substring(2).split(":")[0].trim();
        const options = [];
        const incorrectAnswers = [];
        const correctAnswers = [];
        let isBooleanQuestion = false;

        // Look ahead for options until we find the next question or run out of lines
        let j = i + 1;
        while (j < lines.length && !lines[j].toLowerCase().startsWith("q.")) {
          const optionLine = lines[j].trim();

          // Check if this is a multiple choice option
          const optionMatch = optionLine.match(/^(\d+)\.(.+)$/);
          if (optionMatch) {
            const optionText = optionMatch[2].trim();

            // Check if this is a true/false option with a number prefix
            const normalizedOption = optionText.toLowerCase();
            const isTrueFalseOption = normalizedOption.includes("true") || normalizedOption.includes("false");

            // If this is going to be a boolean question, store the original case but normalize for comparison
            if (isTrueFalseOption) {
              if (options.length < 2) {
                isBooleanQuestion = true;
              }
            }

            // Check if this is a correct answer (marked with "(true)" or similar)
            if (optionText.toLowerCase().includes("(true)")) {
              // Remove the "(true)" marker before adding to options
              const cleanOption = optionText.replace(/\(true\)/i, "").trim();
              correctAnswers.push(cleanOption);
              options.push(cleanOption);
            } else {
              options.push(optionText);
              incorrectAnswers.push(optionText);
            }
          }
          j++;
        }

        // If we found a valid question with options and at least one correct answer
        if (questionText && options.length > 0 && correctAnswers.length > 0) {
          const isMultipleCorrect = correctAnswers.length > 1;

          // Determine if this is a boolean question by checking both the option count and content
          const isBoolean =
            isBooleanQuestion &&
            options.length === 2 &&
            options.some(
              (o) =>
                o.toLowerCase() === "true" || o.toLowerCase().trim() === "true"
            ) &&
            options.some(
              (o) =>
                o.toLowerCase() === "false" ||
                o.toLowerCase().trim() === "false"
            );

          questions.push({
            question: questionText,
            all_answers: options,
            // For backward compatibility, set correct_answer to first correct answer
            correct_answer: correctAnswers[0],
            // Store all correct answers in case of multiple
            correct_answers: correctAnswers,
            incorrect_answers: incorrectAnswers,
            category: "Custom",
            type: isBoolean
              ? "boolean"
              : isMultipleCorrect
              ? "multiple_correct"
              : "multiple",
            difficulty: "medium",
            is_multiple_correct: isMultipleCorrect,
          });
        }

        i = j - 1; // Update the outer loop counter to skip the options we've processed
      }
    }

    return questions.length > 0 ? questions : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!questions.trim()) {
      setError("Please enter some questions in the specified format.");
      return;
    }

    const parsedQuestions = parseQuestions(questions);

    if (!parsedQuestions) {
      setError(
        "Could not parse any valid questions. Please check your format and try again."
      );
      return;
    }

    setCustomQuestions(parsedQuestions);
    navigate("/quiz");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            className="block text-gray-700 font-medium"
            htmlFor="custom-questions"
          >
            Create Your Own Quiz
          </label>
          <button
            type="button"
            onClick={() => setShowInstructions(!showInstructions)}
            className="text-indigo-600 hover:text-indigo-800 transition-colors"
            aria-label="Show instructions"
          >
            <FaInfoCircle size={18} />
          </button>
        </div>

        {showInstructions && (
          <div className="mb-4 p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
            <h3 className="font-medium text-indigo-800 mb-2">
              How to Format Your Questions
            </h3>
            <p className="text-sm text-gray-700 mb-2">
              Each question should start with "Q." followed by the question text
              and a colon. Then list each answer option starting with a number.
              Mark the correct answer(s) with "(true)" at the end.
            </p>
            <h4 className="font-medium text-indigo-700 mt-3 mb-1">
              Example (Multiple Choice - Single Answer):
            </h4>
            <pre className="text-xs bg-white p-2 rounded border border-gray-200">
              {`Q.What is the capital of France:
1.Berlin
2.Madrid
3.Paris (true)
4.London`}
            </pre>

            <h4 className="font-medium text-indigo-700 mt-3 mb-1">
              Example (Multiple Choice - Multiple Answers):
            </h4>
            <pre className="text-xs bg-white p-2 rounded border border-gray-200">
              {`Q.Which of these are mammals:
1.Dolphin (true)
2.Shark
3.Elephant (true)
4.Eagle`}
            </pre>

            <h4 className="font-medium text-indigo-700 mt-3 mb-1">
              Example (True/False):
            </h4>
            <pre className="text-xs bg-white p-2 rounded border border-gray-200">
              {`Q.The Earth is flat:
1.True
2.False (true)`}
            </pre>
          </div>
        )}

        <textarea
          id="custom-questions"
          rows={10}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          placeholder="Enter your questions here..."
          value={questions}
          onChange={(e) => {
            setQuestions(e.target.value);
            setError(null);
          }}
        ></textarea>

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
        aria-label="Start Custom Quiz"
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

export default CustomQuizForm;
