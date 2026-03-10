import {  useState } from "react";
import useAuathUser from "../hooks/useAuathUser";
import toast, { Toaster } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { onbording } from "../lib/api";
import { Camera, Donut, Loader, MapPinIcon, ShuffleIcon } from 'lucide-react';
import { LANGUAGES } from "../constants";



const OnbordingPage = ({ setIsOnborded }) => {

  const { authUser ,isLoading} = useAuathUser();
  const queryClient = useQueryClient();
  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    profilePic: authUser?.profilePic || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || ""
  })


  const { mutate: onbordingMutation, isPending } = useMutation({
    mutationFn: onbording,
    onSuccess: () => {
      toast.success("Profile onbording successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"]});
    },
    onError: (error) =>{
        toast.error(error.response.data.message)
    }
  });
    
  const handleOnbording = (e) => {
    e.preventDefault();
    onbordingMutation(formState);
    
  }

  const handleRandomAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(2, 12);
    const randomAvatar = `https://api.dicebear.com/9.x/avataaars/svg?seed=${randomSeed}`
    setFormState({...formState,profilePic:randomAvatar})
    toast.success("Random profile picture generated!");
  }

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center" data-theme="coffee">
      <Toaster></Toaster>
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Complate Your Profile</h1>


          <form onSubmit={handleOnbording} className="space-y-6">
            <div className="className flex flex-col items-center justify-center space-y-4">
              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {
                  formState.profilePic ? (
                    <img src={formState.profilePic} alt="Profile Preview"
                      className="w-full h-full" />
                  ) :
                    <div className="flex items-center justify-center h-full">
                      <Camera className="size-12 text-base-content opacity-40" />
                    </div>
                }
              </div>

              <div className="flex items-center gap-2">
                <button type="button" onClick={handleRandomAvatar} className="btn btn-accent">
                  <ShuffleIcon className="size-4 mr-2" />
                  Generate Random Avatar
                </button>
              </div>


            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                id="fullName"
                value={formState.fullName}
                onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                className="input input-bordered w-full"
                placeholder="Your Full Name"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                name="textarea"
                id="bio"
                value={formState.bio}
                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                className="textarea textarea-bordered w-full h-24"
                placeholder="Tell others about yourself and your language learning goals"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Native Language</span>
                </label>
                <select
                  id="nativeLanguage"
                  name="nativelanguage"
                  value={formState.nativeLanguage}
                  onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                  className="select select-bordered w-full"
                >
                  <option value="">Select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={(`native-${lang}`)} value={lang.toLocaleLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Learning Language</span>
                </label>
                <select
                  id="learningLanguage"
                  name="learningLanguage"
                  value={formState.learningLanguage}
                  onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
                  className="select select-bordered w-full"
                >
                  <option value="">Select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={(`learning-${lang}`)} value={lang.toLocaleLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70 z-10"/>
                <input 
                  id="location"
                  type="text"
                  name="location"
                  value={(formState.location)}
                  onChange={(e)=>setFormState({...formState,location:e.target.value})}
                  className="input input-bordered w-full pl-10"
                  placeholder="City, Country"
                />
              </div>
            </div>

            <button className="btn btn-primary w-full" type="submit" disabled={isPending}>
              {!isPending ? (
                <>
                  <Donut className="size-5 mr-2"/>
                  Complate Onbording
                </>) : (
                  <>
                  <Loader className="size-5 animate-spin mr-2"/>
                  Onbording...
                  </>
                )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default OnbordingPage