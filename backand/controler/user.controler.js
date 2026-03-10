import User from "../modules/user.js";
import FriendRequest from "../modules/FriendRequest.js"

export async function getRecommendedUsers(req,res){
    try {
        const currentUserId = req.user._id;
        const currentUser = req.user;

        const getRecommendedUsers = await User.find({
            $and:[
                {_id:{$ne:currentUserId}},
                {_id :{$nin:currentUser.friends}},
                {isOnborded:true},
            ],
        });
        
        res.status(200).json(getRecommendedUsers)
    } catch (error) {
        console.error("Error in getRecommendedUsers controller", error.message);
        res.status(500).json({ message: "Internal Server Error"});
    }

}

export async function getMyFriends(req,res){
    try {
        const user = await User.findById(req.user._id)
        .select("friends")
        .populate("friends" , "fullName profilePic nativeLanguage learningLanguage")
        res.status(200).json(user.friends)
    } catch (error) {
        console.error("Error in getMyFriends controller", error.message);
        res.status(500).json({ message: "Internal Server Error"});
    }
}

export async function sendFriendRequest(req,res){

    try {
        
        const myId = req.user._id;
        const {id:recipientId} = req.params;
    
        if(myId.toString() === recipientId){
            return res.status(400).json({message : "you can't send request to youreself"});
        }
        const recipient = await User.findById(recipientId);
        if(!recipient){
            return res.status(404).json({message : "recipient not found"});
        }
        if(recipient.friends.includes(myId)){
            return res.status(400).json({message : "you already friends with this user"});
        }
         
        const existingRequest = await FriendRequest.findOne({
            $or:[
                {sender:myId,recipient:recipientId},
                {sender:recipientId,recipient:myId}
            ]
        })
        if(existingRequest){
            return res.status(400).json({message : "Friend request already send"})
        }
    
        const friendRequest = await FriendRequest.create({
            sender:myId,
            recipient:recipientId
        });

        res.status(201).json({friendRequest})
    } catch (error) {
        console.error("error in sendFriendRequest : ",error.message);
        res.status(500).json({message:"Internal server error"});
    }

}

export async function acceptFriendRequest(req,res) {
    try {
        const {id:requestId} = req.params;
        const friendRequest = await FriendRequest.findById(requestId);

        if(!friendRequest){
            return res.status(400).json({message:"friend request not found"});
        }
        if(friendRequest.recipient.toString() !== req.user.id){
            return res.status(400).json({message:"Unauthorized to accept this request"});
        }

        friendRequest.status = "accepted"
        await friendRequest.save()

        await User.findByIdAndUpdate(friendRequest.sender,{
            $addToSet:{friends : friendRequest.recipient}
        })
        
        await User.findByIdAndUpdate(friendRequest.recipient,{
            $addToSet:{friends : friendRequest.sender}
        })
        res.status(200).json("friend request accepted successfully")
    } catch (error) {
        console.error("error in accept friend request : ",error.message);
        res.status(500).json({message:"interner server error "});
    }
}

export async function getFriendRequest(req,res) {
    try {
        const incomingRequest = await FriendRequest.find({
            recipient : req.user.id,
            status:"pending"
        }).populate("sender","fullName profilePic nativeLanguage learningLanguage")
        
        const acceptRequest = await FriendRequest.find({
            sender:req.user.id,
            status:"accepted"
        }).populate("recipient","fullName profilePic")
        
    res.status(200).json({incomingRequest,acceptRequest});
    } catch (error) {
        console.error("error in geFriendRequest : ",error.message);
        res.status(500).json({message:"internel server error"});
    }
}

export async function getOutgoingFriendRequest(req,res) {
    try {
        const outgoingFriendReqs = await FriendRequest.find({
            sender:req.user.id,
            status:"pending"
        }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage")
        res.status(200).json({outgoingFriendReqs});
    } catch (error) {
        console.error("error in outgoing Friend Request : ",error.message);
        res.status(500).json("internel server error ");
    }
}