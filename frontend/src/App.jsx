import { Routes, Route, Navigate, Link } from "react-router"
import HomePage from "./pages/HomePage"
import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import OnbordingPage from "./pages/OnbordingPage"
import NotificationPage from "./pages/NotificationPage"
import CallPage from "./pages/CallPage"
import ChatPage from "./pages/ChatPage"
import { Toaster, toast } from "react-hot-toast";
import useAuathUser from "./hooks/useAuathUser"
import PageLoder from "./components/PageLoder"
import Layout from "./components/Layout"
import { useThemeStore } from "./stors/themeStore"
import Navbar from "./components/Navbar"
import FriendCard from "./components/FriendCard"
import UseFriends from "./hooks/useFriends"
import { UserIcon } from "lucide-react"
import NoFriendsFound from "./components/NoFriendsFound"




const App = () => {
  const { isLoading, authUser } = useAuathUser();
  const { theme } = useThemeStore()
  const isAuthenticated = Boolean(authUser);
  const isOnborded = String(authUser?.isOnborded).toLowerCase() === "true";
  const { friends = [], loadingFriends } = UseFriends()
  if (isLoading) return <PageLoder />

  return (
    <div className="" data-theme={theme}>
      <Routes>
        <Route
          path="/"
          element={

            isAuthenticated && isOnborded ? (
              <Layout showSidebar={true}>
                <HomePage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/LoginPage" : "/OnbordingPage"} />
            )
          }
        />
        <Route path="/SignUpPage" element={!isAuthenticated ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/LoginPage" element={!isAuthenticated ? <LoginPage /> : <Navigate to={isOnborded ? "/" : "/OnbordingPage"} />} />
        <Route
          path="/OnbordingPage"
          element={
            isAuthenticated ? (
              !(isOnborded) ? (
                <OnbordingPage />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/LoginPage" />
            )}
        />
        <Route path="/NotificationPage"
          element={isAuthenticated && isOnborded ? (
            <Layout showSidebar={true}>
              <NotificationPage />
            </Layout>
          ) : (
            <Navigate to={!isAuthenticated ? "/LoginPage" : "/OnbordingPage"} />
          )} />
        <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnborded ? (
              <CallPage />
            ) : (
              <Navigate to={!isAuthenticated ? "/LoginPage" : "/OnbordingPage"} />
            )
          }

        />
        <Route path="/ChatPage/:id"
          element={isAuthenticated && isOnborded ? (
            <Layout showSidebar={false}>
              <ChatPage />
            </Layout>
          ) : (
            <Navigate to={!isAuthenticated ? "/LoginPage" : "/OnbordingPage"} />
          )
          } />
        <Route path="/FriendCard"
          element={isAuthenticated && isOnborded ? (
            <Layout showSidebar={true}>
              <div className='p-4 sm:p-6 lg:p-8'>
                <div className="container mx-auto space-y-10">
                  <div className="flex flex-col sm:flex-row items sm:items-center justify-between gap-4">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
                    <Link to="/NotificationPage" className="btn btn-outline btn-sm">
                      <UserIcon className="" />
                      Friend Requests
                    </Link>
                  </div>
                  {loadingFriends ? (
                    <div className="flex justify-center py-12">
                      <span className="loading loading-spinner loading-lg"></span>
                    </div>
                  ) : friends.length === 0 ? (
                    <NoFriendsFound />

                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {friends.map((friend) => (
                        <FriendCard key={friend._id} friend={friend} />
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </Layout>
          ) : (
            <Navigate to={!isAuthenticated ? "/LoginPage" : "/OnbordingPage"} />
          )
          } />
      </Routes>

    </div>
  )
}

export default App