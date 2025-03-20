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
  correct_answers?: string[];
  is_multiple_correct?: boolean;
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
  selectedAnswers: string[][]; // For tracking multiple selections
  quizConfig: QuizConfig;
  timeLeft: number;
  quizStarted: boolean;
  quizFinished: boolean;

  // Actions
  fetchQuestions: () => Promise<void>;
  setQuizConfig: (config: Partial<QuizConfig>) => void;
  nextQuestion: () => void;
  submitAnswer: (answer: string) => void;
  submitMultipleAnswers: (answers: string[]) => void;
  resetQuiz: () => void;
  startTimer: () => void;
  decrementTimer: () => void;
  resetTimer: () => void;
  setCustomQuestions: (questions: Question[]) => void;
  toggleAnswerSelection: (answer: string) => void;
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
      selectedAnswers: [], // Track selected answers for multiple-choice
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
                correct_answers: [he.decode(q.correct_answer)],
                is_multiple_correct: false,
              })
            );

            set({
              questions: processedQuestions,
              loading: false,
              currentQuestionIndex: 0,
              score: 0,
              userAnswers: [],
              selectedAnswers: [],
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

      submitMultipleAnswers: (answers: string[]) => {
        const {
          currentQuestionIndex,
          questions,
          userAnswers,
          score,
          selectedAnswers,
        } = get();
        const currentQuestion = questions[currentQuestionIndex];

        // Make a copy of the current selectedAnswers array
        const updatedSelectedAnswers = [...selectedAnswers];
        // Set the answers for the current question
        updatedSelectedAnswers[currentQuestionIndex] = answers;

        // For backward compatibility, store first answer in userAnswers or empty string if none
        const updatedUserAnswers = [...userAnswers, answers[0] || ""];

        // Check if selected answers match all correct answers
        let isCorrect = false;
        if (
          currentQuestion.is_multiple_correct &&
          currentQuestion.correct_answers
        ) {
          // For multiple correct questions, all correct answers must be selected and no incorrect answers
          const correctAnswersSet = new Set(currentQuestion.correct_answers);

          // Check if all selected answers are correct and all correct answers are selected
          const allSelectedAreCorrect = answers.every((answer) =>
            correctAnswersSet.has(answer)
          );
          const allCorrectAreSelected = currentQuestion.correct_answers.every(
            (answer) => answers.includes(answer)
          );

          isCorrect = allSelectedAreCorrect && allCorrectAreSelected;
        } else {
          // For single answer questions
          isCorrect = currentQuestion.correct_answer === answers[0];
        }

        set({
          userAnswers: updatedUserAnswers,
          selectedAnswers: updatedSelectedAnswers,
          score: isCorrect ? score + 1 : score,
        });
      },

      resetQuiz: () => {
        set({
          currentQuestionIndex: 0,
          score: 0,
          userAnswers: [],
          selectedAnswers: [],
          quizStarted: false,
          quizFinished: false,
          timeLeft: 30,
        });
      },

      startTimer: () => {
        set({ timeLeft: 10 });
      },

      decrementTimer: () => {
        const {
          timeLeft,
          currentQuestionIndex,
          questions,
          userAnswers,
          selectedAnswers,
        } = get();

        if (timeLeft > 0) {
          set({ timeLeft: timeLeft - 1 });
        } else if (userAnswers[currentQuestionIndex] === undefined) {
          // If time ran out and no answer selected, submit empty answer and move to next question
          const currentQuestion = questions[currentQuestionIndex];

          if (currentQuestion.is_multiple_correct) {
            get().submitMultipleAnswers([]);
          } else {
            get().submitAnswer("");
          }

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

      setCustomQuestions: (questions: Question[]) => {
        // Make sure all questions have all_answers set
        const processedQuestions = questions.map((q) => {
          // If all_answers is not already set, create it
          if (!q.all_answers) {
            return {
              ...q,
              all_answers: shuffleArray([
                q.correct_answer,
                ...q.incorrect_answers,
              ]),
            };
          }
          return q;
        });

        set({
          questions: processedQuestions,
          loading: false,
          currentQuestionIndex: 0,
          score: 0,
          userAnswers: [],
          selectedAnswers: [],
          quizStarted: true,
          quizFinished: false,
          error: null,
        });
      },

      toggleAnswerSelection: (answer: string) => {
        const { currentQuestionIndex, selectedAnswers, questions } = get();
        const currentQuestion = questions[currentQuestionIndex];

        // Copy the current selections array
        const updatedSelectedAnswers = [...selectedAnswers];

        // Get the current selections for this question or initialize empty array
        const currentSelections = selectedAnswers[currentQuestionIndex] || [];

        let newSelections: string[];

        if (currentQuestion.is_multiple_correct) {
          // For multiple-correct questions, toggle the selection
          if (currentSelections.includes(answer)) {
            // Remove if already selected
            newSelections = currentSelections.filter((a) => a !== answer);
          } else {
            // Add if not selected
            newSelections = [...currentSelections, answer];
          }
        } else {
          // For single answer questions, replace the selection
          newSelections = [answer];
        }

        // Update the selections for this question
        updatedSelectedAnswers[currentQuestionIndex] = newSelections;

        set({
          selectedAnswers: updatedSelectedAnswers,
        });
      },
    }),
    {
      name: "quiz-storage", // Name for localStorage
      partialize: (state) => ({
        questions: state.questions,
        currentQuestionIndex: state.currentQuestionIndex,
        score: state.score,
        userAnswers: state.userAnswers,
        selectedAnswers: state.selectedAnswers,
        quizConfig: state.quizConfig,
        quizStarted: state.quizStarted,
        quizFinished: state.quizFinished,
      }),
    }
  )
);
