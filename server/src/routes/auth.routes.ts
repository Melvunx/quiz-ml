import authenticate from "@/middleware/authentification";
import {
  login,
  logout,
  refreshToken,
  regesterNewAccount,
} from "@controller/auth.controller";
import { Router } from "express";

const router = Router();

router.post("/register", regesterNewAccount);

router.post("/login", login);

router.post("/refresh", authenticate, refreshToken);

router.post("/logout", authenticate, logout);

module.exports = router;
