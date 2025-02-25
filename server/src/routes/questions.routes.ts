import { amdinAuthenticate, authenticate } from "@/middleware/authentification";
import {
  addAnswers,
  editAnswers,
  removeAnswers,
} from "@controller/answer.controller";
import {
  createNewQuestion,
  deleteManyQuestions,
  deleteQuestion,
  editQuestion,
  getQuestionsWithAnswers,
  getQuestionWithAnswers,
  searchQuestion,
} from "@controller/questions.controller";
import { Router } from "express";

const router = Router();

// -----QUESTIONS----- //

// Rechercher une question
router.get("/", authenticate, searchQuestion);

// Avoir toutes les questions avec leurs réponses
router.get("/answers", authenticate, getQuestionsWithAnswers);

// Avoir une question avec leurs réponses
router.get("/:questionId/answers", authenticate, getQuestionWithAnswers);

// creéer une question
router.post("/", authenticate, amdinAuthenticate, createNewQuestion);

router.put(
  "/question/:questionId",
  authenticate,
  amdinAuthenticate,
  editQuestion
);

router.delete("/:questionId", authenticate, amdinAuthenticate, deleteQuestion);

// Supprime toutes les questions où les id sont stockés dans un tableau
router.delete("/many", authenticate, amdinAuthenticate, deleteManyQuestions);

// -----ANSWERS----- //

// ajouter une ou des réponses
router.post(
  "/:questionId/answers",
  authenticate,
  amdinAuthenticate,
  addAnswers
);

// Modifier une ou des réponses
router.put("/answers", authenticate, amdinAuthenticate, editAnswers);

// Supprimer une ou plusieurs réponses
router.delete("/answers/many", authenticate, amdinAuthenticate, removeAnswers);

module.exports = router;
