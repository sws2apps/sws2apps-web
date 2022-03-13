import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {
	adminEmailState,
	adminPasswordState,
	apiHostState,
	isAdminState,
} from '../states/main';
import {
	appMessageState,
	appSeverityState,
	appSnackOpenState,
} from '../states/notification';
import { isEmailValid } from '../utils/emailValid';

const Login = () => {
	let navigate = useNavigate();

	let abortCont = useMemo(() => new AbortController(), []);

	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);
	const setIsAdmin = useSetRecoilState(isAdminState);
	const setAdminEmail = useSetRecoilState(adminEmailState);
	const setAdminPassword = useSetRecoilState(adminPasswordState);

	const apiHost = useRecoilValue(apiHostState);

	const [userTmpPwd, setUserTmpPwd] = useState('');
	const [userTmpEmail, setUserTmpEmail] = useState('');
	const [hasErrorEmail, setHasErrorEmail] = useState(false);
	const [hasErrorPwd, setHasErrorPwd] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);

	const handleGoPublic = () => {
		navigate('/');
	};

	const handleSignIn = () => {
		setHasErrorEmail(false);
		setHasErrorPwd(false);
		if (isEmailValid(userTmpEmail) && userTmpPwd.length >= 10) {
			setIsProcessing(true);
			const reqPayload = {
				email: userTmpEmail,
				password: userTmpPwd,
			};

			if (apiHost !== '') {
				fetch(`${apiHost}api/admin/login`, {
					signal: abortCont.signal,
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(reqPayload),
				})
					.then(async (res) => {
						const data = await res.json();
						if (res.status === 200) {
							setAppMessage(data.message);
							setAppSeverity('success');
							setAppSnackOpen(true);
							setIsProcessing(false);
							setAdminEmail(userTmpEmail);
							setAdminPassword(userTmpPwd);
							setIsAdmin(true);
							navigate('/administration');
						} else {
							setIsProcessing(false);
							setAppMessage(data.message);
							setAppSeverity('warning');
							setAppSnackOpen(true);
						}
					})
					.catch((err) => {
						setIsProcessing(false);
						setAppMessage(err.message);
						setAppSeverity('error');
						setAppSnackOpen(true);
					});
			}
		} else {
			if (!isEmailValid(userTmpEmail)) {
				setHasErrorEmail(true);
			}
			if (userTmpPwd.length < 10) {
				setHasErrorPwd(true);
			}
		}
	};

	useEffect(() => {
		return () => abortCont.abort();
	}, [abortCont]);

	return (
		<Box
			sx={{
				border: '2px solid #BFC9CA',
				width: '400px',
				height: 'auto',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
				padding: '10px',
				borderRadius: '10px',
				margin: 'auto',
				marginTop: '30px',
			}}
		>
			<Typography sx={{ fontWeight: 'bold' }}>
				Accessing the Administration Panel
			</Typography>

			<Box sx={{ marginTop: '25px' }}>
				<TextField
					id='outlined-email'
					label='Email address'
					variant='outlined'
					size='small'
					autoComplete='off'
					required
					value={userTmpEmail}
					onChange={(e) => setUserTmpEmail(e.target.value)}
					error={hasErrorEmail ? true : false}
					sx={{ width: '100%' }}
				/>
				<TextField
					sx={{ marginTop: '15px', width: '100%' }}
					id='outlined-password'
					label='Password'
					type='password'
					variant='outlined'
					size='small'
					autoComplete='off'
					required
					value={userTmpPwd}
					onChange={(e) => setUserTmpPwd(e.target.value)}
					error={hasErrorPwd ? true : false}
				/>

				{isProcessing && (
					<Container
						sx={{
							display: 'flex',
							justifyContent: 'center',
							marginTop: '15px',
						}}
					>
						<CircularProgress disableShrink color='secondary' size={'40px'} />
					</Container>
				)}

				<Box
					sx={{
						marginTop: '20px',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<Link
						component='button'
						underline='none'
						variant='body2'
						onClick={handleGoPublic}
					>
						Go back to home page
					</Link>
					<Button variant='contained' onClick={handleSignIn}>
						Login
					</Button>
				</Box>
			</Box>
		</Box>
	);
};

export default Login;
