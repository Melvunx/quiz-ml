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

// -----QUESTIONS-----

// Rechercher une question
router.get("/", searchQuestion);

// Avoir toutes les questions avec leurs réponses
router.get("/answers", getQuestionsWithAnswers);

// Avoir une questions avec leurs réponses
router.get("/:questionId/answers", getQuestionWithAnswers);

// creéer une question
router.post("/create", createNewQuestion);

router.put("/", editQuestion);

router.delete("/:questionId", deleteQuestion);

// Supprime toutes les questions où les id sont stockés dans un tableau
router.delete("/many", deleteManyQuestions);

// -----ANSWERS-----

// ajouter une ou des réponses
router.post("/:questionId/answers/add", addAnswers);

router.put("/answers", editAnswers);

router.delete("/answer/:answerId", removeAnswer);

router.delete("/answer/many", removeAnswers);

module.exports = router;
