import Box from '@mui/material/Box';
import AppMenus from './AppMenus';

const Layout = (props) => {
	return (
		<Box sx={{ display: 'flex', padding: '10px' }}>
			<AppMenus />
			<Box
				sx={{
					flexGrow: 1,
					paddingTop: '60px',
				}}
			>
				{props.children}
			</Box>
		</Box>
	);
};

export default Layout;
