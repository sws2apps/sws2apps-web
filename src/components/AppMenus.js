import { useNavigate } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import CssBaseline from '@mui/material/CssBaseline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { isAdminState, pendingRequestsState } from '../states/main';

const AppMenus = () => {
	let navigate = useNavigate();

	const [isAdmin, setIsAdmin] = useRecoilState(isAdminState);
	const setPendingRequests = useSetRecoilState(pendingRequestsState);

	const handleAccount = () => {
		if (isAdmin) {
			navigate('/');
			setPendingRequests([]);
			setIsAdmin(false);
		} else {
			navigate('login');
		}
	};

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
						<Typography noWrap sx={{ marginLeft: '10px', fontSize: '16px' }}>
							Scheduling Workbox System
						</Typography>
					</Box>
				</Toolbar>
				<Button
					onClick={handleAccount}
					startIcon={<AccountCircleIcon />}
					sx={{ color: 'white', marginRight: '5px', fontSize: '12px' }}
				>
					{isAdmin ? 'Logout' : 'Login'}
				</Button>
			</AppBar>
		</Box>
	);
};

export default AppMenus;
