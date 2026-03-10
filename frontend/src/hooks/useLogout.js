import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api";

  const UseLogout = () =>  {
	
    const queryCLient = useQueryClient();

    const {mutate,isPending}= useMutation({
        mutationFn : logout,
        onSuccess : ()=>queryCLient.invalidateQueries({queryKey:["authUser"]})
    })
    
    
    return ({logoutMutation:mutate});
  }
  
  export default UseLogout;
  