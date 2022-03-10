import { lazy, Suspense } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';

const Home = lazy(() => import('./pages/Home'));

const App = () => {
	return (
		<Suspense fallback={<div></div>}>
			<HashRouter>
				<Layout>
					<Routes>
						<Route path='/' element={<Home />} />
					</Routes>
				</Layout>
			</HashRouter>
		</Suspense>
	);
};

export default App;
