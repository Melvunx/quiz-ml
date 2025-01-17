require("dotenv").config();
import cookieParser from "cookie-parser";
import express from "express";
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const { PORT } = process.env;

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${Number(PORT)}`);
});
