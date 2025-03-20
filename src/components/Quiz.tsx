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
    submitMultipleAnswers,
    toggleAnswerSelection,
    selectedAnswers,
    resetTimer,
    quizFinished,
  } = useQuizStore(
    useShallow((state) => ({
      questions: state.questions,
      currentQuestionIndex: state.currentQuestionIndex,
      loading: state.loading,
      error: state.error,
      nextQuestion: state.nextQuestion,
      submitAnswer: state.submitAnswer,
      submitMultipleAnswers: state.submitMultipleAnswers,
      toggleAnswerSelection: state.toggleAnswerSelection,
      selectedAnswers: state.selectedAnswers,
      resetTimer: state.resetTimer,
      quizFinished: state.quizFinished,
    }))
  );

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackCorrect, setFeedbackCorrect] = useState(false);

  // Get the current selections for multi-answer questions
  const currentSelections = selectedAnswers[currentQuestionIndex] || [];
  const currentQuestion = questions[currentQuestionIndex];
  const isMultipleCorrect = currentQuestion?.is_multiple_correct;

  const handleAnswerSelect = (answer: string) => {
    if (!isAnswerSubmitted) {
      if (isMultipleCorrect) {
        // For multiple-correct questions, use the toggle function
        toggleAnswerSelection(answer);
      } else {
        // For single-answer questions, use the original behavior
        setSelectedAnswer(answer);
      }
    }
  };

  const handleSubmit = useCallback(() => {
    if (currentQuestionIndex >= questions.length) return;

    const currentQuestion = questions[currentQuestionIndex];
    setIsAnswerSubmitted(true);
    setShowCorrect(true);

    let isCorrect = false;

    if (currentQuestion.is_multiple_correct) {
      // For multiple correct questions
      const selections = selectedAnswers[currentQuestionIndex] || [];

      if (currentQuestion.correct_answers) {
        // Check if all selections are correct and all correct answers are selected
        const correctAnswersSet = new Set(currentQuestion.correct_answers);
        const allSelectedAreCorrect = selections.every((answer) =>
          correctAnswersSet.has(answer)
        );
        const allCorrectAreSelected = currentQuestion.correct_answers.every(
          (answer) => selections.includes(answer)
        );

        isCorrect = allSelectedAreCorrect && allCorrectAreSelected;
        submitMultipleAnswers(selections);
      }
    } else {
      // For single answer questions
      isCorrect = selectedAnswer === currentQuestion.correct_answer;
      submitAnswer(selectedAnswer || "");
    }

    setFeedbackCorrect(isCorrect);
    setShowFeedback(true);

    // Hide feedback after 1.5s
    setTimeout(() => {
      setShowFeedback(false);
    }, 1500);
  }, [
    currentQuestionIndex,
    questions,
    selectedAnswer,
    submitAnswer,
    submitMultipleAnswers,
    selectedAnswers,
  ]);

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
    if (quizFinished) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <DifficultyIndicator difficulty={currentQuestion.difficulty} />
          <div className="flex items-center text-white">
            <FaClock className="mr-1" />
            <Timer
              handleSubmit={handleSubmit}
              isAnswerSubmitted={isAnswerSubmitted}
            />
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
          isMultipleCorrect={currentQuestion.is_multiple_correct}
        />

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          {isMultipleCorrect && !isAnswerSubmitted && (
            <div className="mb-4 p-2 bg-indigo-50 text-indigo-700 text-sm rounded">
              Select all correct answers for this question.
            </div>
          )}

          <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4">
            {currentQuestion.all_answers?.map((answer, index) => (
              <AnswerOption
                key={answer}
                answer={answer}
                index={index}
                isCorrect={
                  currentQuestion.is_multiple_correct &&
                  currentQuestion.correct_answers
                    ? currentQuestion.correct_answers.includes(answer)
                    : answer === currentQuestion.correct_answer
                }
                isSelected={
                  isMultipleCorrect
                    ? currentSelections.includes(answer)
                    : selectedAnswer === answer
                }
                isAnswerSubmitted={isAnswerSubmitted}
                showCorrect={showCorrect}
                onSelect={() => handleAnswerSelect(answer)}
                isMultipleChoice={isMultipleCorrect}
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
          selectedAnswer={
            isMultipleCorrect
              ? currentSelections.length > 0
                ? "selected"
                : null
              : selectedAnswer
          }
          onSubmit={handleSubmit}
          onNext={handleNext}
          onHome={handleGoHome}
          isLastQuestion={currentQuestionIndex === questions.length - 1}
        />
      </div>
    </div>
  );
}
