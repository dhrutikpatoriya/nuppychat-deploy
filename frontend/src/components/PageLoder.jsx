import { Loader } from 'lucide-react'
import { useThemeStore } from '../stors/themeStore'


const PageLoder = () => {
  const {theme} = useThemeStore()
  return (
    <div className='min-h-screen flex items-center justify-center' data-theme={theme}>
        <Loader className="animate-spin size-10 text-primary"/>
    </div>
  )
}

export default PageLoder