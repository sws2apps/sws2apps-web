import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import Box from '@mui/material/Box';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import { isAdminState } from './states/main.js';

// lazy pages import
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

const App = () => {
	const isAdmin = useRecoilValue(isAdminState);

	const router = createBrowserRouter([
		{
			path: '/',
			element: <Home />,
		},
		{
			path: '/dashboard',
			element: <PrivateRoute isAdmin={isAdmin} />,
			children: [
				{
					element: <Layout />,
					children: [
						{
							index: true,
							element: <Dashboard />,
						},
					],
				},
			],
		},
	]);

	return (
		<Box>
			<Suspense fallback={<div></div>}>
				<RouterProvider router={router} />
			</Suspense>
		</Box>
	);
};

export default App;
