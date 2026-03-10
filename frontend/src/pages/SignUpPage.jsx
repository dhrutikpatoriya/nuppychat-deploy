import { Donut} from 'lucide-react';
import { useState } from 'react'
import { Link } from 'react-router';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signup } from '../lib/api';
import UseSignup from '../hooks/useSignup';

const AVATAR_OPTIONS = [
  "Felix", "Aneka", "Jack", "Luna", "Molly", "Max", "Lily", "Daisy", "Buddy", "Lucy"
];

const SignUpPage = () => {
  const [signupData,setSignupData] = useState({
    fullName : "",
    email : "",
    password : "",
    profilePic : ""
  });

  const {isPending,error,signupMutation} = UseSignup();
  const handleSignup = (e)=>{
    e.preventDefault();
    signupMutation(signupData)
  };
  
  return (
    <div className='h-screen flex items-center justify-center p-4 sm:p-6 md:p-8' data-theme = "forest">
      <div className='border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 
      rounded-xl shadow-lg overflow-hidden'>
        
        <div className='w-full lg:w-1/2 p-4 sm:p-8 flex flex-col'>
          <div className='mb-4 flex items-center justify-start gap-2'>
            <Donut className='size-9 text-primary'/>
            <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary 
            to-secondary tracking-wider'>
              NuppyChat
            </span>
          </div>
          {error &&(
            <div className='alert alert-error mb-4'>
              <span>{error.response.data.message}</span>
            </div>
          )}
          <div className='w-full flex flex-col'>
              <form onSubmit={handleSignup} >
                <div className='space-y-4'>
                  <div>
                    <h2 className='text-xl font-semibold'>Create an Account</h2>
                    <p className='text-sm opacity-70'>Start your journey with NuppyChat</p>
                  </div>

                  <div className='form-control w-full'>
                    <label className='label'>
                      <span className='label-text'>Choose an Avatar (Optional)</span>
                    </label>
                    <div className='flex gap-2 overflow-x-auto pb-2 scrollbar-hide'>
                      {AVATAR_OPTIONS.map((seed) => {
                        const avatarUrl = `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`;
                        return (
                          <div 
                            key={seed} 
                            onClick={() => setSignupData({...signupData, profilePic: avatarUrl})}
                            className={`avatar cursor-pointer rounded-full transition-transform hover:scale-105 min-w-12 h-12 p-1 ${signupData.profilePic === avatarUrl ? 'ring-2 ring-primary bg-base-200' : ''}`}
                          >
                            <img src={avatarUrl} alt={`Avatar ${seed}`} className="rounded-full" />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div className='space-y-3'>
                    <div className='form-control w-full'>
                      <label className='label'>
                        <span className='label-text'>Full Name</span>
                      </label>
                    </div>
                    <div>
                      <input type="text"
                      placeholder='John Doe'
                      className='input input-bordered w-full' 
                      value={signupData.fullName}
                      onChange={(e)=>setSignupData({...signupData,fullName:e.target.value})}
                      required
                      />
                    </div>

                    <div className='form-control w-full'>
                      <label className='label'>
                        <span className='label-text'>Email</span>
                      </label>
                    </div>
                    <div>
                      <input type="email"
                      placeholder='john@gmail.com'
                      className='input input-bordered w-full' 
                      value={signupData.email}
                      onChange={(e)=>setSignupData({...signupData,email : e.target.value})}  
                      required
                      />
                    </div>
                    
                    <div className='form-control w-full'>
                      <label className='label'>
                        <span className='label-text'>Password</span>
                      </label>
                      </div>
                      <div>
                      <input type="password"
                      placeholder='••••••••'
                      className='input input-bordered w-full' 
                      value={signupData.password}
                      onChange={(e)=>setSignupData({...signupData,password : e.target.value})}  
                      required
                      />
                      <p className='text-xs opacity-70 mt-1'>
                        Password must be at least 6 characters long
                      </p>
                    </div>

                    <div className='form-control'>
                      <label className='label curson-pointer justify-start gap-2'>
                        <input type="checkbox" className='checkbox checkbox-sm' />
                        <span className='text-xs leading-tight'>I aggry to the{" "}
                          <span className='text-primary hover:underline'>terms of service</span> and {" "}
                          <span className='text-primary hover:underline'>privacy policy</span>
                        </span>
                      </label>
                    </div>

                    <button className='btn btn-primary w-full' type="submit">
                      {isPending ? (
                        <span className='loading loading-spinner loading-xs'>
                          Loading...
                        </span>
                      ) : (
                        "Create Account"
                      )}
                    </button>
                    <div className='text-center mt-4'>
                      <p className='text-sm'>
                        Already have an account?{" "}
                        <Link to="/LoginPage" className='hover:underline text-primary'>
                          Sign in
                        </Link>
                      </p>
                    </div>

                  </div>
                </div>
              </form>
            </div>
        </div>

        <div className='hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center'>
          <div className='max-w-md p-8'>
            <div>
              <img src="/i3.svg" alt="Language connection illustration" className='w-full h-full'/>
            </div>
            <div className='text-center space-y-3 mt-6'>
              <h2 className='text-xl font-semibold'>Connect with peoples worldwide</h2>
              <p className='opacity-70'>make new friends</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage