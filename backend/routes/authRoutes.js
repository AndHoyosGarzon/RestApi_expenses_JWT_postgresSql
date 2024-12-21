import { Router } from "express";
import { signupUser, signinUser } from "../controller/authController.js";

const singRouter = Router()

singRouter.post("/sign-up", signupUser)
singRouter.post("/sign-in", signinUser)



export default singRouter