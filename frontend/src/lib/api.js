import { axiosInstance } from "./axios.js";

export const signup = async (signupData) => {
      const response = await axiosInstance.post("/auth/signup",signupData);
      return response.data
}

export const login = async (loginData) =>{
      const response = await axiosInstance.post("/auth/login",loginData);
      return response.data
}

export const logout = async() =>{
      const response = await axiosInstance.post("/auth/logout");
      return response.data
}

export const getAuthUser = async () =>{
      try {
            const response = await axiosInstance.get("/auth/me")
            return response.data
            
      } catch (error) {
            console.log("error in getrAuth User:",error)
            return null;
      }
}

export const onbording = async (onbordingData) =>{
      const response = await axiosInstance.post("/auth/onbording",onbordingData);
      return response.data;
}

export async function getUserFriends() {
      try {
            const response = await axiosInstance.get("/user/friends");
            return response.data;    
      } catch (error) {
            console.log("error in getrUserFriends :",error)
            return null;
      } 
}

export async function getRecommendedUsers() {
      const response = await axiosInstance.get("/user");
      return response.data;
}

export async function getOutgoingFriendReqs(){
      try {
    const response = await axiosInstance.get("/user/getOutgoingFriend-requests");
            return response.data;
      } catch (error) {
            console.log("error in getOutgoingFriendReqs :",error)
            return null;
      }
}

export async function sendFriendRequest(userId) {
      const response = await axiosInstance.post(`/user/friend-request/${userId}`);
      return response.data;
}

export async function getFriendRequest() {
      const response = await axiosInstance.get("/user/getFriend-requests");
      return response.data;
}

export async function acceptFriendRequestMutation(reqId) {
      const response = await axiosInstance.put(`/user/friend-request/${reqId}/accept`);
      return response.data;
}

export async function getStreamToken() {
      const response = await axiosInstance.get("/chat/token");
      return response.data;
}     