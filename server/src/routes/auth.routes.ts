import { login, regesterNewAccount } from "@controller/auth.controller";
import { Router } from "express";

const router = Router();

router.post("/register", regesterNewAccount);

router.post("/login", login);

module.exports = router;
