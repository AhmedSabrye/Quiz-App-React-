import  { useEffect, useState } from 'react'
import { useQuizStore } from '../../../store/quizStore';

export default function Timer({isAnswerSubmitted,handleSubmit}: {isAnswerSubmitted: boolean,handleSubmit: () => void}) {

  const { decrementTimer, startTimer, questions, currentQuestionIndex, timeLeft } = useQuizStore();
  const [timeLeftWarning, setTimeLeftWarning] = useState(false);

  useEffect(() => {
    if (timeLeft <= 10 && timeLeft > 0) {
      setTimeLeftWarning(true);
    } else {
      setTimeLeftWarning(false);
    }

    // Auto-submit when time runs out
    if (timeLeft === 0 && !isAnswerSubmitted) {
      handleSubmit();
    }
  }, [timeLeft, isAnswerSubmitted, handleSubmit]);

  // Set up timer
  useEffect(() => {
    if (
        questions.length > 0 &&
        currentQuestionIndex < questions.length &&
        !isAnswerSubmitted
      ) {
        startTimer();
        const timer = setInterval(() => {
          decrementTimer();
        }, 1000);
  
        return () => clearInterval(timer);
      }
    }, [
      currentQuestionIndex,
      decrementTimer,
      isAnswerSubmitted,
      questions.length,
      startTimer,
    ]);
    
  return (
    <span
    className={`font-bold ${
      timeLeftWarning ? "text-red-300 animate-pulse" : ""
    }`}
  >
    {timeLeft}s
  </span>
  )
}
