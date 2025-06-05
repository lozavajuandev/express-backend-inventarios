import express from "express";

const router = express.Router();

router.get("", async () => {
  return "items endpoint";
});

export default router;
