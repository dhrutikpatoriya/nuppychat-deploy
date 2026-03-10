import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { signup } from '../lib/api';
  
  const UseSignup = () =>  {
      const queryClient = useQueryClient();
        const {mutate,isPending,error} = useMutation({
            mutationFn : signup,
            onSuccess: () => queryClient.invalidateQueries({queryKey : ["authUser"]})
        })
	return {isPending,error,signupMutation:mutate};
  }
  
  export default UseSignup;
  