import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const AppMenus = () => {
	return (
		<Box sx={{ display: 'flex' }}>
			<CssBaseline />
			<AppBar
				position='fixed'
				sx={{
					zIndex: (theme) => theme.zIndex.drawer + 1,
					height: '50px !important',
					minHeight: '50px !important',
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<Toolbar
					sx={{
						height: '50px !important',
						minHeight: '50px !important',
					}}
				>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
						}}
					>
						<img
							src='./img/appLogo.png'
							alt='App Logo'
							className='appLogoTop'
						/>
						<Typography variant='h6' noWrap sx={{ marginLeft: '10px' }}>
							Scheduling Workbox System
						</Typography>
					</Box>
				</Toolbar>
			</AppBar>
		</Box>
	);
};

export default AppMenus;
