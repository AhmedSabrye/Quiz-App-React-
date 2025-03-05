import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuizStore } from "../store/quizStore";
import ResultHeader from "./subcomponents/results/ResultHeader";
import CategoryPerformance from "./subcomponents/results/CategoryPerformance";
import ActionButtons from "./subcomponents/results/ActionButtons";
import SocialSharing from "./subcomponents/results/SocialSharing";
import QuestionReviewItem from "./subcomponents/results/QuestionReviewItem";

export default function Results() {
  const navigate = useNavigate();
  const {
    questions,
    userAnswers,
    score,
    quizFinished,
    fetchQuestions,
    loading,
  } = useQuizStore();

  const [animateScore, setAnimateScore] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAnimateScore(true);
    }, 500);
  }, []);

  // If quiz is not finished, redirect to home
  useEffect(() => {
    if (!quizFinished && questions.length === 0) {
      navigate("/");
    }
  }, [quizFinished, questions.length, navigate]);

  const handleRestart = async () => {
    await fetchQuestions();
    navigate("/quiz");
  };

  // Calculate percentage score
  const percentage = Math.round((score / questions.length) * 100);

  // Determine message based on score
  const getMessage = () => {
    if (percentage >= 90) return "Excellent!";
    if (percentage >= 70) return "Great job!";
    if (percentage >= 50) return "Good effort!";
    return "Keep practicing!";
  };

  // Get badge based on score
  const getBadge = () => {
    if (percentage >= 90) return "Master";
    if (percentage >= 70) return "Expert";
    if (percentage >= 50) return "Adept";
    return "Novice";
  };

  // Group questions by category
  const categoriesData = questions.reduce((acc, question, index) => {
    const category = question.category;
    const isCorrect = userAnswers[index] === question.correct_answer;

    if (!acc[category]) {
      acc[category] = { total: 0, correct: 0 };
    }

    acc[category].total += 1;
    if (isCorrect) acc[category].correct += 1;

    return acc;
  }, {} as Record<string, { total: number; correct: number }>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-12 px-4 sm:px-6">
      <div className="container mx-auto">
        <ResultHeader
          percentage={percentage}
          message={getMessage()}
          badgeTitle={getBadge()}
        />

        {/* Score card */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:h-[500px] gap-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col justify-center transform transition-all duration-500 hover:shadow-3xl">
            {/* Performance by Category */}
            <CategoryPerformance
              animateScore={animateScore}
              categoryData={categoriesData}
            />

            {/* Action buttons */}
            <ActionButtons
              loading={loading}
              onRestart={handleRestart}
              onHome={() => navigate("/")}
            />

            {/* Social sharing */}
            <SocialSharing />
          </div>

          {/* Question review */}
          <div className="bg-white overflow-y-auto h-[500px] rounded-2xl shadow-2xl p-8 ">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Question Review
            </h3>

            <div className="space-y-8">
              {questions.map((question, index) => {
                const isCorrect =
                  userAnswers[index] === question.correct_answer;
                return (
                  <QuestionReviewItem
                    key={index}
                    question={question}
                    userAnswer={userAnswers[index]}
                    isCorrect={isCorrect}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
