import { Router } from "express";
import {
  addMoneyToAccount,
  createAccount,
  getAccounts,
} from "../controller/accountController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const accountRouter = Router();

accountRouter.get("/", authMiddleware, getAccounts);

accountRouter.post("/create", authMiddleware, createAccount);

accountRouter.put("/add-money/:id", authMiddleware, addMoneyToAccount);

export default accountRouter;
