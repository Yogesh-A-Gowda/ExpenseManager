import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
    addMoneyToAccount,
    createAccount,
    deleteAccount,
    getAccounts,
  } from "../controllers/accountControllers.js";

const router = express.Router();

router.get("/:id?", authMiddleware, getAccounts);
router.post("/create", authMiddleware, createAccount);
router.put("/add-money/:id", authMiddleware, addMoneyToAccount);
router.delete("/delete/:id?",authMiddleware,deleteAccount)

export default router;