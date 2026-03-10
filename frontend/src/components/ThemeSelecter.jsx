import { PaletteIcon } from "lucide-react"
import { useThemeStore } from "../stors/themeStore"
import { THEMES } from "../constants"


const ThemeSelecter = () => {
  
  const {theme,setTheme} = useThemeStore()

  return (

    
    <div className="dropdown dropdown-end">
      <button tabIndex={0} className="btn btn-ghost btn-circle">
        <PaletteIcon className="size-5"/>
      </button>
      
      <div
        tabIndex={0}
        className="dropdown-content mt-2 p-1 shadow-2xl bg-base-200 background-blur-lg rounded-2xl w-56 
        border border-base-content/10 max-h-80 overflow-y-auto"
      >
        <div className="space-y-1">
          {THEMES.map((themeOption)=>(
            <button key={themeOption.name} 
            className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors 
            ${
              theme === themeOption.name 
              ? "bg-primary/10" : "hover:bg-base-content/5"
            }
            `}
            onClick={()=>setTheme(themeOption.name)}
            >
              <PaletteIcon className="size-4"/>
              <span className="font-medium">{themeOption.name}</span>
              <div className="ml-auto flex gpa-1">
                {themeOption.colors.map((color,i)=>(
                  <span 
                    key={i} 
                    className="size-2 rounded-full"
                    style={{backgroundColor:color}}
                    >

                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ThemeSelecter