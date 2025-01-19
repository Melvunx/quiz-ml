import {
  createQuiz,
  deleteQuiz,
  EditQuiz,
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

router.get("/all", getAllQuiz);

// Rechercher un quiz
router.get("/", getSearchedQuiz);

// Voir le quiz avec le nombre de questions
router.get("/:quizId", getQuiz);

router.post("/create", createQuiz);

// Modifier quelques variables du quiz (titre et description)
router.put("/", EditQuiz);

router.delete("/:quizId", deleteQuiz);

// Avoir le resultat de tous les quiz
router.get("/results", getAllQuizRestults);

router.get("/results/:resultsId", getQuizResults);

router.post("/results/save", saveQuizResults);

router.delete("/results/:resultId", removeQuizResults);

module.exports = router;
