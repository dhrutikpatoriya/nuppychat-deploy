import useAuathUser from '../hooks/useAuathUser'
import { Link, useLocation } from 'react-router';

import { BellIcon, Donut, LogOutIcon } from 'lucide-react';
import ThemeSelecter from './ThemeSelecter';
import UseLogout from '../hooks/useLogout';

const Navbar = () => {
  const {authUser} = useAuathUser();
  const location = useLocation();
  const inChatPage = location.pathname?.startsWith("/ChatPage");
  

  const {logoutMutation} = UseLogout()
  
  return (
    <div className='bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-end w-full'>
          {inChatPage && (
            <div className='pl-5'>
              <Link to='/' className='flex items-center gap-2.5'>
                <Donut className='size-9 text-primary' />
                <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary 
                    to-secondary tracking-wider'>
                  NuppyChat
                </span>
              </Link>
            </div>
           )} 

          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <Link to={"/NotificationPage"}>
              <button className="btn btn-ghost btn-circle">
                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
              </button>
            </Link>
          </div>

          <ThemeSelecter/>

          <div className="avatar">
            <div className="w-9 rounded-full">
              <img src={authUser?.profilePic || `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(authUser?.fullName || 'User')}`} 
                alt="User Avatar" 
                rel="noreferrer" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(authUser?.fullName || 'User')}`;
                }}
              /> 
            </div> 
          </div>

          <button className="btn btn-ghost btn-circle hover:active" onClick={()=>document.getElementById('logout_modal').showModal()}>
            <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
          </button>

          <dialog id="logout_modal" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Confirm Logout</h3>
              <p className="py-4">Are you sure you want to log out of your account?</p>
              <div className="modal-action">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn btn-ghost mr-2">Cancel</button>
                  <button className="btn btn-error" onClick={logoutMutation}>Log Out</button>
                </form>
              </div>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
        </div>  

      </div>
    </div>
  )
}

export default Navbar