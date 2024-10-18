import App from './components/App';
import LandingPage from './components/LandingPage';
import ErrorPage from './error-page';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import Home from './pages/Home';
import Login from './pages/AuthPage';
import PostDetail from './pages/PostDetail';
import Profile from './pages/Profile';
import AuthPage from './pages/AuthPage';

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
                path: "/posts",
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
                path: "/AuthPage",
                element: <AuthPage />
            },
            {
                path: "/posts/edit/:id",
                element: <EditPost />
            }
        ]
    },
]
export default routes;