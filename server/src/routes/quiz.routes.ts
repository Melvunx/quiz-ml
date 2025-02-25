import { amdinAuthenticate, authenticate } from "@/middleware/authentification";
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
router.get("/quiz-detail/:quizId", authenticate, getQuiz);

router.get("/questions/:quizId", authenticate, getExistQuestionToQuiz);

// Créer un quiz
router.post("/", authenticate, amdinAuthenticate, createQuiz);

// Ajouter des questions dans un quiz
router.patch(
  "/:quizId/questions/add",
  authenticate,
  amdinAuthenticate,
  addQuestions
);

// Suppression de question dans un quiz
router.patch(
  "/:quizId/questions/remove",
  authenticate,
  amdinAuthenticate,
  removeQuestions
);

// Modifier quelques variables du quiz (titre et description)
router.put("/:quizId", authenticate, amdinAuthenticate, editQuiz);

// Supprimer un quiz
router.delete("/:quizId", authenticate, amdinAuthenticate, deleteQuiz);

// Avoir le resultat de tous les quiz sans les questions et réponses
router.get("/results", authenticate, getAllQuizRestults);

// Avoir le resultat d'un quiz avec les questions et réponses
router.get("/results/:resultId", authenticate, getQuizResults);

// Savegarder les résultats
router.post("/results", authenticate, saveQuizResults);

// Supprimer les résultats
router.delete(
  "/results/:resultId",
  authenticate,
  amdinAuthenticate,
  removeQuizResults
);

module.exports = router;
