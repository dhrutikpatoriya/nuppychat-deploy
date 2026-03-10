import { useQuery } from '@tanstack/react-query';
import { getUserFriends } from '../lib/api';
  
  const UseFriends = () =>  {
	const {data,isLoading} = useQuery({
        queryKey: ["friends"],
        queryFn: getUserFriends
    });
    return {friends:data,loadingFriends:isLoading}

  }
  
  export default UseFriends;
  

  