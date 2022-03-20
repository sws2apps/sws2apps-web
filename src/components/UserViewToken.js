import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import PreviewIcon from '@mui/icons-material/Preview';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {
	adminEmailState,
	adminPwdState,
	apiHostState,
	connectionIdState,
	isViewTokenState,
	viewTokenEmailState,
	viewTokenUsernameState,
} from '../states/main';
import {
	appMessageState,
	appSeverityState,
	appSnackOpenState,
} from '../states/notification';

const UserViewToken = () => {
	let abortCont = useMemo(() => new AbortController(), []);

	const [open, setOpen] = useRecoilState(isViewTokenState);
	const [viewTokenEmail, setViewTokenEmail] =
		useRecoilState(viewTokenEmailState);
	const [viewTokenUsername, setViewTokenUsername] = useRecoilState(
		viewTokenUsernameState
	);

	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);

	const apiHost = useRecoilValue(apiHostState);
	const adminEmail = useRecoilValue(adminEmailState);
	const adminPassword = useRecoilValue(adminPwdState);
	const cnID = useRecoilValue(connectionIdState);

	const [isProcessing, setIsProcessing] = useState(false);
	const [token, setToken] = useState('');

	const handleClose = useCallback(() => {
		setViewTokenEmail('');
		setViewTokenUsername('');
		setOpen(false);
	}, [setOpen, setViewTokenEmail, setViewTokenUsername]);

	const handleGetToken = useCallback(async () => {
		setIsProcessing(true);
		try {
			const reqPayload = {
				email: adminEmail,
				password: adminPassword,
				user_email: viewTokenEmail,
			};

			if (apiHost !== '') {
				const res = await fetch(`${apiHost}api/admin/view-user-token`, {
					signal: abortCont.signal,
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						cn_uid: cnID,
					},
					body: JSON.stringify(reqPayload),
				});

				const data = await res.json();
				if (res.status === 200) {
					setIsProcessing(false);
					setToken(data.message);
				} else {
					handleClose();
					setAppMessage(data.message);
					setAppSeverity('warning');
					setAppSnackOpen(true);
				}
			}
		} catch (err) {
			handleClose();
			setAppMessage(err.message);
			setAppSeverity('error');
			setAppSnackOpen(true);
		}
	}, [
		abortCont,
		adminEmail,
		adminPassword,
		apiHost,
		cnID,
		viewTokenEmail,
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
					<Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
						{`MFA token for ${viewTokenUsername}`}
					</Typography>
				</DialogTitle>
				<DialogContent sx={{ width: '420px', height: '120px' }}>
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
					{!isProcessing && token === '' && (
						<Box
							sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}
						>
							<IconButton aria-label='view' onClick={handleGetToken}>
								<PreviewIcon sx={{ color: 'blue', fontSize: '60px' }} />
							</IconButton>
						</Box>
					)}
					{!isProcessing && token !== '' && (
						<TextField
							id='outlined-email'
							label='Token'
							variant='outlined'
							size='small'
							autoComplete='off'
							value={token}
							multiline
							sx={{ width: '100%', marginTop: '10px' }}
							InputProps={{
								readOnly: true,
							}}
						/>
					)}
				</DialogContent>
			</Dialog>
		</Box>
	);
};

export default UserViewToken;
