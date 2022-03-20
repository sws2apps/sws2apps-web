import React from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
import RecoilOutside from 'recoil-outside';
import App from './App';
import './global.css';

ReactDOM.render(
	<React.StrictMode>
		<RecoilRoot>
			<RecoilOutside />
			<App />
		</RecoilRoot>
	</React.StrictMode>,
	document.getElementById('root')
);
