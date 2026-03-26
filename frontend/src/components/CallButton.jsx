import { VideoIcon } from "lucide-react";

function CallButton({handleVideoCall}) {
    return(
        <div className="absolute top-3 sm:top-4 right-4 sm:right-6 z-[100] flex items-center justify-end">
            <button 
                onClick={handleVideoCall} 
                className="btn btn-primary btn-sm sm:btn-md btn-circle shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 glass border-none text-white backdrop-blur-md bg-primary/90"
            >
                <VideoIcon className="size-4 sm:size-5"/>
            </button>
        </div>
    )
}

export default CallButton; 