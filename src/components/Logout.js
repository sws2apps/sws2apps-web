import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import {
	adminEmailState,
	adminPwdState,
	adminTmpEmailState,
	adminTmpPwdState,
	adminTokenState,
	apiHostState,
	connectionIdState,
	isAdminState,
	isLogoutState,
	isMfaVerifiedState,
	pendingRequestsState,
} from '../states/main';
import {
	appMessageState,
	appSeverityState,
	appSnackOpenState,
} from '../states/notification';

const Logout = () => {
	let navigate = useNavigate();

	let abortCont = useMemo(() => new AbortController(), []);

	const [open, setOpen] = useRecoilState(isLogoutState);

	const setIsAdmin = useSetRecoilState(isAdminState);
	const setPendingRequests = useSetRecoilState(pendingRequestsState);
	const setAdminEmail = useSetRecoilState(adminEmailState);
	const setAdminPwd = useSetRecoilState(adminPwdState);
	const setAdminTmpEmail = useSetRecoilState(adminTmpEmailState);
	const setAdminTmpPwd = useSetRecoilState(adminTmpPwdState);
	const setAdminToken = useSetRecoilState(adminTokenState);
	const setIsLogout = useSetRecoilState(isLogoutState);
	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);
	const setIsMfaVerified = useSetRecoilState(isMfaVerifiedState);

	const apiHost = useRecoilValue(apiHostState);
	const adminEmail = useRecoilValue(adminEmailState);
	const adminPassword = useRecoilValue(adminPwdState);
	const cnID = useRecoilValue(connectionIdState);

	const handleClose = useCallback(
		(event, reason) => {
			if (reason === 'clickaway' || reason === 'backdropClick') {
				return;
			}
			setIsLogout(false);
			setOpen(false);
		},
		[setOpen, setIsLogout]
	);

	useEffect(() => {
		const handleLogout = async () => {
			const reqPayload = {
				email: adminEmail,
				password: adminPassword,
			};

			if (apiHost !== '') {
				fetch(`${apiHost}api/admin/logout`, {
					signal: abortCont.signal,
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						cn_uid: cnID,
					},
					body: JSON.stringify(reqPayload),
				})
					.then(async (res) => {
						const data = await res.json();
						if (res.status === 200) {
							setPendingRequests([]);
							setAdminEmail('');
							setAdminPwd('');
							setAdminTmpEmail('');
							setAdminTmpPwd('');
							setAdminToken('');
							setIsAdmin(false);
							setIsMfaVerified(false);

							handleClose();
						} else {
							setAppMessage(data.message);
							setAppSeverity('warning');
							setAppSnackOpen(true);
							handleClose();
						}
					})
					.catch((err) => {
						if (err.name !== 'AbortError') {
							setAppMessage(err.message);
							setAppSeverity('error');
							setAppSnackOpen(true);
						}
						handleClose();
					});
			}
		};

		if (open) {
			handleLogout();
		}
	}, [
		open,
		abortCont,
		adminEmail,
		adminPassword,
		apiHost,
		cnID,
		handleClose,
		navigate,
		setAdminEmail,
		setAdminPwd,
		setAdminTmpEmail,
		setAdminTmpPwd,
		setAdminToken,
		setAppMessage,
		setAppSeverity,
		setAppSnackOpen,
		setIsAdmin,

		setIsMfaVerified,
		setPendingRequests,
	]);

	useEffect(() => {
		return () => abortCont.abort();
	}, [abortCont]);

	return (
		<Box>
			<Dialog
				open={open}
				aria-labelledby='dialog-title-logout'
				onClose={handleClose}
			>
				<DialogTitle id='dialog-title-logout'>
					<Typography variant='h6' component='p'>
						Logging out. Please wait ...
					</Typography>
				</DialogTitle>
				<DialogContent>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							marginTop: '15px',
						}}
					>
						<CircularProgress disableShrink color='secondary' size={'60px'} />
					</Box>
				</DialogContent>
			</Dialog>
		</Box>
	);
};

export default Logout;
