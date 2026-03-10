import dotenv from "dotenv" 
dotenv.config();
import cors from 'cors'
import chatRouter from "./routes/chat.route.js";
import express from "express";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import { dbConnection } from "./lid/db.js";
import cookieParser from "cookie-parser";
const app = express();
const PORT = process.env.PORT;

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);
app.use("/api/chat",chatRouter);





app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  dbConnection()
});