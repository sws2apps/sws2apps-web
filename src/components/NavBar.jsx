import { cloneElement } from 'react';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Box from '@mui/material/Box';
import AccountSignOut from './AccountSignOut';

const ElevationScroll = (props) => {
	const { children } = props;
	const trigger = useScrollTrigger({
		disableHysteresis: true,
		threshold: 0,
	});

	return cloneElement(children, {
		elevation: trigger ? 4 : 0,
	});
};

const NavBar = (props) => {
	const handleDrawerToggle = props.handleDrawerToggle;

	const theme = useTheme();

	const upMd = useMediaQuery(theme.breakpoints.up('md'), {
		noSsr: true,
	});

	return (
		<>
			<CssBaseline />
			<ElevationScroll {...props}>
				<AppBar
					position='fixed'
					sx={{
						zIndex: (theme) => theme.zIndex.drawer + 1,
						height: '50px !important',
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'space-between',
					}}
				>
					<Toolbar
						sx={{
							height: '50px !important',
							paddingLeft: '0px !important',
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'space-between',
							width: '100%',
						}}
					>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								marginRight: '40px',
							}}
						>
							<img
								src='./img/appLogo.png'
								alt='App Logo'
								style={{
									width: 'auto',
									height: '50px',
									borderRadius: '4px',
									marginRight: '5px',
									cursor: upMd ? '' : 'pointer',
								}}
								onClick={upMd ? null : handleDrawerToggle}
							/>
							<Typography noWrap sx={{ fontSize: '18px' }}>
								Scheduling Workbox System
							</Typography>
						</Box>
						<AccountSignOut />
					</Toolbar>
				</AppBar>
			</ElevationScroll>
			<Toolbar />
		</>
	);
};

export default NavBar;
