import { authenticate } from "@/middleware/authentification";
import {
  addQuestions,
  createQuiz,
  deleteQuiz,
  editQuiz,
  getAllQuiz,
  getExistQuestionToQuiz,
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
// Avoir tous les quiz mais avec uniquement le nombre de question
router.get("/all", authenticate, getAllQuiz);

// Rechercher un quiz
router.get("/", authenticate, getSearchedQuiz);

// Voir le quiz avec les questions et reponses
router.get("/:quizId", authenticate, getQuiz);

router.get("/questions/:quizId", authenticate, getExistQuestionToQuiz);

// Créer un quiz
router.post("/", authenticate, createQuiz);

// Ajouter des questions dans un quiz
router.patch("/:quizId/questions/add", authenticate, addQuestions);

// Suppression de question dans un quiz
router.patch("/:quizId/questions/remove", authenticate, removeQuestions);

// Modifier quelques variables du quiz (titre et description)
router.put("/:quizId", authenticate, editQuiz);

// Supprimer un quiz
router.delete("/:quizId", authenticate, deleteQuiz);

// Avoir le resultat de tous les quiz sans les questions et réponses
router.get("/results", authenticate, getAllQuizRestults);

// Avoir le resultat d'un quiz avec les questions et réponses
router.get("/results/:resultId", authenticate, getQuizResults);

// Savegarder les résultats
router.post("/results", authenticate, saveQuizResults);

// Supprimer les résultats
router.delete("/results/:resultId", authenticate, removeQuizResults);

module.exports = router;
