import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import Notfound from "../pages/notfound/Notfound";
import Settings from "../pages/settings/Settings";
import SinglePost from "../pages/SinglePost/SinglePost";
import Layout from './../layouts/Layout';
import Home from './../pages/home/Home';
import Login from './../pages/login/Login';
import Profile from './../pages/profile/Profile';
import Signup from './../pages/signup/Signup';

export const route = createBrowserRouter([
    {
        path: '', element: <Layout />, children: [
            { index: true, element: <ProtectedRoute><Home /></ProtectedRoute> },
            { path: 'login', element: <Login /> },
            { path: 'signup', element: <Signup /> },
            { path: 'profile', element: <ProtectedRoute><Profile /></ProtectedRoute> },
            { path: 'settings', element: <ProtectedRoute><Settings /></ProtectedRoute> },
            { path: 'singlepost/:id', element: <ProtectedRoute><SinglePost /></ProtectedRoute> },
            { path: '*', element: <Notfound /> },
        ]
    }
])