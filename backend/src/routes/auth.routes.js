import { Router } from "express";
import {
  refreshToken,
  loginController,
  registerController,
  getmeController,
} from "../controllers/auth.controller.js";
import {
  loginValidation,
  registerValidation,
} from "../validations/auth.validation.js";
import { authenticate } from "../middleware/auth.middleware.js";
const router = Router();

router.post("/register", registerValidation, registerController);
router.post("/login", loginValidation, loginController);
router.post("/refresh", refreshToken);
router.get("/getme", authenticate, getmeController);
export default router;
