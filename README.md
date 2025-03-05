# React Quiz App

A fully functional and responsive quiz application built with React, Zustand, and TailwindCSS that fetches questions from the Open Trivia Database API.

## Features

- Select quiz options (category, difficulty, and question type)
- Interactive quiz interface with countdown timer
- Score tracking and results summary
- Responsive design with TailwindCSS
- State management with Zustand
- Persistent storage (quiz progress is saved if you refresh)

## Technologies Used

- React
- TypeScript
- Zustand (for state management)
- TailwindCSS (for styling)
- React Router (for routing)
- Axios (for API requests)
- Open Trivia Database API

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm

### Installation

1. Clone the repository

```
git clone <repository-url>
```

2. Navigate to the project directory

```
cd react-quiz-app
```

3. Install dependencies

```
npm install
```

4. Start the development server

```
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

1. On the home screen, select your quiz options:

   - Number of questions
   - Category
   - Difficulty
   - Question type

2. Click "Start Quiz" to begin

3. Answer each question within the time limit and click "Submit Answer"

4. After submitting, click "Next Question" to proceed

5. At the end of the quiz, you'll see your score and a review of all questions and answers

6. Click "Return to Home" to start a new quiz

## License

MIT
