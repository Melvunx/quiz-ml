require("dotenv").config();
import cookieParser from "cookie-parser";
import express from "express";
import colors from "./schema/colors.schema";
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const { PORT, FRONTEND_URL } = process.env;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

const authRoutes = require("./auth.routes");
const questionsRoutes = require("./routes/questions.routes");
const quizRoutes = require("./routes/quiz.routes");

app.use("/api/auth", authRoutes);
app.use("/api/questions", questionsRoutes);
app.use("/api/quiz", quizRoutes);

app.listen(PORT, () => {
  console.log(
    colors.info(`Server is running on port http://localhost:${Number(PORT)}`)
  );
});

app.get("/", (request, response) => {
  response.send("Hello World!");
});
