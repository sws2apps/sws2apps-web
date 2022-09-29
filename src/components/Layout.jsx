import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import AppDrawer from './AppDrawer';

const Layout = () => {
	return (
		<Box>
			<AppDrawer>
				<Outlet />
			</AppDrawer>
		</Box>
	);
};

export default Layout;
