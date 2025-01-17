require("dotenv").config();
import express from "express";

const { PORT } = process.env;

const app = express();

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${Number(PORT)}`);
})
