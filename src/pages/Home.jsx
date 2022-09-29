import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { MuiOtpInput } from 'mui-one-time-password-input';
import FingerprintJS from '@fingerprintjs/fingerprintjs-pro';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import KeyIcon from '@mui/icons-material/Key';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { adminEmailState, isAdminState, visitorIdState } from '../states/main';
import { loginAdmin, validateMe, verifyToken } from '../api/auth';

const matchIsNumeric = (text) => {
	return !isNaN(Number(text));
};

const validateChar = (value, index) => {
	return matchIsNumeric(value);
};

const Home = () => {
	const abortCont = useRef();
	const navigate = useNavigate();

	const [visitorId, setVisitorId] = useRecoilState(visitorIdState);

	const setIsAdmin = useSetRecoilState(isAdminState);
	const setAdminEmail = useSetRecoilState(adminEmailState);

	const [isValidating, setIsValidating] = useState(true);
	const [isLogin, setIsLogin] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [errorText, setErrorText] = useState('');
	const [isMfaCheck, setIsMfaCheck] = useState(false);
	const [otpCode, setOtpCode] = useState('');

	const handlePasswordToggle = () => {
		setShowPassword(!showPassword);
	};

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
	};

	const handleOtpChange = (newValue) => {
		setOtpCode(newValue);
	};

	const handleValidateMe = useCallback(async () => {
		try {
			setErrorText('');
			setIsValidating(true);
			abortCont.current = new AbortController();

			const fpPromise = FingerprintJS.load({
				apiKey: 'XwmESck7zm6PZAfspXbs',
			});

			let visitorId = '';

			do {
				const fp = await fpPromise;
				const result = await fp.get();
				visitorId = result.visitorId;
			} while (visitorId.length === 0);

			setVisitorId(visitorId);

			const tmpEmail = localStorage.getItem('email');

			const isValid = await validateMe(tmpEmail, visitorId, abortCont.current);

			if (isValid) {
				setIsAdmin(true);
				navigate('/dashboard');
			} else {
				setIsValidating(false);
			}
		} catch (error) {
			setErrorText(
				`An error occured while validating your credentials: ${error.message}`
			);
		}
	}, [navigate, setIsAdmin, setVisitorId]);

	const handleLogin = async () => {
		try {
			setIsLogin(true);
			setErrorText('');

			abortCont.current = new AbortController();

			const isPassed = await loginAdmin(
				email,
				password,
				visitorId,
				abortCont.current
			);

			if (isPassed === true) {
				setIsLogin(false);
				setIsMfaCheck(true);
			} else {
				setIsLogin(false);
				setErrorText(isPassed);
			}
		} catch (error) {
			setErrorText(error.message);
		}
	};

	const handleVerifyToken = async () => {
		try {
			setIsLogin(true);
			setErrorText('');

			abortCont.current = new AbortController();

			const isPassed = await verifyToken(
				email,
				otpCode,
				visitorId,
				abortCont.current
			);

			if (isPassed === true) {
				setAdminEmail(email);
				navigate('/dashboard');
			} else {
				setIsLogin(false);
				setErrorText(isPassed);
			}
		} catch (error) {
			setErrorText(error.message);
		}
	};

	useEffect(() => {
		handleValidateMe();
	}, [handleValidateMe]);

	useEffect(() => {
		return () => {
			if (abortCont.current) {
				abortCont.current.abort();
			}
		};
	}, [abortCont]);

	return (
		<Box
			sx={{
				backgroundColor: 'white',
				boxShadow: '5px 5px 5px 5px #F2F3F4',
				maxWidth: '320px',
				margin: '50px auto',
				padding: '20px',
				borderRadius: '10px',
			}}
		>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<img
					src='img/appLogo.png'
					alt='App logo'
					className={'appLogoStartup'}
				/>
				<Typography sx={{ marginTop: '10px', fontWeight: 'bold' }}>
					Administration Control Panel
				</Typography>
				<Typography sx={{ fontWeight: 'bold' }}>@sws2apps</Typography>
			</Box>

			{isMfaCheck && (
				<Box sx={{ marginTop: '25px' }}>
					<Typography sx={{ color: '#566573', marginBottom: '5px' }}>
						Two-factor authentication code
					</Typography>
					<MuiOtpInput
						value={otpCode}
						onChange={handleOtpChange}
						length={6}
						display='flex'
						gap={1}
						validateChar={validateChar}
						TextFieldsProps={{ autoComplete: 'off' }}
					/>
				</Box>
			)}

			{!isMfaCheck && (
				<>
					{isValidating && (
						<Box
							sx={{
								marginTop: '25px',
								display: 'flex',
								justifyContent: 'center',
								flexDirection: 'column',
								alignItems: 'center',
								height: '65%',
							}}
						>
							<CircularProgress
								color='secondary'
								size={40}
								disableShrink={true}
							/>
							<Typography sx={{ fontSize: '14px', marginTop: '20px' }}>
								Validating your credentials ...
							</Typography>
						</Box>
					)}

					{!isValidating && (
						<Box sx={{ marginTop: '25px' }}>
							<TextField
								id='admin-email'
								variant='outlined'
								autoComplete='off'
								size='small'
								autoFocus
								label='Email address'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								InputProps={{
									readOnly: isLogin,
								}}
								sx={{
									width: '320px',
									marginBottom: '8px',
								}}
							/>
							<FormControl
								sx={{ marginTop: '10px', width: '320px' }}
								variant='outlined'
								size='small'
							>
								<InputLabel htmlFor='outlined-adornment-password'>
									Password
								</InputLabel>
								<OutlinedInput
									id='outlined-adornment-password'
									required
									type={showPassword ? 'text' : 'password'}
									value={password}
									onChange={handlePasswordChange}
									endAdornment={
										<InputAdornment position='end'>
											<IconButton
												aria-label='toggle password visibility'
												onClick={handlePasswordToggle}
												onMouseDown={handlePasswordToggle}
												edge='end'
											>
												{showPassword ? <VisibilityOff /> : <Visibility />}
											</IconButton>
										</InputAdornment>
									}
									inputProps={{ readOnly: isLogin }}
									label='Password'
								/>
							</FormControl>
						</Box>
					)}
				</>
			)}

			{errorText.length > 0 && (
				<Box sx={{ margin: '10px 0' }}>
					<Typography
						sx={{ color: 'red', fontWeight: 'bold', fontSize: '12px' }}
					>
						{errorText}
					</Typography>
				</Box>
			)}

			{!isValidating && (
				<Box
					sx={{
						marginTop: '10px',
						display: 'flex',
						justifyContent: 'flex-end',
					}}
				>
					<Button
						variant='contained'
						startIcon={isLogin ? null : <KeyIcon />}
						onClick={isMfaCheck ? handleVerifyToken : handleLogin}
						disabled={isLogin}
					>
						{isLogin && (
							<CircularProgress
								disableShrink
								color='secondary'
								size={'25px'}
								sx={{ marginRight: '10px' }}
							/>
						)}
						{isMfaCheck ? 'Verify' : 'Login'}
					</Button>
				</Box>
			)}
		</Box>
	);
};

export default Home;
