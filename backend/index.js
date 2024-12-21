import cors from "cors";
import express from "express";
import { config } from "dotenv";
//import router from "./routes/index.js";
import singRouter from "./routes/authRoutes.js";
import userRoute from "./routes/userRoutes.js";
import accountRouter from "./routes/accountRoutes.js";
import transactionRouter from "./routes/transactionRoutes.js";

config();

const app = express();

//middlewares
app.use(cors("*"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

//routes
//app.use("/api-v1", router);
app.use("/api-v1", singRouter);
app.use("/api-v1", userRoute);
app.use("/api-v1/account", accountRouter);
app.use("/api-v1/transaction", transactionRouter);

//Error_route
app.use("*", (req, res) => {
  return res
    .status(404)
    .json({ status: "Not found", message: "Route not found" });
});

const PORT = process.env.PORT ?? 5001;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
