import { useNavigate, useParams } from 'react-router'
import useAuathUser from '../hooks/useAuathUser'
import { getStreamToken } from '../lib/api'
import { useEffect, useState } from 'react'
// import type { CallingState, StreamCall, StreamVideo, StreamVideoClient, useCall, useCallStateHooks, User } from "@stream-io/video-react-sdk";
import {
  CallControls,
  CallingState,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import PageLoder from "../components/PageLoder"

import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
const CallPage = () => {

  const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;
  const {id:callId} = useParams()
  const [client,setClient] = useState(null)
  const [call,setCall] = useState(null)
  const [isConnecting,setIsConnecting] = useState(true)
  const {authUser,isLoading} = useAuathUser();
  
  const {data:tokenData} = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser
  })

  useEffect(()=>{
    const initCall = async () =>{
      if(!callId || !authUser || !tokenData.token) return;
      
      try {
        console.log("Initializing video call client... ");
        
        const user = {
          id : authUser._id,
          name : authUser.fullName,
          image : authUser.profilePic || `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(authUser.fullName)}`
        }

        const videoClient = new StreamVideoClient({
          apiKey : STREAM_API_KEY,
          user,
          token : tokenData.token
        })
        
        const callInstance = videoClient.call("default",callId)

        await callInstance.join({create:true})

        console.log("Joined call Successfully");
        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.error("Error joining Call : ",error);
        toast.error("could not join call. please try again");
      } finally{
        setIsConnecting(false);
      }
      
    }
    initCall();
  },[tokenData,authUser,callId])

  if(isLoading || isConnecting) return <PageLoder/>
  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <div className='relative'>
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent/>
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className='flex items-center justify-center h-full'>
            <p>could not initialize call. please refresh or try again later.</p>
          </div>
        )

        }
      </div>
    </div>
  )
}

const CallContent = () =>{
  const {useCallCallingState} = useCallStateHooks();
  const callingState = useCallCallingState();
  const navigate = useNavigate();

  if(callingState === CallingState.LEFT) return navigate("/");

  return (
    <StreamTheme>
      <SpeakerLayout/>
      <CallControls/>
    </StreamTheme>
  )
}

export default CallPage


