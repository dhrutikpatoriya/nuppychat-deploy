import express from "express"
import { protectedRoute } from "../middleware/auth.middleware.js";
import { acceptFriendRequest, getFriendRequest, getMyFriends, getOutgoingFriendRequest, getRecommendedUsers,sendFriendRequest } from "../controler/user.controler.js";


const userRouter = express.Router();

userRouter.use(protectedRoute);

userRouter.get("/",getRecommendedUsers);
userRouter.get("/friends",getMyFriends);

userRouter.post("/friend-request/:id",sendFriendRequest);
userRouter.put("/friend-request/:id/accept",acceptFriendRequest);

userRouter.get("/getFriend-requests",getFriendRequest);

userRouter.get("/getOutgoingFriend-requests",getOutgoingFriendRequest);
export default userRouter;