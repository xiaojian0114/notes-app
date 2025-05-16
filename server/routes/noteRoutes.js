import express from "express";

import {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
  getNotesByCategory,
} from "../controllers/noteController.js";

const router = express.Router();

router.post("/", createNote);
router.get("/user/:userId", getNotes);
router.get("/:id", getNote);
router.get("/categories/:userId/:categoryId", getNotesByCategory);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
