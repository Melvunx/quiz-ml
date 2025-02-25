import { authenticate } from "@/middleware/authentification";
import {
  adminAuth,
  auth,
  login,
  logout,
  refreshToken,
  regester,
} from "@controller/auth.controller";
import { Router } from "express";
import { amdinAuthenticate } from "../middleware/authentification";

const router = Router();

router.post("/register", regester);

router.post("/login", login);

router.post("/refresh-token", authenticate, refreshToken);

router.get("/check-auth", authenticate, auth);

router.get("/check-admin", authenticate, amdinAuthenticate, adminAuth);

router.post("/logout", authenticate, logout);

module.exports = router;
