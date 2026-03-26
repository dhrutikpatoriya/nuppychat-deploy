import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getOutgoingFriendReqs, getRecommendedUsers, getUserFriends, sendFriendRequest } from "../lib/api";
import { CheckCircleIcon, MapPinIcon, UserIcon, UserPlusIcon, SearchIcon } from "lucide-react";
import { Link } from "react-router";
import FriendCard from "../components/FriendCard";
import { getLanguageFlag } from "../utils/language";
import NoFriendsFound from "../components/NoFriendsFound";
import UseFriends from "../hooks/useFriends";

const Homepage = () => {
  const queryClient = useQueryClient();

  const [outgoingRequestIds, setOutgoingRequestIds] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const {friends=[],loadingFriends} = UseFriends();

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers
  });

  const { data} = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs
  });
  
  const outgoingFriendReqs = data?.outgoingFriendReqs || [];

  const { mutate: sendRequestMutation, variables: pendingUserId, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:["outgoingFriendReqs"]});
      queryClient.invalidateQueries({queryKey:["users"]}); 
    },
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        if (req?.recipient?._id) {
          outgoingIds.add(req.recipient._id);
        }
      })
      setOutgoingRequestIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  const filteredFriends = friends.filter(f => f.fullName.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredUsers = recommendedUsers.filter(u => u.fullName.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className='p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto'>
      <div className="container mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Discover
            </h2>
            <p className="text-base-content/60 mt-1">Connect with friends and meet new people</p>
          </div>
          
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <SearchIcon className="size-4 text-base-content/40" />
            </div>
            <input
              type="text"
              className="input input-bordered w-full pl-10 bg-base-200/50 backdrop-blur-sm focus:border-primary transition-all rounded-full border-base-300"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Your Friends */}
        <section>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Your Friends</h2>
            <Link to="/NotificationPage" className="btn btn-outline btn-sm rounded-full hover:scale-105 transition-transform">
              <UserIcon className="size-4 mr-1.5" />
              Friend Requests
            </Link>
          </div>

          {loadingFriends ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : filteredFriends.length === 0 ? (
             <div className="card bg-base-200/50 backdrop-blur-sm p-6 text-center border border-base-300">
               <p className="text-base-content opacity-70">
                  {searchQuery ? "No friends match your search." : "You haven't added any friends yet."}
               </p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFriends.filter(f => f).map((friend) => (
                <FriendCard key={friend._id} friend={friend} />
              ))}
            </div>
          )}
        </section>

        {/* Meet New Users */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Meet New Users</h2>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="card bg-base-200/50 p-8 text-center border border-base-300 rounded-2xl">
              <h3 className="font-semibold text-lg mb-2">No recommendations available</h3>
              <p className="text-base-content opacity-70">
                {searchQuery ? "Try a different search term" : "Check back later for new friends!"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestIds.has(user._id);
                const isThisUserPending = isPending && pendingUserId === user._id;

                return (
                  <div
                    key={user._id}
                    className="card bg-base-100 border border-base-200 hover:border-primary/30 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    <div className="card-body p-6 space-y-4 relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="avatar">
                          <div className="w-16 rounded-full border-2 border-base-300 group-hover:border-primary transition-colors">
                            <img src={user.profilePic || `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(user.fullName)}`}
                              alt={user.fullName}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(user.fullName)}`;
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{user.fullName}</h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-70 mt-1">
                              <MapPinIcon className="size-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className='flex flex-wrap gap-1.5'>
                        <span className='badge badge-secondary'>
                          {getLanguageFlag(user.nativeLanguage)}
                          Native: {capitialize(user.nativeLanguage)}
                        </span>
                        <span className='badge badge-outline'>
                          {getLanguageFlag(user.learningLanguage)}
                          Learning: {capitialize(user.learningLanguage)}
                        </span>
                      </div>

                      {user.bio && <p className="text-sm opacity-70 line-clamp-2">{user.bio}</p>}
                    
                      <button className={`btn w-full mt-3 rounded-xl shadow-sm hover:scale-[1.02] transition-all ${hasRequestBeenSent ? "btn-disabled bg-base-300 text-base-content/50" : "btn-primary"}`}
                              onClick={() => sendRequestMutation(user._id)}
                              disabled={hasRequestBeenSent || isThisUserPending}
                      >
                        {isThisUserPending ? (
                              <span className="loading loading-spinner"></span>
                          ) : hasRequestBeenSent ? (
                            <>
                              <CheckCircleIcon className="size-4 mr-2"/>
                              Request Sent
                            </>
                          ) : (
                            <>
                              <UserPlusIcon className="size-4 mr-2"/>
                              Send Friend Request
                            </>
                          )
                        }
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default Homepage;

const capitialize = (str) => str.charAt(0).toUpperCase() + str.slice(1); 