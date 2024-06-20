import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Authentication from './pages/Authentication';
import Privateroute from './components/Privateroute';
import Profile from './pages/Profile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreatePost from './pages/CreatePost';

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
        path: '/login',
        element: <Authentication />,
      },
      {
        path: '/profile',
        element: <Privateroute element={<Profile />} />,
      },
      {
        path:'/create-post',
        element:<Privateroute element={<CreatePost/>}/>
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
