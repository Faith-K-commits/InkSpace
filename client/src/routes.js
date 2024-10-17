import App from './components/App';
import LandingPage from './components/LandingPage';
import ErrorPage from './error-page';
import CreatePost from './pages/CreatePost';
import Home from './pages/Home';
import Login from './pages/Login';
import PostDetail from './pages/PostDetail';
import Profile from './pages/Profile';
import Signup from './pages/Signup';

const routes = [
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <LandingPage/>
            },
            {
                path: "/home",
                element: <Home />
            },
            {
                path: "/posts/:id",
                element: <PostDetail />
            },
            {
                path: "/create",
                element: <CreatePost />
            },
            {
                path: "/profile",
                element: <Profile />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/signup",
                element: <Signup />
            }
        ]
    },
]
export default routes;