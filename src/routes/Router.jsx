import { createBrowserRouter } from "react-router-dom";
import GuestRoute from "../components/GuestRoute/GuestRoute";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import Layout from '../layouts/Layout';
import { Home, Login, Notfound, Profile, Settings, SinglePost, Signup } from "./pages";


export const route = createBrowserRouter([
    {
        path: '', element: <Layout />, children: [
            { index: true, element: <ProtectedRoute><Home /></ProtectedRoute> },
            { path: 'login', element: <GuestRoute><Login /></GuestRoute> },
            { path: 'signup', element: <GuestRoute><Signup /></GuestRoute> },
            { path: 'profile', element: <ProtectedRoute><Profile /></ProtectedRoute> },
            { path: 'settings', element: <ProtectedRoute><Settings /></ProtectedRoute> },
            { path: 'singlepost/:id', element: <ProtectedRoute><SinglePost /></ProtectedRoute> },
            { path: '*', element: <Notfound /> },
        ]
    }
])
