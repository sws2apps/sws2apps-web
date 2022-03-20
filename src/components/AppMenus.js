import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useRecoilState } from 'recoil';
import CssBaseline from '@mui/material/CssBaseline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Logout from './Logout';
import { isLogoutState, isMfaVerifiedState } from '../states/main';

const AppMenus = () => {
	let navigate = useNavigate();

	const [isLogout, setIsLogout] = useRecoilState(isLogoutState);

	const isMfaVerified = useRecoilValue(isMfaVerifiedState);

	const handleAccount = () => {
		if (isMfaVerified) {
			setIsLogout(true);
		} else {
			navigate('login');
		}
	};

	return (
		<>
			{isLogout && <Logout />}
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
						{isMfaVerified ? 'Logout' : 'Login'}
					</Button>
				</AppBar>
			</Box>
		</>
	);
};

export default AppMenus;
