import { LoaderIcon } from "lucide-react"

const ChatLoder = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center p-4">
        <LoaderIcon className="animate-spin size-10 text-primary"/>
        <p className="mt-4 text-center text-lg font-mono">Connecting to chat...</p>
    </div>
  )
}

export default ChatLoder;