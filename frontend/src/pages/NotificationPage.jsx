import {  useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { acceptFriendRequestMutation, getFriendRequest } from '../lib/api'
import { BellIcon, ClockIcon, MessageSquareIcon, UserCheckIcon } from 'lucide-react'
import NoNotificationsFound from '../components/NoNotificationsFound'

const NotificationPage = () => {
  const queryClient = useQueryClient()
  const {data:friendRequest,isLoading} = useQuery({
    queryKey : ["friendRequest"],
    queryFn : getFriendRequest
  })

  const {mutate:acceptFriendRequest,isPending} = useMutation({
    mutationFn : acceptFriendRequestMutation,
    onSuccess : ()=>{
      queryClient.invalidateQueries({queryKey:["friendRequest"]});
      queryClient.invalidateQueries({queryKey:["friends"]});
    }
  })

  const incomingRequest = friendRequest?.incomingRequest || [];
  const accetedRequest = friendRequest?.acceptRequest || [];

  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      <div className='container mx-auto max-w-4xl space-y-8'>
        <h1 className='text-2xl sm:text-3xl font-bold tracking-tight mb-6'>Notifications</h1>
        
        {isLoading ? (
            <div className='flex justify-center py-12'>
              <span className='loading loading-spinner loading-lg'></span>
            </div>
        ) : (
          <>
            { incomingRequest.length > 0 && (
              <section className='space-y-4'>
                <div className='text-xl font-semibold flex items-center gap-2'>
                  <UserCheckIcon className='h-5 w-5 text-primary'/>
                  Friend Requests
                  <span className='badge badge-primary ml-2'>{incomingRequest.length}</span>
                </div>

                <div className='space-y-3'>
                  {incomingRequest.map((request)=>(
                    <div 
                      key={request._id}
                      className='card bg-base-200 shadow-sm hover:shadow-md transition-shadow'
                    >
                       <div className='card-body p-4'>
                        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                          <div className='flex items-center gap-3 w-full'>
                            <div className='avatar w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-base-300 shrink-0'>
                              <img 
                                src={request.sender.profilePic || `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(request.sender.fullName)}`} 
                                alt={request.sender.fullName}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(request.sender.fullName)}`;
                                }}
                              />                            
                            </div>
                            <div className='flex-1 overflow-hidden'>
                              <h3 className='font-semibold truncate'>{request.sender.fullName}</h3>
                              <div className='flex flex-wrap gap-1.5 mt-1'>
                                <span className='badge badge-primary badge-xs sm:badge-sm'>
                                  Native: {request.sender.nativeLanguage}
                                </span>
                                <span className='badge badge-outline badge-xs sm:badge-sm'>
                                  Learning: {request.sender.learningLanguage}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button 
                            className='btn btn-primary btn-sm w-full sm:w-auto'
                            onClick={()=>acceptFriendRequest(request._id)}
                            disabled={isPending}
                          >
                            Accept
                          </button>
                        </div>
                       </div>
                    </div>
                  ))}
                </div>
              </section>
              )
            }
              {accetedRequest.length > 0 && (
                <section className='space-y-4'>
                  <h2>
                    <BellIcon className='h-5 w-5 text-success'/>
                    New Connections
                  </h2>
                  <div>
                  <div className='space-y-3'>
                    {accetedRequest.map((notification)=>(
                      <div key={notification._id}
                        className='card bg-base-200 shadow-sm'
                      >
                        <div className='card-body p-4'>
                          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3'>
                            <div className='flex items-start gap-3 w-full sm:w-auto flex-1'>
                              <div className='avatar mt-1 size-10 rounded-full shrink-0'>
                                <img 
                                  src={notification.recipient.profilePic || `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(notification.recipient.fullName)}`} 
                                  alt={notification.recipient.fullName}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(notification.recipient.fullName)}`;
                                  }} 
                                />
                              </div>
                              <div className='flex-1 overflow-hidden mt-0 sm:mt-1'>
                                <h3 className='font-semibold truncate'>
                                  {notification.recipient.fullName}
                                </h3>
                                <p className='text-sm my-1 text-base-content/80'>
                                  {notification.recipient.fullName} accepted your friend request
                                </p>
                                <p className='text-xs flex items-center opacity-70'>
                                  <ClockIcon className='h-3 w-3 mr-1' />
                                  Recently
                                </p>
                              </div>
                            </div>
                            <div className='badge badge-success shrink-0 mt-2 sm:mt-0'>
                              <MessageSquareIcon className='h-3 w-3 mr-1'/>
                              New Friend
                            </div>
                          </div>
                        </div>
                      </div>

                    ))}
                  </div>
                  </div>
                </section>
              )
              }
            {incomingRequest.length === 0 && accetedRequest.length === 0 && (
              <NoNotificationsFound/>
            )}
          </>
        ) 

        }
      </div>
    </div>
  )
}

export default NotificationPage