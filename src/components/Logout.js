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
import { handleAdminLogout } from '../utils/admin';
import {
	adminEmailState,
	apiHostState,
	visitorIDState,
	isLogoutState,
} from '../states/main';
import {
	appMessageState,
	appSeverityState,
	appSnackOpenState,
} from '../states/notification';

const Logout = () => {
	let abortCont = useMemo(() => new AbortController(), []);

	const [open, setOpen] = useRecoilState(isLogoutState);

	const setIsLogout = useSetRecoilState(isLogoutState);
	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);

	const apiHost = useRecoilValue(apiHostState);
	const visitorID = useRecoilValue(visitorIDState);
	const adminEmail = useRecoilValue(adminEmailState);

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

	const handleClearAdmin = useCallback(async () => {
		await handleAdminLogout();
	}, []);

	const handleLogout = useCallback(async () => {
		setIsProcessing(true);

		if (apiHost !== '') {
			fetch(`${apiHost}api/admin/logout`, {
				signal: abortCont.signal,
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					email: adminEmail,
					visitorid: visitorID,
				},
			})
				.then(async (res) => {
					const data = await res.json();
					if (res.status === 200) {
						handleClearAdmin();
						handleClose();
					} else if (res.status === 403) {
						handleClearAdmin();
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
		apiHost,
		visitorID,
		handleClearAdmin,
		handleClose,
		setAppMessage,
		setAppSeverity,
		setAppSnackOpen,
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
