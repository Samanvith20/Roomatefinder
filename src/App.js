import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Authentication from './pages/Authentication';
import Profile from './components/Profile';
import Privateroute from './components/Privateroute';

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
        path: 'login',
        element: <Authentication />,
      },
      {
        path: 'profile',
        element: <Privateroute element={<Profile />} />,
      },
    ],
  },
]);

function App() {
  return (
    <RouterProvider router={appRouter} />
  );
}

export default App;
