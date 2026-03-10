
import useAuathUser from '../hooks/useAuathUser'
import { Link, useLocation } from 'react-router'
import { BellIcon, Donut, HomeIcon, UsersIcon } from 'lucide-react'

const Sidebar = () => {
  const {authUser} = useAuathUser()
  const location = useLocation()
  const currentPath = location.pathname

  return (
    <aside className='w-64 bg-base-200 border-r border-base-300 lg:flex flex-col hidden h-screen sticky top-0 '>
      <div className='p-5 border-b border-base-300'>
        <Link to='/' className='flex items-center gap-2.5'>
          <Donut className='size-9 text-primary' />
          <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary 
              to-secondary tracking-wider'>
            NuppyChat
          </span>
        </Link>
      </div>
      <nav className='flex-1 p-4 space-y-1'>
        <Link
          to="/"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentPath === "/" ? "btn-active" : ""}`}
        >
          <HomeIcon className='size-5 text-base-content opacity-70' />
          <span>Home</span>
        </Link>

        <Link
          to="/FriendCard"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentPath === "/friends" ? "btn-active" : ""}`}
        >
          <UsersIcon className='size-5 text-base-content opacity-70' />
          <span>Friends</span>
        </Link>

        <Link
          to="/NotificationPage"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentPath === "/NotificationPage" ? "btn-active" : ""}`}
        >
          <BellIcon className='size-5 text-base-content opacity-70' />
          <span>Notification</span>
        </Link>
      </nav>

      <div className='p-4 border-t border-base-300 mt-auto'>
        <div className='flex items-center gap-3'>
          <div className='avatar'>
            <div className='w-10 rounded-full'>
              <img src={authUser?.profilePic || `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(authUser?.fullName || 'User')}`} 
                alt="User Avatar" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(authUser?.fullName || 'User')}`;
                }}
              />
            </div>
          </div>
          <div className='flex-1'>
            <p className='font-semibold text-sm'>{authUser?.fullName}</p>
            <p className='text-xs text-success flex items-center gap-1'>
              <span className='size-2 rounded-full bg-success inline-block'>
              </span>
                Online 
            </p>

          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar