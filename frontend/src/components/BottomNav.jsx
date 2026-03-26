import { Link, useLocation } from 'react-router';
import { BellIcon, HomeIcon, UsersIcon, MessageSquareIcon } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="z-50 lg:hidden bg-base-200 border-t border-base-300 fixed bottom-0 left-0 right-0 w-full h-16 flex flex-row items-center justify-around shadow-lg">
      <Link to="/" className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${currentPath === "/" ? "text-primary bg-primary/10" : "text-base-content/70 hover:bg-base-300"}`}>
        <HomeIcon className="size-5" />
        <span className="text-[10px] mt-1 font-medium">Home</span>
      </Link>
      
      <Link to="/ChatsPage" className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${currentPath === "/ChatsPage" ? "text-primary bg-primary/10" : "text-base-content/70 hover:bg-base-300"}`}>
        <MessageSquareIcon className="size-5" />
        <span className="text-[10px] mt-1 font-medium">Chats</span>
      </Link>

      <Link to="/FriendCard" className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${currentPath === "/FriendCard" ? "text-primary bg-primary/10" : "text-base-content/70 hover:bg-base-300"}`}>
        <UsersIcon className="size-5" />
        <span className="text-[10px] mt-1 font-medium">Friends</span>
      </Link>
      
      <Link to="/NotificationPage" className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${currentPath === "/NotificationPage" ? "text-primary bg-primary/10" : "text-base-content/70 hover:bg-base-300"}`}>
        <BellIcon className="size-5" />
        <span className="text-[10px] mt-1 font-medium">Alerts</span>
      </Link>
    </div>
  );
};

export default BottomNav;
