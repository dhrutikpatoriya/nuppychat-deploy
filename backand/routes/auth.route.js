import express from "express";
import { login, logout, onboard, signup } from "../controler/auth.controler.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const authRouter = express.Router()

authRouter.post("/signup",signup)
authRouter.post("/login",login)
authRouter.post("/logout",logout)

authRouter.post("/onbording",protectedRoute,onboard)
authRouter.get("/me",protectedRoute,(req,res)=>{
    res.status(200).json({success : true, user:req.user})
})

export default authRouter;
