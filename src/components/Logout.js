import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
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
	isMfaEnabledState,
	isMfaVerifiedState,
	pendingRequestsState,
} from '../states/main';
import {
	appMessageState,
	appSeverityState,
	appSnackOpenState,
} from '../states/notification';

const Logout = () => {
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
	const setIsMfaEnabled = useSetRecoilState(isMfaEnabledState);

	const apiHost = useRecoilValue(apiHostState);
	const adminEmail = useRecoilValue(adminEmailState);
	const adminPassword = useRecoilValue(adminPwdState);
	const cnID = useRecoilValue(connectionIdState);

	const [isProcessing, setIsProcessing] = useState(false);

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

	const handleLogout = useCallback(async () => {
		setIsProcessing(true);
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
						setIsMfaEnabled(false);
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
	}, [
		abortCont,
		adminEmail,
		adminPassword,
		apiHost,
		cnID,
		handleClose,
		setAdminEmail,
		setAdminPwd,
		setAdminTmpEmail,
		setAdminTmpPwd,
		setAdminToken,
		setAppMessage,
		setAppSeverity,
		setAppSnackOpen,
		setIsAdmin,
		setIsMfaEnabled,
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
						Log out from Admin Panel
					</Typography>
				</DialogTitle>
				<DialogContent>
					{!isProcessing && (
						<Typography>
							Are you sure to logout? You will be redirected to the home page.
						</Typography>
					)}
					{isProcessing && (
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'center',
								marginTop: '15px',
								marginBottom: '15px',
							}}
						>
							<CircularProgress disableShrink color='secondary' size={'60px'} />
						</Box>
					)}
				</DialogContent>
				{!isProcessing && (
					<DialogActions>
						<Button onClick={handleClose} color='primary'>
							No
						</Button>
						<Button
							onClick={handleLogout}
							disabled={isProcessing}
							color='primary'
							autoFocus
						>
							Yes
						</Button>
					</DialogActions>
				)}
			</Dialog>
		</Box>
	);
};

export default Logout;
