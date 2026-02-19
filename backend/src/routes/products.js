import express from "express";
import {
  addFavorite,
  createProduct,
  deleteProduct,
  getMyFavorites,
  getProductById,
  getProducts,
  removeFavorite,
  updateProduct,
} from "../controllers/productController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getProductById);

router.post("/", auth, createProduct);

router.put("/:id", auth, updateProduct);

router.delete("/:id", auth, deleteProduct);

router.post("/:id/favorite", auth, addFavorite);

router.delete("/:id/favorite", auth, removeFavorite);

router.get("/me/favorites", auth, getMyFavorites);

export default router;
