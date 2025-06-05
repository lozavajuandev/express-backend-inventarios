import express from "express";
import createNewCount from "../controllers/counts.controller.js";
const router = express.Router();

router.get("/", async (req, res) => {
  res.status(200).json({ message: "Counts endopoint`" });
});

router.post("/submitCount", createNewCount);

export default router;
