import { z } from "zod";

// Enum schema
export const QuestionTypeSchema = z.enum(["SINGLE", "MULTIPLE"]);

// Answer schema
export const AnswerSchema = z.object({
  id: z.string().cuid(),
  content: z.string(),
  isCorrect: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  questionId: z.string().cuid(),
});

// Question schema
export const QuestionSchema = z.object({
  id: z.string().cuid(),
  content: z.string(),
  type: QuestionTypeSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  _count: z
    .object({
      answers: z.number().int().optional(),
      quizzes: z.number().int().optional(),
    })
    .optional(),
  answers: z.array(AnswerSchema).optional(),
});

// Question array schema
export const QuestionsSchema = z.array(QuestionSchema);

// QuizQuestion schema
export const QuizQuestionSchema = z.object({
  quizId: z.string().cuid(),
  questionId: z.string().cuid(),
  createdAt: z.string().datetime(),
  question: QuestionSchema,
});

export const QuizQuestionsSchema = z.array(QuizQuestionSchema)

// Quiz schema
export const QuizSchema = z.object({
  id: z.string().cuid(),
  title: z.string(),
  description: z.string(),
  _count: z
    .object({
      questions: z.number().int().optional(),
    })
    .optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  questions: z.array(QuizQuestionSchema).optional(),
});

export const QuizzesSchema = z.array(QuizSchema);

// Result schema
export const ResultSchema = z.object({
  id: z.string().cuid(),
  score: z.number().int(),
  completedAt: z.string().datetime(),
  quizId: z.string().cuid(),
  userId: z.string().cuid().optional(),
  quiz: QuizSchema.optional(),
});

export const ResultsSchema = z.array(ResultSchema);

// Create schemas
export const CreateAnswerSchema = AnswerSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  questionId: true,
});

export const CreateQuestionSchema = QuestionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  answers: true,
}).extend({
  answers: z.array(CreateAnswerSchema),
});

export const CreateQuizQuestionSchema = z.object({
  questionId: z.string().cuid(),
});

export const CreateQuizSchema = QuizSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  questions: true,
}).extend({
  questions: z.array(CreateQuizQuestionSchema).optional(),
});

export const AddQuestionToQuizSchema = z.object({
  quizId: z.string().cuid(),
  questionId: z.string().cuid(),
});

export const saveQuizResults = ResultSchema.omit({
  id: true,
  completedAt: true,
});

// Types
export type QuestionType = z.infer<typeof QuestionTypeSchema>;
export type Answer = z.infer<typeof AnswerSchema>;
export type CreateAnswer = z.infer<typeof CreateAnswerSchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;
export type CreateQuizQuestion = z.infer<typeof CreateQuizQuestionSchema>;
export type Quiz = z.infer<typeof QuizSchema>;
export type Result = z.infer<typeof ResultSchema>;
export type AddQuestionToQuiz = z.infer<typeof AddQuestionToQuizSchema>;
