import React from 'react';
import { createRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import RecoilOutside from 'recoil-outside';
import App from './App';
import './global.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
	<RecoilRoot>
		<RecoilOutside />
		<App />
	</RecoilRoot>
);
