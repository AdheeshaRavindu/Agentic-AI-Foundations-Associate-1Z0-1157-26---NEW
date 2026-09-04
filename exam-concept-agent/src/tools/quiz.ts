import {
  QUIZZES,
  type QuizChoice,
  type QuizQuestion
} from "../data/quizzes";

export type PublicQuiz = {
  id: string;
  topic: string;
  question: string;
  choices: Record<QuizChoice, string>;
};

function toPublic(q: QuizQuestion): PublicQuiz {
  return {
    id: q.id,
    topic: q.topic,
    question: q.question,
    choices: q.choices
  };
}

export function quizMe(topic?: string): PublicQuiz {
  const pool = topic
    ? QUIZZES.filter((q) =>
        q.topic.toLowerCase().includes(topic.toLowerCase().trim())
      )
    : QUIZZES;
  const list = pool.length > 0 ? pool : QUIZZES;
  const idx = Math.floor(Math.random() * list.length);
  return toPublic(list[idx]!);
}

export function checkAnswer(
  questionId: string,
  choice: string
): {
  ok: boolean;
  correct?: boolean;
  yourChoice?: string;
  correctAnswer?: QuizChoice;
  explanation?: string;
  error?: string;
} {
  const q = QUIZZES.find((item) => item.id === questionId);
  if (!q) {
    return { ok: false, error: `Unknown question id: ${questionId}` };
  }
  const normalized = choice.trim().toUpperCase();
  if (!["A", "B", "C", "D"].includes(normalized)) {
    return { ok: false, error: "Choice must be A, B, C, or D." };
  }
  const yourChoice = normalized as QuizChoice;
  return {
    ok: true,
    correct: yourChoice === q.answer,
    yourChoice,
    correctAnswer: q.answer,
    explanation: q.explanation
  };
}
