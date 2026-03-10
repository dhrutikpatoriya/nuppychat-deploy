import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../lib/api";
import toast from "react-hot-toast";

  
  const UseLogin = () =>  {
    const queryClient = useQueryClient()
    const { mutate, isPending, error } = useMutation({
        mutationFn: login,
        onSuccess: () => {
            toast.success("Login Successfully");
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        }
    })

	return {isPending,error, loginMutation:mutate};
  }
  
  export default UseLogin;
  