import authenticate from "@/middleware/authentification";
import {
  addQuestions,
  createQuiz,
  deleteQuiz,
  editQuiz,
  getAllQuiz,
  getQuiz,
  getSearchedQuiz,
  removeQuestions,
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

// Créer un quiz
router.post("/create", authenticate, createQuiz);

// Ajouter des questions dans un quiz
router.patch("/:quizId/questions/add", authenticate, addQuestions);

// Suppression de question dans un quiz
router.patch("/:quizId/questions/remove", authenticate, removeQuestions);
// Modifier quelques variables du quiz (titre et description)
router.put("/:quizId", authenticate, editQuiz);

router.delete("/:quizId", authenticate, deleteQuiz);

// Avoir le resultat de tous les quiz
router.get("/results", authenticate, getAllQuizRestults);

router.get("/results/:resultsId", authenticate, getQuizResults);

router.post("/results/save", authenticate, saveQuizResults);

router.delete("/results/:resultId", authenticate, removeQuizResults);

module.exports = router;
