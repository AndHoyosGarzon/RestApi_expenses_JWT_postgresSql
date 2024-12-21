import { Router } from "express";
import {
  getTransations,
  getDashboarInformation,
  addTransation,
  transferMoneyToAccount,
} from "../controller/transactionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const transactionRouter = Router();

transactionRouter.get("/", authMiddleware, getTransations);
transactionRouter.get("/dashboard", authMiddleware, getDashboarInformation);

transactionRouter.post(
  "/add-transaction/:account_id",
  authMiddleware,
  addTransation
);

transactionRouter.put(
  "/transfer-money",
  authMiddleware,
  transferMoneyToAccount
);

export default transactionRouter;
