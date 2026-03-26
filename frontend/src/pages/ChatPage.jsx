import useAuathUser from "../hooks/useAuathUser";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import { useEffect, useState } from "react";
import {Channel,ChannelHeader,Chat,MessageInput,MessageList,Thread,Window} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import ChatLoder from "../components/ChatLoder";
import toast from "react-hot-toast";
import CallButton from "../components/CallButton";
import { ArrowLeftIcon } from "lucide-react";



const ChatPage = () => {

  const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;
  const {id:targetUserId} = useParams();
  const navigate = useNavigate();

  const [chatClient,setChatClient] = useState(null);
  const [channel,setChannel] = useState(null);
  const [loading,setLoading] = useState(true);

  const {authUser} =  useAuathUser();

  const {data:tokenData} = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser
  })

  useEffect(()=>{
    const initChat = async () => {
      if(!tokenData?.token || !authUser) return;

      try {
        console.log("Initializing stream chat client...");

        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser({
          id:authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic || `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(authUser.fullName)}`
        },tokenData.token)

        const channelId = [authUser._id,targetUserId].sort().join("-");

        const currChannel = client.channel("messaging",channelId,{
          members: [authUser._id,targetUserId],
        })
        await currChannel.watch();
        setChatClient(client)
        setChannel(currChannel)

      } catch (error) {
          console.error("Error initializing chat:", error);
          toast.error("Could not connect to chat. Please try again.");
      } finally{
        setLoading(false);
      }
    };
    initChat();
  },[tokenData,authUser,targetUserId])

  const handleVideoCall = ()=>{
    if(channel){
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text:`I've started a video call. join me hear: ${callUrl}`
      })
      toast.success("Video call link sent successfully! ");
    }
  }
  if(loading || !chatClient || !channel) return <ChatLoder/>
  
  return (
    <div className="h-[calc(100vh-4rem)] w-full flex flex-col bg-base-100 overflow-hidden">
      
      <div className="flex items-center px-4 py-2 border-b border-base-200 bg-base-100 z-50">
         <button onClick={() => navigate("/ChatsPage")} className="btn btn-ghost btn-sm rounded-full gap-2">
            <ArrowLeftIcon className="size-4" />
            <span className="hidden sm:inline">Back to Chats</span>
         </button>
      </div>

      <div className="flex-1 w-full relative flex flex-col">
        <Chat client={chatClient}>
          <Channel channel={channel}>
            <div className="w-full h-full relative flex flex-col">
              <CallButton handleVideoCall={handleVideoCall}/>
              <Window>
                <ChannelHeader/>
                <MessageList/>
                <MessageInput focus/>
              </Window>
            </div>
            <Thread />
          </Channel>
        </Chat>
      </div>
    </div>
  )
}


export default ChatPage




