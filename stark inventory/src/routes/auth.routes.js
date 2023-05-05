import { Router } from "express";
import {
  renderSignUp,
  signUp,
  renderSignIn,
  signIn,
  renderForgotPassword,
  forgotPassword,
  logout,

} from "../controllers/auth.controller.js";
import { validator } from "../middlewares/validator.middleware.js";
import { signinSchema, signupSchema, resetPasswordSchema} from "../schemas/auth.schema.js";

const router = Router();

// SIGNUP
router.get("/signup", renderSignUp);
router.post("/signup", validator(signupSchema), signUp);

// SINGIN

router.get("/signin", renderSignIn);
router.post("/signin", validator(signinSchema), signIn);

//resetpassword
router.get("/forgot-password", renderForgotPassword);
router.post("/forgot-password", validator(resetPasswordSchema), forgotPassword);



router.get("/logout", logout);

export default router;
