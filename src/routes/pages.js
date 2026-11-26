import { lazy } from "react";

export const Home = lazy(() => import('../pages/home/Home'));
export const Login = lazy(() => import('../pages/login/Login'));
export const Signup = lazy(() => import('../pages/signup/Signup'));
export const Profile = lazy(() => import('../pages/profile/Profile'));
export const Settings = lazy(() => import('../pages/settings/Settings'));
export const SinglePost = lazy(() => import('../pages/SinglePost/SinglePost'));
export const Notfound = lazy(() => import('../pages/notfound/Notfound'));
