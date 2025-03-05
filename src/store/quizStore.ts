import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import * as he from "he";




export interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  all_answers?: string[]; // Holds shuffled answers
}

export interface QuizConfig {
  amount: number;
  category: string;
  difficulty: string;
  type: string;
}

interface QuizState {
  questions: Question[];
  loading: boolean;
  error: string | null;
  currentQuestionIndex: number;
  score: number;
  userAnswers: string[];
  quizConfig: QuizConfig;
  timeLeft: number;
  quizStarted: boolean;
  quizFinished: boolean;

  // Actions
  fetchQuestions: () => Promise<void>;
  setQuizConfig: (config: Partial<QuizConfig>) => void;
  nextQuestion: () => void;
  submitAnswer: (answer: string) => void;
  resetQuiz: () => void;
  startTimer: () => void;
  decrementTimer: () => void;
  resetTimer: () => void;
}

// Shuffle array function "Fisher–Yates"
// it gets random number and swaps it with the last element
// then it decrements the length of the array and repeats
// until the array is shuffled
const shuffleArray = (array: string[]): string[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      questions: [],
      loading: false,
      error: null,
      currentQuestionIndex: 0,
      score: 0,
      userAnswers: [],
      quizConfig: {
        amount: 3,
        category: "",
        difficulty: "",
        type: "",
      },
      timeLeft: 10,
      quizStarted: false,
      quizFinished: false,

      fetchQuestions: async () => {
        const { quizConfig } = get();
        set({
          loading: true,
          error: null,
          quizStarted: true,
          quizFinished: false,
        });

        try {
          console.log(quizConfig);
          let url = `https://opentdb.com/api.php?amount=${quizConfig.amount}&`;

          if (quizConfig.category) {
            url += `&category=${quizConfig.category}`;
          }

          if (quizConfig.difficulty) {
            url += `&difficulty=${quizConfig.difficulty}`;
          }

          if (quizConfig.type) {
            url += `&type=${quizConfig.type}`;
          }

          const response = await axios.get(url);
          console.log(response);

          if (response.data.response_code === 0) {
            const processedQuestions = response.data.results.map(
              (q: Question) => ({
                ...q,
                question: he.decode(q.question),
                correct_answer: he.decode(q.correct_answer),
                incorrect_answers: q.incorrect_answers.map((a) => he.decode(a)),
                all_answers: shuffleArray([
                  he.decode(q.correct_answer),
                  ...q.incorrect_answers.map((a) => he.decode(a)),
                ]),
              })
            );

            set({
              questions: processedQuestions,
              loading: false,
              currentQuestionIndex: 0,
              score: 0,
              userAnswers: [],
            });
          } else {
            set({
              error: "Failed to fetch questions. Please try different options.",
              loading: false,
              quizStarted: false,
            });
          }
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "An error occurred while fetching questions.";

          set({
            error: errorMessage,
            loading: false,
          });
        }
      },

      setQuizConfig: (config: Partial<QuizConfig>) => {
        set((state: QuizState) => ({
          quizConfig: { ...state.quizConfig, ...config },
        }));
      },

      nextQuestion: () => {
        const { currentQuestionIndex, questions } = get();
        if (currentQuestionIndex < questions.length - 1) {
          get().resetTimer();
          set((state: QuizState) => ({
            currentQuestionIndex: state.currentQuestionIndex + 1,
          }));
        } else {
          set({ quizFinished: true });
        }
      },

      submitAnswer: (answer: string) => {
        const { currentQuestionIndex, questions, userAnswers, score } = get();
        const currentQuestion = questions[currentQuestionIndex];

        const updatedUserAnswers = [...userAnswers, answer];

        const isCorrect = currentQuestion.correct_answer === answer;

        set({
          userAnswers: updatedUserAnswers,
          score: isCorrect ? score + 1 : score,
        });
      },

      resetQuiz: () => {
        set({
          currentQuestionIndex: 0,
          score: 0,
          userAnswers: [],
          quizStarted: false,
          quizFinished: false,
          timeLeft: 30,
        });
      },

      startTimer: () => {
        set({ timeLeft: 10 });
      },

      decrementTimer: () => {
        const { timeLeft, currentQuestionIndex, questions, userAnswers } =
          get();

        if (timeLeft > 0) {
          set({ timeLeft: timeLeft - 1 });
        } else if (userAnswers[currentQuestionIndex] === undefined) {
          // If time ran out and no answer selected, submit empty answer and move to next question
          get().submitAnswer("");

          if (currentQuestionIndex < questions.length - 1) {
            get().nextQuestion();
          } else {
            set({ quizFinished: true });
          }
        }
      },

      resetTimer: () => {
        get().startTimer();
      },
    }),
    {
      name: "quiz-storage", // Name for localStorage
      partialize: (state) => ({
        questions: state.questions,
        currentQuestionIndex: state.currentQuestionIndex,
        score: state.score,
        userAnswers: state.userAnswers,
        quizConfig: state.quizConfig,
        quizStarted: state.quizStarted,
        quizFinished: state.quizFinished,
      }),
    }
  )
);
