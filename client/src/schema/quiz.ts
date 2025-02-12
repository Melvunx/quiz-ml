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
  title: z.string(),
  description: z.string().optional(),
  _count: z
    .object({
      questions: z.number().int().optional(),
    })
    .optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  questions: z.array(QuestionSchema).optional(),
  Result: z.array(z.lazy(() => ResultSchema)).optional(),
});

export const QuizzesSchema = z.array(QuizSchema);

// Result schema
export const ResultSchema = z.object({
  score: z.number().int(),
  completedAt: z.date(),
  quizId: z.string().cuid(),
  userId: z.string().cuid().optional(),
});

// Create schemas
export const CreateAnswerSchema = AnswerSchema.omit({
  createdAt: true,
  updatedAt: true,
});

export const CreateQuestionSchema = QuestionSchema.omit({
  createdAt: true,
  updatedAt: true,
  answers: true,
}).extend({
  answers: z.array(CreateAnswerSchema),
});

export const CreateQuizSchema = QuizSchema.omit({
  createdAt: true,
  updatedAt: true,
  Result: true,
}).extend({
  questions: z.array(CreateQuestionSchema),
});

// Types
export type QuestionType = z.infer<typeof QuestionTypeSchema>;
export type Answer = z.infer<typeof AnswerSchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type Quiz = z.infer<typeof QuizSchema>;
export type Result = z.infer<typeof ResultSchema>;
