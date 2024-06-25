import React from 'react';
import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Authentication from './pages/Authentication';
import Privateroute from './components/Privateroute';
import Profile from './pages/Profile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/Editpost';
import Home from './pages/Home';
import Post from './pages/Post';

const AppLayout = () => (
  <>
    <Header />
    <Outlet />
  </>
);

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'login',
        element: <Authentication />,
      },
      {
        path: 'post/:postId',
        element: <Post />,
      },
      {
        path: '*',
        element: <Privateroute />,
        children: [
          {
            path: 'profile',
            element: <Profile />,
          },
          {
            path: 'create-post',
            element: <CreatePost />,
          },
          {
            path: 'edit-post/:postId',
            element: <EditPost />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={appRouter} />
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
