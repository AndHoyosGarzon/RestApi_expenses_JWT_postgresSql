import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getUser,
  changePassword,
  updateUser,
} from "../controller/userController.js";

const userRoute = Router();

userRoute.get("/user", authMiddleware, getUser);

userRoute.put("/change-password", authMiddleware, changePassword);
userRoute.put("/", authMiddleware, updateUser);

export default userRoute;
