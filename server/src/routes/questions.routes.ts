import { authenticate } from "@/middleware/authentification";
import {
  addAnswers,
  editAnswers,
  removeAnswer,
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

// Avoir une questions avec leurs réponses
router.get("/:questionId/answers", authenticate, getQuestionWithAnswers);

// creéer une question
router.post("/create", authenticate, createNewQuestion);

router.put("/", authenticate, editQuestion);

router.delete("/:questionId", authenticate, deleteQuestion);

// Supprime toutes les questions où les id sont stockés dans un tableau
router.delete("/many", authenticate, deleteManyQuestions);

// -----ANSWERS----- //

// ajouter une ou des réponses
router.post("/:questionId/answers/add", authenticate, addAnswers);

router.put("/answers", authenticate, editAnswers);

router.delete("/answer/:answerId", authenticate, removeAnswer);

router.delete("/answer/many", authenticate, removeAnswers);

module.exports = router;
