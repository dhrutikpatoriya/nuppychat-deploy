import { upsertStreamUser } from "../lid/stream.js";
import User from "../modules/user.js"
import jwt from "jsonwebtoken"

export async function signup(req,res){
    const {email,fullName,password} = req.body;
    try {
        if(!fullName || !email || !password ){
            return res.status(400).json({message : "All fild are required"});
        }
        if(password.length < 6){
            return res.status(400).json({message : "password must be atleast 6 characters"});
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({message : "Invalid email formate"});
        }
        const existingEmail = await User.findOne({email});
        if(existingEmail){
            return res.status(400).json({message : "email already axists, please use different email"});
        }
        
        const randomAvtar = `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`;

        const newUser = await User.create({
            email,
            fullName,
            password,
            profilePic : randomAvtar 
        });

        try {
            await upsertStreamUser({
                id : newUser._id.toString(),
                name : newUser.fullName,
                image : newUser.profilepic || "",
            });
            console.log(`Stream user created for ${newUser.fullName}`)
        } catch (error) {
            console.log("Error creating stream user",error)
        }


        const token = jwt.sign({userId:newUser._id},process.env.JWT_SECRET_KEY,{
            expiresIn : "7d"
        })

        res.cookie("jwt",token,{
            maxAge : 7 * 24 * 60 * 60 *1000,
            httpOnly : true,
            sameSite: "strict",
            secure : process.env.NODE_ENV === "production"
        })

        res.status(201).json({success:true,user:newUser})

    } catch (error) {
        console.log("error in signUp controller : ",error);
        res.status(500).json({message : "Internal server error"})
    }
}
export async function login(req,res){
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(401).json("All field are required");
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json("Invalid email or password");
        }
        const isPasswordCorrect = await user.matchPassword(password);
        if(!isPasswordCorrect){
            return res.status(401).json("Invalid email or password");
        }
        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY,{
            expiresIn : "7d"
        })

        res.cookie("jwt",token,{
            maxAge : 7 * 24 * 60 * 60 *1000,
            httpOnly : true,
            sameSite: "strict",
            secure : process.env.NODE_ENV === "production"
        })
        return res.status(200).json({stauts : true,user})
        console.log(user)

        
    } catch (error) {
        console.log("error in login controler : ",error)
        return res.status(500).json({message : "internal server error"})
    }
}
export function logout(req,res){
    res.clearCookie("jwt");
    res.status(200).json({status : true,message : "logout successfull"})
}
export async function onboard(req,res){
    try {
        const userId = req.user._id;
        const {fullName,bio,nativeLanguage,learningLanguage,location} = req.body;

        if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
            return res.status(400).json({
                message : "All field are required",
                missingField : [
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location"
                ].filter(Boolean),
            })
        }
        const updatedUser = await User.findByIdAndUpdate(userId,{
            ...req.body,
            isOnborded : true,
            
        },{new:true})

        if(!updatedUser){
            return res.status(404).json({message:"User not found"});
        }

        try {
            await upsertStreamUser({
                id : updatedUser._id,
                name : updatedUser.fullName,
                image : updatedUser.profilePic || ""
            })
            console.log(`Stream user updated after onvording for ${updatedUser.fullName}`)
        } catch (streamError) {
            console.log("Error updating Stream user during onboarding:", streamError.message);
        }

        res.status(200).json({success : true ,user:updatedUser})
    } catch (error) {
        console.error("Onbording error : ",error)
        res.status(500).json({ message: "Internal Server Error"});
    }
}


