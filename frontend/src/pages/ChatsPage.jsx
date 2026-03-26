import { Link } from "react-router";
import UseFriends from "../hooks/useFriends";
import { MessageSquareIcon, SearchIcon } from "lucide-react";
import { useState } from "react";

const ChatsPage = () => {
  const { friends = [], loadingFriends } = UseFriends();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFriends = friends.filter(friend => 
    friend.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='p-4 sm:p-6 lg:p-8 w-full max-w-4xl mx-auto'>
      <div className="container mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Messages
            </h2>
            <p className="text-base-content/60 mt-1">Select a friend to start chatting</p>
          </div>
          
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="size-5 text-base-content/40" />
            </div>
            <input
              type="text"
              className="input input-bordered w-full pl-10 bg-base-200/50 backdrop-blur-sm focus:border-primary transition-all rounded-full"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : filteredFriends.length === 0 ? (
           <div className="card bg-base-200/50 backdrop-blur-sm p-8 text-center border border-base-300">
             <MessageSquareIcon className="size-12 mx-auto mb-4 text-base-content/20" />
             <h3 className="font-semibold text-lg mb-2">No conversations found</h3>
             <p className="text-base-content opacity-70">
               {searchQuery ? "Try a different search term" : "Add some friends to start chatting!"}
             </p>
             {!searchQuery && <Link to="/" className="btn btn-primary mt-4 rounded-full px-8">Find Friends</Link>}
           </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:gap-4 mt-8">
            {filteredFriends.map((friend) => (
              <Link 
                key={friend._id} 
                to={`/ChatPage/${friend._id}`}
                className="group flex flex-row items-center gap-4 p-4 sm:p-5 rounded-2xl bg-base-100 border border-base-200 hover:border-primary/30 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                
                <div className="avatar relative">
                  <div className="w-14 sm:w-16 rounded-full border-2 border-base-300 group-hover:border-primary transition-colors">
                    <img 
                      src={friend.profilePic || `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(friend.fullName)}`} 
                      alt={friend.fullName}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(friend.fullName)}`;
                      }}
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-success border-2 border-base-100 rounded-full z-10 shadow-[0_0_5px_rgba(0,0,0,0.1)]"></span>
                </div>
                
                <div className="flex flex-col flex-1 overflow-hidden pl-1">
                   <h3 className="text-lg font-bold truncate group-hover:text-primary transition-colors">{friend.fullName}</h3>
                   <span className="text-sm text-base-content/60 truncate mt-0.5">
                     {friend.bio || "Available"}
                   </span>
                </div>
                
                <div className="ml-auto flex items-center justify-center">
                   <div className="btn btn-circle btn-ghost bg-base-200 group-hover:bg-primary group-hover:text-white transition-all duration-300 transform group-hover:scale-110 shadow-sm">
                      <MessageSquareIcon className="size-5" />
                   </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatsPage;
