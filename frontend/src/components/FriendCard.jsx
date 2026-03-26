import { Link } from 'react-router';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeFriend } from "../lib/api";
import { UserMinusIcon, MessageSquareIcon } from "lucide-react";
import toast from "react-hot-toast";
import { getLanguageFlag } from "../utils/language";

const FriendCard = ({friend}) => {
  const queryClient = useQueryClient();

  const { mutate: removeFriendMutation, isPending } = useMutation({
    mutationFn: () => removeFriend(friend._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Friend removed successfully");
    },
    onError: () => {
      toast.error("Failed to remove friend");
    }
  });

  return (
    <div className='card bg-base-100 border border-base-200 hover:border-primary/30 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group flex flex-col h-full'>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      
      <div className='card-body p-6 relative z-10 flex flex-col flex-1'>
        <div className='flex items-center gap-4 mb-4 w-full'>
          <div className='avatar relative'>
            <div className='w-16 rounded-full border-2 border-base-300 group-hover:border-primary transition-colors'>
              <img src={friend.profilePic || `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(friend.fullName)}`}
                alt={friend.fullName}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(friend.fullName)}`;
                }}
              />
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <h3 className='font-bold text-lg truncate group-hover:text-primary transition-colors'>
              {friend.fullName}
            </h3>
            <span className="text-sm text-base-content/60 truncate block mt-0.5">
               {friend.bio || "Available"}
            </span>
          </div>
        </div>

        <div className='flex flex-wrap gap-1.5 mb-2'>
          <span className='badge badge-secondary text-xs'>
            {getLanguageFlag(friend.nativeLanguage)}
              Native: {friend.nativeLanguage}
          </span>
          <span className='badge badge-outline text-xs'>
            {getLanguageFlag(friend.learningLanguage)}
            Learning: {friend.learningLanguage}
          </span>
        </div>

        <div className="mt-auto pt-4 flex gap-2">
          <Link to={`/ChatPage/${friend._id}`} className='btn btn-primary flex-1 rounded-xl shadow-sm hover:scale-[1.02] transition-transform'>
            <MessageSquareIcon className="size-4 mr-1"/>
            Message
          </Link>
          <button 
            onClick={(e) => {
              e.preventDefault();
              if(window.confirm(`Are you sure you want to remove ${friend.fullName} from your friends?`)) {
                removeFriendMutation();
              }
            }}
            disabled={isPending}
            className='btn btn-outline btn-error px-3 rounded-xl hover:scale-[1.05] transition-transform'
            title="Remove Friend"
          >
            {isPending ? <span className="loading loading-spinner size-4"></span> : <UserMinusIcon className="size-4" />}
          </button>
        </div>

      </div>
    </div>
  )
}

export default FriendCard;