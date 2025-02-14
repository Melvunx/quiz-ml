import { z } from "zod";

// Enum schema
export const QuestionTypeSchema = z.enum(["SINGLE", "MULTIPLE"]);

// Answer schema
export const AnswerSchema = z.object({
  id: z.string().cuid(),
  content: z.string(),
  isCorrect: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  questionId: z.string().cuid(),
});

// Question schema
export const QuestionSchema = z.object({
  id: z.string().cuid(),
  content: z.string(),
  type: QuestionTypeSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z
    .object({
      answers: z.number().int().optional(),
    })
    .optional(),
  quizId: z.string().cuid().optional(),
  answers: z.array(AnswerSchema).optional(),
});

// Question array schema
export const QuestionsSchema = z.array(QuestionSchema);

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
  createdAt: z.date(),
  updatedAt: z.date(),
  questions: z.array(QuestionSchema).optional(),
});

export const QuizzesSchema = z.array(QuizSchema);

// Result schema
export const ResultSchema = z.object({
  id: z.string().cuid(),
  score: z.number().int(),
  completedAt: z.date(),
  quizId: z.string().cuid(),
  userId: z.string().cuid().optional(),
  quiz: QuizSchema,
});

export const ResultsSchema = z.array(ResultSchema);

// Create schemas
export const CreateAnswerSchema = AnswerSchema.omit({
  createdAt: true,
  updatedAt: true,
});

export const CreateQuestionSchema = QuestionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  answers: true,
});

export const CreateQuizSchema = QuizSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const saveQuizResults = ResultSchema.omit({
  id: true,
  completedAt: true,
});

// Types
export type QuestionType = z.infer<typeof QuestionTypeSchema>;
export type Answer = z.infer<typeof AnswerSchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type Quiz = z.infer<typeof QuizSchema>;
export type Result = z.infer<typeof ResultSchema>;
