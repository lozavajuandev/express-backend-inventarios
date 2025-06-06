import express from "express";

import {
  listCounts,
  createNewCount,
} from "../controllers/counts.controller.js";

const router = express.Router();

router.get("/", listCounts);

router.post("/submit", createNewCount);

export default router;
