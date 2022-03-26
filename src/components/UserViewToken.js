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
import { handleAdminLogout } from '../utils/admin';
import {
	apiHostState,
	visitorIDState,
	isViewTokenState,
	viewTokenEmailState,
	viewTokenPocketUidState,
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
	const [viewTokenPocketUid, setViewTokenPocketUid] = useRecoilState(
		viewTokenPocketUidState
	);
	const [viewTokenUsername, setViewTokenUsername] = useRecoilState(
		viewTokenUsernameState
	);

	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);

	const apiHost = useRecoilValue(apiHostState);
	const visitorID = useRecoilValue(visitorIDState);

	const [isProcessing, setIsProcessing] = useState(false);
	const [token, setToken] = useState('');

	const handleClearAdmin = useCallback(async () => {
		await handleAdminLogout();
	}, []);

	const handleClose = useCallback(() => {
		setViewTokenEmail('');
		setViewTokenPocketUid('');
		setViewTokenUsername('');
		setOpen(false);
	}, [setOpen, setViewTokenEmail, setViewTokenPocketUid, setViewTokenUsername]);

	const handleGetToken = useCallback(async () => {
		setIsProcessing(true);
		try {
			const reqPayload = {
				user_uid:
					viewTokenEmail.length > 0 ? viewTokenEmail : viewTokenPocketUid,
				user_type: viewTokenEmail.length > 0 ? 'pocket' : 'vip',
			};

			if (apiHost !== '') {
				const res = await fetch(`${apiHost}api/admin/view-user-token`, {
					signal: abortCont.signal,
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						visitor_id: visitorID,
					},
					body: JSON.stringify(reqPayload),
				});

				const data = await res.json();
				if (res.status === 200) {
					setIsProcessing(false);
					setToken(data.message);
				} else if (res.status === 403) {
					handleClearAdmin();
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
		apiHost,
		visitorID,
		handleClearAdmin,
		viewTokenEmail,
		viewTokenPocketUid,
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
