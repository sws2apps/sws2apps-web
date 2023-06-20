import { lazy, useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import CssBaseline from '@mui/material/CssBaseline';
import { apiHostState, isAdminState, isLightThemeState, isOnlineState, visitorIDState } from './states/main';
import { InternetChecker } from './features/internetChecker';
import { appSnackOpenState } from './states/notification';
import DashboardMenu from './pages/DashboardMenu';
import NotificationWrapper from './features/notificationWrapper';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import PrivateRoute from './components/PrivateRoot';

// lazy loading
const CongregationDetails = lazy(() => import('./pages/CongregationDetails'));
const Congregations = lazy(() => import('./pages/Congregations'));
const Startup = lazy(() => import('./pages/Startup'));
const UserDetails = lazy(() => import('./pages/UserDetails'));
const Users = lazy(() => import('./pages/Users'));
const PublicTalks = lazy(() => import('./pages/PublicTalks'));

// creating theme
const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const queryClient = new QueryClient();

const App = () => {
  const setVisitorID = useSetRecoilState(visitorIDState);
  const setApiHost = useSetRecoilState(apiHostState);

  const isLight = useRecoilValue(isLightThemeState);
  const appSnackOpen = useRecoilValue(appSnackOpenState);
  const isAdmin = useRecoilValue(isAdminState);
  const isOnline = useRecoilValue(isOnlineState);

  const [activeTheme, setActiveTheme] = useState(darkTheme);

  const router = createBrowserRouter([
    {
      element: <Layout />,
      errorElement: <ErrorBoundary />,
      children: [
        { path: '/signin', element: <Startup /> },
        {
          element: <PrivateRoute isAdmin={isAdmin} />,
          children: [
            { path: '/', element: <DashboardMenu /> },
            {
              path: '/congregations',
              element: <Congregations />,
            },
            {
              path: '/congregations/:id',
              element: <CongregationDetails />,
            },
            {
              path: '/users',
              element: <Users />,
            },
            {
              path: '/users/:id',
              element: <UserDetails />,
            },
            {
              path: '/public-talks',
              element: <PublicTalks />,
            },
          ],
        },
      ],
    },
  ]);

  useEffect(() => {
    if (isLight) {
      setActiveTheme(lightTheme);
    } else {
      setActiveTheme(darkTheme);
    }
  }, [isLight]);

  useEffect(() => {
    // get visitor ID and check if there is an active connection
    const getUserID = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();

      const visitorId = result.visitorId;
      setVisitorID(visitorId);
    };

    if (isOnline) getUserID();
  }, [setVisitorID, isOnline]);

  useEffect(() => {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      if (import.meta.env.VITE_API_REMOTE_URL) {
        setApiHost(import.meta.env.VITE_API_REMOTE_URL);
      } else {
        setApiHost('http://localhost:8000/');
      }
    } else {
      setApiHost('https://sws2apps.herokuapp.com/');
    }
  }, [setApiHost]);

  useEffect(() => {
    if (!indexedDB) {
      if (!('serviceWorker' in navigator)) {
        return (
          <div className="browser-not-supported">
            You seem to use an unsupported browser to run this website. Make sure that you browser is up to date, or try
            to use another browser.
          </div>
        );
      }
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={activeTheme}>
        <CssBaseline />
        <InternetChecker />
        {appSnackOpen && <NotificationWrapper />}

        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
