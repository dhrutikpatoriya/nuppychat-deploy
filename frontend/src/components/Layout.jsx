
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'

const Layout = ({children,showSidebar = false}) => {
  return (
    <div className='min-h-screen bg-base-100 flex flex-col h-screen overflow-hidden'>
        <div className='flex flex-1 overflow-hidden h-full'>
            {showSidebar && <Sidebar/>}

            <div className={`flex-1 flex flex-col relative w-full h-full ${showSidebar ? 'pb-16 lg:pb-0' : ''}`}>
                <Navbar/>
                <main className='flex-1 overflow-y-auto w-full'>
                    {children} 
                </main>
            </div>
        </div>
        {showSidebar && <BottomNav />}
    </div>
  )
}

export default Layout