import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuizStore } from "../store/quizStore";
import { FaClock } from "react-icons/fa";
import ErrorDisplay from "./subcomponents/common/ErrorDisplay";
import DifficultyIndicator from "./subcomponents/quiz/DifficultyIndicator";
import ProgressBar from "./subcomponents/quiz/ProgressBar";
import QuestionDisplay from "./subcomponents/quiz/QuestionDisplay";
import AnswerOption from "./subcomponents/quiz/AnswerOption";
import FeedbackAnimation from "./subcomponents/quiz/FeedbackAnimation";
import ActionButtons from "./subcomponents/quiz/ActionButtons";
import Timer from "./subcomponents/quiz/Timer";
import { useShallow } from "zustand/react/shallow";
export default function Quiz() {
  const navigate = useNavigate();
  const {
    questions,
    currentQuestionIndex,
    loading,
    error,
    nextQuestion,
    submitAnswer,
    resetTimer,
    quizFinished,
  } = useQuizStore(useShallow(state => ({
    questions: state.questions,
    currentQuestionIndex: state.currentQuestionIndex,
    loading: state.loading,
    error: state.error,
    nextQuestion: state.nextQuestion,
    submitAnswer: state.submitAnswer,
    resetTimer: state.resetTimer,
    quizFinished: state.quizFinished,
  })));
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackCorrect, setFeedbackCorrect] = useState(false);
  const handleAnswerSelect = (answer: string) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmit = useCallback(() => {
    if (currentQuestionIndex >= questions.length) return;

    const currentQuestion = questions[currentQuestionIndex];
    setIsAnswerSubmitted(true);
    setShowCorrect(true);

    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    setFeedbackCorrect(isCorrect);
    setShowFeedback(true);

    // Hide feedback after 1.5s
    setTimeout(() => {
      setShowFeedback(false);
    }, 1500);

    submitAnswer(selectedAnswer || "");
  }, [currentQuestionIndex, questions, selectedAnswer, submitAnswer]);

  const handleNext = () => {
    resetTimer();

    if (currentQuestionIndex >= questions.length - 1) {
      navigate("/results");
    } else {
      nextQuestion();
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };


  

  // Set default state when question changes
  useEffect(() => {
    if(quizFinished){
      navigate("/results");
    }
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setShowCorrect(false);
    setShowFeedback(false);
  }, [currentQuestionIndex, quizFinished, navigate]);

  // Redirect to home if no questions
  useEffect(() => {
    if (!loading && questions.length === 0 && !error) {
      navigate("/");
    }
  }, [loading, questions.length, navigate, error]);


  if (error) {
    return <ErrorDisplay message={error} onGoHome={handleGoHome} />;
  }

  if (questions.length === 0) {
    return (
      <ErrorDisplay
        message="No questions available. Please try again with different options."
        onGoHome={handleGoHome}
      />
    );
  }



  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <DifficultyIndicator difficulty={currentQuestion.difficulty} />
          <div className="flex items-center text-white">
            <FaClock className="mr-1" />
            <Timer isAnswerSubmitted={isAnswerSubmitted} />
          </div>
        </div>

        <ProgressBar
          currentIndex={currentQuestionIndex}
          totalQuestions={questions.length}
        />

        <QuestionDisplay
          question={currentQuestion.question}
          type={currentQuestion.type}
          category={currentQuestion.category}
          difficulty={currentQuestion.difficulty}
          showMeta={true}
        />

        <div className="bg-white rounded-xl  shadow-md p-6 mb-8">
          <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4">
            {currentQuestion.all_answers?.map((answer, index) => (
              <AnswerOption
                key={answer}
                answer={answer}
                index={index}
                isCorrect={answer === currentQuestion.correct_answer}
                isSelected={selectedAnswer === answer}
                isAnswerSubmitted={isAnswerSubmitted}
                showCorrect={showCorrect}
                onSelect={() => handleAnswerSelect(answer)}
              />
            ))}
          </div>
        </div>

        {/* Feedback animation */}
        <FeedbackAnimation
          isCorrect={feedbackCorrect}
          isVisible={showFeedback}
        />

        <ActionButtons
          isAnswerSubmitted={isAnswerSubmitted}
          selectedAnswer={selectedAnswer}
          onSubmit={handleSubmit}
          onNext={handleNext}
          onHome={handleGoHome}
          isLastQuestion={currentQuestionIndex === questions.length - 1}
        />
      </div>
    </div>
  );
}
