import {
  createQuiz,
  deleteQuiz,
  EditQuiz,
  getAllQuiz,
  getQuiz,
  getSearchedQuiz,
} from "@controller/quiz.controller";
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

module.exports = router;
