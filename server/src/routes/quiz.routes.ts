import authenticate from "@/middleware/authentification";
import {
  createQuiz,
  deleteQuiz,
  editQuiz,
  getAllQuiz,
  getQuiz,
  getSearchedQuiz,
} from "@controller/quiz.controller";
import {
  getAllQuizRestults,
  getQuizResults,
  removeQuizResults,
  saveQuizResults,
} from "@controller/results.controller";
import { Router } from "express";

const router = Router();

router.get("/all", authenticate, getAllQuiz);

// Rechercher un quiz
router.get("/", authenticate, getSearchedQuiz);

// Voir le quiz avec le nombre de questions
router.get("/:quizId", authenticate, getQuiz);

router.post("/create", authenticate, createQuiz);

// Modifier quelques variables du quiz (titre et description)
router.put("/", authenticate, editQuiz);

router.delete("/:quizId", authenticate, deleteQuiz);

// Avoir le resultat de tous les quiz
router.get("/results", authenticate, getAllQuizRestults);

router.get("/results/:resultsId", authenticate, getQuizResults);

router.post("/results/save", authenticate, saveQuizResults);

router.delete("/results/:resultId", authenticate, removeQuizResults);

module.exports = router;
