
import { create } from 'zustand'

export const useThemeStore = create((set) => ({
    theme : localStorage.getItem("nuppyChat-theme") || "sunset",
    setTheme : (theme) =>{
        localStorage.setItem("nuppyChat-theme",theme)
        set({theme})
    } 
}))
  