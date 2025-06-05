import express from "express";
import {
  register,
  logIn,
  listUsers,
  logOut,
} from "../controllers/auth.controllers.js";

const router = express.Router();

router.get("/", listUsers);

router.post("/register", register);
router.post("/login", logIn);
router.post("/logout", logOut);

export default router;
