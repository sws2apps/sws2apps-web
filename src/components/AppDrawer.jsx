import { useState } from 'react';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';

import NavBar from './NavBar';
import AppMenus from './AppMenus';

const drawerWidth = 240;

const AppDrawer = ({ children }) => {
	const theme = useTheme();

	const [smallScreen, setSmallScreen] = useState(false);

	const upMd = useMediaQuery(theme.breakpoints.up('md'), {
		noSsr: true,
	});

	const handleDrawerToggle = () => {
		setSmallScreen(!smallScreen);
	};

	return (
		<Box sx={{ display: 'flex' }}>
			<NavBar handleDrawerToggle={handleDrawerToggle} />
			<Drawer
				variant='temporary'
				anchor='left'
				open={smallScreen}
				onClose={handleDrawerToggle}
				onClick={handleDrawerToggle}
				ModalProps={{
					keepMounted: true, // Better open performance on mobile.
				}}
				sx={{
					zIndex: (theme) => theme.zIndex.drawer,
					display: upMd ? 'none' : 'block',
					'& .MuiDrawer-paper': {
						boxSizing: 'border-box',
						width: drawerWidth,
					},
				}}
			>
				<Toolbar />
				<Box sx={{ overflow: 'auto' }}>
					<AppMenus />
				</Box>
			</Drawer>
			<Drawer
				variant='permanent'
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					display: upMd ? 'block' : 'none',
					'& .MuiDrawer-paper': {
						boxSizing: 'border-box',
						width: drawerWidth,
					},
				}}
			>
				<Toolbar />
				<Box sx={{ overflow: 'auto' }}>
					<AppMenus />
				</Box>
			</Drawer>
			<Box sx={{ flexGrow: 1, marginRight: '20px', marginLeft: '-20px' }}>
				<Toolbar />
				{children}
			</Box>
		</Box>
	);
};

export default AppDrawer;
