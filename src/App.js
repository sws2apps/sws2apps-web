import { lazy, Suspense, useEffect } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Layout from './components/Layout';
import NotificationBar from './components/NotificationBar';
import PrivateRoute from './components/PrivateRoute';
import { apiHostState, isAdminState, isMfaVerifiedState } from './states/main';
import { appSnackOpenState } from './states/notification';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

const App = () => {
	const setApiHost = useSetRecoilState(apiHostState);

	const appSnackOpen = useRecoilValue(appSnackOpenState);
	const isAdmin = useRecoilValue(isAdminState);
	const isMfaVerified = useRecoilValue(isMfaVerifiedState);

	useEffect(() => {
		if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
			setApiHost('http://localhost:8000/');
		} else {
			const appUrl = window.location.hostname;
			if (
				appUrl === 'sws-apps-dev.web.app' ||
				appUrl === 'sws-apps-dev.firebaseapp.com'
			) {
				setApiHost('https://dev-sws2apps.herokuapp.com/');
			} else if (
				appUrl === 'sws-apps-staging.web.app' ||
				appUrl === 'sws-apps-staging.firebaseapp.com'
			) {
				setApiHost('https://staging-sws2apps.herokuapp.com/');
			} else if (
				appUrl === 'sws-apps.web.app' ||
				appUrl === 'sws-apps.firebaseapp.com'
			) {
				setApiHost('https://dev-sws2apps.herokuapp.com/');
			}
		}
	}, [setApiHost]);

	return (
		<>
			{appSnackOpen && <NotificationBar />}
			<Suspense fallback={<div></div>}>
				<HashRouter>
					<Layout>
						<Routes>
							<Route path='/' element={<Home />} />
							<Route path='/login' element={<Login />} />
							<Route
								element={
									<PrivateRoute
										isAdmin={isAdmin}
										isMfaVerified={isMfaVerified}
									/>
								}
							>
								<Route path='/administration/*' element={<AdminPanel />} />
							</Route>
						</Routes>
					</Layout>
				</HashRouter>
			</Suspense>
		</>
	);
};

export default App;
