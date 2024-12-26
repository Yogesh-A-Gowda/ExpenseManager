import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { changePassword, getUser, updateUser } from "../controllers/userControllers.js";
const router = express.Router();


router.get("/",authMiddleware,getUser);
router.put("/changepassword" , authMiddleware , changePassword);
router.put("/updateuser",authMiddleware, updateUser);

export default router;