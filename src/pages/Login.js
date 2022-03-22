import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import LoginAdmin from '../components/LoginAdmin';
import MfaCheck from '../components/MfaCheck';
import MfaSetup from '../components/MfaSetup';
import { handleAdminLogout } from '../utils/admin';
import {
	adminEmailState,
	adminPwdState,
	adminTmpEmailState,
	adminTmpPwdState,
	adminTokenState,
	apiHostState,
	sessionIDState,
	hasErrorEmailState,
	hasErrorPwdState,
	isAdminState,
	isMfaEnabledState,
	isMfaVerifiedState,
	hasErrorTokenState,
	qrCodePathState,
	secretTokenPathState,
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

	const [isAdmin, setIsAdmin] = useRecoilState(isAdminState);
	const [isMfaEnabled, setIsMfaEnabled] = useRecoilState(isMfaEnabledState);
	const [isMfaVerified, setIsMfaVerified] = useRecoilState(isMfaVerifiedState);

	const setSessionID = useSetRecoilState(sessionIDState);
	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);
	const setHasErrorEmail = useSetRecoilState(hasErrorEmailState);
	const setHasErrorPwd = useSetRecoilState(hasErrorPwdState);
	const setHasErrorToken = useSetRecoilState(hasErrorTokenState);
	const setAdminEmail = useSetRecoilState(adminEmailState);
	const setAdminPwd = useSetRecoilState(adminPwdState);
	const setQrCodePath = useSetRecoilState(qrCodePathState);
	const setSecretTokenPath = useSetRecoilState(secretTokenPathState);

	const apiHost = useRecoilValue(apiHostState);
	const userTmpPwd = useRecoilValue(adminTmpPwdState);
	const userTmpEmail = useRecoilValue(adminTmpEmailState);
	const adminToken = useRecoilValue(adminTokenState);

	const [isProcessing, setIsProcessing] = useState(false);
	const [tempSession, setTempSession] = useState('');

	const handleClearAdmin = useCallback(async () => {
		await handleAdminLogout();
	}, []);

	const handleGoPublic = async () => {
		await handleClearAdmin();
		navigate('/');
	};

	const handleSignIn = () => {
		setHasErrorEmail(false);
		setHasErrorPwd(false);

		const checkEmail = isEmailValid(userTmpEmail);

		if (checkEmail && userTmpPwd.length >= 10) {
			setIsProcessing(true);
			const reqPayload = {
				email: userTmpEmail,
				password: userTmpPwd,
			};

			if (apiHost !== '') {
				fetch(`${apiHost}user-login`, {
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
							setIsProcessing(false);
							setIsAdmin(true);
							setIsMfaEnabled(true);
							setTempSession(data.session_id);
						} else {
							if (data.secret && data.qrCode && data.session_id) {
								setIsProcessing(false);
								setSecretTokenPath(data.secret);
								setQrCodePath(data.qrCode);
								setTempSession(data.session_id);
								setIsAdmin(true);
							} else {
								setIsProcessing(false);
								setAppMessage(data.message);
								setAppSeverity('warning');
								setAppSnackOpen(true);
							}
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
			if (!checkEmail) {
				setHasErrorEmail(true);
			}
			if (userTmpPwd.length < 10) {
				setHasErrorPwd(true);
			}
		}
	};

	const handleVerifyToken = async () => {
		try {
			setHasErrorToken(false);

			if (adminToken.length === 6) {
				setIsProcessing(true);
				const reqPayload = {
					token: adminToken,
				};

				if (apiHost !== '') {
					const res = await fetch(`${apiHost}api/mfa/verify-token`, {
						signal: abortCont.signal,
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							session_id: tempSession,
						},
						body: JSON.stringify(reqPayload),
					});

					const data = await res.json();
					if (res.status === 200) {
						// attemp to access admin
						const adminRes = await fetch(`${apiHost}api/admin/`, {
							signal: abortCont.signal,
							method: 'GET',
							headers: {
								'Content-Type': 'application/json',
								session_id: tempSession,
							},
						});

						if (adminRes.status === 200) {
							setSessionID(tempSession);
							setAdminEmail(userTmpEmail);
							setAdminPwd(userTmpPwd);
							setIsMfaVerified(true);
							setIsMfaEnabled(true);
							setAppMessage(data.message);
							setAppSeverity('success');
							setAppSnackOpen(true);
							setIsProcessing(false);
							localStorage.setItem('session_id', tempSession);
							navigate('/administration');
						} else {
							const adminData = await adminRes.json();
							setIsProcessing(false);
							setAppMessage(adminData.message);
							setAppSeverity('warning');
							setAppSnackOpen(true);

							await handleClearAdmin();
						}
					} else {
						setIsProcessing(false);
						setAppMessage(data.message);
						setAppSeverity('warning');
						setAppSnackOpen(true);
					}
				}
			} else {
				setHasErrorToken(true);
			}
		} catch (err) {
			setIsProcessing(false);
			setAppMessage(err.message);
			setAppSeverity('error');
			setAppSnackOpen(true);
		}
	};

	useEffect(() => {
		return () => abortCont.abort();
	}, [abortCont]);

	return (
		<Box
			sx={{
				border: '2px solid #BFC9CA',
				width: '450px',
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

			{!isAdmin && !isMfaEnabled && !isMfaVerified && <LoginAdmin />}
			{isAdmin && !isMfaEnabled && !isMfaVerified && <MfaSetup />}
			{isAdmin && isMfaEnabled && !isMfaVerified && (
				<Box sx={{ marginTop: '25px', width: '100%' }}>
					<MfaCheck />
				</Box>
			)}

			{isProcessing && (
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						marginTop: '15px',
					}}
				>
					<CircularProgress disableShrink color='secondary' size={'40px'} />
				</Box>
			)}

			<Box
				sx={{
					marginTop: '20px',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					width: '100%',
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
				{!isAdmin && !isMfaVerified && (
					<Button
						variant='contained'
						onClick={handleSignIn}
						disabled={isProcessing}
					>
						Login
					</Button>
				)}
				{isAdmin && !isMfaVerified && (
					<Button
						variant='contained'
						onClick={handleVerifyToken}
						disabled={isProcessing}
					>
						Verify
					</Button>
				)}
			</Box>
		</Box>
	);
};

export default Login;
