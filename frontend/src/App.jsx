import React, { Suspense, lazy, useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import Loader from './components/Loader';
import RedirectLoader from './components/RedirectLoader';
import ScrollToTop from './components/ScrollToTop';
import LoadingBar from './components/loadingBar';
import TinyMCEForm from './components/TinyMCEForm';
import axios from 'axios';
import ErrorBoundary from './components/ErrorBoundary';


// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Blog = lazy(() => import('./pages/Blog'));
const Post = lazy(() => import('./pages/Post'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Contact = lazy(() => import('./pages/Contact'));


const Profile = lazy(() => import('./pages/Profile'));
const Account = lazy(() => import('./pages/AccountPage'));
const Setting = lazy(() => import('./pages/SettingsPage'));
const CreateBlog = lazy(() => import('./pages/CreateBlog'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const FullPost = lazy(() => import('./components/FullPost'));
const Admin = lazy(() => import('./pages/Admin'));
const About = lazy(() => import('./pages/About'));
import 'nprogress/nprogress.css';

// const Home = lazy(() =>
//   new Promise((resolve) => {
//     setTimeout(() => resolve(import('./pages/Home')), 1000);
//   })
// );

// const About = lazy(() =>
//   new Promise((resolve) => {
//     setTimeout(() => resolve(import('./pages/About')), 1000);
//   })
// );

// checking when app is loaded 
import { fetchIsLogin } from './api/userAuth';
import { useUserData } from './context/UserData';
import ErrorPage from './pages/ErrorPage';

// Create router with all the future flags enabled
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/admin",
          element: (
            <Suspense fallback={<RedirectLoader />}>
              <Admin />
            </Suspense>
          ),
        },
        {
          path: "/",
          element: (
            <Suspense fallback={<RedirectLoader />}>
              <Home />
            </Suspense>
          ),
        },
        {
          path: "/blog",
          element: (
            <Suspense fallback={<RedirectLoader />}>
              <Blog />
            </Suspense>
          ),
        },
        {
          path: "/blog/category/:category",
          element: (
            <Suspense fallback={<RedirectLoader />}>
              <Blog />
            </Suspense>
          ),
        },
        {
          path: "/post/:id",
          element: (
            <Suspense fallback={<RedirectLoader />}>
              <Post />
            </Suspense>
          ),
        },
        {
          path: "/login",
          element: (
            <Suspense fallback={<RedirectLoader />}>
              <Login />
            </Suspense>
          ),
        },
        {
          path: "/register",
          element: (
            <Suspense fallback={<Loader />}>
              <Register />
            </Suspense>
          ),
        },
        {
          path: "/contact",
          element: (
            <Suspense fallback={<Loader />}>
              <Contact />
            </Suspense>
          ),
        },
        {
          path: "/about",
          element: (
            <Suspense fallback={<Loader />}>
              <About />
            </Suspense>
          ),
        },
        {
          path: "/profile/:userid",
          element: (
            <Suspense fallback={<Loader />}>
              <Profile />
            </Suspense>
          ),
        },
        {
          path: "/account",
          element: (
            <Suspense fallback={<Loader />}>
              <Account />
            </Suspense>
          ),
        },
        {
          path: "/setting",
          element: (
            <Suspense fallback={<Loader />}>
              <Setting />
            </Suspense>
          ),
        },
        {
          path: "/create-blog",
          element: (
            <Suspense fallback={<Loader />}>
              <CreateBlog />
            </Suspense>
          ),
        },
        {
          path: "/dashboard/blog",
          element: (
            <Suspense fallback={<Loader />}>
              <Dashboard />
            </Suspense>
          ),
        },
        {
          path: "/blog/:blogId",
          element: (
            <Suspense fallback={<Loader />}>
              <FullPost />
            </Suspense>
          ),
        },
        {
          path: "*",
          element: (
            <Suspense fallback={<Loader />}>
              <ErrorPage />
            </Suspense>
          ),
        }
      ],
    },
  ],
  {
    future: {
      v7_skipActionErrorRevalidation: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_startTransition: true,  // Opt-in to startTransition behavior in v7
    },
  }
);

const App = () => {

  const { updateUserData } = useUserData();

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    document.documentElement.setAttribute('data-theme', theme);
  }, []);


  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // reqUserInfo(token);
      fetchIsLogin(token).then((data) => {
        if (data) {
          updateUserData({
            email: data?.data?.user?.email,
            username: data?.data?.user?.username,
            role: data?.data?.user?.role,
            profile: data?.data?.user?.img,
            id: data?.data?.user?.id,
            following: data?.data?.user?.following,
            followers: data?.data?.user?.followers
          });
        }
      }).catch((error) => {
        console.log(error);
      })
    }
  }, [],)


  return <>
    <ErrorBoundary>
      <RouterProvider
        future={{
          v7_startTransition: true,
        }}
        router={router}
      />
    </ErrorBoundary>
  </>
};

export default App;
