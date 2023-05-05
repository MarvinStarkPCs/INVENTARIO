import { Router } from "express";
import { isLoggedIn } from "../middlewares/protectedRoutes.js";
import { validator } from "../middlewares/validator.middleware.js";
import {
  renderAddArticle,
  addArticle,
  renderArticle,
  deleteArticle,
  editArticle,
  renderEditarticle,
} from "../controllers/article.controller.js";
import { createArticleSchema } from "../schemas/task.schema.js";

const router = Router();

// Routes
router.get("/", isLoggedIn, renderArticle);
router.get("/add", isLoggedIn, renderAddArticle);
router.post("/add", isLoggedIn, addArticle);
router.get("/delete/:id", isLoggedIn, deleteArticle);
router.get("/edit/:id", isLoggedIn, renderEditarticle);
router.post("/edit/:id", isLoggedIn, editArticle);

export default router;
