require("dotenv").config();
import cookieParser from "cookie-parser";
import express from "express";
import colors from "./schema/colors.schma";
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const { PORT } = process.env;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const authRoutes = require("@routes/auth.routes");
const questionsRoutes = require("@routes/questions.routes");
const quizRoutes = require("@routes/quiz.routes");
const resultsRoutes = require("@routes/results.routes");

app.use("/api/auth", authRoutes);
app.use("/api/questions", questionsRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/results", resultsRoutes);

app.listen(PORT, () => {
  console.log(
    colors.info(`Server is running on port http://localhost:${Number(PORT)}`)
  );
});

app.get("/", (request, response) => {
  response.send("Hello World!");
});
