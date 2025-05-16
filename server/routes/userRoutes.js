import express from "express";
import {
  resisterUser,
  loginUser,
  getUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", resisterUser);
router.post("/login", loginUser);
router.get("/:id", getUser);

export default router;
