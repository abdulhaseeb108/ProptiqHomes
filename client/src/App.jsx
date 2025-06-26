import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './pages/CreateListing';
import Listing from './pages/Listing';
import Search from './pages/Search';

// Layout with Header + Outlet
const MainLayout = () => (
  <>
    <Header />
    <Outlet />
  </>
);

const router = createBrowserRouter(
  [
    {
      element: <MainLayout />,
      children: [
        { path: '/', element: <Home /> },
        { path: '/home', element: <Home /> },
        { path: '/sign-in', element: <SignIn /> },
        { path: '/sign-up', element: <SignUp /> },
        { path: '/about', element: <About /> },
        { path: '/search', element: <Search /> },

        {
          element: <PrivateRoute />,
          children: [
            { path: '/profile', element: <Profile /> },
            { path: '/create-listing', element: <CreateListing /> },
            { path: '/listing/:listingId', element: <Listing /> }, // ✅ Correct param name
          ],
        },
      ],
    },
  ],
  {
    future: { v7_startTransition: true, v7_relativeSplatPath: true },
  }
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
